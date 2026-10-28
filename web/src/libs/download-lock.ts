type TDownloadLockState = {
  locked: boolean
  activeFile: string | null
}

let state: TDownloadLockState = {
  locked: false,
  activeFile: null,
}

const listeners = new Set<() => void>()

const emit = () => {
  listeners.forEach((listener) => listener())
}

export const subscribeDownloadLock = (listener: () => void) => {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

export const getDownloadLockSnapshot = () => state

export const acquireDownloadLock = (filename: string) => {
  if (state.locked) {
    return false
  }

  state = {
    locked: true,
    activeFile: filename,
  }
  emit()
  return true
}

export const releaseDownloadLock = () => {
  state = {
    locked: false,
    activeFile: null,
  }
  emit()
}
