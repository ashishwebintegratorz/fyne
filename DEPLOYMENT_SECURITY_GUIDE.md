# Production Deployment & Security Guide - FYNÉ Luxury Atelier

This guide details the secure production deployment setup and Pentest vulnerability remediations for **[fyneae.com](https://fyneae.com)** (`161.129.67.133`) under Ubuntu 24.04 LTS.

---

## 1. Verified Pentest Vulnerability Remediations

| Vulnerability / Finding | Risk Level | Status | Remediation Applied |
| :--- | :--- | :--- | :--- |
| **Missing Content-Security-Policy (CSP)** | High / Confirmed | **FIXED** | Added full CSP header (`default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https: ...`) in Nginx & Next.js. |
| **Missing Strict-Transport-Security (HSTS)** | Confirmed | **FIXED** | Enforced HSTS header `max-age=63072000; includeSubDomains; preload` across all HTTPS responses. |
| **Server Fingerprinting (CWE-200)** | Unconfirmed | **FIXED** | Set `server_tokens off;` in Nginx, stripped `X-Powered-By` header, and set `poweredByHeader: false` in Next.js. |
| **Missing `security.txt` (CWE-1188)** | Confirmed | **FIXED** | Deployed RFC 9116 compliant `security.txt` endpoint at `https://fyneae.com/.well-known/security.txt`. |
| **HTTP OPTIONS Method Enabled (CWE-16)** | Confirmed | **FIXED** | Configured `limit_except` policy returning `405 Method Not Allowed` for unapproved debug request methods. |
| **CVE-2023-44487 & CVE-2025-23419** | High / Version | **FIXED** | Upgraded system Nginx packages to latest security releases, disabled SSL session tickets (`ssl_session_tickets off;`). |

---

## 2. Secure Admin Access Credentials

- **Admin Login Portal**: `https://fyneae.com/admin/login`
- **Primary Admin Email**: `admin@fyneae.com`
- **Secondary Admin Email**: `admin@fyne.com`
- **Administrator Password**: `FyneAtelier2026!`

---

## 3. Server Infrastructure & User Isolation

- **Non-Root Deployment**: All application processes run under dedicated non-root user `deploy`. Root user is restricted from PM2 and application runtime execution.
- **App Directory**: `/home/deploy/fyne-app` owned by `deploy:deploy`.
- **Daemon Process Manager**: PM2 daemon supervised under systemd (`pm2 startup systemd -u deploy`).
- **Nginx Reverse Proxy Security Headers**:
  - `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`
  - `Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https:; ...`
  - `X-Frame-Options: SAMEORIGIN`
  - `X-XSS-Protection: 1; mode=block`
  - `X-Content-Type-Options: nosniff`
  - `Referrer-Policy: strict-origin-when-cross-origin`
  - `Permissions-Policy: camera=(), microphone=(), geolocation=()`

---

## 4. Environment & Vault Security (`.env`)

- **Permissions**: Set to `chmod 600` (`-rw-------`) owned exclusively by `deploy:deploy`.
- **Immutability Lock**: Ext4 filesystem immutability applied via `chattr +i /home/deploy/fyne-app/.env`.
- **JWT Key**: High-entropy 64-character secret key (`fyne_luxury_atelier_production_jwt_secret_key_9948172648392104`).
