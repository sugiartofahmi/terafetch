use std::path::{Path, PathBuf};

pub fn content_type_for(name: &str) -> String {
    let lower = name.to_ascii_lowercase();
    if lower.ends_with(".png") {
        "image/png".into()
    } else if lower.ends_with(".gif") {
        "image/gif".into()
    } else if lower.ends_with(".webp") {
        "image/webp".into()
    } else if lower.ends_with(".jpg") || lower.ends_with(".jpeg") {
        "image/jpeg".into()
    } else if lower.ends_with(".mp4") {
        "video/mp4".into()
    } else {
        "application/octet-stream".into()
    }
}

pub fn extension_of(name: &str) -> String {
    Path::new(name)
        .extension()
        .and_then(|e| e.to_str())
        .map(|e| format!(".{e}"))
        .unwrap_or_else(|| ".bin".into())
}

pub async fn write_name_meta(path: &Path, file_name: &str) {
    let ext = path.extension().and_then(|e| e.to_str()).unwrap_or("bin");
    let meta_path = path.with_extension(format!("{ext}name"));
    let _ = tokio::fs::write(meta_path, file_name).await;
}

pub fn digest_key(left: &str, right: &str) -> String {
    use sha2::{Digest, Sha256};
    let mut h = Sha256::new();
    h.update(left.as_bytes());
    h.update(b"|");
    h.update(right.as_bytes());
    hex::encode(h.finalize())
}

pub fn cache_path(root: &Path, left: &str, right: &str, ext: &str) -> PathBuf {
    root.join(format!("{}{}", digest_key(left, right), ext))
}
