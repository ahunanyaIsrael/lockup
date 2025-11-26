import { lockAda } from "./lock";
import { connectWallet } from "./lucid";
import { unlockAda } from "./unlock";
import { getValidatorAddress } from "./validator";

document.querySelector<HTMLButtonElement>("#connect")!.onclick = async () => {
  const addr = await connectWallet();
  if (addr) {
    document.querySelector("#status")!.textContent =
      "Connected: " + addr.slice(0, 20) + "...";
  }
  const vAddr = await getValidatorAddress();
  console.log(vAddr)
};


document.querySelector<HTMLButtonElement>("#lock")!.onclick = async () =>{
  try {
    const txHash = await lockAda();
    document.getElementById("log")!.innerHTML +=
      "Locked 2 ADA. Tx Hash: " + txHash + "<br>";
  } catch (err) {
    document.getElementById("log")!.innerHTML +=
      "Error locking ADA: " + err + "<br>";
  }
}

document.querySelector<HTMLButtonElement>("#withdraw")!.onclick = async () =>{
  try {
    const txHash = await unlockAda();
    document.getElementById("log")!.innerHTML +=
      "Unlocked 2 ADA. Tx Hash: " + txHash + "<br>";
  } catch (err) {
    document.getElementById("log")!.innerHTML +=
      "Error locking ADA: " + err + "<br>";
  }
}
