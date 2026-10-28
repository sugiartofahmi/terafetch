use crate::infrastructure::exceptions::AppError;
use crate::infrastructure::terabox::client::TeraboxClient;
use crate::infrastructure::terabox::list::fetch_share_list;
use crate::infrastructure::terabox::map::RawListItem;
use crate::infrastructure::terabox::session::ShareSession;

fn value_id(item: &RawListItem) -> Option<String> {
    item.fs_id.as_ref().map(|v| match v {
        serde_json::Value::String(s) => s.clone(),
        serde_json::Value::Number(n) => n.to_string(),
        other => other.to_string(),
    })
}

fn is_dir(item: &RawListItem) -> bool {
    match &item.isdir {
        Some(serde_json::Value::String(s)) => s == "1" || s.eq_ignore_ascii_case("true"),
        Some(serde_json::Value::Number(n)) => n.as_u64() == Some(1),
        Some(serde_json::Value::Bool(true)) => true,
        _ => false,
    }
}

pub async fn find_by_fs_id(
    client: &TeraboxClient,
    sess: &ShareSession,
    file_id: &str,
) -> Result<RawListItem, AppError> {
    let mut dirs: Vec<Option<String>> = vec![None];
    let mut visited = 0usize;

    while let Some(dir) = dirs.pop() {
        visited += 1;
        if visited > 300 {
            break;
        }

        let items = match fetch_share_list(client, sess, dir.as_deref()).await {
            Ok(items) => items,
            Err(_) => continue,
        };

        for item in items {
            if value_id(&item).as_deref() == Some(file_id) && !is_dir(&item) {
                return Ok(item);
            }
            if is_dir(&item)
                && let Some(path) = item.path.clone().filter(|p| !p.is_empty())
            {
                dirs.push(Some(path));
            }
        }
    }

    Err(AppError::NotFound {
        message: format!("file not found: {file_id}"),
    })
}
