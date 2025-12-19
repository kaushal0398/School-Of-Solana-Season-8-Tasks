import React, { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { getProgram } from "../chainvault";

export default function GuardianPanel({ wallet }: { wallet: any }) {
  const [title, setTitle] = useState("");
  const [maxPayment, setMaxPayment] = useState<number>(1000000);
  const [nonce, setNonce] = useState<number>(1);
  const [assignee, setAssignee] = useState("");

  async function initVaultForChild(childPubkey: string) {
    const program = getProgram(wallet);
    const child = new PublicKey(childPubkey);

    const [vaultPda, vaultBump] = PublicKey.findProgramAddressSync(
      [Buffer.from("vault"), child.toBuffer()],
      program.programId
    );

    try {
      await program.methods
        .initVault()
        .accounts({
          vault: vaultPda,
          child,
          guardian: wallet.publicKey,
          systemProgram: PublicKey.default,
        })
        .rpc();
      alert("Vault initialized: " + vaultPda.toBase58());
    } catch (err: any) {
      alert("Error init vault: " + err.toString());
    }
  }

  async function createJob() {
    const program = getProgram(wallet);
    if (!assignee) return alert("set assignee pubkey");
    const assigneePk = new PublicKey(assignee);

    // derive job PDA seed = ["job", assigner, nonce]
    const [jobPda] = PublicKey.findProgramAddressSync(
      [Buffer.from("job"), wallet.publicKey!.toBuffer(), new Uint8Array([nonce])],
      program.programId
    );

    try {
      await program.methods
        .createJob(title, new Number(maxPayment).valueOf(), nonce)
        .accounts({
          job: jobPda,
          vault: jobPda, // NOTE: original program used vault too — adjust if needed
          assigner: wallet.publicKey,
          assignee: assigneePk,
          systemProgram: PublicKey.default,
        })
        .rpc();
      alert("Job created: " + jobPda.toBase58());
    } catch (err: any) {
      alert("Error create job: " + err.toString());
    }
  }

  async function approveAndPay(jobPubkey: string, childActual: string, rating: number) {
    const program = getProgram(wallet);
    try {
      await program.methods
        .approveAndPay(rating)
        .accounts({
          job: new PublicKey(jobPubkey),
          vault: new PublicKey(jobPubkey), // depending on program -- adjust
          guardian: wallet.publicKey,
          childActual: new PublicKey(childActual),
          systemProgram: PublicKey.default,
        })
        .rpc();
      alert("Paid and rated.");
    } catch (err: any) {
      alert("Error pay: " + err.toString());
    }
  }

  return (
    <div style={{ padding: 16, border: "1px solid #ddd", borderRadius: 8 }}>
      <h3>Guardian Panel</h3>

      <div style={{ marginTop: 12 }}>
        <label>Init vault for child (pubkey)</label>
        <input onChange={(e) => {}} placeholder="paste child pubkey" style={{ width: "100%", marginTop: 6 }} />
        <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
          <button onClick={() => {
            const pk = prompt("child pubkey:");
            if (pk) initVaultForChild(pk);
          }}>
            Init Vault
          </button>
        </div>
      </div>

      <hr style={{ margin: "12px 0" }} />

      <div>
        <h4>Create job</h4>
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="title" />
        <input type="number" value={maxPayment} onChange={(e) => setMaxPayment(Number(e.target.value))} />
        <input type="number" value={nonce} onChange={(e) => setNonce(Number(e.target.value))} />
        <input placeholder="assignee pubkey" value={assignee} onChange={(e) => setAssignee(e.target.value)} />
        <div style={{ marginTop: 8 }}>
          <button onClick={createJob}>Create Job</button>
        </div>
      </div>

      <hr style={{ margin: "12px 0" }} />

      <div>
        <h4>Approve & Pay</h4>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={() => {
            const job = prompt("job pubkey:");
            const child = prompt("child actual pubkey:");
            const rating = Number(prompt("rating 1-10:") || "5");
            if (job && child) approveAndPay(job, child, rating);
          }}>
            Approve & Pay
          </button>
        </div>
      </div>
    </div>
  );
}
