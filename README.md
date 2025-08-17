# MyToken (onemore)

A minimal Clarity fungible token (FT) project using Clarinet + Vitest. It defines a simple token `my-token` with minting by the contract owner and basic transfer and balance query functions. The repo is set up for local simnet testing and deployment to Stacks Testnet.

## Contract

- Name: `my-token`
- Source: `contracts/my-token.clar`
- Standard: basic FT via `define-fungible-token` (not full SIP-010 implementation)
- Public/read-only functions:
  - `get-name() -> (response (string-utf8 32) uint)`
  - `get-symbol() -> (response (string-utf8 10) uint)`
  - `get-token-uri() -> (response (optional (string-utf8 256)) uint)`
  - `mint(amount uint, recipient principal) -> (response uint uint)`
  - `transfer(amount uint, sender principal, recipient principal) -> (response uint uint)`
  - `get-balance(who principal) -> (response uint uint)`
- Error codes:
  - `u100`: owner-only (caller is not allowed)
  - `u101`: reserved (not-enough-balance)

## Testnet Deployment

- Network: Stacks Testnet
- Contract address: `ST2KMS23R64H7QB9QRX20SZNCHAAA9GVDQF430P8.my-token`
- Deployment plan: `deployments/default.testnet-plan.yaml`
- Command used:
  ```bash
  clarinet deployments generate --testnet --low-cost
  clarinet deployments apply --testnet
  ```
- Explorer (replace with your tx/contract URL if desired):
  - https://explorer.hiro.so/txid?chain=testnet
  - https://explorer.hiro.so/contract/ST2KMS23R64H7QB9QRX20SZNCHAAA9GVDQF430P8.my-token?chain=testnet

## Getting Started

### Prerequisites

- Node.js LTS (>=18)
- Clarinet CLI (https://docs.hiro.so/clarinet)

### Install

```bash
npm install
```

### Run Tests (Simnet)

```bash
npm test
# or with coverage and cost reports
npm run test:report
# watch mode (re-runs tests on file changes)
npm run test:watch
```

Vitest is configured via `vitest.config.js` to use `vitest-environment-clarinet`. Test helpers are re-exported from `tests/utils.ts`.

### Local REPL / Checks

```bash
clarinet check
clarinet console
```

### Deploy to Testnet

```bash
clarinet deployments generate --testnet --low-cost
clarinet deployments apply --testnet
```

This uses the deployer account defined in `settings/Devnet.toml` for local/dev purposes. For mainnet or alternate keys, update your deployment plan and/or Clarinet settings accordingly.

## Usage Examples (Read-only)

```clarity
;; get name
(contract-call? .my-token get-name)

;; get balance of a principal
(clarity:call-read-only .my-token get-balance (principal "ST..."))
```

## Project Structure

- `contracts/my-token.clar` — Clarity contract source
- `tests/my-token_test.ts` — Vitest tests against simnet
- `tests/utils.ts` — Re-exports Clarinet/Vitest helpers
- `Clarinet.toml` — Project and contract registration
- `settings/Devnet.toml` — Local devnet accounts and settings
- `deployments/default.testnet-plan.yaml` — Auto-generated deployment plan

## Future Scope

- Implement full SIP-010 compliance (traits, `get-decimals`, `get-total-supply`, `transfer`/`transfer-memo`, allowances if applicable).
- Add access control refinements (separate admin role, multi-sig, or DAO control).
- Supply management (cap, minting schedule, burn function, pause/unpause).
- Metadata expansion (`token-uri`, on-chain/off-chain metadata management).
- Events/logging for analytics and indexers.
- Additional test coverage (property tests, edge cases, failure paths).

## Scripts

- `npm test` — run all tests once
- `npm run test:report` — tests with coverage and costs
- `npm run test:watch` — watch mode for rapid iteration

## Notes

- This repo is intended for educational/demo use. Audit code and update security model before production deployments.
- Update the contract address above if you redeploy or change the deployer key.
