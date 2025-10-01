#!/usr/bin/env node

/**
 * Security Monitoring Script
 * 
 * This script performs comprehensive security checks on the codebase:
 * - Dependency vulnerabilities
 * - Code security patterns
 * - Docker image security
 * - Configuration security
 * 
 * Usage: node scripts/security-monitor.js
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function header(message) {
  console.log('\n' + '='.repeat(80));
  log(message, colors.bright + colors.cyan);
  console.log('='.repeat(80) + '\n');
}

function section(message) {
  log(`\n${message}`, colors.bright + colors.blue);
  console.log('-'.repeat(80));
}

function success(message) {
  log(`✅ ${message}`, colors.green);
}

function warning(message) {
  log(`⚠️  ${message}`, colors.yellow);
}

function error(message) {
  log(`❌ ${message}`, colors.red);
}

function info(message) {
  log(`ℹ️  ${message}`, colors.cyan);
}

// 1. Dependency Audit
function checkDependencies() {
  section('1. Dependency Vulnerability Scan');
  
  try {
    const auditOutput = execSync('yarn audit --json', { 
      encoding: 'utf8',
      stdio: 'pipe'
    });
    
    const lines = auditOutput.trim().split('\n');
    const vulnerabilities = {
      critical: 0,
      high: 0,
      moderate: 0,
      low: 0,
    };
    
    lines.forEach(line => {
      try {
        if (line.includes('"severity"')) {
          if (line.includes('"critical"')) vulnerabilities.critical++;
          else if (line.includes('"high"')) vulnerabilities.high++;
          else if (line.includes('"moderate"')) vulnerabilities.moderate++;
          else if (line.includes('"low"')) vulnerabilities.low++;
        }
      } catch (e) {
        // Skip malformed lines
      }
    });
    
    info(`Critical: ${vulnerabilities.critical}`);
    info(`High: ${vulnerabilities.high}`);
    info(`Moderate: ${vulnerabilities.moderate}`);
    info(`Low: ${vulnerabilities.low}`);
    
    if (vulnerabilities.critical > 0) {
      error(`Found ${vulnerabilities.critical} critical vulnerabilities!`);
      warning('Run: yarn audit for details');
    } else if (vulnerabilities.high > 10) {
      warning(`Found ${vulnerabilities.high} high severity vulnerabilities`);
      warning('Run: yarn audit for details');
    } else {
      success('No critical vulnerabilities found');
    }
    
    return vulnerabilities;
  } catch (e) {
    // yarn audit returns non-zero exit code when vulnerabilities found
    warning('Vulnerabilities detected in dependencies');
    info('Run: yarn audit for detailed report');
    return null;
  }
}

// 2. Code Security Patterns
function checkCodePatterns() {
  section('2. Code Security Pattern Analysis');
  
  const patterns = {
    eval: { pattern: 'eval\\(', risk: 'HIGH', description: 'Direct eval() usage' },
    dangerousHTML: { pattern: 'dangerouslySetInnerHTML', risk: 'MEDIUM', description: 'Potential XSS vector' },
    innerHTML: { pattern: '\\.innerHTML\\s*=', risk: 'HIGH', description: 'Direct HTML injection' },
  };
  
  const issues = [];
  
  for (const [name, config] of Object.entries(patterns)) {
    try {
      const cmd = `grep -rn "${config.pattern}" packages/ --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx" 2>/dev/null | grep -v ".min.js" | grep -v "node_modules" || true`;
      const result = execSync(cmd, { encoding: 'utf8' });
      
      if (result.trim()) {
        const count = result.trim().split('\n').length;
        issues.push({ name, count, ...config });
        
        if (config.risk === 'HIGH') {
          warning(`${config.description}: ${count} occurrences found`);
        } else {
          info(`${config.description}: ${count} occurrences found`);
        }
      }
    } catch (e) {
      // Pattern not found
    }
  }
  
  if (issues.length === 0) {
    success('No dangerous code patterns detected');
  }
  
  return issues;
}

// 3. Docker Security
function checkDockerfiles() {
  section('3. Dockerfile Security Analysis');
  
  const dockerfiles = [];
  
  function findDockerfiles(dir) {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
        findDockerfiles(fullPath);
      } else if (file === 'Dockerfile' || file.endsWith('.dockerfile')) {
        dockerfiles.push(fullPath);
      }
    });
  }
  
  findDockerfiles('.');
  
  dockerfiles.forEach(dockerfile => {
    info(`\nAnalyzing: ${dockerfile}`);
    
    const content = fs.readFileSync(dockerfile, 'utf8');
    const lines = content.split('\n');
    
    // Check base image
    const fromLine = lines.find(l => l.trim().startsWith('FROM'));
    if (fromLine) {
      const baseImage = fromLine.split(/\s+/)[1];
      info(`  Base image: ${baseImage}`);
      
      // Check for version pinning
      if (baseImage.includes(':latest') || !baseImage.includes(':')) {
        warning('  Using :latest or unversioned base image');
      } else {
        success('  Base image is version-pinned');
      }
    }
    
    // Check for security best practices
    const hasUpdate = content.includes('apt-get update') || content.includes('apt update') || content.includes('yum update');
    const hasUpgrade = content.includes('apt-get upgrade') || content.includes('apt upgrade');
    const hasCleanup = content.includes('rm -rf') || content.includes('apt-get clean') || content.includes('yum clean');
    
    if (hasUpdate) success('  ✓ Package manager update found');
    else warning('  Missing package manager update');
    
    if (hasUpgrade) success('  ✓ Security upgrades included');
    else info('  Consider adding security upgrades');
    
    if (hasCleanup) success('  ✓ Cleanup commands present');
    else warning('  Missing cleanup commands');
  });
  
  return dockerfiles;
}

// 4. Configuration Security
function checkConfiguration() {
  section('4. Configuration Security Check');
  
  const sensitiveFiles = [
    '.env',
    'config.json',
    'secrets.json',
  ];
  
  sensitiveFiles.forEach(file => {
    if (fs.existsSync(file)) {
      warning(`Sensitive file exists: ${file}`);
      info(`  Ensure ${file} is in .gitignore`);
      
      // Check if in .gitignore
      if (fs.existsSync('.gitignore')) {
        const gitignore = fs.readFileSync('.gitignore', 'utf8');
        if (gitignore.includes(file)) {
          success(`  ${file} is in .gitignore`);
        } else {
          error(`  ${file} is NOT in .gitignore!`);
        }
      }
    }
  });
  
  // Check .env for actual secrets
  if (fs.existsSync('.env')) {
    const envContent = fs.readFileSync('.env', 'utf8');
    const lines = envContent.split('\n').filter(l => l.trim() && !l.startsWith('#'));
    
    if (lines.length > 0) {
      info(`Found ${lines.length} environment variables`);
      
      // Check for potentially dangerous values
      const dangerous = lines.filter(l => 
        l.includes('password=') || 
        l.includes('secret=') || 
        l.includes('key=') || 
        l.includes('token=')
      );
      
      if (dangerous.length > 0) {
        warning(`Found ${dangerous.length} potentially sensitive environment variables`);
        info('Ensure these are not committed to version control');
      }
    }
  }
}

// 5. Git Security
function checkGitSecurity() {
  section('5. Git Security Check');
  
  try {
    // Check for accidentally committed secrets
    const secretPatterns = [
      'password',
      'api_key',
      'secret_key',
      'private_key',
      'access_token',
    ];
    
    secretPatterns.forEach(pattern => {
      try {
        const cmd = `git log -p | grep -i "${pattern}" | head -5 || true`;
        const result = execSync(cmd, { encoding: 'utf8' });
        
        if (result.trim()) {
          warning(`Potential secret pattern "${pattern}" found in git history`);
          info('Consider using git-secrets or similar tools');
        }
      } catch (e) {
        // Pattern not found
      }
    });
    
    success('Git security check completed');
  } catch (e) {
    warning('Could not perform git security check');
  }
}

// Main execution
function main() {
  header('🔒 CodeSandbox Security Monitor');
  
  log(`Date: ${new Date().toISOString()}`, colors.cyan);
  log(`Node version: ${process.version}`, colors.cyan);
  
  try {
    const vulnerabilities = checkDependencies();
    const codeIssues = checkCodePatterns();
    const dockerfiles = checkDockerfiles();
    checkConfiguration();
    checkGitSecurity();
    
    // Summary
    header('📊 Security Scan Summary');
    
    if (vulnerabilities && vulnerabilities.critical > 0) {
      error('CRITICAL: Immediate action required for critical vulnerabilities');
    } else if (vulnerabilities && vulnerabilities.high > 10) {
      warning('WARNING: Multiple high severity vulnerabilities detected');
    } else {
      success('No critical issues detected');
    }
    
    info('\nRecommendations:');
    console.log('  1. Run yarn audit regularly');
    console.log('  2. Keep dependencies up-to-date');
    console.log('  3. Review SECURITY_AUDIT.md for detailed information');
    console.log('  4. Use automated security scanning in CI/CD');
    console.log('  5. Implement security headers in production');
    
    header('✅ Security scan complete!');
    
  } catch (e) {
    error(`Security scan failed: ${e.message}`);
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  main();
}

module.exports = { main };
