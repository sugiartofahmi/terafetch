use regex::Regex;
use serde::Deserialize;
use serde_json::Value;

use crate::infrastructure::exceptions::AppError;
use crate::infrastructure::terabox::client::TeraboxClient;

#[derive(Debug, Clone)]
#[allow(dead_code)]
pub struct ShareSession {
    pub surl: String,
    pub uk: String,
    pub shareid: String,
    pub sign: String,
    pub timestamp: String,
    pub randsk: String,
    pub js_token: String,
}

#[derive(Debug, Deserialize)]
struct ShortUrlInfoResponse {
    errno: i64,
    uk: Option<Value>,
    shareid: Option<Value>,
    sign: Option<String>,
    timestamp: Option<Value>,
    randsk: Option<String>,
}

pub fn extract_surl(share_url: &str) -> Option<String> {
    let url = url::Url::parse(share_url.trim()).ok()?;
    if let Some(seg) = url.path_segments().and_then(|s| {
        let parts: Vec<_> = s.collect();
        if parts.len() >= 2 && parts[parts.len() - 2] == "s" {
            Some(parts[parts.len() - 1].to_string())
        } else {
            None
        }
    }) {
        return Some(seg);
    }
    url.query_pairs()
        .find(|(k, _)| k == "surl")
        .map(|(_, v)| v.into_owned())
}

fn value_to_string(value: &Value) -> String {
    match value {
        Value::String(s) => s.clone(),
        Value::Number(n) => n.to_string(),
        other => other.to_string(),
    }
}

fn extract_js_token(html: &str) -> String {
    let encoded = Regex::new(r#"fn%28%22([A-F0-9]+)%22%29"#).ok();
    if let Some(re) = encoded.as_ref()
        && let Some(caps) = re.captures(html)
    {
        return caps[1].to_string();
    }

    let decoded_wrap = Regex::new(r#"decodeURIComponent\(`([^`]+)`\)"#).ok();
    if let Some(re) = decoded_wrap.as_ref()
        && let Some(caps) = re.captures(html)
    {
        let decoded = urlencoding_decode(&caps[1]);
        let inner = Regex::new(r#"fn\("([A-F0-9]+)"\)"#).ok();
        if let Some(inner_re) = inner.as_ref()
            && let Some(inner_caps) = inner_re.captures(&decoded)
        {
            return inner_caps[1].to_string();
        }
    }

    String::new()
}

fn urlencoding_decode(input: &str) -> String {
    percent_encoding_decode(input)
}

fn percent_encoding_decode(input: &str) -> String {
    let bytes = input.as_bytes();
    let mut out = Vec::with_capacity(bytes.len());
    let mut i = 0;
    while i < bytes.len() {
        if bytes[i] == b'%'
            && i + 2 < bytes.len()
            && let (Some(h), Some(l)) = (from_hex(bytes[i + 1]), from_hex(bytes[i + 2]))
        {
            out.push((h << 4) | l);
            i += 3;
            continue;
        }
        out.push(bytes[i]);
        i += 1;
    }
    String::from_utf8_lossy(&out).into_owned()
}

fn from_hex(b: u8) -> Option<u8> {
    match b {
        b'0'..=b'9' => Some(b - b'0'),
        b'a'..=b'f' => Some(b - b'a' + 10),
        b'A'..=b'F' => Some(b - b'A' + 10),
        _ => None,
    }
}

pub async fn open_share(
    client: &TeraboxClient,
    share_url: &str,
) -> Result<ShareSession, AppError> {
    let surl = extract_surl(share_url).ok_or_else(|| AppError::BadRequest {
        message: "unsupported or invalid TeraBox share URL".into(),
        field: Some("url".into()),
    })?;

    let page_url = format!("https://www.terabox.com/sharing/link?surl={surl}");
    let page = client
        .http
        .get(&page_url)
        .send()
        .await
        .map_err(|e| AppError::Internal {
            message: format!("failed to open share page: {e}"),
        })?;

    if !page.status().is_success() {
        return Err(AppError::NotFound {
            message: "This share link does not exist or has expired.".into(),
        });
    }

    let html = page.text().await.map_err(|e| AppError::Internal {
        message: format!("failed to read share page: {e}"),
    })?;
    let js_token = extract_js_token(&html);

    let info: ShortUrlInfoResponse = client
        .http
        .get("https://www.terabox.com/api/shorturlinfo")
        .query(&[
            ("app_id", "250528"),
            ("shorturl", surl.as_str()),
            ("root", "1"),
            ("web", "1"),
            ("channel", "dubox"),
            ("clienttype", "0"),
            ("jsToken", js_token.as_str()),
        ])
        .header("Referer", &page_url)
        .header("Accept", "application/json")
        .send()
        .await
        .map_err(|e| AppError::Internal {
            message: format!("shorturlinfo request failed: {e}"),
        })?
        .json()
        .await
        .map_err(|e| AppError::Internal {
            message: format!("shorturlinfo parse failed: {e}"),
        })?;

    if info.errno != 0 {
        let message = if matches!(info.errno, 400141 | 400210) {
            "TeraBox is rate-limiting this request. Please wait a moment and try again."
                .to_string()
        } else {
            "This share link does not exist or has expired.".to_string()
        };
        return Err(AppError::NotFound { message });
    }

    Ok(ShareSession {
        surl,
        uk: info
            .uk
            .as_ref()
            .map(value_to_string)
            .unwrap_or_default(),
        shareid: info
            .shareid
            .as_ref()
            .map(value_to_string)
            .unwrap_or_default(),
        sign: info.sign.unwrap_or_default(),
        timestamp: info
            .timestamp
            .as_ref()
            .map(value_to_string)
            .unwrap_or_default(),
        randsk: info.randsk.unwrap_or_default(),
        js_token,
    })
}
