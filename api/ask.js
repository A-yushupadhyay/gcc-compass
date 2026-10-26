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
  if (req.method !== "POST") {
    return res.status(405).json({ error: "POST only" });
  }

  const q = String((req.body && req.body.question) || "")
    .slice(0, 500)
    .trim();

  if (!q) {
    return res.status(400).json({ error: "Empty question" });
  }

  const key = process.env.GEMINI_API_KEY;

  if (!key) {
    return res.status(503).json({
      error: "Assistant not configured. The eligibility engine still works.",
    });
  }

  const system =
    "You answer questions about Indian state GCC incentive policies using ONLY the JSON rule base below. Cite option ids in brackets like [ka-bb]. If the rule base does not contain the answer (other states, rent, talent cost, provider quality), say 'Not in the evidence base' and do not guess. Separate facts from recommendations. Amounts are policy caps, not expected payouts. Keep it under 150 words.\nRULE BASE:\n" +
    JSON.stringify(POLICIES);

  const call = async (model) => {
    const r = await fetch(BASE + "/" + model + ":generateContent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": key,
      },
      body: JSON.stringify({
        systemInstruction: {
          parts: [{ text: system }],
        },
        contents: [{ role: "user", parts: [{ text: q }] }],
      }),
    });

    return { r, j: await r.json().catch(() => ({})) };
  };

  try {
    let { r, j } = await call(process.env.GEMINI_MODEL || "gemini-2.0-flash");
    let a = text(j);

    if (
      !a &&
      j.error &&
      (r.status === 404 || /not found|not supported/i.test(j.error.message || ""))
    ) {
      const l = await (await fetch(BASE, { headers: { "x-goog-api-key": key } }))
        .json()
        .catch(() => ({}));

      const names = (l.models || [])
        .filter(
          (m) =>
            (m.supportedGenerationMethods || []).includes("generateContent") &&
            /flash/.test(m.name) &&
            !/(image|tts|live|thinking|exp)/.test(m.name)
        )
        .map((m) => m.name.replace("models/", ""));

      if (names[0]) {
        ({ r, j } = await call(names[0]));
        a = text(j);
      }
    }

    if (!a) {
      return res.status(502).json({
        error:
          "Model error (" +
          r.status +
          "): " +
          (((j.error && j.error.message) ||
            (j.promptFeedback ? "Blocked by safety filter" : "empty response")) +
            "").slice(0, 200),
      });
    }

    res.json({ answer: a });
  } catch (e) {
    return res.status(502).json({
      error: "Request failed: " + String(e.message).slice(0, 120),
    });
  }
};