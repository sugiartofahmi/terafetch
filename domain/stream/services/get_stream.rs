use std::future::Future;

use crate::domain::stream::constants::DEFAULT_FORMAT;
use crate::domain::stream::dtos::{
    GetStreamRequestDto, GetStreamResultDto, ResolveStreamRequestDto, SignMediaUrlRequestDto,
    StreamSourceResultDto,
};
use crate::infrastructure::exceptions::AppError;
use crate::infrastructure::media::thumb::hd_thumb_url;

pub trait TeraboxStream: Send + Sync {
    fn resolve_stream(
        &self,
        request: ResolveStreamRequestDto,
    ) -> impl Future<Output = Result<StreamSourceResultDto, AppError>> + Send;
}

pub trait StreamTokenSigner: Send + Sync {
    fn play_url(&self, request: SignMediaUrlRequestDto) -> Result<String, AppError>;
    fn download_url(&self, request: SignMediaUrlRequestDto) -> Result<String, AppError>;
}

fn is_image_format(format: &str) -> bool {
    matches!(
        format.to_ascii_uppercase().as_str(),
        "JPG" | "JPEG" | "PNG" | "GIF" | "WEBP" | "BMP" | "HEIC"
    )
}

pub async fn get_stream<C, S>(
    client: &C,
    tokens: &S,
    request: GetStreamRequestDto,
) -> Result<GetStreamResultDto, AppError>
where
    C: TeraboxStream,
    S: StreamTokenSigner,
{
    if request.id.trim().is_empty() {
        return Err(AppError::BadRequest {
            message: "id is required".into(),
            field: Some("id".into()),
        });
    }
    if request.url.trim().is_empty() {
        return Err(AppError::BadRequest {
            message: "url is required".into(),
            field: Some("url".into()),
        });
    }

    let source = client
        .resolve_stream(ResolveStreamRequestDto {
            share_url: request.url.clone(),
            file_id: request.id.clone(),
        })
        .await?;

    let format = if source.format.is_empty() {
        DEFAULT_FORMAT.to_string()
    } else {
        source.format.clone()
    };

    let download_sign = if is_image_format(&format) && !source.poster_url.is_empty() {
        SignMediaUrlRequestDto {
            share_url: request.url.clone(),
            file_id: request.id.clone(),
            asset_url: Some(hd_thumb_url(&source.poster_url)),
            file_name: Some(source.name.clone()),
        }
    } else {
        SignMediaUrlRequestDto {
            share_url: request.url.clone(),
            file_id: request.id.clone(),
            asset_url: None,
            file_name: None,
        }
    };

    let play_sign = SignMediaUrlRequestDto {
        share_url: request.url,
        file_id: request.id,
        asset_url: None,
        file_name: None,
    };

    Ok(GetStreamResultDto {
        id: source.id,
        name: source.name,
        size: source.size,
        width: source.width,
        height: source.height,
        duration: source.duration,
        format,
        poster_url: source.poster_url,
        stream_url: tokens.play_url(play_sign)?,
        download_url: tokens.download_url(download_sign)?,
    })
}
