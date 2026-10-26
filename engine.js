// Deterministic eligibility engine: same inputs always give the same answer.
function evaluate(P, emp, inv) {
  return P.map((o) => {
    const ok = o.tiers.filter((t) => {
      if (t.empMax && emp > t.empMax) return false;
      if (t.invMax && inv >= t.invMax) return false;
      if (t.needInv && inv < t.needInv) return false;

      const byEmp = t.emp != null && emp >= t.emp;
      const byInv = t.inv != null && t.inv > 0 && inv >= t.inv;

      return t.emp === 0 || byEmp || byInv;
    });

    const tier = ok.length ? ok[ok.length - 1] : null;
    const next = o.tiers.find((t) => !ok.includes(t));

    return { opt: o, tier, next };
  }).sort(
    (a, b) =>
      (b.tier ? 1 : 0) - (a.tier ? 1 : 0) ||
      (b.tier?.cap || 0) - (a.tier?.cap || 0)
  );
}

if (typeof module !== "undefined") module.exports = evaluate;
