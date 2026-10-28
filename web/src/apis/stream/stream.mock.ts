import type {
  TGetStreamParams,
  TGetStreamResponse,
  TStreamDetail,
} from './stream.type'

const SAMPLE_VIDEO_URL =
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'

const MOCK_STREAMS: Record<string, TStreamDetail | undefined> = {
  'v-bunny': {
    id: 'v-bunny',
    name: 'Big Buck Bunny.mp4',
    size: 151 * 1024 * 1024,
    width: 1920,
    height: 1080,
    duration: 596,
    format: 'MP4',
    poster_url: 'https://picsum.photos/seed/v-bunny/640/360',
    stream_url: SAMPLE_VIDEO_URL,
    download_url: SAMPLE_VIDEO_URL,
  },
  'v-escape': {
    id: 'v-escape',
    name: 'Mountain road timelapse.mp4',
    size: 2.2 * 1024 * 1024,
    width: 1920,
    height: 1080,
    duration: 15,
    format: 'MP4',
    poster_url: 'https://picsum.photos/seed/727/640/360',
    stream_url: SAMPLE_VIDEO_URL,
    download_url: SAMPLE_VIDEO_URL,
  },
  'v-fun': {
    id: 'v-fun',
    name: 'Drone pass 01.mp4',
    size: 2.5 * 1024 * 1024,
    width: 1920,
    height: 1080,
    duration: 15,
    format: 'MP4',
    poster_url: 'https://picsum.photos/seed/471/640/360',
    stream_url: SAMPLE_VIDEO_URL,
    download_url: SAMPLE_VIDEO_URL,
  },
  'v-joy': {
    id: 'v-joy',
    name: 'Drone pass 02.mp4',
    size: 12 * 1024 * 1024,
    width: 1920,
    height: 1080,
    duration: 60,
    format: 'MP4',
    poster_url: 'https://picsum.photos/seed/517/640/360',
    stream_url: SAMPLE_VIDEO_URL,
    download_url: SAMPLE_VIDEO_URL,
  },
}

export const getMockStream = async (
  params: TGetStreamParams,
): Promise<TGetStreamResponse> => {
  await new Promise((resolve) => setTimeout(resolve, 400))

  const { id } = params
  const stream = MOCK_STREAMS[id] || {
    id,
    name: `${id}.mp4`,
    size: 25 * 1024 * 1024,
    width: 1920,
    height: 1080,
    duration: 120,
    format: 'MP4',
    poster_url: `https://picsum.photos/seed/${id}/640/360`,
    stream_url: SAMPLE_VIDEO_URL,
    download_url: SAMPLE_VIDEO_URL,
  }

  return {
    status_code: 200,
    version: '1.0.0',
    data: stream,
  }
}
