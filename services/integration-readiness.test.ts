import test from "node:test";
import assert from "node:assert/strict";
import { integrationReadiness } from "./integration-readiness.js";

const healthy = { configured: true, healthy: true };

test("IRD requires Keenon, OTIS and PBX while concierge requires Keenon and WhatsApp", () => {
  const report = integrationReadiness({
    keenon: healthy,
    otis: { configured: false },
    pbx: { configured: false },
    whatsapp: healthy,
  });
  assert.equal(report.readyForLiveIrd, false);
  assert.equal(report.readyForConcierge, true);
  assert.deepEqual(report.blockers, ["otis: configuration missing", "pbx: configuration missing"]);
});

test("live IRD is enabled only after required integrations pass health checks", () => {
  const report = integrationReadiness({ keenon: healthy, otis: healthy, pbx: healthy, whatsapp: healthy });
  assert.equal(report.readyForLiveIrd, true);
  assert.equal(report.readyForConcierge, true);
  assert.deepEqual(report.blockers, []);
});
