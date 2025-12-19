import React from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { getProgram } from "../chainvault";
import { PublicKey } from "@solana/web3.js";

export default function ChildPanel({ wallet }: { wallet: any }) {
  async function submitJob(jobPubkey: string) {
    const program = getProgram(wallet);
    try {
      await program.methods
        .submitJob()
        .accounts({
          job: new PublicKey(jobPubkey),
          assignee: wallet.publicKey,
        })
        .rpc();
      alert("Job submitted.");
    } catch (err: any) {
      alert("Error submit job: " + err.toString());
    }
  }

  async function withdraw(amountLamports: string) {
    const program = getProgram(wallet);
    const amount = Number(amountLamports);
    if (!wallet.publicKey) return alert("connect wallet");

    // vault & vault_treasury PDAs must be derived exactly as program expects
    const [vaultPda] = PublicKey.findProgramAddressSync(
      [Buffer.from("vault"), wallet.publicKey!.toBuffer()],
      program.programId
    );

    const [treasuryPda] = PublicKey.findProgramAddressSync(
      [Buffer.from("vault_treasury"), wallet.publicKey!.toBuffer()],
      program.programId
    );

    try {
      await program.methods
        .withdrawFromVault(amount) // method name from on-chain program
        .accounts({
          vault: vaultPda,
          vaultTreasury: treasuryPda,
          child: wallet.publicKey,
          systemProgram: PublicKey.default,
        })
        .rpc();
      alert("Withdraw successful.");
    } catch (err: any) {
      alert("Withdraw error: " + err.toString());
    }
  }

  return (
    <div style={{ padding: 16, border: "1px solid #ddd", borderRadius: 8 }}>
      <h3>Child Panel</h3>

      <div style={{ marginTop: 12 }}>
        <button onClick={() => {
          const job = prompt("job pubkey to submit:");
          if (job) submitJob(job);
        }}>Submit Job</button>
      </div>

      <hr style={{ marginTop: 12, marginBottom: 12 }} />

      <div>
        <button onClick={() => {
          const amt = prompt("amount (lamports):", "1000");
          if (amt) withdraw(amt);
        }}>Withdraw</button>
      </div>
    </div>
  );
}
