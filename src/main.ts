import { lockAda } from "./lock";
import { connectWallet } from "./lucid";
import { unlockAda } from "./unlock";
import { getValidatorAddress } from "./validator";

const $ = (selector: string) => document.querySelector<HTMLElement>(selector)!;

const progressFill = $("#progress-fill") as HTMLElement;
const progressText = $("#progress-text") as HTMLElement;


let walletAddr: string | null = null;

// -------------------------
// Wallet connect handler
// -------------------------

document.querySelector<HTMLButtonElement>("#connect")!.onclick = async () => {
  const addr = await connectWallet();
  if (addr) {
    document.querySelector("#status")!.textContent =
      "Connected: " + addr.slice(0, 20) + "...";
  }
  walletAddr = addr
  updateProgressForWallet(walletAddr);
  const vAddr = await getValidatorAddress();
  console.log(vAddr)
};

// -------------------------
// Lock ADA handler
// -------------------------

document.querySelector<HTMLButtonElement>("#lock")!.onclick = async () => {
  try {
    if (!walletAddr) {
    alert("Please connect your wallet first!");
    return;
  }
    const goalInput = ($("#goal") as HTMLInputElement).value;
    const amountInput = Number(($("#amount") as HTMLInputElement).value || 2);
    const deadlineInput = ($("#deadline") as HTMLInputElement).value; // make sure your

    const txHash = await lockAda(goalInput, amountInput, deadlineInput);

    document.getElementById("log")!.innerHTML +=
      `Locked ${amountInput} ADA. Tx Hash: ${txHash}<br>`;
    
      // Save start time and deadline in localStorage keyed by wallet
    const lockData = {
      start: Date.now(),
      deadline: new Date(deadlineInput).getTime()
    };
    localStorage.setItem(`lock-${walletAddr}`, JSON.stringify(lockData));

    // Start progress bar
    updateProgressForWallet(walletAddr);

  } catch (err) {
    document.getElementById("log")!.innerHTML +=
      "Error locking ADA: " + err + "<br>";
  }
};

// -------------------------
// Withdraw handler
// -------------------------
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


// -------------------------
// Progress bar function per wallet
// -------------------------
function updateProgressForWallet(wallet: string) {
  const data = localStorage.getItem(`lock-${wallet}`);
  if (!data) {
    progressFill.style.width = "0%";
    progressText.textContent = "0%";
    return;
  }

  const { start, deadline } = JSON.parse(data);

  function tick() {
    const now = Date.now();
    let percent = ((now - start) / (deadline - start)) * 100;
    percent = Math.min(Math.max(percent, 0), 100);
    progressFill.style.width = percent + "%";

    if (percent < 100) {
      const remaining = Math.max(deadline - now, 0);
      const hrs = Math.floor(remaining / (1000 * 60 * 60));
      const mins = Math.floor((remaining / (1000 * 60)) % 60);
      const secs = Math.floor((remaining / 1000) % 60);
      progressText.textContent = `${Math.floor(percent)}% (${hrs}h ${mins}m ${secs}s left)`;
      requestAnimationFrame(tick);
    } else {
      progressText.textContent = "Unlocked!";
      progressFill.style.width = "100%";
      localStorage.removeItem(`lock-${wallet}`);
    }
  }

  tick();
}

// -------------------------
// Restore progress on page load if wallet connected
// -------------------------
window.addEventListener("load", () => {
  // If user has previously connected, attempt to restore progress
  // Wallet connection required to know which key to use
  // Once they connect, updateProgressForWallet(walletAddr) will be called
});