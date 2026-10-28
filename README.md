# terafetch

Resolve TeraBox share links: list folder/file, stream video, and download — with a React frontend and a Rust API.

## Features

- Paste a TeraBox share URL and browse folders, videos, and photos
- Stream video in the browser (progressive MP4)
- Download files
- Nested folder navigation
- Stateless API (no database, no user accounts in v1)

## Tech stack

| Part | Stack |
|---|---|
| Frontend | Vite, React, TanStack Router/Query, Axios, Tailwind (`web/`) |
| Backend | Rust, Tokio, Axum (`main.rs` + layered folders at repo root) |

## Project layout

```
terafetch/
├── web/                 # frontend
├── main.rs              # API entrypoint
├── domain/              # services, DTOs, constants (per feature)
├── infrastructure/      # config, TeraBox client, media, token, utils
├── presentation/        # HTTP controllers & router
├── Cargo.toml
└── .env.example
```

Backend layout follows the same idea as a layered Go service: `controller → service → infrastructure`, without a database layer.

## Prerequisites

- **Node.js** 20+ and **pnpm** (or npm/yarn) for the frontend
- **Rust** stable/nightly with Cargo for the backend
- **ffmpeg** on `PATH` (needed later for stream remux)
- Optional for Chrome TLS impersonation later: `libclang-dev` and `cmake`

```bash
# Debian/Ubuntu example
sudo apt install -y ffmpeg
# later, for wreq impersonate:
# sudo apt install -y libclang-dev cmake
```

## Setup

### 1. Backend env

```bash
cp .env.example .env
```

| Variable | Description | Default |
|---|---|---|
| `APP_HOST` | Bind address | `0.0.0.0` |
| `APP_PORT` | API port | `3100` |
| `APP_VERSION` | API version string in responses | `1.0.0` |
| `SECRET_KEY` | HMAC signing key for play/download URLs | (dev placeholder) |
| `MEDIA_TEMP_DIR` | Temp directory for remuxed MP4 files | `/tmp/terafetch-media` |
| `MEDIA_TTL_SECS` | How long temp media is kept | `3600` |
| `PUBLIC_BASE_URL` | Public base URL used when minting stream/download links | `http://localhost:3100` |

Change `SECRET_KEY` before any shared or production use.

### 2. Frontend

```bash
cd web
pnpm install
```

The frontend calls `http://localhost:3100/api/v1` by default.

## Running

Open two terminals.

**API**

```bash
cargo run
```

Listens on `http://0.0.0.0:3100`.

**Frontend**

```bash
cd web
pnpm dev
```

Open the URL Vite prints (usually `http://localhost:5173`).

## API overview

| Method | Path | Purpose |
|---|---|---|
| `GET` | `/health` | Health check |
| `GET` | `/api/v1/result` | List share contents (`url`, optional `folder`, `filter`, `page`, `per_page`) |
| `GET` | `/api/v1/stream` | Stream metadata + play/download URLs (`id`, `url`) |
| `GET` | `/api/v1/play/{token}` | Progressive MP4 for `<video>` |
| `GET` | `/api/v1/download/{token}` | Attachment download |

Success envelope:

```json
{
  "status_code": 200,
  "version": "1.0.0",
  "data": {}
}
```

Error envelope:

```json
{
  "error_message": "...",
  "errors": [{ "field": "...", "message": "..." }],
  "status_code": 400,
  "version": "1.0.0"
}
```

## Current status

| Area | Status |
|---|---|
| Frontend UI & routes | Ready |
| Frontend → API (no mocks) | Ready |
| API routing, JSON envelope, HMAC tokens | Ready |
| TeraBox list + stream metadata | Ready |
| HLS → MP4 remux + Range serve | Ready (ffmpeg, VLC fallback) |

## License

Private / unlicensed unless stated otherwise.
