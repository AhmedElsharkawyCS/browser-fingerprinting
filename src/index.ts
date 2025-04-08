import type { BrowserFingerprint, NormalizedBrowserFingerprint } from "./types"
import { getBrowserFingerprint, getFingerprintBase64Id, getFingerprintHashId, normalizeFingerprint } from "./lib"

export { getBrowserFingerprint, normalizeFingerprint, getFingerprintBase64Id, getFingerprintHashId }
export type { BrowserFingerprint, NormalizedBrowserFingerprint }
