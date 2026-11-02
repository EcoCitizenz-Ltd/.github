# ECZ-ID Developer Trust Product Boundary

Status: ORGANISATION-WIDE PRODUCT LAW
Effective: 2026-11-01
Owner-approved restoration: `EcoCitizenz-Ltd/eczid-vscode-extensions-source` PR #61

## Purpose

This contract prevents product-name and feature-ownership drift across ECZ-ID repositories, websites, marketplace listings, machine-readable facts, documentation and commercial handoffs.

## Canonical product layers

| Layer | Agent | MCP |
|---|---|---|
| Free local developer utility | Agent Trust Community | MCP Trust Community |
| Free durable machine identity | Agent Passport | MCP Passport |
| Optional paid local Developer Trust software | **Agent Trust Pro** | **MCP Trust Pro** |
| Optional paid Developer Trust bundle | **Developer Trust Pro Bundle** = Agent Trust Pro + MCP Trust Pro | **Developer Trust Pro Bundle** = Agent Trust Pro + MCP Trust Pro |
| Separate higher-level organisational product | **KYA Authority** | **MCP Assurance / MCP Assurance Plus** |
| Public proof | ECZ-ID Resolver | ECZ-ID Resolver |

## Permanent naming law

1. `AGENT_TRUST_PRO` is customer-facing **Agent Trust Pro**.
2. `MCP_TRUST_PRO` is customer-facing **MCP Trust Pro**.
3. `DEVELOPER_TRUST_PRO_BUNDLE` is customer-facing **Developer Trust Pro Bundle**.
4. **KYA Authority is not an alias for Agent Trust Pro.**
5. **MCP Assurance is not an alias for MCP Trust Pro.**
6. KYA Authority and MCP Assurance may be offered after or alongside Developer Trust software when the organisational need justifies them, but they remain separate products.
7. Free Agent/MCP Passports are not created, replaced or metered by Developer Trust software subscriptions.
8. Developer Trust software does not create or mutate canonical Resolver truth.
9. Existing extension identities and stable entitlement grant IDs remain compatibility contracts.

## Feature ownership

### Agent Trust Pro

The local paid Agent Trust feature family includes the established Developer Trust software capabilities such as:

- Authority Graph;
- Authority Epochs / retained local history;
- dangerous action-chain indicators;
- reciprocal Agent-to-MCP visibility;
- reviewable local remediation and related local controls.

A separate KYA Authority product may have organisational governance capabilities of its own, but public copy must not move the Agent Trust Pro software entitlement or its established local feature family into KYA by renaming the software product.

### MCP Trust Pro

The local paid MCP Trust feature family includes the established Developer Trust software capabilities such as:

- Protect This MCP / Local Trust Gate for supported transports;
- Secret Shield;
- Trust Epochs;
- Advanced Tool X-Ray;
- deterministic local policy;
- reviewable remediation and rollback.

A separate MCP Assurance product may have organisational assurance capabilities of its own, but public copy must not move the MCP Trust Pro software entitlement or its established local feature family into MCP Assurance by renaming the software product.

## Forbidden current-state claims

Current public or generated content must not state or imply any of the following:

- `KYA Authority is the optional paid operating layer` when describing the Agent Trust extension entitlement;
- `MCP Assurance is the optional paid operating layer` when describing the MCP Trust extension entitlement;
- `AGENT_TRUST_PRO = KYA Authority`;
- `MCP_TRUST_PRO = MCP Assurance`;
- `Developer Trust operating bundle` as a replacement name for Developer Trust Pro Bundle;
- that buying KYA Authority activates Agent Trust Pro merely by being the same product;
- that buying MCP Assurance activates MCP Trust Pro merely by being the same product.

Historical evidence may contain superseded wording only when it is clearly marked historical/superseded and cannot be consumed as current generation input.

## Required public distinction

Where both layers appear on the same page, prefer an explicit sequence:

`Community / free local value -> free Passport identity -> optional Agent Trust Pro or MCP Trust Pro -> optional separate KYA Authority or MCP Assurance when the organisational need arises`

The Developer Trust Pro Bundle may be offered at the software layer as the combined Agent + MCP option.

## Change control

No repository, generator, website, marketplace listing, entitlement issuer or commercial surface may silently rename or merge these products. Any future product-boundary change requires an explicit owner-approved migration covering at minimum:

- Shopify SKUs and product names;
- entitlement grants and lease compatibility;
- TrustOps activation/account management;
- VS Code Marketplace and Open VSX;
- public product repositories;
- Developer Gateway and product websites;
- machine-readable product facts;
- customer transition and release notes;
- automated regression/drift checks.

This document is intentionally narrow: it protects product identity and feature ownership while allowing each product to continue evolving independently.
