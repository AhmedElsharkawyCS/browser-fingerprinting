import type { BrowserFingerprint, NormalizedBrowserFingerprint } from "./types"
import { normalizeFingerprint, getBrowserFingerprint, getFingerprintBase64, getFingerprintHashAsync, stringifyFingerprint } from "./lib"

export { getBrowserFingerprint, normalizeFingerprint, getFingerprintBase64, getFingerprintHashAsync, stringifyFingerprint }

export type { BrowserFingerprint, NormalizedBrowserFingerprint }
