import { BrowserFingerprint, ExtendedNavigator, NormalizedBrowserFingerprint } from "./types"

const navigatorWithExtensions = navigator as ExtendedNavigator

function getCanvasFingerprint(): string {
  try {
    const canvas = document.createElement("canvas")
    canvas.width = 200
    canvas.height = 50
    const ctx = canvas.getContext("2d")
    if (ctx) {
      ctx.textBaseline = "top"
      ctx.font = "14px Arial"
      ctx.fillStyle = "#f60"
      ctx.fillRect(0, 0, 100, 50)
      ctx.fillStyle = "#069"
      ctx.fillText("BrowserFingerprint", 2, 15)
      return canvas.toDataURL()
    }
  } catch (_) {}
  return "unknown"
}

function getBrowserFingerprint(): BrowserFingerprint {
  const {
    userAgent,
    platform,
    vendor = "",
    language,
    languages = [],
    hardwareConcurrency = "unknown",
    deviceMemory = "unknown",
    plugins = [],
    mimeTypes = [],
    maxTouchPoints = 0,
    connection = {},
    doNotTrack = "",
    cookieEnabled
  } = navigatorWithExtensions

  const screen = {
    width: window.screen.width,
    height: window.screen.height,
    availWidth: window.screen.availWidth,
    availHeight: window.screen.availHeight,
    colorDepth: window.screen.colorDepth,
    pixelDepth: window.screen.pixelDepth,
    devicePixelRatio: window.devicePixelRatio || 1
  }

  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone

  const canvasFingerprint = getCanvasFingerprint()

  const fonts = ["Arial", "Times New Roman", "Courier New", "Comic Sans MS", "Verdana", "Georgia"]
  const fontCheck: Record<string, boolean> = {}
  fonts.forEach((font) => {
    fontCheck[font] = document.fonts ? document.fonts.check(`12px "${font}"`) : false
  })

  let webglVendor = "unknown",
    webglRenderer = "unknown"
  try {
    const canvas = document.createElement("canvas")
    const gl = (canvas.getContext("webgl") as WebGLRenderingContext) || (canvas.getContext("experimental-webgl") as WebGLRenderingContext)
    if (gl) {
      const debugInfo = gl.getExtension("WEBGL_debug_renderer_info")
      if (debugInfo) {
        webglVendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL)
        webglRenderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL)
      }
    }
  } catch (_) {}

  const touchSupport = {
    maxTouchPoints,
    touchEvent: "ontouchstart" in window,
    pointerEvent: "onpointerdown" in window
  }

  const networkInfo = {
    effectiveType: connection.effectiveType,
    downlink: connection.downlink,
    rtt: connection.rtt
  }

  const storage = {
    localStorage: !!window.localStorage,
    sessionStorage: !!window.sessionStorage,
    indexedDB: !!window.indexedDB,
    cookies: cookieEnabled
  }

  // Remove dynamic performance benchmark that changes on each call
  const performanceBenchmark = {
    timing: 0, // Static value instead of performance.now()
    mathRandom: 0.123456789, // Static value instead of Math.random()
    mathSin: Math.sin(1) // This is deterministic, keep it
  }

  const quirks = {
    chrome: !!(window as any).chrome,
    edge: userAgent.includes("Edg/"),
    brave: userAgent.includes("Brave"),
    vivaldi: userAgent.includes("Vivaldi"),
    opera: userAgent.includes("OPR/") || userAgent.includes("Opera"),
    mobile: /Mobi|Android/i.test(userAgent),
    tablet: /Tablet|iPad/i.test(userAgent),
    desktop: !(/Mobi|Android/i.test(userAgent) || /Tablet|iPad/i.test(userAgent)),
    mac: platform.includes("Mac"),
    windows: platform.includes("Win"),
    linux: platform.includes("Linux"),
    android: /Android/i.test(userAgent),
    ios: /iPhone|iPad|iPod/i.test(userAgent),
    firefox: "InstallTrigger" in window,
    safari: /^((?!chrome|android).)*safari/i.test(userAgent),
    ie: !!(document as any).documentMode
  }

  return {
    userAgent,
    platform,
    vendor,
    screen,
    timezone,
    language,
    languages: languages as string[],
    hardwareConcurrency,
    deviceMemory,
    canvasFingerprint,
    fontCheck,
    webgl: { vendor: webglVendor, renderer: webglRenderer },
    plugins: Array.from(plugins).map((p) => ({ name: p.name, filename: p.filename, description: p.description })),
    mimeTypes: Array.from(mimeTypes).map((mt) => ({ type: mt.type, description: mt.description })),
    touchSupport,
    networkInfo,
    storage,
    performanceBenchmark,
    localIPs: [], // Static empty array instead of dynamic IPs
    doNotTrack,
    quirks
  }
}

function normalizeFingerprint(f: BrowserFingerprint): NormalizedBrowserFingerprint {
  return {
    userAgent: f.userAgent,
    platform: f.platform,
    screen: {
      width: f.screen.width,
      height: f.screen.height,
      devicePixelRatio: f.screen.devicePixelRatio
    },
    timezone: f.timezone,
    deviceMemory: f.deviceMemory,
    hardwareConcurrency: f.hardwareConcurrency,
    fonts: f.fontCheck,
    language: f.language,
    touchSupport: f.touchSupport,
    webglRenderer: f.webgl.renderer,
    webglVendor: f.webgl.vendor,
    plugins: f.plugins.map((p) => p.name).sort(),
    mimeTypes: f.mimeTypes.map((mt) => mt.type).sort()
  }
}

function stringifyFingerprint(f: NormalizedBrowserFingerprint | NormalizedBrowserFingerprint): string {
  return JSON.stringify(f)
}

function getFingerprintBase64(fingerprint: BrowserFingerprint | NormalizedBrowserFingerprint, isNormalized: boolean = true): string {
  const str = isNormalized
    ? stringifyFingerprint(fingerprint as NormalizedBrowserFingerprint)
    : stringifyFingerprint(normalizeFingerprint(fingerprint as BrowserFingerprint))
  const encoded = btoa(str)
  return encoded.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "")
}

async function getFingerprintHashAsync(
  fingerprint: BrowserFingerprint | NormalizedBrowserFingerprint,
  isNormalized: boolean = true
): Promise<string> {
  const str = isNormalized
    ? stringifyFingerprint(fingerprint as NormalizedBrowserFingerprint)
    : stringifyFingerprint(normalizeFingerprint(fingerprint as BrowserFingerprint))
  const encoder = new TextEncoder()
  const data = encoder.encode(str)
  const hashBuffer = await crypto.subtle.digest("SHA-256", data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")
}

export { getBrowserFingerprint, normalizeFingerprint, stringifyFingerprint, getFingerprintBase64, getFingerprintHashAsync }
