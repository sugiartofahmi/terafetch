use serde::Deserialize;
use serde_json::Value;

use crate::domain::result::dtos::ResultItemDto;

#[derive(Debug, Deserialize)]
pub struct RawListItem {
    pub fs_id: Option<Value>,
    pub isdir: Option<Value>,
    pub server_filename: Option<String>,
    pub path: Option<String>,
    pub size: Option<Value>,
    pub category: Option<Value>,
    pub thumbs: Option<RawThumbs>,
}

#[derive(Debug, Deserialize)]
pub struct RawThumbs {
    pub url3: Option<String>,
    pub url2: Option<String>,
    pub url1: Option<String>,
}

fn value_to_string(value: &Value) -> String {
    match value {
        Value::String(s) => s.clone(),
        Value::Number(n) => n.to_string(),
        other => other.to_string(),
    }
}

fn value_to_u64(value: &Value) -> u64 {
    match value {
        Value::Number(n) => n.as_u64().unwrap_or(0),
        Value::String(s) => s.parse().unwrap_or(0),
        _ => 0,
    }
}

fn is_dir(value: &Option<Value>) -> bool {
    match value {
        Some(Value::String(s)) => s == "1" || s.eq_ignore_ascii_case("true"),
        Some(Value::Number(n)) => n.as_u64() == Some(1),
        Some(Value::Bool(true)) => true,
        _ => false,
    }
}

fn category_num(value: &Option<Value>) -> u32 {
    match value {
        Some(Value::Number(n)) => n.as_u64().unwrap_or(0) as u32,
        Some(Value::String(s)) => s.parse().unwrap_or(0),
        _ => 0,
    }
}

fn is_video(name: &str, category: u32) -> bool {
    if category == 1 {
        return true;
    }
    let lower = name.to_ascii_lowercase();
    [".mp4", ".mkv", ".mov", ".webm", ".avi", ".m4v", ".ts", ".flv"]
        .iter()
        .any(|ext| lower.ends_with(ext))
}

fn is_photo(name: &str, category: u32) -> bool {
    if category == 3 {
        return true;
    }
    let lower = name.to_ascii_lowercase();
    [".jpg", ".jpeg", ".png", ".gif", ".webp", ".bmp", ".heic"]
        .iter()
        .any(|ext| lower.ends_with(ext))
}

fn thumbnail(thumbs: &Option<RawThumbs>) -> String {
    thumbs
        .as_ref()
        .and_then(|t| t.url3.clone().or(t.url2.clone()).or(t.url1.clone()))
        .unwrap_or_default()
}

pub fn map_list_item(item: &RawListItem) -> Option<ResultItemDto> {
    let name = item.server_filename.clone().unwrap_or_default();
    if name.is_empty() {
        return None;
    }

    if is_dir(&item.isdir) {
        let id = item
            .path
            .clone()
            .filter(|p| !p.is_empty())
            .or_else(|| item.fs_id.as_ref().map(value_to_string))?;
        return Some(ResultItemDto::Folder {
            id,
            name,
            item_count: 0,
        });
    }

    let fs_id = item.fs_id.as_ref().map(value_to_string)?;
    let size = item.size.as_ref().map(value_to_u64).unwrap_or(0);
    let category = category_num(&item.category);
    let thumb = thumbnail(&item.thumbs);

    if is_video(&name, category) {
        return Some(ResultItemDto::Video {
            id: fs_id.clone(),
            name,
            size,
            width: 0,
            height: 0,
            duration: 0,
            thumbnail_url: thumb,
            stream_id: Some(fs_id),
            download_url: None,
        });
    }

    if is_photo(&name, category) {
        return Some(ResultItemDto::Photo {
            id: fs_id,
            name,
            size,
            width: 0,
            height: 0,
            thumbnail_url: thumb,
            download_url: None,
        });
    }

    Some(ResultItemDto::Video {
        id: fs_id.clone(),
        name,
        size,
        width: 0,
        height: 0,
        duration: 0,
        thumbnail_url: thumb,
        stream_id: Some(fs_id),
        download_url: None,
    })
}
