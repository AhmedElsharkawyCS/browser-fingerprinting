export type ScreenInfo = {
  width: number
  height: number
  availWidth: number
  availHeight: number
  colorDepth: number
  pixelDepth: number
  devicePixelRatio: number
}

export type WebGLInfo = {
  vendor: string
  renderer: string
}

export type FontCheck = {
  [key: string]: boolean
}

export type PluginInfo = {
  name: string
  filename: string
  description: string
}

export type MimeTypeInfo = {
  type: string
  description: string
}

export type TouchSupport = {
  maxTouchPoints: number
  touchEvent: boolean
  pointerEvent: boolean
}

export type NetworkInfo = {
  effectiveType?: string
  downlink?: number
  rtt?: number
}

export type StorageInfo = {
  localStorage: boolean
  sessionStorage: boolean
  indexedDB: boolean
  cookies: boolean
}

export type PerformanceBenchmark = {
  timing: number
  mathRandom: number
  mathSin: number
}

export type QuirksInfo = {
  chrome: boolean
  edge: boolean
  brave: boolean
  vivaldi: boolean
  opera: boolean
  mobile: boolean
  tablet: boolean
  desktop: boolean
  mac: boolean
  windows: boolean
  linux: boolean
  android: boolean
  ios: boolean
  firefox: boolean
  safari: boolean
  ie: boolean
}

export type BrowserFingerprint = {
  userAgent: string
  platform: string
  vendor: string
  screen: ScreenInfo
  timezone: string
  language: string
  languages: string[]
  hardwareConcurrency: number | "unknown"
  deviceMemory: number | "unknown"
  webgl: WebGLInfo
  canvasFingerprint: string
  audioFingerprint: string
  fontCheck: FontCheck
  plugins: PluginInfo[]
  mimeTypes: MimeTypeInfo[]
  touchSupport: TouchSupport
  networkInfo: NetworkInfo
  storage: StorageInfo
  performanceBenchmark: PerformanceBenchmark
  localIPs: string[]
  doNotTrack?: string | null
  quirks: QuirksInfo
}

export type NormalizedBrowserFingerprint = {
  userAgent: string
  platform: string
  screen: Pick<ScreenInfo, "height" | "width" | "devicePixelRatio">
  timezone: string
  language: string
  hardwareConcurrency: number | "unknown"
  deviceMemory: number | "unknown"
  webglVendor: string
  webglRenderer: string
  fonts: FontCheck
  audio: boolean
  touchSupport: TouchSupport
  plugins: string[]
  mimeTypes: string[]
}

export type ExtendedNavigator = Navigator & {
  deviceMemory?: number
  hardwareConcurrency?: number
  connection?: {
    effectiveType?: string
    downlink?: number
    rtt?: number
  }
  mozConnection?: any
  webkitConnection?: any
  msDoNotTrack?: string
  getUserMedia?: (constraints: MediaStreamConstraints) => Promise<MediaStream>
  webkitGetUserMedia?: (
    constraints: MediaStreamConstraints,
    successCallback: (stream: MediaStream) => void,
    errorCallback: (error: any) => void
  ) => void
  mozGetUserMedia?: (constraints: MediaStreamConstraints, successCallback: (stream: MediaStream) => void, errorCallback: (error: any) => void) => void
}

export type ExtendedWindow = Window & {
  AudioContext?: {
    new (contextOptions?: AudioContextOptions): AudioContext
    prototype: AudioContext
  }
  webkitAudioContext?: {
    new (contextOptions?: AudioContextOptions): AudioContext
    prototype: AudioContext
  }
  chrome?: unknown
  opera?: unknown
  InstallTrigger?: unknown
  doNotTrack?: string
}
