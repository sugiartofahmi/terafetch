use serde::{Deserialize, Serialize};

#[derive(Debug, Clone)]
pub struct ListShareRequestDto {
    pub url: String,
    pub folder: Option<String>,
}

#[derive(Debug, Clone, Deserialize)]
pub struct ListResultRequestDto {
    pub url: String,
    pub folder: Option<String>,
    pub filter: Option<ResultFilter>,
    pub page: Option<u32>,
    pub per_page: Option<u32>,
}

#[derive(Debug, Clone, Copy, Default, PartialEq, Eq, Deserialize, Serialize)]
#[serde(rename_all = "lowercase")]
pub enum ResultFilter {
    #[default]
    All,
    Video,
    Photo,
}

#[derive(Debug, Clone, Serialize)]
#[serde(tag = "type", rename_all = "lowercase")]
pub enum ResultItemDto {
    Folder {
        id: String,
        name: String,
        item_count: u32,
    },
    Video {
        id: String,
        name: String,
        size: u64,
        width: u32,
        height: u32,
        duration: u32,
        thumbnail_url: String,
        #[serde(skip_serializing_if = "Option::is_none")]
        stream_id: Option<String>,
        #[serde(skip_serializing_if = "Option::is_none")]
        download_url: Option<String>,
    },
    Photo {
        id: String,
        name: String,
        size: u64,
        width: u32,
        height: u32,
        thumbnail_url: String,
        #[serde(skip_serializing_if = "Option::is_none")]
        download_url: Option<String>,
    },
}

#[derive(Debug, Clone, Serialize)]
pub struct PaginationMetaDto {
    pub total: u32,
    pub total_page: u32,
    pub page: u32,
    pub per_page: u32,
}

#[derive(Debug, Clone, Serialize)]
pub struct ListResultResultDto {
    pub items: Vec<ResultItemDto>,
    pub meta: PaginationMetaDto,
}
