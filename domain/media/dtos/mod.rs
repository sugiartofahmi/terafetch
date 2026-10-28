use std::path::PathBuf;

#[derive(Debug, Clone)]
pub struct MediaTokenClaimsResultDto {
    pub kind: MediaKind,
    pub share_url: String,
    pub file_id: String,
    pub exp: i64,
    pub asset_url: Option<String>,
    pub file_name: Option<String>,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum MediaKind {
    Play,
    Download,
}

#[derive(Debug, Clone)]
pub struct MintMediaTokenRequestDto {
    pub kind: MediaKind,
    pub share_url: String,
    pub file_id: String,
    pub asset_url: Option<String>,
    pub file_name: Option<String>,
}

#[derive(Debug, Clone)]
pub struct PrepareMp4RequestDto {
    pub share_url: String,
    pub file_id: String,
}

#[derive(Debug, Clone)]
pub struct PrepareDirectRequestDto {
    pub asset_url: String,
    pub file_id: String,
    pub file_name: String,
}

#[derive(Debug, Clone)]
pub struct PreparedMp4ResultDto {
    pub path: PathBuf,
    pub size: u64,
    pub file_name: String,
    pub content_type: String,
}
