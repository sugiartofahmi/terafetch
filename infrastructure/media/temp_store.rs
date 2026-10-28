use std::path::{Path, PathBuf};
use std::sync::Arc;

use crate::domain::media::dtos::{
    PrepareDirectRequestDto, PrepareMp4RequestDto, PreparedMp4ResultDto,
};
use crate::domain::media::services::serve_play::MediaStore;
use crate::infrastructure::exceptions::AppError;
use crate::infrastructure::media::files::{
    cache_path, content_type_for, extension_of, write_name_meta,
};
use crate::infrastructure::media::photo::download_url_to_file;
use crate::infrastructure::media::remux;
use crate::infrastructure::terabox::client::TeraboxClient;
use crate::infrastructure::terabox::m3u8::{fetch_playlist, synthesize_ranges};
use crate::infrastructure::terabox::segments::download_segments;
use crate::infrastructure::terabox::session;

#[derive(Clone)]
pub struct TempMediaStore {
    root: PathBuf,
    terabox: Arc<TeraboxClient>,
}

impl TempMediaStore {
    pub fn new(root: &Path, terabox: Arc<TeraboxClient>) -> Result<Self, AppError> {
        std::fs::create_dir_all(root).map_err(|e| AppError::Internal {
            message: format!("failed to create media temp dir: {e}"),
        })?;
        Ok(Self {
            root: root.to_path_buf(),
            terabox,
        })
    }

    async fn cached(
        &self,
        path: &Path,
        file_name: &str,
        content_type: &str,
    ) -> Option<PreparedMp4ResultDto> {
        if !path.is_file() {
            return None;
        }
        let size = tokio::fs::metadata(path).await.ok()?.len();
        Some(PreparedMp4ResultDto {
            path: path.to_path_buf(),
            size,
            file_name: file_name.to_string(),
            content_type: content_type.to_string(),
        })
    }
}

impl MediaStore for TempMediaStore {
    async fn prepare_mp4(
        &self,
        request: PrepareMp4RequestDto,
    ) -> Result<PreparedMp4ResultDto, AppError> {
        let path = cache_path(&self.root, &request.share_url, &request.file_id, ".mp4");
        let file_name = format!("{}.mp4", request.file_id);
        if let Some(cached) = self.cached(&path, &file_name, "video/mp4").await {
            return Ok(cached);
        }

        let sess = session::open_share(self.terabox.as_ref(), &request.share_url).await?;
        let playlist = fetch_playlist(self.terabox.as_ref(), &sess, &request.file_id).await?;
        let urls = synthesize_ranges(&playlist)?;

        let work_dir = self.root.join(format!("work-{}", request.file_id));
        tokio::fs::create_dir_all(&work_dir)
            .await
            .map_err(|e| AppError::Internal {
                message: format!("failed to create work dir: {e}"),
            })?;

        let assemble = work_dir.join("assemble.ts");
        let tmp_mp4 = work_dir.join("out.mp4");
        download_segments(self.terabox.as_ref(), &urls, &assemble).await?;
        remux::remux_ts_to_mp4(&assemble, &tmp_mp4).await?;
        tokio::fs::rename(&tmp_mp4, &path)
            .await
            .map_err(|e| AppError::Internal {
                message: format!("failed to publish mp4: {e}"),
            })?;
        let _ = tokio::fs::remove_dir_all(&work_dir).await;

        write_name_meta(&path, &file_name).await;
        let size = tokio::fs::metadata(&path)
            .await
            .map(|m| m.len())
            .unwrap_or(0);

        Ok(PreparedMp4ResultDto {
            path,
            size,
            content_type: "video/mp4".into(),
            file_name,
        })
    }

    async fn prepare_direct(
        &self,
        request: PrepareDirectRequestDto,
    ) -> Result<PreparedMp4ResultDto, AppError> {
        let ext = extension_of(&request.file_name);
        let path = cache_path(&self.root, "direct", &request.file_id, &ext);
        let content_type = content_type_for(&request.file_name);

        if let Some(cached) = self
            .cached(&path, &request.file_name, &content_type)
            .await
        {
            return Ok(cached);
        }

        download_url_to_file(self.terabox.as_ref(), &request.asset_url, &path).await?;
        write_name_meta(&path, &request.file_name).await;
        let size = tokio::fs::metadata(&path)
            .await
            .map(|m| m.len())
            .unwrap_or(0);

        Ok(PreparedMp4ResultDto {
            path,
            size,
            content_type,
            file_name: request.file_name,
        })
    }

    fn open_path(&self, path: &Path) -> Result<PathBuf, AppError> {
        if path.is_file() {
            Ok(path.to_path_buf())
        } else {
            Err(AppError::NotFound {
                message: "prepared media not found".into(),
            })
        }
    }
}
