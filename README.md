# GCC Compass (prototype)
Static site plus one serverless route. No build step.
- `policies.js` rule base (with sources), `engine.js` deterministic eligibility, `api/ask.js` Gemini assistant limited to the rule base.
- Env vars (Vercel > Settings > Environment Variables): `GEMINI_API_KEY` (required for the assistant), `GEMINI_MODEL` (optional, default gemini-2.0-flash; update if Google retires it).
- Deploy: push to GitHub, import in Vercel, add the env var, deploy. Never commit keys.
- Limits: 4 states, summaries for Maharashtra and Gujarat, amounts are caps not payouts, not legal advice.
