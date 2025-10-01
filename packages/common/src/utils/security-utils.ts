/**
 * Security Utilities for Input Sanitization
 * 
 * This module provides utilities for preventing XSS and other injection attacks.
 * Use these utilities instead of directly using dangerouslySetInnerHTML.
 * 
 * @module security-utils
 */

/**
 * Escapes HTML special characters to prevent XSS attacks
 * @param {string} text - The text to escape
 * @returns {string} The escaped text
 */
export function escapeHtml(text: string): string {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

/**
 * Sanitizes HTML by removing potentially dangerous tags and attributes
 * This is a basic implementation. For production use, consider DOMPurify.
 * 
 * @param {string} html - The HTML to sanitize
 * @returns {string} The sanitized HTML
 */
export function sanitizeHtml(html: string): string {
  // List of allowed tags
  const allowedTags = ['b', 'i', 'em', 'strong', 'a', 'p', 'br', 'ul', 'ol', 'li', 'span', 'div', 'code', 'pre'];
  
  // List of allowed attributes
  const allowedAttributes = ['href', 'title', 'class'];
  
  const div = document.createElement('div');
  div.innerHTML = html;
  
  // Remove disallowed tags
  const allElements = div.getElementsByTagName('*');
  for (let i = allElements.length - 1; i >= 0; i--) {
    const element = allElements[i];
    const tagName = element.tagName.toLowerCase();
    
    if (!allowedTags.includes(tagName)) {
      element.remove();
      continue;
    }
    
    // Remove disallowed attributes
    const attributes = Array.from(element.attributes);
    attributes.forEach(attr => {
      if (!allowedAttributes.includes(attr.name.toLowerCase())) {
        element.removeAttribute(attr.name);
      }
    });
    
    // Sanitize href attributes to prevent javascript: protocol
    if (element.hasAttribute('href')) {
      const href = element.getAttribute('href') || '';
      if (href.trim().toLowerCase().startsWith('javascript:')) {
        element.removeAttribute('href');
      }
    }
  }
  
  return div.innerHTML;
}

/**
 * Validates and sanitizes a URL
 * @param {string} url - The URL to validate
 * @returns {string|null} The sanitized URL or null if invalid
 */
export function sanitizeUrl(url: string): string | null {
  try {
    const parsed = new URL(url);
    
    // Only allow http, https, and mailto protocols
    if (!['http:', 'https:', 'mailto:'].includes(parsed.protocol)) {
      return null;
    }
    
    return parsed.toString();
  } catch (e) {
    return null;
  }
}

/**
 * Safely sets inner HTML with sanitization
 * Use this instead of dangerouslySetInnerHTML when possible
 * 
 * @param {string} html - The HTML to set
 * @returns {object} Object suitable for dangerouslySetInnerHTML
 */
export function safeSetInnerHTML(html: string): { __html: string } {
  return { __html: sanitizeHtml(html) };
}

/**
 * Validates that a string contains only alphanumeric characters and common safe symbols
 * @param {string} input - The input to validate
 * @returns {boolean} True if the input is safe
 */
export function isAlphanumericSafe(input: string): boolean {
  return /^[a-zA-Z0-9\s\-_.,!?]+$/.test(input);
}

/**
 * Content Security Policy helper
 * Returns recommended CSP directives
 */
export const CSP_DIRECTIVES = {
  defaultSrc: ["'self'"],
  scriptSrc: [
    "'self'",
    "'unsafe-inline'", // Required for CodeSandbox functionality
    "'unsafe-eval'",   // Required for CodeSandbox functionality
    "https://codesandbox.io"
  ],
  styleSrc: [
    "'self'",
    "'unsafe-inline'", // Required for styled-components
    "https://fonts.googleapis.com"
  ],
  imgSrc: [
    "'self'",
    "data:",
    "https:"
  ],
  fontSrc: [
    "'self'",
    "data:",
    "https://fonts.gstatic.com"
  ],
  connectSrc: [
    "'self'",
    "https://codesandbox.io",
    "wss://codesandbox.io"
  ],
  frameSrc: ["'self'"],
  objectSrc: ["'none'"],
  baseUri: ["'self'"],
  formAction: ["'self'"],
};

/**
 * Generates a CSP header string
 * @returns {string} The CSP header value
 */
export function generateCSPHeader(): string {
  return Object.entries(CSP_DIRECTIVES)
    .map(([directive, sources]) => {
      const kebabCase = directive.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`);
      return `${kebabCase} ${sources.join(' ')}`;
    })
    .join('; ');
}

/**
 * Security headers recommended for production
 */
export const SECURITY_HEADERS = {
  'Content-Security-Policy': generateCSPHeader(),
  'X-Frame-Options': 'SAMEORIGIN',
  'X-Content-Type-Options': 'nosniff',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
};

// Usage examples and documentation
export const USAGE_EXAMPLES = `
/**
 * Usage Examples:
 * 
 * 1. Escaping user input:
 *    const safe = escapeHtml(userInput);
 * 
 * 2. Sanitizing HTML content:
 *    const safeHtml = sanitizeHtml(untrustedHtml);
 * 
 * 3. Using with React:
 *    <div dangerouslySetInnerHTML={safeSetInnerHTML(content)} />
 * 
 * 4. Validating URLs:
 *    const safeUrl = sanitizeUrl(userProvidedUrl);
 *    if (safeUrl) {
 *      window.location.href = safeUrl;
 *    }
 * 
 * 5. Setting security headers (Express.js):
 *    Object.entries(SECURITY_HEADERS).forEach(([key, value]) => {
 *      res.setHeader(key, value);
 *    });
 */
`;

export default {
  escapeHtml,
  sanitizeHtml,
  sanitizeUrl,
  safeSetInnerHTML,
  isAlphanumericSafe,
  generateCSPHeader,
  SECURITY_HEADERS,
  CSP_DIRECTIVES,
};
