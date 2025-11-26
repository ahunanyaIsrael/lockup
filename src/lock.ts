import { Data } from "https://unpkg.com/lucid-cardano@0.10.11/web/mod.js";
import { lucid, walletAddress } from "./lucid";
import { getValidatorAddress } from "./validator";

// Utility: convert string to hex for Data.Bytes
const stringToHex = (str: string) =>
  Array.from(new TextEncoder().encode(str))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

export const lockAda = async (
  goal: string,
  amount: number,
  deadline: string
) => {
  if (!lucid) throw new Error("Lucid is not initialized. Connect your wallet first.");
  if (!walletAddress) throw new Error("Wallet not connected!");

  try {
    const validatorAddress = await getValidatorAddress();
    const { paymentCredential } = lucid.utils.getAddressDetails(walletAddress);
    if (!paymentCredential?.hash) throw new Error("Invalid wallet address");

    // Define datum type
    const SavingsDatumType = Data.Object({
      sdOwner: Data.Bytes(), // hex string of PKH
      sdDeadline: Data.Integer(), // POSIX time as BigInt
      sdGoal: Data.Bytes(), // goal name as hex string
      sdAmount: Data.Integer(), // lovelace
    });
    type SavingsDatumType = Data.Static<typeof SavingsDatumType>;

    // Convert deadline string to POSIX timestamp in seconds
    const deadlineTimestamp = BigInt(Math.floor(new Date(deadline).getTime() / 1000));

    // Convert ADA to lovelace
    const lovelaceAmount = BigInt(Math.floor(amount * 1_000_000));

    // Create datum
    const datum: SavingsDatumType = {
      sdOwner: paymentCredential.hash, // already hex string
      sdDeadline: deadlineTimestamp,
      sdGoal: stringToHex(goal),
      sdAmount: lovelaceAmount,
    };

    const dtm = Data.to(datum, SavingsDatumType);

    // Create and submit transaction
    const tx = await lucid
      .newTx()
      .payToContract(validatorAddress, { inline: dtm }, { lovelace: lovelaceAmount })
      .complete();

    const signedTx = await tx.sign().complete();
    const txHash = await signedTx.submit();

    console.log("Locked ADA. Tx Hash:", txHash);
    return txHash;
  } catch (err) {
    console.error("Error locking ADA:", err);
    throw err;
  }
};
