use regex::Regex;
use url::Url;

use crate::infrastructure::exceptions::AppError;
use crate::infrastructure::terabox::client::TeraboxClient;
use crate::infrastructure::terabox::session::ShareSession;

pub async fn fetch_playlist(
    client: &TeraboxClient,
    sess: &ShareSession,
    file_id: &str,
) -> Result<String, AppError> {
    let referer = format!("https://www.terabox.com/sharing/link?surl={}", sess.surl);
    let text = client
        .http
        .get("https://www.terabox.com/share/streaming")
        .query(&[
            ("uk", sess.uk.as_str()),
            ("shareid", sess.shareid.as_str()),
            ("type", "M3U8_AUTO_480"),
            ("fid", file_id),
            ("sign", sess.sign.as_str()),
            ("timestamp", sess.timestamp.as_str()),
            ("jsToken", sess.js_token.as_str()),
            ("esl", "1"),
            ("isplayer", "1"),
            ("ehps", "1"),
            ("clienttype", "0"),
            ("app_id", "250528"),
            ("web", "1"),
            ("channel", "dubox"),
        ])
        .header("Referer", &referer)
        .send()
        .await
        .map_err(|e| AppError::Internal {
            message: format!("share/streaming request failed: {e}"),
        })?
        .text()
        .await
        .map_err(|e| AppError::Internal {
            message: format!("share/streaming read failed: {e}"),
        })?;

    if !text.starts_with("#EXTM3U") {
        return Err(AppError::Internal {
            message: format!("share/streaming returned invalid playlist: {}", &text[..text.len().min(200)]),
        });
    }

    Ok(text)
}

pub fn synthesize_ranges(playlist: &str) -> Result<Vec<String>, AppError> {
    let re = Regex::new(r"https://[^\s]+").map_err(|e| AppError::Internal {
        message: format!("regex error: {e}"),
    })?;
    let first = re
        .find(playlist)
        .map(|m| m.as_str().to_string())
        .ok_or_else(|| AppError::Internal {
            message: "no segment urls in playlist".into(),
        })?;

    let parsed = Url::parse(&first).map_err(|e| AppError::Internal {
        message: format!("invalid segment url: {e}"),
    })?;

    let mut query: std::collections::HashMap<String, String> = parsed
        .query_pairs()
        .map(|(k, v)| (k.to_string(), v.to_string()))
        .collect();

    let ts_size: u64 = query
        .get("ts_size")
        .and_then(|v| v.parse().ok())
        .ok_or_else(|| AppError::Internal {
            message: "missing ts_size in segment url".into(),
        })?;
    let step: u64 = query
        .get("len")
        .and_then(|v| v.parse().ok())
        .unwrap_or(740_532);

    let mut out = Vec::new();
    let mut start = 0u64;
    while start < ts_size {
        let end = (start + step).min(ts_size) - 1;
        query.insert("range".into(), format!("{start}-{end}"));
        query.insert("len".into(), (end - start + 1).to_string());

        let mut rebuilt = parsed.clone();
        rebuilt
            .query_pairs_mut()
            .clear()
            .extend_pairs(query.iter().map(|(k, v)| (k.as_str(), v.as_str())));
        out.push(rebuilt.to_string());
        start = end + 1;
    }

    Ok(out)
}
