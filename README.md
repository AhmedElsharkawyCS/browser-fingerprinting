# Browser Fingerprinting

Browser fingerprinting is a technique used to identify and track users based on their browser and device characteristics. It involves collecting various attributes such as user agent, screen resolution, installed plugins, timezone, and more to create a unique identifier for each user

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Contact](#contact)

## Installation

To install the required packages, run the following command:

```bash
npm install @ahmed-sharkawy-sde/browser-fingerprinting
# or
yarn add @ahmed-sharkawy-sde/browser-fingerprinting
```

## Usage

JavaScript

```javascript
import { getBrowserFingerprint, normalizeFingerprint, getFingerprintBase64Id, getFingerprintHashId } from "@ahmed-sharkawy-sde/browser-fingerprinting"

console.log(getBrowserFingerprint()) // Printing all the attributes collected from the browser
console.log(normalizeFingerprint()) // Printing all the attributes that used to create the fingerprint
console.log(getFingerprintBase64Id()) // Printing the base64 id of the fingerprint
getFingerprintHashId().then((id) => console.log(id)) // Printing the hash id of the fingerprint
```

TypeScript

```typescript
import {
  getBrowserFingerprint,
  normalizeFingerprint,
  getFingerprintBase64Id,
  getFingerprintHashId,
  BrowserFingerprint,
  NormalizedBrowserFingerprint
} from "@ahmed-sharkawy-sde/browser-fingerprinting"

const fingerprint: BrowserFingerprint = getBrowserFingerprint()
const normalizedFingerprint: NormalizedBrowserFingerprint = normalizeFingerprint()
const base64Id: string = getFingerprintBase64Id()
const hashId: Promise<string> = getFingerprintHashId()
console.log(fingerprint) // Printing all the attributes collected from the browser
console.log(normalizedFingerprint) // Printing all the attributes that used to create the fingerprint
console.log(base64Id) // Printing the base64 id of the fingerprint
hashId.then((id) => console.log(id)) // Printing the hash id of the fingerprint
```

## Contact

Feel free to reach out if you have any questions or suggestions.
E-Mail: <ahmed.sharkawy.sde@gmail.com>
