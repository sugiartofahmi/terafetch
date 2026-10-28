use crate::domain::result::dtos::{ListShareRequestDto, ResultItemDto};
use crate::domain::result::services::list_result::TeraboxList;
use crate::domain::stream::dtos::{ResolveStreamRequestDto, StreamSourceResultDto};
use crate::domain::stream::services::get_stream::TeraboxStream;
use crate::infrastructure::exceptions::AppError;
use crate::infrastructure::terabox::{list, streaming};

#[derive(Clone)]
pub struct TeraboxClient {
    pub(crate) http: reqwest::Client,
}

impl TeraboxClient {
    pub async fn new() -> Result<Self, AppError> {
        let http = reqwest::Client::builder()
            .cookie_store(true)
            .user_agent(
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 \
                 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
            )
            .build()
            .map_err(|e| AppError::Internal {
                message: format!("failed to build terabox client: {e}"),
            })?;

        Ok(Self { http })
    }
}

impl TeraboxList for TeraboxClient {
    async fn list_share(
        &self,
        request: ListShareRequestDto,
    ) -> Result<Vec<ResultItemDto>, AppError> {
        list::list_share(self, request).await
    }
}

impl TeraboxStream for TeraboxClient {
    async fn resolve_stream(
        &self,
        request: ResolveStreamRequestDto,
    ) -> Result<StreamSourceResultDto, AppError> {
        streaming::resolve_stream(self, request).await
    }
}
