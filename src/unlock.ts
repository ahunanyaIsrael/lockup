import { lucid, walletAddress } from "./lucid";
import { getValidatorAddress, validator, } from "./validator";
import { Data } from "https://unpkg.com/lucid-cardano@0.10.11/web/mod.js";


export const unlockAda = async () => {
    if (!lucid) throw new Error("Lucid is not initialized. Connect your wallet first.");
    if (!walletAddress) throw new Error("Wallet not connected!");

    try {
        const validatorAddress = await getValidatorAddress();
        const { paymentCredential } = lucid.utils.getAddressDetails(walletAddress);
        if (!paymentCredential?.hash) throw new Error("Invalid wallet address");

        const SavingsDatumType = Data.Object({
            sdOwner: Data.Bytes(), // hex string of PKH
            sdDeadline: Data.Integer(), // POSIX time as BigInt
            sdGoal: Data.Bytes(), // goal name as hex string
            sdAmount: Data.Integer(), // lovelace
        });
        type SavingsDatumType = Data.Static<typeof SavingsDatumType>;

        // Fetch all UTxOs at the validator
        const utxosAtScript = await lucid.utxosAt(validatorAddress);

        // Decode inline datum before filtering
        const now = BigInt(Math.floor(Date.now() / 1000));
        const myUTxOs = utxosAtScript.filter(utxo => {
            if (!utxo.datum) return false;
            try {
                const dtm = Data.from<SavingsDatumType>(utxo.datum, SavingsDatumType);
                return dtm.sdOwner === paymentCredential.hash && dtm.sdDeadline <= now;
            } catch {
                return false;
            }
        });

        if (myUTxOs.length === 0) {
            console.log("No UTxOs available to unlock.");
            return;
        }
        const nowMs = Date.now();
        const tx = await lucid.newTx()
            .collectFrom(myUTxOs, Data.void())
            .addSignerKey(paymentCredential.hash)
            .attachSpendingValidator({
                type: "PlutusV2",
                script: validator.script
            })
            .validFrom(nowMs - 1000)
            .complete();

        const signedTx = await tx.sign().complete();
        const txHash = await signedTx.submit();

        console.log("Unlocked ADA. Tx Hash:", txHash);
        return txHash;
    } catch (err) {
        console.error("Error unlocking ADA:", err);
        throw err;
    }
};
