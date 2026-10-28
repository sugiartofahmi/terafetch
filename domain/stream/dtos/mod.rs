use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Deserialize)]
pub struct GetStreamRequestDto {
    pub id: String,
    pub url: String,
}

#[derive(Debug, Clone)]
pub struct ResolveStreamRequestDto {
    pub share_url: String,
    pub file_id: String,
}

#[derive(Debug, Clone)]
pub struct SignMediaUrlRequestDto {
    pub share_url: String,
    pub file_id: String,
    pub asset_url: Option<String>,
    pub file_name: Option<String>,
}

#[derive(Debug, Clone, Serialize)]
pub struct GetStreamResultDto {
    pub id: String,
    pub name: String,
    pub size: u64,
    pub width: u32,
    pub height: u32,
    pub duration: u32,
    pub format: String,
    pub poster_url: String,
    pub stream_url: String,
    pub download_url: String,
}

#[derive(Debug, Clone)]
pub struct StreamSourceResultDto {
    pub id: String,
    pub name: String,
    pub size: u64,
    pub width: u32,
    pub height: u32,
    pub duration: u32,
    pub format: String,
    pub poster_url: String,
}
