use std::future::Future;

use crate::domain::result::constants::{DEFAULT_PAGE, DEFAULT_PER_PAGE, MAX_PER_PAGE};
use crate::domain::result::dtos::{
    ListResultRequestDto, ListResultResultDto, ListShareRequestDto, PaginationMetaDto,
    ResultFilter, ResultItemDto,
};
use crate::domain::stream::dtos::SignMediaUrlRequestDto;
use crate::domain::stream::services::get_stream::StreamTokenSigner;
use crate::infrastructure::exceptions::AppError;
use crate::infrastructure::media::thumb::hd_thumb_url;

pub trait TeraboxList: Send + Sync {
    fn list_share(
        &self,
        request: ListShareRequestDto,
    ) -> impl Future<Output = Result<Vec<ResultItemDto>, AppError>> + Send;
}

pub async fn list_result<T, S>(
    client: &T,
    tokens: &S,
    request: ListResultRequestDto,
) -> Result<ListResultResultDto, AppError>
where
    T: TeraboxList,
    S: StreamTokenSigner,
{
    if request.url.trim().is_empty() {
        return Err(AppError::BadRequest {
            message: "url is required".into(),
            field: Some("url".into()),
        });
    }

    let page = request.page.unwrap_or(DEFAULT_PAGE).max(1);
    let per_page = request
        .per_page
        .unwrap_or(DEFAULT_PER_PAGE)
        .clamp(1, MAX_PER_PAGE);
    let filter = request.filter.unwrap_or_default();
    let share_url = request.url.clone();

    let mut items = client
        .list_share(ListShareRequestDto {
            url: request.url,
            folder: request.folder,
        })
        .await?;

    items = match filter {
        ResultFilter::All => items,
        ResultFilter::Video => items
            .into_iter()
            .filter(|i| matches!(i, ResultItemDto::Video { .. } | ResultItemDto::Folder { .. }))
            .collect(),
        ResultFilter::Photo => items
            .into_iter()
            .filter(|i| matches!(i, ResultItemDto::Photo { .. } | ResultItemDto::Folder { .. }))
            .collect(),
    };

    items = items
        .into_iter()
        .map(|item| attach_download_url(tokens, &share_url, item))
        .collect();

    let total = items.len() as u32;
    let total_page = total.div_ceil(per_page).max(1);
    let start = ((page - 1) * per_page) as usize;
    let page_items = items.into_iter().skip(start).take(per_page as usize).collect();

    Ok(ListResultResultDto {
        items: page_items,
        meta: PaginationMetaDto {
            total,
            total_page,
            page,
            per_page,
        },
    })
}

fn attach_download_url<S: StreamTokenSigner>(
    tokens: &S,
    share_url: &str,
    item: ResultItemDto,
) -> ResultItemDto {
    match item {
        ResultItemDto::Photo {
            id,
            name,
            size,
            width,
            height,
            thumbnail_url,
            ..
        } => {
            let download_url = if thumbnail_url.is_empty() {
                None
            } else {
                tokens
                    .download_url(SignMediaUrlRequestDto {
                        share_url: share_url.to_string(),
                        file_id: id.clone(),
                        asset_url: Some(hd_thumb_url(&thumbnail_url)),
                        file_name: Some(name.clone()),
                    })
                    .ok()
            };
            ResultItemDto::Photo {
                id,
                name,
                size,
                width,
                height,
                thumbnail_url,
                download_url,
            }
        }
        ResultItemDto::Video {
            id,
            name,
            size,
            width,
            height,
            duration,
            thumbnail_url,
            stream_id,
            ..
        } => {
            let file_id = stream_id.clone().unwrap_or_else(|| id.clone());
            let download_url = tokens
                .download_url(SignMediaUrlRequestDto {
                    share_url: share_url.to_string(),
                    file_id,
                    asset_url: None,
                    file_name: Some(name.clone()),
                })
                .ok();
            ResultItemDto::Video {
                id,
                name,
                size,
                width,
                height,
                duration,
                thumbnail_url,
                stream_id,
                download_url,
            }
        }
        other => other,
    }
}
