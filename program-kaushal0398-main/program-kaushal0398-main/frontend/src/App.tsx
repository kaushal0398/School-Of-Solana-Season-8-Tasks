import React, { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { PublicKey, SystemProgram } from "@solana/web3.js";
import { getProgram } from "./chainvault";
import GuardianPanel from "./components/GuardianPanel";
import ChildPanel from "./components/ChildPanel";

export default function App() {
  const wallet = useWallet();

  return (
    <div style={{ padding: 24, fontFamily: "system-ui, sans-serif" }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1>ChainVault — demo frontend</h1>
        <WalletMultiButton />
      </header>

      {!wallet.connected && <p style={{ marginTop: 20 }}>Connect a wallet (Phantom recommended).</p>}

      {wallet.connected && (
        <main style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginTop: 20 }}>
          <GuardianPanel wallet={wallet} />
          <ChildPanel wallet={wallet} />
        </main>
      )}

      <footer style={{ marginTop: 40, fontSize: 13 }}>
        <p>RPC: {process.env.VITE_SOLANA_RPC || "https://api.devnet.solana.com"}</p>
      </footer>
    </div>
  );
}

