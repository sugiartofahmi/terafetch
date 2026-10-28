use std::path::{Path, PathBuf};
use std::process::Stdio;

use crate::infrastructure::exceptions::AppError;

fn ffmpeg_bin() -> PathBuf {
    let local = PathBuf::from(env!("CARGO_MANIFEST_DIR")).join(".tools/ffmpeg");
    if local.is_file() {
        return local;
    }
    PathBuf::from("ffmpeg")
}

fn vlc_bin() -> Option<PathBuf> {
    for name in ["cvlc", "vlc"] {
        if let Ok(path) = which(name) {
            return Some(path);
        }
    }
    None
}

fn which(name: &str) -> Result<PathBuf, ()> {
    let path = std::env::var_os("PATH").ok_or(())?;
    for dir in std::env::split_paths(&path) {
        let candidate = dir.join(name);
        if candidate.is_file() {
            return Ok(candidate);
        }
    }
    Err(())
}

async fn file_ok(path: &Path) -> bool {
    match tokio::fs::metadata(path).await {
        Ok(meta) => meta.len() > 1000,
        Err(_) => false,
    }
}

async fn remux_with_ffmpeg(src: &Path, dest: &Path) -> Result<(), AppError> {
    let ff = ffmpeg_bin();
    let status = tokio::process::Command::new(&ff)
        .args([
            "-y",
            "-err_detect",
            "ignore_err",
            "-fflags",
            "+genpts+discardcorrupt",
            "-f",
            "mpegts",
            "-i",
        ])
        .arg(src)
        .args(["-c", "copy", "-movflags", "+faststart"])
        .arg(dest)
        .stdin(Stdio::null())
        .stdout(Stdio::null())
        .stderr(Stdio::null())
        .status()
        .await
        .map_err(|e| AppError::Internal {
            message: format!("failed to spawn ffmpeg: {e}"),
        })?;

    if status.success() && file_ok(dest).await {
        return Ok(());
    }

    let status = tokio::process::Command::new(&ff)
        .args(["-y", "-err_detect", "ignore_err", "-f", "mpegts", "-i"])
        .arg(src)
        .args([
            "-c:v",
            "libx264",
            "-preset",
            "veryfast",
            "-crf",
            "23",
            "-c:a",
            "aac",
            "-movflags",
            "+faststart",
        ])
        .arg(dest)
        .stdin(Stdio::null())
        .stdout(Stdio::null())
        .stderr(Stdio::null())
        .status()
        .await
        .map_err(|e| AppError::Internal {
            message: format!("failed to spawn ffmpeg re-encode: {e}"),
        })?;

    if status.success() && file_ok(dest).await {
        Ok(())
    } else {
        Err(AppError::Internal {
            message: "ffmpeg remux failed".into(),
        })
    }
}

async fn remux_with_vlc(src: &Path, dest: &Path) -> Result<(), AppError> {
    let vlc = vlc_bin().ok_or_else(|| AppError::Internal {
        message: "vlc not available for remux fallback".into(),
    })?;

    let sout = format!(
        "#std{{access=file,mux=mp4,dst={}}}",
        dest.display()
    );

    let status = tokio::process::Command::new(&vlc)
        .args(["-I", "dummy", "--play-and-exit", &format!("--sout={sout}")])
        .arg(src)
        .arg("vlc://quit")
        .stdin(Stdio::null())
        .stdout(Stdio::null())
        .stderr(Stdio::null())
        .status()
        .await
        .map_err(|e| AppError::Internal {
            message: format!("failed to spawn vlc: {e}"),
        })?;

    if status.success() && file_ok(dest).await {
        Ok(())
    } else {
        Err(AppError::Internal {
            message: "vlc remux failed".into(),
        })
    }
}

pub async fn remux_ts_to_mp4(src: &Path, dest: &Path) -> Result<(), AppError> {
    if let Some(parent) = dest.parent() {
        tokio::fs::create_dir_all(parent)
            .await
            .map_err(|e| AppError::Internal {
                message: format!("failed to create remux dir: {e}"),
            })?;
    }

    let _ = tokio::fs::remove_file(dest).await;

    if remux_with_ffmpeg(src, dest).await.is_ok() {
        return Ok(());
    }

    remux_with_vlc(src, dest).await
}
