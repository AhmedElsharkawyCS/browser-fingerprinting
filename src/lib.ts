// path: utils/browserFingerprint.ts

import { BrowserFingerprint, ExtendedNavigator, ExtendedWindow, NormalizedBrowserFingerprint } from "./types"

const navigatorWithExtensions = navigator as ExtendedNavigator
const windowWithExtensions = window as ExtendedWindow

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

async function getAudioFingerprint(): Promise<string> {
  try {
    // Check if AudioContext is available
    const AudioContextConstructor = windowWithExtensions.AudioContext || windowWithExtensions.webkitAudioContext
    if (!AudioContextConstructor) {
      return "no-audio-context"
    }

    const audioContext = new AudioContextConstructor()

    // Check if the context is suspended (requires user gesture)
    if (audioContext.state === "suspended") {
      // Try to resume, but if it fails, generate a fallback fingerprint
      try {
        await audioContext.resume()
      } catch (_) {
        audioContext.close()
        // Return a fallback fingerprint based on audio capabilities
        return getAudioCapabilitiesFingerprint()
      }
    }

    const oscillator = audioContext.createOscillator()
    const analyser = audioContext.createAnalyser()
    const gain = audioContext.createGain()
    const scriptProcessor = audioContext.createScriptProcessor(4096, 1, 1)

    return await new Promise<string>((resolve) => {
      // Set a timeout to prevent hanging
      const timeout = setTimeout(() => {
        audioContext.close()
        resolve(getAudioCapabilitiesFingerprint())
      }, 1000)

      oscillator.connect(analyser)
      analyser.connect(scriptProcessor)
      scriptProcessor.connect(gain)
      gain.connect(audioContext.destination)

      oscillator.type = "triangle"
      oscillator.frequency.value = 10000

      scriptProcessor.onaudioprocess = (e) => {
        clearTimeout(timeout)
        const audioData = String(e.inputBuffer.getChannelData(0).slice(0, 100))
        audioContext.close()
        resolve(audioData)
      }

      oscillator.start(0)
    })
  } catch (_) {
    return getAudioCapabilitiesFingerprint()
  }
}

function getAudioCapabilitiesFingerprint(): string {
  try {
    // Generate a fingerprint based on audio capabilities without requiring user gesture
    const capabilities = {
      hasAudioContext: !!(windowWithExtensions.AudioContext || windowWithExtensions.webkitAudioContext),
      hasWebAudio: typeof window !== "undefined" && "AudioContext" in window,
      hasMediaDevices: !!navigator.mediaDevices,
      hasGetUserMedia: !!(
        navigatorWithExtensions.getUserMedia ||
        navigatorWithExtensions.webkitGetUserMedia ||
        navigatorWithExtensions.mozGetUserMedia
      ),
      audioFormats: {
        mp3: canPlayAudioType("audio/mpeg"),
        wav: canPlayAudioType("audio/wav"),
        ogg: canPlayAudioType("audio/ogg"),
        m4a: canPlayAudioType("audio/mp4"),
        webm: canPlayAudioType("audio/webm")
      }
    }
    return JSON.stringify(capabilities)
  } catch (_) {
    return "audio-capabilities-unknown"
  }
}

function canPlayAudioType(type: string): boolean {
  try {
    const audio = document.createElement("audio")
    return audio.canPlayType(type) !== ""
  } catch (_) {
    return false
  }
}

async function getLocalIPs(): Promise<string[]> {
  return new Promise((resolve) => {
    const ips: Set<string> = new Set()
    try {
      const rtc = new RTCPeerConnection({ iceServers: [] })
      rtc.createDataChannel("")
      rtc.onicecandidate = (e) => {
        if (e.candidate) {
          const ipMatch = /([0-9]{1,3}(\.[0-9]{1,3}){3})/.exec(e.candidate.candidate)
          if (ipMatch) ips.add(ipMatch[1])
        } else {
          resolve(Array.from(ips))
        }
      }
      rtc.createOffer().then((offer) => rtc.setLocalDescription(offer))
    } catch (_) {
      resolve([])
    }
  })
}

async function getBrowserFingerprintAsync(): Promise<BrowserFingerprint> {
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
  const audioFingerprint = await getAudioFingerprint()
  const localIPs = await getLocalIPs()

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

  const performanceBenchmark = {
    timing: performance.now(),
    mathRandom: Math.random(),
    mathSin: Math.sin(1)
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
    audioFingerprint,
    fontCheck,
    webgl: { vendor: webglVendor, renderer: webglRenderer },
    plugins: Array.from(plugins).map((p) => ({ name: p.name, filename: p.filename, description: p.description })),
    mimeTypes: Array.from(mimeTypes).map((mt) => ({ type: mt.type, description: mt.description })),
    touchSupport,
    networkInfo,
    storage,
    performanceBenchmark,
    localIPs,
    doNotTrack,
    quirks,
    currentTimestamp: new Date().toISOString()
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
    audio: f.audioFingerprint !== "unknown",
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

export { getBrowserFingerprintAsync, normalizeFingerprint, stringifyFingerprint, getFingerprintBase64, getFingerprintHashAsync }
