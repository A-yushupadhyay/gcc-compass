const test = require("node:test");
const assert = require("node:assert");
const P = require("../policies.js");
const E = require("../engine.js");

const at = (emp, inv) =>
  Object.fromEntries(E(P, emp, inv).map(r => [r.opt.id, r]));

const name = r => (r.tier ? r.tier.n : "none");

test("40 employees: only Karnataka qualifies", () => {
  const r = at(40, 0);

  assert.equal(name(r["ka-blr"]), "General support only");
  assert.match(name(r["ka-bb"]), /^Nano/);

  for (const id of ["up-ncr", "up-rest", "mh-z1", "mh-z2", "gj"]) {
    assert.equal(name(r[id]), "none");
  }
});

test("300 employees, no investment: Gujarat is Category I, not II", () => {
  const r = at(300, 0);

  assert.match(name(r.gj), /^Category I /);
  assert.equal(name(r["ka-bb"]), "100+ employees");
  assert.equal(name(r["mh-z1"]), "Medium");
  assert.equal(name(r["up-rest"]), "Advanced");
  assert.equal(name(r["up-ncr"]), "Level-1");
  assert.match(r.gj.next.n, /^Category II/);
});

test("600 employees, Rs 300 cr: top tiers", () => {
  const r = at(600, 300);

  assert.match(name(r.gj), /^Category II/);
  assert.equal(name(r["mh-z2"]), "Large");
  assert.equal(name(r["up-ncr"]), "Advanced");
  assert.equal(name(r["ka-bb"]), "500+ employees");
  assert.equal(r.gj.next, undefined);
});

test("60 employees in Karnataka beyond Bengaluru: below thresholds, next is 100+", () => {
  const r = at(60, 0)["ka-bb"];

  assert.equal(name(r), "none");
  assert.equal(r.next.n, "100+ employees");
});

test("same inputs give same output", () => {
  assert.deepEqual(
    JSON.stringify(E(P, 250, 40)),
    JSON.stringify(E(P, 250, 40))
  );
});

