#!/usr/bin/env node

/**
 * ECZ-ID organisation-wide Developer Trust public-surface drift guard.
 *
 * This intentionally validates a small set of canonical public surfaces rather
 * than trying to infer product law from arbitrary historical files. The private
 * VS/VSX source repository has its own deeper regression tests; this guard
 * protects the public repositories and published documentation surfaces that
 * can drift independently.
 */

const HARD_TARGETS = [
  {
    name: "Agent Authority Toolkit",
    url: "https://raw.githubusercontent.com/EcoCitizenz-Ltd/eczid-agent-authority-toolkit/main/README.md",
    required: [
      /## Agent Trust Pro/i,
      /Developer Trust Pro Bundle/i,
      /KYA Authority is separate from Agent Trust Pro/i,
    ],
    forbidden: [
      /KYA Authority\s+is the optional paid operating layer/i,
      /AGENT_TRUST_PRO\s*[=:]\s*KYA Authority/i,
      /Developer Trust operating bundle/i,
    ],
  },
  {
    name: "MCP Security Toolkit",
    url: "https://raw.githubusercontent.com/EcoCitizenz-Ltd/eczid-mcp-security-toolkit/main/README.md",
    required: [
      /## MCP Trust Pro/i,
      /Developer Trust Pro Bundle/i,
      /MCP Assurance is separate from MCP Trust Pro/i,
    ],
    forbidden: [
      /MCP Assurance\s+is the optional paid operating layer/i,
      /MCP_TRUST_PRO\s*[=:]\s*MCP Assurance/i,
      /Developer Trust operating bundle/i,
    ],
  },
  {
    name: "Public Agent Trust product repository",
    url: "https://raw.githubusercontent.com/EcoCitizenz-Ltd/eczid-agent-trust/main/README.md",
    required: [
      /Agent Trust Pro/i,
      /Developer Trust Pro/i,
      /KYA Authority/i,
    ],
    forbidden: [
      /KYA Authority\s+is the optional paid operating layer/i,
      /AGENT_TRUST_PRO\s*[=:]\s*KYA Authority/i,
      /Developer Trust operating bundle/i,
    ],
  },
  {
    name: "Public MCP Trust product repository",
    url: "https://raw.githubusercontent.com/EcoCitizenz-Ltd/eczid-mcp-trust/main/README.md",
    required: [
      /MCP Trust Pro/i,
      /Developer Trust Pro/i,
      /MCP Assurance/i,
    ],
    forbidden: [
      /MCP Assurance\s+is the optional paid operating layer/i,
      /MCP_TRUST_PRO\s*[=:]\s*MCP Assurance/i,
      /Developer Trust operating bundle/i,
    ],
  },
];

// Live pages are useful additional drift detectors, but availability/CDN issues
// should not block repository work. If reachable, content is checked. If not,
// the run records a warning and the hard repository checks remain authoritative.
const SOFT_TARGETS = [
  {
    name: "Developer Gateway — Agent Trust",
    url: "https://developers.ecocitizenz.com/agent-trust",
    forbidden: [/KYA Authority\s+is the optional paid operating layer/i],
  },
  {
    name: "Developer Gateway — MCP Trust",
    url: "https://developers.ecocitizenz.com/mcp-trust",
    forbidden: [/MCP Assurance\s+is the optional paid operating layer/i],
  },
];

async function fetchText(url, timeoutMs = 15000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: { "user-agent": "EcoCitizenz-Developer-Trust-Drift-Guard/1.0" },
      redirect: "follow",
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.text();
  } finally {
    clearTimeout(timer);
  }
}

function checkText(target, text) {
  const failures = [];
  for (const re of target.required ?? []) {
    if (!re.test(text)) failures.push(`missing required evidence: ${re}`);
  }
  for (const re of target.forbidden ?? []) {
    if (re.test(text)) failures.push(`forbidden product-boundary drift observed: ${re}`);
  }
  return failures;
}

let failed = false;

for (const target of HARD_TARGETS) {
  try {
    const text = await fetchText(target.url);
    const failures = checkText(target, text);
    if (failures.length) {
      failed = true;
      console.error(`\nFAIL ${target.name}`);
      for (const failure of failures) console.error(`  - ${failure}`);
    } else {
      console.log(`PASS ${target.name}`);
    }
  } catch (error) {
    failed = true;
    console.error(`\nFAIL ${target.name}: could not retrieve ${target.url}: ${error.message}`);
  }
}

for (const target of SOFT_TARGETS) {
  try {
    const text = await fetchText(target.url);
    const failures = checkText(target, text);
    if (failures.length) {
      failed = true;
      console.error(`\nFAIL ${target.name}`);
      for (const failure of failures) console.error(`  - ${failure}`);
    } else {
      console.log(`PASS ${target.name}`);
    }
  } catch (error) {
    console.warn(`WARN ${target.name}: live page unavailable for drift check (${error.message})`);
  }
}

console.log(`\nDEVELOPER_TRUST_PRODUCT_BOUNDARY=${failed ? "FAIL" : "PASS"}`);
process.exit(failed ? 1 : 0);
