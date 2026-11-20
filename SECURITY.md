# Security Policy

Only the current `main` branch is maintained.

Report potential vulnerabilities privately to **johnkrentschler@icloud.com**.
Include the issue, reproduction steps, and potential impact. Do not post
credentials, exploits, or personal information in public GitHub issues.

The same contact is published in `/.well-known/security.txt`.

Tinta has no account system or learner database. Lesson progress is saved
locally by the browser. Server requests and deployment infrastructure may be
logged by the hosting provider. Keep Cloudflare credentials in GitHub Actions
secrets and never commit access keys.

An older revision contained a preview OAuth credential. If it remains valid,
the issuer must revoke/rotate it. Removing a credential from active source
does not remove it from Git history.
