use std::future::Future;
use std::path::{Path, PathBuf};

use crate::domain::media::dtos::{
    MediaKind, MediaTokenClaimsResultDto, PrepareDirectRequestDto, PrepareMp4RequestDto,
    PreparedMp4ResultDto,
};
use crate::infrastructure::exceptions::AppError;

pub trait MediaTokenVerifier: Send + Sync {
    fn verify(&self, token: &str) -> Result<MediaTokenClaimsResultDto, AppError>;
}

pub trait MediaStore: Send + Sync {
    fn prepare_mp4(
        &self,
        request: PrepareMp4RequestDto,
    ) -> impl Future<Output = Result<PreparedMp4ResultDto, AppError>> + Send;

    fn prepare_direct(
        &self,
        request: PrepareDirectRequestDto,
    ) -> impl Future<Output = Result<PreparedMp4ResultDto, AppError>> + Send;

    fn open_path(&self, path: &Path) -> Result<PathBuf, AppError>;
}

pub async fn serve_play<V, M>(
    verifier: &V,
    store: &M,
    token: &str,
) -> Result<PreparedMp4ResultDto, AppError>
where
    V: MediaTokenVerifier,
    M: MediaStore,
{
    let claims = verifier.verify(token)?;
    if claims.kind != MediaKind::Play {
        return Err(AppError::Unauthorized {
            message: "token is not a play token".into(),
        });
    }
    if claims.exp < chrono::Utc::now().timestamp() {
        return Err(AppError::Unauthorized {
            message: "token expired".into(),
        });
    }

    let prepared = store
        .prepare_mp4(PrepareMp4RequestDto {
            share_url: claims.share_url,
            file_id: claims.file_id,
        })
        .await?;
    let path = store.open_path(&prepared.path)?;
    Ok(PreparedMp4ResultDto {
        path,
        size: prepared.size,
        file_name: prepared.file_name,
        content_type: prepared.content_type,
    })
}
