import type {
  TGetResultParams,
  TGetResultResponse,
  TResultItem,
} from './result.type'

const ROOT_ITEMS: Array<TResultItem> = [
  {
    id: 'f-trips',
    type: 'folder',
    name: 'Travel 2026',
    item_count: 4,
  },
  {
    id: 'p-workspace',
    type: 'photo',
    name: 'Workspace.jpg',
    size: 2.8 * 1024 * 1024,
    width: 3840,
    height: 2160,
    thumbnail_url: 'https://picsum.photos/seed/workspace/640/360',
  },
  {
    id: 'p-citynight',
    type: 'photo',
    name: 'City night.jpg',
    size: 5.0 * 1024 * 1024,
    width: 3840,
    height: 2160,
    thumbnail_url: 'https://picsum.photos/seed/citynight/640/360',
  },
  {
    id: 'v-bunny',
    type: 'video',
    name: 'Big Buck Bunny.mp4',
    size: 151 * 1024 * 1024,
    width: 1920,
    height: 1080,
    duration: 596,
    thumbnail_url: 'https://picsum.photos/seed/v-bunny/640/360',
    stream_id: 'v-bunny',
  },
  {
    id: 'p-forest',
    type: 'photo',
    name: 'Misty Forest.jpg',
    size: 4.2 * 1024 * 1024,
    width: 3840,
    height: 2160,
    thumbnail_url: 'https://picsum.photos/seed/forest/640/360',
  },
  {
    id: 'p-architecture',
    type: 'photo',
    name: 'Modern Architecture.jpg',
    size: 3.1 * 1024 * 1024,
    width: 3840,
    height: 2160,
    thumbnail_url: 'https://picsum.photos/seed/architecture/640/360',
  },
  {
    id: 'v-ocean',
    type: 'video',
    name: 'Ocean Waves 4K.mp4',
    size: 42 * 1024 * 1024,
    width: 3840,
    height: 2160,
    duration: 45,
    thumbnail_url: 'https://picsum.photos/seed/ocean/640/360',
    stream_id: 'v-ocean',
  },
  {
    id: 'p-sunset',
    type: 'photo',
    name: 'Golden Sunset.jpg',
    size: 6.4 * 1024 * 1024,
    width: 3840,
    height: 2160,
    thumbnail_url: 'https://picsum.photos/seed/sunset/640/360',
  },
  {
    id: 'p-desert',
    type: 'photo',
    name: 'Sahara Dunes.jpg',
    size: 4.8 * 1024 * 1024,
    width: 3840,
    height: 2160,
    thumbnail_url: 'https://picsum.photos/seed/desert/640/360',
  },
  {
    id: 'v-aurora',
    type: 'video',
    name: 'Northern Lights Timelapse.mp4',
    size: 88 * 1024 * 1024,
    width: 1920,
    height: 1080,
    duration: 120,
    thumbnail_url: 'https://picsum.photos/seed/aurora/640/360',
    stream_id: 'v-aurora',
  },
  {
    id: 'p-mountain-peak',
    type: 'photo',
    name: 'Snowy Peak.jpg',
    size: 5.7 * 1024 * 1024,
    width: 3840,
    height: 2160,
    thumbnail_url: 'https://picsum.photos/seed/mountain/640/360',
  },
  {
    id: 'v-nightsky',
    type: 'video',
    name: 'Milky Way Galaxy.mp4',
    size: 64 * 1024 * 1024,
    width: 1920,
    height: 1080,
    duration: 90,
    thumbnail_url: 'https://picsum.photos/seed/milkyway/640/360',
    stream_id: 'v-nightsky',
  },
]

const TRIPS_ITEMS: Array<TResultItem> = [
  {
    id: 'v-escape',
    type: 'video',
    name: 'Mountain road timelapse.mp4',
    size: 2.2 * 1024 * 1024,
    width: 1920,
    height: 1080,
    duration: 15,
    thumbnail_url: 'https://picsum.photos/seed/727/640/360',
    stream_id: 'v-escape',
  },
  {
    id: 'p-lakesunrise',
    type: 'photo',
    name: 'Lake sunrise.jpg',
    size: 3.9 * 1024 * 1024,
    width: 3840,
    height: 2160,
    thumbnail_url: 'https://picsum.photos/seed/924/640/360',
  },
  {
    id: 'p-cliffview',
    type: 'photo',
    name: 'Cliff view.jpg',
    size: 3.6 * 1024 * 1024,
    width: 3840,
    height: 2160,
    thumbnail_url: 'https://picsum.photos/seed/271/640/360',
  },
  {
    id: 'f-raw',
    type: 'folder',
    name: 'Raw clips',
    item_count: 2,
  },
]

const RAW_ITEMS: Array<TResultItem> = [
  {
    id: 'v-fun',
    type: 'video',
    name: 'Drone pass 01.mp4',
    size: 2.5 * 1024 * 1024,
    width: 1920,
    height: 1080,
    duration: 15,
    thumbnail_url: 'https://picsum.photos/seed/471/640/360',
    stream_id: 'v-fun',
  },
  {
    id: 'v-joy',
    type: 'video',
    name: 'Drone pass 02.mp4',
    size: 12 * 1024 * 1024,
    width: 1920,
    height: 1080,
    duration: 60,
    thumbnail_url: 'https://picsum.photos/seed/517/640/360',
    stream_id: 'v-joy',
  },
]

export const getMockResult = async (
  params: TGetResultParams,
): Promise<TGetResultResponse> => {
  await new Promise((resolve) => setTimeout(resolve, 500))

  const { url, folder, filter = 'all', page = 1, per_page = 10 } = params

  if (url.includes('error-404')) {
    const error: any = new Error('Link not found or has expired')
    error.response = {
      status: 404,
      data: {
        error_message: 'This share link does not exist or has expired.',
        errors: [],
        status_code: 404,
        version: '1.0.0',
      },
    }
    throw error
  }

  if (url.includes('ratelimit')) {
    const error: any = new Error('Too many requests')
    error.response = {
      status: 429,
      data: {
        error_message:
          'Too many requests. Please wait a moment before trying again.',
        errors: [],
        status_code: 429,
        version: '1.0.0',
      },
    }
    throw error
  }

  let sourcePool = ROOT_ITEMS
  if (folder === 'f-trips') {
    sourcePool = TRIPS_ITEMS
  } else if (folder === 'f-raw') {
    sourcePool = RAW_ITEMS
  }

  let filtered = sourcePool
  if (filter === 'video') {
    filtered = sourcePool.filter((item) => item.type === 'video')
  } else if (filter === 'photo') {
    filtered = sourcePool.filter((item) => item.type === 'photo')
  }

  const total = filtered.length
  const total_page = Math.max(1, Math.ceil(total / per_page))
  const startIndex = (page - 1) * per_page
  const paginatedItems = filtered.slice(startIndex, startIndex + per_page)

  return {
    status_code: 200,
    version: '1.0.0',
    data: {
      items: paginatedItems,
      meta: {
        total,
        total_page,
        page,
        per_page,
      },
    },
  }
}
