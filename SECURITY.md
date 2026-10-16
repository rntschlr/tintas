# Security Policy

## Supported versions

Tinta is distributed as this repository’s `main` branch (Cloudflare Pages project `tinta`). Only the latest `main` receives fixes.

## Reporting a vulnerability

Email **johnkrentschler@icloud.com** with:

- A short description of the issue
- Steps to reproduce (or a PoC that does not harm third parties)
- Impact assessment if you have one

You can expect an acknowledgement within a few days. Please do **not** open a public GitHub issue for sensitive reports.

The same contact is published at `https://tintas.app/.well-known/security.txt`.

## Scope notes

- Progress data is stored **on-device** (localStorage). Tinta does not require an account for the public grammar notebook.
- Auth is **disabled** for public Cloudflare builds (`VITE_AUTH_ENABLED=false`). Preview OAuth secrets must come from the environment — there is no hardcoded client secret in the repo.
- Do not invent or commit Cloudflare API tokens or OAuth client secrets.
