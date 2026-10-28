# GCC Compass

A prototype for the Flexiple Product Intern assignment. Live: https://gcc-compass-orcin.vercel.app

**The problem:** India's 2,000+ GCCs are covered by scattered, conflicting data. A company planning a first GCC cannot easily tell which state incentives it would qualify for, or how reliable the figures are.

**What it does:** enter planned headcount and fixed investment; get, for Uttar Pradesh, Maharashtra, Karnataka and Gujarat, the tier you meet, the main incentives (as policy caps, not payouts), the next tier, and the source, source type and date for every rule. A question box answers only from the same rule base. A table explains why published GCC counts disagree.

**Design choices:** results are listed by state and not ranked, because caps of different types are not comparable. Rules are deterministic code, not LLM output; the LLM only answers questions, restricted to the rule base by instruction.

## Data provenance and limits
- Rules checked 26 Oct 2026. UP: official agency summary. Karnataka: official policy text. Maharashtra and Gujarat: professional-firm summaries of the official policies (labelled in the app); not yet checked against the official PDFs.
- Not covered: Tamil Nadu, Andhra Pradesh, Telangana, Haryana, Madhya Pradesh, Bihar. No rent, talent cost or provider data.
- Incentive caps are not expected payouts. Not legal or tax advice. Talent often matters more than incentives.

## Run and test
`npm test` runs the engine tests (Node 20+). Open `index.html` through any static server to try the UI.

## Deploy
Import the repo in Vercel (framework: Other). Set `GEMINI_API_KEY`; optionally `GEMINI_MODEL`. Never commit keys.
