# Browser Fingerprinting Library

[![npm version](https://badge.fury.io/js/%40ahmedelsharkawycs%2Fbrowser-fingerprinting.svg)](https://badge.fury.io/js/%40ahmedelsharkawycs%2Fbrowser-fingerprinting)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)

A powerful, privacy-focused browser fingerprinting library that generates unique
identifiers based on browser and device characteristics. Perfect for fraud
prevention, analytics, and user identification without cookies.

## Features

- **Comprehensive Data Collection**: Gathers 15+ unique browser and device attributes
- **Privacy-Focused**: No external dependencies or data transmission
- **High Performance**: Optimized async operations with minimal impact
- **Canvas Fingerprinting**: Advanced canvas-based fingerprinting technique
- **Cross-Browser Support**: Works on all modern browsers
- **Device Detection**: Mobile, tablet, and desktop identification
- **TypeScript Support**: Full type safety and IntelliSense
- **Flexible Output**: Base64, SHA-256 hash, or raw data formats

## Table of Contents

- [Installation](#installation)
- [Quick Start](#quick-start)
- [API Reference](#api-reference)
- [Data Collected](#data-collected)
- [Advanced Usage](#advanced-usage)
- [Use Cases](#use-cases)
- [Browser Support](#browser-support)
- [Privacy & Ethics](#privacy--ethics)
- [Contributing](#contributing)
- [License](#license)

## Installation

```bash
npm install @ahmedelsharkawycs/browser-fingerprinting
```

```bash
yarn add @ahmedelsharkawycs/browser-fingerprinting
```

```bash
pnpm add @ahmedelsharkawycs/browser-fingerprinting
```

## Quick Start

### JavaScript (ES6+)

```javascript
import {
  getBrowserFingerprint,
  normalizeFingerprint,
  getFingerprintBase64,
  getFingerprintHashAsync
} from "@ahmedelsharkawycs/browser-fingerprinting"

// Get complete browser fingerprint
const fingerprint = getBrowserFingerprint()
console.log("Full fingerprint:", fingerprint)

// Get normalized fingerprint for ID generation
const normalized = normalizeFingerprint(fingerprint)
console.log("Normalized:", normalized)

// Generate Base64 ID
const base64Id = getFingerprintBase64(normalized)
console.log("Base64 ID:", base64Id)

// Generate SHA-256 hash ID
const hashId = await getFingerprintHashAsync(normalized)
console.log("Hash ID:", hashId)
```

### TypeScript

```typescript
import {
  getBrowserFingerprint,
  normalizeFingerprint,
  getFingerprintBase64,
  getFingerprintHashAsync,
  type BrowserFingerprint,
  type NormalizedBrowserFingerprint
} from "@ahmedelsharkawycs/browser-fingerprinting"

async function generateFingerprint(): Promise<string> {
  // Get complete fingerprint with full type safety
  const fingerprint: BrowserFingerprint = getBrowserFingerprint()

  // Normalize for consistent ID generation
  const normalized: NormalizedBrowserFingerprint = normalizeFingerprint(fingerprint)

  // Generate a unique hash-based ID
  const uniqueId: string = await getFingerprintHashAsync(normalized)

  return uniqueId
}
```

## API Reference

### Core Functions

#### getBrowserFingerprint(): BrowserFingerprint

Collects comprehensive browser and device information.

**Returns:** Complete fingerprint object with all available data points.

#### normalizeFingerprint(fingerprint: BrowserFingerprint): NormalizedBrowserFingerprint

Normalizes fingerprint data for consistent ID generation across sessions.

**Parameters:**

- `fingerprint`: The complete browser fingerprint

**Returns:** Normalized fingerprint with stable attributes only.

#### getFingerprintBase64(fingerprint: NormalizedBrowserFingerprint): string

Generates a Base64-encoded unique identifier.

**Parameters:**

- `fingerprint`: Normalized fingerprint data
- `isNormalized`: Whether the input is already normalized (default: true)

**Returns:** URL-safe Base64 encoded ID.

#### getFingerprintHashAsync(fingerprint: NormalizedBrowserFingerprint): Promise<string>

Generates a SHA-256 hash-based unique identifier.

**Parameters:**

- `fingerprint`: Normalized fingerprint data
- `isNormalized`: Whether the input is already normalized (default: true)

**Returns:** Hexadecimal SHA-256 hash string.

## Data Collected

### Browser Information

- **User Agent**: Browser and OS identification
- **Platform**: Operating system details
- **Vendor**: Browser vendor information
- **Language**: Primary and available languages
- **Plugins**: Installed browser plugins
- **MIME Types**: Supported media types

### Hardware & Performance

- **Screen Resolution**: Display dimensions and pixel density
- **Hardware Concurrency**: CPU core count
- **Device Memory**: Available RAM (if supported)
- **Touch Support**: Touch capabilities and max touch points
- **Performance Metrics**: Timing benchmarks

### Graphics & Media

- **Canvas Fingerprint**: Rendered canvas signature
- **WebGL Information**: Graphics card vendor and renderer
- **Font Detection**: Available system fonts

### Network & Storage

- **Network Information**: Connection type and speed
- **Storage Support**: Local/session storage and IndexedDB
- **Local IP Addresses**: WebRTC-based IP detection
- **Timezone**: User's timezone setting

### Browser Quirks Detection

- **Browser Type**: Chrome, Firefox, Safari, Edge, etc.
- **Device Type**: Mobile, tablet, or desktop
- **Operating System**: Windows, macOS, Linux, etc.

## Advanced Usage

### Custom Fingerprint Processing

```typescript
import { getBrowserFingerprint, normalizeFingerprint, getFingerprintHashAsync } from "@ahmedelsharkawycs/browser-fingerprinting"

async function createCustomFingerprint() {
  const fingerprint = getBrowserFingerprint()

  // Custom processing for specific use cases
  const customData = {
    id: await getFingerprintHashAsync(normalizeFingerprint(fingerprint)),
    deviceType: fingerprint.quirks.mobile ? "mobile" : fingerprint.quirks.tablet ? "tablet" : "desktop",
    browserFamily: fingerprint.quirks.chrome ? "Chrome" : fingerprint.quirks.firefox ? "Firefox" : fingerprint.quirks.safari ? "Safari" : "Other",
    screenSignature: `${fingerprint.screen.width}x${fingerprint.screen.height}@${fingerprint.screen.devicePixelRatio}x`,
    hasWebGL: fingerprint.webgl.vendor !== "unknown",
    timestamp: fingerprint.currentTimestamp
  }

  return customData
}
```

### Fingerprint Comparison

```typescript
async function compareFingerprints() {
  const fp1 = getBrowserFingerprint()
  const fp2 = getBrowserFingerprint() // Later session

  const id1 = await getFingerprintHashAsync(normalizeFingerprint(fp1))
  const id2 = await getFingerprintHashAsync(normalizeFingerprint(fp2))

  return id1 === id2 // Same user/device
}
```

## Use Cases

### Fraud Prevention

```typescript
async function detectSuspiciousActivity(userFingerprint: string) {
  const currentFingerprint = await getFingerprintHashAsync(normalizeFingerprint(getBrowserFingerprint()))

  return userFingerprint !== currentFingerprint
}
```

### Analytics & Tracking

```typescript
async function trackUniqueVisitors() {
  const fingerprint = getBrowserFingerprint()
  const visitorId = getFingerprintBase64(normalizeFingerprint(fingerprint))

  // Send to analytics without personal data
  analytics.track("page_view", { visitor_id: visitorId })
}
```

### Session Management

```typescript
async function validateSession(storedFingerprintId: string) {
  const currentId = await getFingerprintHashAsync(normalizeFingerprint(getBrowserFingerprint()))

  if (currentId !== storedFingerprintId) {
    // Potential session hijacking
    return false
  }
  return true
}
```

## Browser Support

| Browser | Version | Notes          |
| ------- | ------- | -------------- |
| Chrome  | 60+     | Full support   |
| Firefox | 55+     | Full support   |
| Safari  | 12+     | Limited WebRTC |
| Edge    | 79+     | Full support   |
| Opera   | 47+     | Full support   |

**Note**: Some features may have limited availability on older browsers or privacy-focused configurations.

## Privacy & Ethics

This library is designed for legitimate use cases such as:

- Fraud prevention and security
- Analytics and user experience improvement
- A/B testing and personalization
- Bot detection and spam prevention

### Ethical Guidelines

- Always inform users about data collection
- Provide opt-out mechanisms where required
- Comply with privacy regulations (GDPR, CCPA, etc.)
- Don't use for malicious tracking or profiling
- Respect user privacy settings and preferences

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Setup

```bash
git clone https://github.com/AhmedElsharkawyCS/browser-fingerprinting
cd browser-fingerprinting
npm install
npm run build
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support & Contact

- **Email**: <ahmed.sharkawy.sde@gmail.com>
- **Issues**: [GitHub Issues](https://github.com/AhmedElsharkawyCS/browser-fingerprinting/issues)
- **Feature Requests**: [GitHub Discussions](https://github.com/AhmedElsharkawyCS/browser-fingerprinting/discussions)

---

**Made with ❤️ by Ahmed Sharkawy**

[⭐ Star this repo](https://github.com/AhmedElsharkawyCS/browser-fingerprinting) if you find it useful!
