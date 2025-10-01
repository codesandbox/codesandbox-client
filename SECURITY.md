# Security Policy

Thanks for helping us keep CodeSandbox secure and safe!

## Reporting a Vulnerability

If you've discovered a vulnerability in CodeSandbox, you can send us an email at hello@codesandbox.io to report the vulnerability.

We'll make sure to respond within 24 hours, and if we accept the vulnerability, a timeline on when it will be fixed. We'll keep you posted on the progress of our fix.

## Security Resources

For detailed information about our security practices and current security status:

- **[Security Audit Report](./SECURITY_AUDIT.md)** - Current vulnerabilities and remediation status
- **[Security Best Practices](./SECURITY_BEST_PRACTICES.md)** - Developer guidelines for secure coding

## Automated Security Monitoring

We use automated security scanning to continuously monitor for vulnerabilities:

- GitHub Actions workflow for dependency auditing
- Weekly security scans
- Pre-commit security checks

To run security checks locally:

```bash
# Run full security audit
yarn security:check

# Run dependency audit only
yarn security:audit

# Run comprehensive security monitor
yarn security:monitor
```

## Security Updates

We regularly update dependencies and address security vulnerabilities. Security updates are prioritized based on severity:

- **Critical**: Immediate action (within 24 hours)
- **High**: Fix within 1 week
- **Medium**: Fix within 1 month
- **Low**: Fix in next regular update cycle

## Responsible Disclosure

We appreciate responsible disclosure of security vulnerabilities. Please:

1. Do not publicly disclose the vulnerability before we have a chance to fix it
2. Provide detailed information to help us reproduce and fix the issue
3. Give us a reasonable time to address the vulnerability before public disclosure

Thank you for helping keep CodeSandbox and our users safe!
