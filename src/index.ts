import type { BrowserFingerprint, NormalizedBrowserFingerprint } from "./types"
import { normalizeFingerprint, getBrowserFingerprintAsync, getFingerprintBase64, getFingerprintHashAsync, stringifyFingerprint } from "./lib"

export { getBrowserFingerprintAsync, normalizeFingerprint, getFingerprintBase64, getFingerprintHashAsync, stringifyFingerprint }

export type { BrowserFingerprint, NormalizedBrowserFingerprint }
