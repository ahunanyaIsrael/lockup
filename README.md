# Time-Locked Savings — Time-Locked dApp

A small front-end dApp demonstrating a time-locked savings contract (Plutus) with a TypeScript + Vite UI.

**Project layout**

- **`index.html`**: App entry served by Vite.
- **`src/`**: Front-end TypeScript source files.
  - **`lock.ts`**: Front-end logic to lock funds into the contract.
  - **`unlock.ts`**: Front-end logic to unlock funds when allowed.
  - **`validator.ts`**: Validator interaction helper for the contract.
  - **`lucid.ts`**: Lucid Cardano integration/setup helpers.
  - **`main.ts`**: App bootstrap and UI wiring.
- **`assets/contract/Savings.hs`**: Haskell Plutus contract source for the time-locked savings.
- **`assets/time-locked-savings.json`**: Contract metadata / compiled artifact used by the front-end.

**Key features**

- Demonstrates a time-locked saving pattern using a Plutus validator.
- Simple UI for locking and unlocking funds using `lucid-cardano`.

**Prerequisites**

- Node.js and npm installed (Node 18+ recommended).
- A Cardano wallet for testing (e.g., Nami, Eternl) and a testnet setup if interacting with a network.

Getting started

1. Install dependencies

```
npm install
```

2. Start development server

```
npm run dev
```

Open the app at the URL printed by Vite (usually `http://localhost:5173`).

3. Build for production

```
npm run build
```

4. Preview a production build

```
npm run preview
```

How to use

- Use the UI to connect a Cardano wallet, choose an amount and unlock time, then `Lock` funds.
- After the lock expiry and any validator conditions are met, use `Unlock` to retrieve funds.

Developer notes

- The front-end uses `lucid-cardano` (see `src/lucid.ts`) to build and submit transactions.
- Contract source is in `assets/contract/Savings.hs`. If you modify the Plutus contract, be sure to recompile and update `assets/time-locked-savings.json` used by the UI.
- The `validator.ts` provides the contract interaction helpers used by `lock.ts` and `unlock.ts`.

Contributing

- Contributions and issues are welcome — open a PR or issue describing the change.

License

- See the `MIT` file in the repository root for license details.

Questions / Support

- If you need help running or extending the project, open an issue or contact the repository owner.
