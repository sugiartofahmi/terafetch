use crate::domain::media::dtos::{
    MediaKind, PrepareDirectRequestDto, PrepareMp4RequestDto, PreparedMp4ResultDto,
};
use crate::domain::media::services::serve_play::{MediaStore, MediaTokenVerifier};
use crate::infrastructure::exceptions::AppError;

pub async fn serve_download<V, M>(
    verifier: &V,
    store: &M,
    token: &str,
) -> Result<PreparedMp4ResultDto, AppError>
where
    V: MediaTokenVerifier,
    M: MediaStore,
{
    let claims = verifier.verify(token)?;
    if claims.kind != MediaKind::Download {
        return Err(AppError::Unauthorized {
            message: "token is not a download token".into(),
        });
    }
    if claims.exp < chrono::Utc::now().timestamp() {
        return Err(AppError::Unauthorized {
            message: "token expired".into(),
        });
    }

    let prepared = if let Some(asset_url) = claims.asset_url {
        store
            .prepare_direct(PrepareDirectRequestDto {
                asset_url,
                file_id: claims.file_id.clone(),
                file_name: claims
                    .file_name
                    .unwrap_or_else(|| format!("{}.bin", claims.file_id)),
            })
            .await?
    } else {
        store
            .prepare_mp4(PrepareMp4RequestDto {
                share_url: claims.share_url,
                file_id: claims.file_id,
            })
            .await?
    };

    let path = store.open_path(&prepared.path)?;
    Ok(PreparedMp4ResultDto {
        path,
        size: prepared.size,
        file_name: prepared.file_name,
        content_type: prepared.content_type,
    })
}
