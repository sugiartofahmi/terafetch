use crate::domain::result::dtos::ResultItemDto;
use crate::domain::stream::dtos::{ResolveStreamRequestDto, StreamSourceResultDto};
use crate::infrastructure::exceptions::AppError;
use crate::infrastructure::terabox::client::TeraboxClient;
use crate::infrastructure::terabox::find::find_by_fs_id;
use crate::infrastructure::terabox::map::map_list_item;
use crate::infrastructure::terabox::session;

pub async fn resolve_stream(
    client: &TeraboxClient,
    request: ResolveStreamRequestDto,
) -> Result<StreamSourceResultDto, AppError> {
    let sess = session::open_share(client, &request.share_url).await?;
    let raw = find_by_fs_id(client, &sess, &request.file_id).await?;
    let mapped = map_list_item(&raw).ok_or_else(|| AppError::NotFound {
        message: format!("file not found: {}", request.file_id),
    })?;

    match mapped {
        ResultItemDto::Video {
            id,
            name,
            size,
            width,
            height,
            duration,
            thumbnail_url,
            ..
        } => Ok(StreamSourceResultDto {
            id,
            name,
            size,
            width,
            height,
            duration,
            format: "MP4".into(),
            poster_url: thumbnail_url,
        }),
        ResultItemDto::Photo {
            id,
            name,
            size,
            width,
            height,
            thumbnail_url,
            ..
        } => {
            let format = extension_format(&name);
            Ok(StreamSourceResultDto {
                id,
                name,
                size,
                width,
                height,
                duration: 0,
                format,
                poster_url: thumbnail_url,
            })
        }
        ResultItemDto::Folder { .. } => Err(AppError::BadRequest {
            message: "folders cannot be streamed".into(),
            field: Some("id".into()),
        }),
    }
}

fn extension_format(name: &str) -> String {
    std::path::Path::new(name)
        .extension()
        .and_then(|e| e.to_str())
        .map(|e| e.to_ascii_uppercase())
        .unwrap_or_else(|| "BIN".into())
}
