const POLICIES = require("../policies.js");

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

  const model = process.env.GEMINI_MODEL || "gemini-2.0-flash";
  const system =
    "You answer questions about Indian state GCC incentive policies using ONLY the JSON rule base below. Cite option ids in brackets like [ka-bb]. If the rule base does not contain the answer (other states, rent, talent cost, provider quality), say 'Not in the evidence base' and do not guess. Separate facts from recommendations. Amounts are policy caps, not expected payouts. Keep it under 150 words.\nRULE BASE:\n" +
    JSON.stringify(POLICIES);

  try {
    const r = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/" + model + ":generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": key,
        },
        body: JSON.stringify({
          systemInstruction: {
            parts: [{ text: system }],
          },
          contents: [
            {
              role: "user",
              parts: [{ text: q }],
            },
          ],
        }),
      }
    );

    const j = await r.json();
    const a =
      j.candidates &&
      j.candidates[0] &&
      j.candidates[0].content.parts.map((p) => p.text).join("");

    if (!a) {
      return res.status(502).json({ error: "No answer from model" });
    }

    res.json({ answer: a });
  } catch (e) {
    return res.status(502).json({ error: "Model request failed" });
  }
};
