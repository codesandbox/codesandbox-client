# Security Best Practices for CodeSandbox Development

This document outlines security best practices for developers working on the CodeSandbox client.

## Table of Contents

1. [Input Validation and Sanitization](#input-validation-and-sanitization)
2. [Cross-Site Scripting (XSS) Prevention](#cross-site-scripting-xss-prevention)
3. [Authentication and Authorization](#authentication-and-authorization)
4. [Dependency Management](#dependency-management)
5. [Secure Coding Practices](#secure-coding-practices)
6. [Environment Variables and Secrets](#environment-variables-and-secrets)
7. [Docker Security](#docker-security)
8. [Security Testing](#security-testing)

## Input Validation and Sanitization

### Always Validate User Input

```typescript
// ❌ BAD - No validation
function processUserInput(input: string) {
  return eval(input); // Never do this!
}

// ✅ GOOD - Validate and sanitize
import { isAlphanumericSafe, escapeHtml } from '@codesandbox/common/lib/utils/security-utils';

function processUserInput(input: string) {
  if (!isAlphanumericSafe(input)) {
    throw new Error('Invalid input');
  }
  return escapeHtml(input);
}
```

### URL Validation

```typescript
// ❌ BAD - No validation
function redirect(url: string) {
  window.location.href = url;
}

// ✅ GOOD - Validate URL
import { sanitizeUrl } from '@codesandbox/common/lib/utils/security-utils';

function redirect(url: string) {
  const safeUrl = sanitizeUrl(url);
  if (safeUrl) {
    window.location.href = safeUrl;
  } else {
    throw new Error('Invalid URL');
  }
}
```

## Cross-Site Scripting (XSS) Prevention

### Avoid dangerouslySetInnerHTML

```typescript
// ❌ BAD - Direct use without sanitization
<div dangerouslySetInnerHTML={{ __html: userContent }} />

// ✅ GOOD - Use sanitization utility
import { safeSetInnerHTML } from '@codesandbox/common/lib/utils/security-utils';

<div dangerouslySetInnerHTML={safeSetInnerHTML(userContent)} />

// ✅ BETTER - Use text content when possible
<div>{userContent}</div>
```

### Content Security Policy

Always configure CSP headers in production:

```typescript
import { SECURITY_HEADERS } from '@codesandbox/common/lib/utils/security-utils';

// In your server configuration
Object.entries(SECURITY_HEADERS).forEach(([key, value]) => {
  res.setHeader(key, value);
});
```

## Authentication and Authorization

### Token Storage

```typescript
// ❌ BAD - Storing sensitive tokens in localStorage without encryption
localStorage.setItem('authToken', token);

// ✅ GOOD - Use secure storage and validate origin
if (window.location.protocol === 'https:') {
  // Only store in secure context
  sessionStorage.setItem('authToken', token);
}

// ✅ BETTER - Use httpOnly cookies (server-side)
// Cookies with httpOnly, secure, and sameSite flags
```

### Authorization Checks

```typescript
// ❌ BAD - Client-side only authorization
if (user.role === 'admin') {
  showAdminPanel();
}

// ✅ GOOD - Always verify on server-side
async function loadAdminData() {
  try {
    const response = await fetch('/api/admin/data', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    if (!response.ok) {
      throw new Error('Unauthorized');
    }
    
    return response.json();
  } catch (error) {
    console.error('Authorization failed:', error);
    redirectToLogin();
  }
}
```

## Dependency Management

### Regular Audits

```bash
# Run weekly
yarn audit

# Check for outdated packages
yarn outdated

# Update dependencies carefully
yarn upgrade-interactive --latest
```

### Lock File Security

- Always commit `yarn.lock`
- Review changes in `yarn.lock` during PR reviews
- Use `yarn install --frozen-lockfile` in CI/CD

### Automated Scanning

The repository includes automated security scanning:
- GitHub Actions workflow: `.github/workflows/security-audit.yml`
- Security monitor script: `scripts/security-monitor.js`

Run locally:
```bash
node scripts/security-monitor.js
```

## Secure Coding Practices

### Avoid eval()

```typescript
// ❌ BAD
const result = eval(userCode);

// ✅ GOOD - Use sandboxed execution
// The sandpack-core already provides safe evaluation
import { evaluateCode } from 'sandpack-core';
```

### Prevent Prototype Pollution

```typescript
// ❌ BAD - Vulnerable to prototype pollution
function merge(target: any, source: any) {
  for (let key in source) {
    target[key] = source[key];
  }
}

// ✅ GOOD - Check for dangerous keys
function safeMerge(target: any, source: any) {
  const dangerousKeys = ['__proto__', 'constructor', 'prototype'];
  
  for (let key in source) {
    if (dangerousKeys.includes(key)) {
      continue;
    }
    
    if (Object.prototype.hasOwnProperty.call(source, key)) {
      target[key] = source[key];
    }
  }
}
```

### SQL Injection Prevention

```typescript
// ❌ BAD - String concatenation
const query = `SELECT * FROM users WHERE id = ${userId}`;

// ✅ GOOD - Use parameterized queries
const query = 'SELECT * FROM users WHERE id = ?';
db.execute(query, [userId]);
```

## Environment Variables and Secrets

### Never Commit Secrets

```bash
# ❌ BAD - Committed to Git
API_KEY=sk_live_abc123xyz

# ✅ GOOD - Use environment variables
API_KEY=${SECRET_API_KEY}
```

### .env File Management

1. Add `.env` files to `.gitignore`
2. Use `.env.example` for templates
3. Document required variables
4. Use different files for different environments

Example `.env.example`:
```bash
# API Configuration
API_ENDPOINT=https://api.codesandbox.io
API_KEY=your_api_key_here

# Feature Flags
ENABLE_FEATURE_X=false
```

### Secret Rotation

- Rotate secrets regularly
- Revoke compromised secrets immediately
- Use secret management services (AWS Secrets Manager, Azure Key Vault, etc.)

## Docker Security

### Base Image Security

```dockerfile
# ❌ BAD - Using latest or old versions
FROM node:latest
FROM node:10

# ✅ GOOD - Specific, maintained versions
FROM node:16-bullseye

# Update and upgrade
RUN apt-get update && \
    apt-get upgrade -y && \
    apt-get install -y --no-install-recommends package && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*
```

### Run as Non-Root User

```dockerfile
# Create non-root user
RUN groupadd -r appuser && useradd -r -g appuser appuser

# Change ownership
RUN chown -R appuser:appuser /app

# Switch to non-root user
USER appuser
```

### Multi-Stage Builds

```dockerfile
# Build stage
FROM node:16-bullseye AS builder
WORKDIR /app
COPY package*.json ./
RUN yarn install
COPY . .
RUN yarn build

# Production stage
FROM node:16-bullseye-slim
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
USER node
CMD ["node", "dist/server.js"]
```

## Security Testing

### Pre-Commit Checks

The repository uses Husky for pre-commit hooks. Security checks include:
- Linting for security issues
- Dependency audit
- Secret scanning

### Manual Testing Checklist

Before submitting a PR, verify:

- [ ] No hardcoded credentials or API keys
- [ ] Input validation on all user inputs
- [ ] Proper error handling (no sensitive info in errors)
- [ ] XSS prevention for dynamic content
- [ ] CSRF protection for state-changing operations
- [ ] Authorization checks on protected resources
- [ ] Secure communication (HTTPS)
- [ ] No eval() or similar dangerous functions
- [ ] Dependency vulnerabilities addressed

### Automated Testing

```typescript
// Example security test
describe('Security', () => {
  it('should sanitize HTML input', () => {
    const malicious = '<script>alert("XSS")</script>';
    const sanitized = sanitizeHtml(malicious);
    expect(sanitized).not.toContain('<script>');
  });
  
  it('should reject javascript: URLs', () => {
    const malicious = 'javascript:alert("XSS")';
    const sanitized = sanitizeUrl(malicious);
    expect(sanitized).toBeNull();
  });
});
```

## Incident Response

### If You Discover a Vulnerability

1. **DO NOT** create a public GitHub issue
2. Email details to: hello@codesandbox.io
3. Include:
   - Detailed description
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)

### Response Timeline

- Initial response: 24 hours
- Assessment: 48 hours
- Fix timeline: Based on severity

## Security Resources

### Tools

- [npm audit](https://docs.npmjs.com/cli/v8/commands/npm-audit) - Dependency vulnerability scanning
- [ESLint Security Plugin](https://github.com/nodesecurity/eslint-plugin-security) - Static analysis
- [DOMPurify](https://github.com/cure53/DOMPurify) - HTML sanitization
- [git-secrets](https://github.com/awslabs/git-secrets) - Prevent committing secrets

### References

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)
- [React Security Best Practices](https://react.dev/learn/preserving-and-resetting-state#different-components-at-the-same-position-reset-state)
- [TypeScript Security Guidelines](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-7.html)

### Training

- [Web Security Academy](https://portswigger.net/web-security)
- [OWASP WebGoat](https://owasp.org/www-project-webgoat/)
- [HackTheBox](https://www.hackthebox.com/)

## Updates and Maintenance

This document should be reviewed and updated:
- After security incidents
- Quarterly (minimum)
- When new security practices emerge
- When technology stack changes

**Last Updated**: 2024
**Maintainer**: Security Team

---

For questions or suggestions, please contact the security team or create an issue.
