import { BrowserFingerprint, ExtendedNavigator, ExtendedWindow, NormalizedBrowserFingerprint } from "./types"

// Get the properly typed navigator object
const navigatorWithExtensions = navigator as ExtendedNavigator
const windowWithExtensions = window as ExtendedWindow

/**
 * Generates a browser fingerprint by collecting various properties and features of the user's browser and device.
 * @returns A BrowserFingerprint object containing the collected information.
 **/
function getBrowserFingerprint(): BrowserFingerprint {
  // Basic Browser & OS Info
  const userAgent = navigatorWithExtensions.userAgent
  const platform = navigatorWithExtensions.platform
  const vendor = navigatorWithExtensions.vendor || ""

  // Screen & Display Info
  const screen = {
    width: windowWithExtensions.screen.width,
    height: windowWithExtensions.screen.height,
    availWidth: windowWithExtensions.screen.availWidth,
    availHeight: windowWithExtensions.screen.availHeight,
    colorDepth: windowWithExtensions.screen.colorDepth,
    pixelDepth: windowWithExtensions.screen.pixelDepth,
    devicePixelRatio: windowWithExtensions.devicePixelRatio || 1
  }

  // Timezone & Language
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
  const language = navigatorWithExtensions.language
  const languages = (navigatorWithExtensions.languages || []) as string[]

  // CPU & Memory
  const hardwareConcurrency = navigatorWithExtensions.hardwareConcurrency || "unknown"
  const deviceMemory = navigatorWithExtensions.deviceMemory || "unknown"

  // WebGL Fingerprinting
  let webglVendor = "unknown"
  let webglRenderer = "unknown"
  try {
    const canvas = document.createElement("canvas")
    const gl = (canvas.getContext("webgl") || canvas.getContext("experimental-webgl")) as WebGLRenderingContext

    if (gl) {
      const debugInfo = gl.getExtension("WEBGL_debug_renderer_info")

      if (debugInfo) {
        webglVendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) as string
        webglRenderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) as string
      }
    }
  } catch (e) {
    console.error("WebGL fingerprint failed:", e)
  }

  // Canvas Fingerprinting
  let canvasFingerprint = "unknown"
  try {
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")
    if (ctx) {
      ctx.textBaseline = "top"
      ctx.font = "14px 'Arial'"
      ctx.fillStyle = "#f60"
      ctx.fillRect(0, 0, 100, 50)
      ctx.fillStyle = "#069"
      ctx.fillText("BrowserFingerprint", 2, 15)
      canvasFingerprint = canvas.toDataURL()
    }
  } catch (e) {}

  // AudioContext Fingerprinting
  let audioFingerprint = "unknown"
  try {
    const audioContext = new (windowWithExtensions.AudioContext ?? windowWithExtensions.webkitAudioContext!)()
    const oscillator = audioContext.createOscillator()
    const analyser = audioContext.createAnalyser()
    const gain = audioContext.createGain()
    const scriptProcessor = audioContext.createScriptProcessor(4096, 1, 1)

    oscillator.connect(analyser)
    analyser.connect(scriptProcessor)
    scriptProcessor.connect(gain)
    gain.connect(audioContext.destination)

    oscillator.type = "triangle"
    oscillator.frequency.value = 10000

    scriptProcessor.onaudioprocess = (e) => {
      audioFingerprint = String(e.inputBuffer.getChannelData(0))
    }

    oscillator.start(0)
    audioContext.close()
  } catch (e) {}

  // Installed Fonts (Approximation)
  const fonts = ["Arial", "Times New Roman", "Courier New", "Comic Sans MS", "Verdana", "Georgia"]
  const fontCheck: Record<string, boolean> = {}
  fonts.forEach((font) => {
    fontCheck[font] = document.fonts ? document.fonts.check(`12px "${font}"`) : false
  })

  // Plugins & MIME Types
  const plugins = Array.from(navigatorWithExtensions.plugins || []).map((p) => ({
    name: p.name,
    filename: p.filename,
    description: p.description
  }))

  const mimeTypes = Array.from(navigatorWithExtensions.mimeTypes || []).map((mt) => ({
    type: mt.type,
    description: mt.description
  }))

  // Touch & Pointer Support
  const touchSupport = {
    maxTouchPoints: navigatorWithExtensions.maxTouchPoints || 0,
    touchEvent: "ontouchstart" in window,
    pointerEvent: "onpointerdown" in window
  }

  // Network Info (if available)
  const connection = navigatorWithExtensions.connection || (navigator as any).mozConnection || (navigator as any).webkitConnection || {}
  const networkInfo = {
    effectiveType: connection.effectiveType,
    downlink: connection.downlink,
    rtt: connection.rtt
  }

  // Storage & Cookies
  const storage = {
    localStorage: !!windowWithExtensions.localStorage,
    sessionStorage: !!windowWithExtensions.sessionStorage,
    indexedDB: !!windowWithExtensions.indexedDB,
    cookies: navigatorWithExtensions.cookieEnabled
  }

  // Performance & Math Benchmarks
  const performanceBenchmark = {
    timing: performance.now(),
    mathRandom: Math.random(),
    mathSin: Math.sin(1)
  }

  // WebRTC IP Leak (Local IP)
  let localIPs: string[] = []
  try {
    const rtc = new RTCPeerConnection({ iceServers: [] })
    rtc.createDataChannel("")
    rtc.onicecandidate = (e) => {
      if (e.candidate) {
        const ip = /([0-9]{1,3}(\.[0-9]{1,3}){3})/.exec(e.candidate.candidate)?.[1]
        if (ip) localIPs.push(ip)
      }
    }
    rtc.createOffer().then((offer) => rtc.setLocalDescription(offer))
  } catch (e) {}

  // Do Not Track & Privacy Settings
  const doNotTrack = navigatorWithExtensions.doNotTrack || windowWithExtensions.doNotTrack || navigatorWithExtensions.msDoNotTrack

  // Additional Browser-Specific Quirks
  const quirks = {
    chrome: windowWithExtensions.chrome !== undefined,
    firefox: "InstallTrigger" in window,
    safari: /^((?!chrome|android).)*safari/i.test(userAgent),
    opera: !!(window as any).opera || userAgent.includes("OPR/"),
    ie: /*@cc_on!@*/ false || !!(document as any).documentMode
  }

  return {
    userAgent,
    platform,
    vendor,
    screen,
    timezone,
    language,
    languages,
    hardwareConcurrency,
    deviceMemory,
    webgl: {
      vendor: webglVendor,
      renderer: webglRenderer
    },
    canvasFingerprint,
    audioFingerprint,
    fontCheck,
    plugins,
    mimeTypes,
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

/**
 * Normalizes the browser fingerprint by extracting relevant properties and converting them to a consistent format.
 * @param fingerprint The browser fingerprint to normalize.
 * @returns A normalized version of the browser fingerprint.
 **/

function normalizeFingerprint(fingerprint: BrowserFingerprint): NormalizedBrowserFingerprint {
  return {
    userAgent: fingerprint.userAgent,
    platform: fingerprint.platform,
    screen: {
      width: fingerprint.screen.width,
      height: fingerprint.screen.height,
      devicePixelRatio: fingerprint.screen.devicePixelRatio
    },
    timezone: fingerprint.timezone,
    audio: fingerprint.audioFingerprint !== "unknown",
    deviceMemory: fingerprint.deviceMemory,
    hardwareConcurrency: fingerprint.hardwareConcurrency,
    fonts: fingerprint.fontCheck,
    language: fingerprint.language,
    touchSupport: fingerprint.touchSupport,
    webglRenderer: fingerprint.webgl.renderer,
    webglVendor: fingerprint.webgl.vendor,
    plugins: fingerprint.plugins.map((plugin) => plugin.name).sort(),
    mimeTypes: fingerprint.mimeTypes.map((mimeType) => mimeType.type).sort()
  }
}

function stringifyNormalizedFingerprint(fingerprint: NormalizedBrowserFingerprint): string {
  const sortedKeys = Object.keys(fingerprint).sort()
  const sortedValues = sortedKeys.map((key) => fingerprint[key as keyof NormalizedBrowserFingerprint])
  return JSON.stringify(sortedValues)
}

/**
 * Generates a unique ID for the browser fingerprint using Base64 encoding.
 * @param fingerprint The browser fingerprint to encode.
 * @returns A Base64 encoded string representing the fingerprint.
 **/
function getFingerprintBase64Id(fingerprint: BrowserFingerprint): string {
  const normalizedFingerprint = normalizeFingerprint(fingerprint)
  const fingerprintString = stringifyNormalizedFingerprint(normalizedFingerprint)
  return btoa(fingerprintString)
}

/**
 * Generates a SHA-256 hash of the fingerprint and returns it as a hex string.
 * @param fingerprint The browser fingerprint to hash.
 * @returns A promise that resolves to the SHA-256 hash of the fingerprint as a hex string.
 **/
async function getFingerprintHashId(fingerprint: BrowserFingerprint): Promise<string> {
  if (!window.crypto || !window.crypto.subtle) return Promise.reject("Crypto API not supported")
  const normalizedFingerprint = normalizeFingerprint(fingerprint)
  const fingerprintString = stringifyNormalizedFingerprint(normalizedFingerprint)
  const encoder = new TextEncoder()
  const data = encoder.encode(fingerprintString)
  const hashBuffer = await crypto.subtle.digest("SHA-256", data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hashHex = hashArray.map((byte) => byte.toString(16).padStart(2, "0")).join("")
  return hashHex
}

export { getBrowserFingerprint, normalizeFingerprint, getFingerprintBase64Id, getFingerprintHashId }
