import { Lucid, Blockfrost } from "https://unpkg.com/lucid-cardano@0.10.11/web/mod.js";

export let lucid: Lucid ;
export let walletAddress: string | null = null;

export async function connectWallet() {
  // Check if Lace is installed
  const lace = (window as any).cardano?.lace;
  if (!lace) {
    alert("Lace wallet not found. Please install Lace.");
    return;
  }

  // Enable wallet
  const api = await lace.enable();

  // Initialize Lucid
  lucid = await Lucid.new(
    new Blockfrost(
      "https://cardano-preprod.blockfrost.io/api/v0",
      "preprod2fyiLT8cAkqpgJyJwncWwN2M5X4R8aoo" || "preprodYjRkHfcazNkL0xxG9C2RdUbUoTrG7wip"
    ),
    "Preprod"
  );

  lucid.selectWallet(api);

  // Get the wallet address
  walletAddress = await lucid.wallet.address();

  console.log("Wallet connected:", walletAddress);
  return walletAddress;
}
