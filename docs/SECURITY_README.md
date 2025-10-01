# Security Documentation Index

This directory contains comprehensive security documentation for the CodeSandbox client repository.

## 📚 Documentation

### [SECURITY.md](../SECURITY.md)
The main security policy document. Read this to understand:
- How to report security vulnerabilities
- Our response timeline
- Automated security monitoring
- Security update process

### [SECURITY_AUDIT.md](../SECURITY_AUDIT.md)
Comprehensive security audit report including:
- Current vulnerability status
- Identified security issues
- Remediation steps taken
- Ongoing security practices
- Regular security task checklist

### [SECURITY_BEST_PRACTICES.md](../SECURITY_BEST_PRACTICES.md)
Developer guidelines for secure coding:
- Input validation and sanitization
- XSS prevention
- Authentication and authorization
- Dependency management
- Secure coding patterns
- Docker security
- Security testing practices

## 🛠️ Security Tools

### Automated Security Scanning
- **GitHub Actions**: `.github/workflows/security-audit.yml`
  - Runs on every push and pull request
  - Weekly scheduled scans
  - Dependency vulnerability checks
  - Code security pattern analysis
  - Docker security scanning

### Security Monitor Script
- **Location**: `scripts/security-monitor.js`
- **Usage**: `yarn security:monitor`
- **Features**:
  - Dependency vulnerability scanning
  - Code pattern analysis
  - Dockerfile security checks
  - Configuration validation
  - Git security checks

### Security Utilities
- **Location**: `packages/common/src/utils/security-utils.ts`
- **Features**:
  - HTML sanitization
  - URL validation
  - XSS prevention helpers
  - CSP configuration
  - Security headers

## 🚀 Quick Start

### Run Security Checks

```bash
# Full security audit and monitoring
yarn security:check

# Just dependency audit
yarn security:audit

# Comprehensive security monitor
yarn security:monitor
```

### Before Committing Code

Security checks are automatically run via pre-commit hooks, but you can manually run:

```bash
yarn lint
yarn typecheck
yarn security:audit
```

### Review Security Guidelines

Before writing code that handles:
- User input
- External data
- Authentication/Authorization
- File uploads
- Dynamic HTML content

Please review [SECURITY_BEST_PRACTICES.md](../SECURITY_BEST_PRACTICES.md)

## 📊 Current Security Status

To view the current security status:

1. Check the latest [Security Audit Report](../SECURITY_AUDIT.md)
2. Run `yarn security:monitor`
3. View GitHub Actions results in the repository

## 🔔 Stay Updated

Security documentation is regularly updated. Check for updates:
- After security incidents
- Quarterly (minimum)
- When dependencies are updated
- When new security practices emerge

## 🤝 Contributing to Security

If you want to improve our security:

1. Review existing documentation
2. Run security tools
3. Submit improvements via pull requests
4. Report vulnerabilities responsibly (see SECURITY.md)

## 📞 Contact

For security questions or concerns:
- Email: hello@codesandbox.io
- See [SECURITY.md](../SECURITY.md) for vulnerability reporting

---

**Last Updated**: 2024
