#!/usr/bin/env node
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join, resolve } from "node:path";

const root = resolve(process.cwd());
const templateDir = join(root, "workflow-templates");
const reusableDir = join(root, ".github", "workflows");

const allowedCategories = new Set([
  "continuous-integration",
  "deployment",
  "testing",
  "code-quality",
  "code-review",
  "dependency-management",
  "monitoring",
  "Automation",
  "utilities",
  "Pages",
  "Hugo"
]);

const templates = [
  ["eczid-workflow-trust", "EcoCitizenz-Ltd/eczid-workflow-trust@v1"],
  ["eczid-agentic-workflow-trust", "EcoCitizenz-Ltd/eczid-agentic-workflow-trust@v1"],
  ["eczid-passport-bootstrap", "EcoCitizenz-Ltd/eczid-passport-bootstrap@v1"],
  ["eczid-trust-delta", "EcoCitizenz-Ltd/eczid-trust-delta@v1"],
  ["eczid-website-security", "EcoCitizenz-Ltd/eczid-website-security@v1"],
  ["eczid-api-trust", "EcoCitizenz-Ltd/eczid-api-trust@v1"],
  ["eczid-release-identity", "EcoCitizenz-Ltd/eczid-release-identity-provenance@v1"],
  ["eczid-supply-chain-evidence", "EcoCitizenz-Ltd/eczid-supply-chain-evidence@v1"],
  ["eczid-counterparty-gate", "EcoCitizenz-Ltd/eczid-counterparty-gate@v1"]
];

const reusable = [
  "eczid-website-security-reusable.yml",
  "eczid-developer-trust-reusable.yml",
  "eczid-release-trust-reusable.yml"
];

function fail(message) {
  throw new Error(message);
}

function text(path) {
  if (!existsSync(path)) fail(`Missing required distribution file: ${path}`);
  return readFileSync(path, "utf8");
}

function assertPinnedUses(yaml, label) {
  const uses = [...yaml.matchAll(/^\s*-?\s*uses:\s*([^\s#]+)\s*$/gm)].map((match) => match[1]);
  for (const ref of uses) {
    if (ref.endsWith("@main") || ref.endsWith("@master")) fail(`${label}: mutable branch Action reference is forbidden: ${ref}`);
    if (ref.startsWith("EcoCitizenz-Ltd/") && !ref.endsWith("@v1")) {
      fail(`${label}: ECZ-ID public Action reference must use the staged stable v1 compatibility tag: ${ref}`);
    }
    if (ref.startsWith("actions/checkout@") && ref !== "actions/checkout@v7") {
      fail(`${label}: checkout reference must match the reviewed current major actions/checkout@v7: ${ref}`);
    }
  }
}

if (!existsSync(templateDir)) fail("workflow-templates directory is missing.");

const actualYaml = readdirSync(templateDir).filter((name) => name.endsWith(".yml")).sort();
const expectedYaml = templates.map(([slug]) => `${slug}.yml`).sort();
if (JSON.stringify(actualYaml) !== JSON.stringify(expectedYaml)) {
  fail(`Template YAML set mismatch; expected=${expectedYaml.join(",")}; actual=${actualYaml.join(",")}`);
}

for (const [slug, expectedAction] of templates) {
  const yamlPath = join(templateDir, `${slug}.yml`);
  const propsPath = join(templateDir, `${slug}.properties.json`);
  const yaml = text(yamlPath);
  const props = JSON.parse(text(propsPath));

  if (!yaml.includes(`uses: ${expectedAction}`)) fail(`${slug}: expected Action reference ${expectedAction} is missing.`);
  assertPinnedUses(yaml, slug);

  if (typeof props.name !== "string" || !props.name.startsWith("ECZ-ID ")) fail(`${slug}: metadata name must be ECZ-ID branded.`);
  if (typeof props.description !== "string" || props.description.length < 20) fail(`${slug}: metadata description is missing/too short.`);
  if (typeof props.iconName !== "string" || !/^octicon [a-z0-9-]+$/.test(props.iconName)) {
    fail(`${slug}: iconName must use GitHub's documented 'octicon <icon name>' syntax.`);
  }
  if (!Array.isArray(props.categories) || props.categories.length === 0) fail(`${slug}: at least one metadata category is required.`);
  for (const category of props.categories) {
    if (!allowedCategories.has(category)) fail(`${slug}: unsupported starter-workflow category ${category}.`);
  }
}

const website = text(join(templateDir, "eczid-website-security.yml"));
if (!website.includes("website: ${{ steps.target.outputs.website }}")) fail("Website Security template must pass the real `website` Action input.");
if (/^\s+url:\s*\$\{\{/m.test(website)) fail("Website Security template must not pass obsolete/unsupported `url` input.");

const counterparty = text(join(templateDir, "eczid-counterparty-gate.yml"));
if (!counterparty.includes("manifest-path:")) fail("Counterparty Gate template must pass `manifest-path`.");
if (!counterparty.includes("as-of:")) fail("Counterparty Gate template must pass `as-of`.");
if (/^\s+ecz-id:/m.test(counterparty)) fail("Counterparty Gate template must not pass unsupported `ecz-id` input.");
if (!counterparty.includes("actions/checkout@v7")) fail("Counterparty Gate must check out the local manifest before reading it.");

for (const name of reusable) {
  const yaml = text(join(reusableDir, name));
  if (!yaml.includes("workflow_call:")) fail(`${name}: reusable workflow must declare workflow_call.`);
  assertPinnedUses(yaml, name);
}

console.log(JSON.stringify({
  ok: true,
  templates_validated: templates.length,
  reusable_workflows_validated: reusable.length,
  metadata_categories_validated: true,
  octicon_syntax_validated: true,
  action_contract_regressions_guarded: ["website", "counterparty"]
}));
