# Contributing to Browser Fingerprinting Library

Thank you for your interest in contributing to the Browser Fingerprinting Library! We welcome contributions from the community and are grateful for your support.

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm, yarn, or pnpm
- Git
- TypeScript knowledge

### Development Setup

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:

   ```bash
   git clone https://github.com/your-username/browser-fingerprinting.git
   cd browser-fingerprinting
   ```

3. **Install dependencies**:

   ```bash
   npm install
   ```

4. **Build the project**:
   ```bash
   npm run build
   ```

## 🔄 Development Workflow

### Making Changes

1. **Create a new branch** for your feature or bug fix:

   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/issue-description
   ```

2. **Make your changes** following our coding standards
3. **Test your changes** thoroughly
4. **Build the project** to ensure everything compiles:
   ```bash
   npm run build
   ```

### Commit Guidelines

We follow conventional commit messages:

- `feat:` for new features
- `fix:` for bug fixes
- `docs:` for documentation changes
- `refactor:` for code refactoring
- `test:` for adding tests
- `chore:` for maintenance tasks

Example:

```bash
git commit -m "feat: add new canvas fingerprinting technique"
git commit -m "fix: resolve WebGL detection issue on Safari"
git commit -m "docs: update API documentation"
```

## 📝 Code Standards

### TypeScript Guidelines

- Use strict TypeScript settings
- Provide proper type annotations
- Avoid using `any` type when possible
- Use meaningful variable and function names
- Add JSDoc comments for public APIs

### Code Style

- Use 2 spaces for indentation
- Use semicolons
- Use double quotes for strings
- Keep lines under 120 characters
- Add trailing commas in multiline objects/arrays

### Example:

```typescript
/**
 * Generates a browser fingerprint by collecting device characteristics.
 * @returns Promise that resolves to a BrowserFingerprint object
 */
async function getBrowserFingerprintAsync(): Promise<BrowserFingerprint> {
  const userAgent = navigator.userAgent
  // ... implementation
}
```

## 🧪 Testing

### Manual Testing

Since this is a browser fingerprinting library, testing should include:

1. **Cross-browser testing** (Chrome, Firefox, Safari, Edge)
2. **Mobile device testing** (iOS Safari, Chrome Mobile)
3. **Privacy mode testing** (incognito/private browsing)
4. **Different operating systems** (Windows, macOS, Linux)

### Test Your Changes

1. Test in multiple browsers
2. Verify TypeScript compilation
3. Check that all functions return expected data types
4. Test error handling for unsupported features

## 📚 Documentation

### API Documentation

- Update README.md if you add new features
- Add JSDoc comments to new functions
- Update type definitions if needed
- Include usage examples for new features

### README Updates

When adding new features:

- Add to the features list
- Update API reference section
- Add usage examples
- Update the data collected section if applicable

## 🐛 Bug Reports

When reporting bugs, please include:

- Browser name and version
- Operating system
- Steps to reproduce
- Expected behavior
- Actual behavior
- Any error messages

## 💡 Feature Requests

For new features:

- Explain the use case
- Describe the proposed solution
- Consider privacy implications
- Discuss browser compatibility
- Provide examples if possible

## 🔒 Privacy Considerations

This library deals with sensitive data collection. When contributing:

- **Respect user privacy** - don't collect unnecessary data
- **Follow ethical guidelines** - ensure features can be used responsibly
- **Consider regulations** - keep GDPR, CCPA compliance in mind
- **Document privacy implications** - clearly explain what data is collected
- **Provide opt-out mechanisms** where applicable

## 📋 Pull Request Process

1. **Update documentation** as needed
2. **Add/update tests** if applicable
3. **Ensure the build passes**:
   ```bash
   npm run build
   ```
4. **Create a pull request** with:
   - Clear title and description
   - Reference any related issues
   - Explain the changes made
   - Include screenshots/examples if relevant

### Pull Request Template

```markdown
## Description

Brief description of changes

## Type of Change

- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Refactoring

## Testing

- [ ] Tested in Chrome
- [ ] Tested in Firefox
- [ ] Tested in Safari
- [ ] Tested on mobile

## Privacy Impact

- [ ] No new data collection
- [ ] New data collection (explain below)
- [ ] Changes to existing data collection

## Checklist

- [ ] Code follows style guidelines
- [ ] Documentation updated
- [ ] Build passes
- [ ] No breaking changes (or marked as breaking)
```

## 🎯 Areas for Contribution

We welcome contributions in these areas:

- **New fingerprinting techniques** (with privacy consideration)
- **Browser compatibility improvements**
- **Performance optimizations**
- **Documentation improvements**
- **TypeScript type improvements**
- **Error handling enhancements**
- **Testing infrastructure**

## ❓ Questions

If you have questions:

- Check existing issues on GitHub
- Create a new issue for discussion
- Email: ahmed.sharkawy.sde@gmail.com

## 🙏 Recognition

Contributors will be recognized in:

- README.md contributors section
- GitHub contributors page
- Release notes for significant contributions

Thank you for contributing to making the web more secure! 🔐
