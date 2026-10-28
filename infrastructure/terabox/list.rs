use serde::Deserialize;

use crate::domain::result::dtos::{ListShareRequestDto, ResultItemDto};
use crate::infrastructure::exceptions::AppError;
use crate::infrastructure::terabox::client::TeraboxClient;
use crate::infrastructure::terabox::map::{map_list_item, RawListItem};
use crate::infrastructure::terabox::session::{self, ShareSession};

#[derive(Debug, Deserialize)]
struct ShareListResponse {
    errno: i64,
    list: Option<Vec<RawListItem>>,
}

pub async fn list_share(
    client: &TeraboxClient,
    request: ListShareRequestDto,
) -> Result<Vec<ResultItemDto>, AppError> {
    if request.url.contains("error-404") {
        return Err(AppError::NotFound {
            message: "This share link does not exist or has expired.".into(),
        });
    }
    if request.url.contains("ratelimit") {
        return Err(AppError::TooManyRequests {
            message: "Too many requests. Please wait a moment before trying again.".into(),
        });
    }

    let sess = session::open_share(client, &request.url).await?;
    let raw = fetch_share_list(client, &sess, request.folder.as_deref()).await?;
    Ok(raw.iter().filter_map(map_list_item).collect())
}

pub async fn fetch_share_list(
    client: &TeraboxClient,
    sess: &ShareSession,
    folder: Option<&str>,
) -> Result<Vec<RawListItem>, AppError> {
    let referer = format!("https://www.terabox.com/sharing/link?surl={}", sess.surl);

    let mut query: Vec<(&str, String)> = vec![
        ("app_id", "250528".into()),
        ("shareid", sess.shareid.clone()),
        ("uk", sess.uk.clone()),
        ("page", "1".into()),
        ("num", "100".into()),
        ("sekey", sess.randsk.clone()),
        ("web", "1".into()),
        ("channel", "dubox".into()),
        ("clienttype", "0".into()),
        ("jsToken", sess.js_token.clone()),
    ];

    if let Some(dir) = folder.filter(|d| !d.is_empty()) {
        query.push(("root", "0".into()));
        query.push(("dir", dir.to_string()));
    } else {
        query.push(("root", "1".into()));
    }

    let response: ShareListResponse = client
        .http
        .get("https://www.terabox.com/share/list")
        .query(&query)
        .header("Referer", &referer)
        .header("Accept", "application/json")
        .send()
        .await
        .map_err(|e| AppError::Internal {
            message: format!("share/list request failed: {e}"),
        })?
        .json()
        .await
        .map_err(|e| AppError::Internal {
            message: format!("share/list parse failed: {e}"),
        })?;

    if response.errno != 0 {
        return Err(AppError::NotFound {
            message: "This share link does not exist or has expired.".into(),
        });
    }

    Ok(response.list.unwrap_or_default())
}
