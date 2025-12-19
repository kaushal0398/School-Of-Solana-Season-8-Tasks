import { AnchorProvider, Program, Idl, web3 } from "@coral-xyz/anchor";
import idl from "./idl/chainvault.json";

export const CLUSTER_URL = process.env.VITE_SOLANA_RPC || "https://api.devnet.solana.com";
// replace with your deployed program id if different
export const PROGRAM_ID = new web3.PublicKey(
  process.env.VITE_CHAINVAULT_PROGRAM_ID || "6UUoNhQHHQjKiFjs5wbyQ8X5jHk4aVXEwi8Lzvt8cTFw"
);

export function getProgram(wallet: any) {
  const connection = new web3.Connection(CLUSTER_URL, "confirmed");
  const provider = new AnchorProvider(connection, wallet as any, {
    commitment: "confirmed",
  });
  return new Program(idl as Idl, PROGRAM_ID, provider);
}
