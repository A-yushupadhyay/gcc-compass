const POLICIES = require("../policies.js");
const BASE = "https://generativelanguage.googleapis.com/v1beta/models";
const text = (j) =>
  j &&
  j.candidates &&
  j.candidates[0] &&
  j.candidates[0].content &&
  j.candidates[0].content.parts
    ? j.candidates[0].content.parts.map((p) => p.text || "").join("")
    : "";

module.exports = async (req, res) => {
  if (req.method !== "POST") return res.status(405).json({ error: "POST only" });
  const q = String((req.body && req.body.question) || "").slice(0, 500).trim();
  if (!q) return res.status(400).json({ error: "Empty question" });
  const key = process.env.GEMINI_API_KEY;
  if (!key) {
    return res.status(503).json({
      error: "Assistant not configured. The eligibility engine still works.",
    });
  }
 const system = "You answer questions about Indian state GCC incentive policies using ONLY the JSON rule base below. Cite option ids in brackets like [ka-bb]. If the rule base does not contain the answer (other states, rent, talent cost, provider quality), reply exactly 'Not in the evidence base.' and stop. If asked which option is best or to rank options, reply 'Not in the evidence base: this tool does not rank options.' and stop. Never say a company qualifies for a tier unless the question states the headcount and investment, and check every threshold of that tier: minimum employees (emp), maximum employees (empMax), minimum investment in Rs crore (inv or needInv) and maximum investment (invMax). Category II in Gujarat needs Rs 250 crore or more of investment. Separate facts from recommendations. Amounts are policy caps, not expected payouts. Plain text only, no asterisks or markdown. Keep it under 120 words.\nRULE BASE:\n" + JSON.stringify(POLICIES);
  const started = Date.now();
  const call = async (model) => {
    const ctl = new AbortController();
    const t = setTimeout(() => ctl.abort(), 4000);
    try {
      const r = await fetch(BASE + "/" + model + ":generateContent", {
        method: "POST", signal: ctl.signal,
        headers: { "Content-Type": "application/json", "x-goog-api-key": key },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: system }] },
          contents: [{ role: "user", parts: [{ text: q }] }],
        }),
      });
      return { r, j: await r.json().catch(() => ({})) };
    } finally {
      clearTimeout(t);
    }
  };
  const primary = process.env.GEMINI_MODEL || "gemini-2.0-flash";
  const models = [primary];
  let discovered = false;
  let last = "";
  for (let i = 0; i < models.length && Date.now() - started < 8000; i++) {
    try {
      const { r, j } = await call(models[i]);
      const a = text(j);
      if (a) return res.json({ answer: a });
      last = (j.error && j.error.message) || (j.promptFeedback ? "blocked" : "empty response");
      if (r.status === 400 || r.status === 403) break;
    } catch (e) { last = "timeout"; }
    if (!discovered) {
      discovered = true;
      try {
        const l = await (await fetch(BASE, { headers: { "x-goog-api-key": key } })).json();
        (l.models || [])
          .filter((m) => (m.supportedGenerationMethods || []).includes("generateContent") && /flash/.test(m.name) && !/(image|tts|live|thinking|exp|preview)/.test(m.name))
          .map((m) => m.name.replace("models/", ""))
          .sort().reverse().slice(0, 3)
          .forEach((n) => {
            if (!models.includes(n)) models.push(n);
          });
        models.push(primary);
      } catch (e) {}
    }
  }
  const busy = /demand|overloaded|unavailable|quota|timeout/i.test(last);
  res.status(busy ? 503 : 502).json({
    error: busy
      ? "The AI model is busy right now. Please try again in a few seconds. The eligibility results above are not affected."
      : "The assistant could not answer this time. The eligibility results above are not affected.",
  });
};