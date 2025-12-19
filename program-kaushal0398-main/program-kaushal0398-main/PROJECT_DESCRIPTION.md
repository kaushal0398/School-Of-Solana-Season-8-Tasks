# ChainVault — A Decentralized Chore & Rewards System (Solana + Anchor)

ChainVault is a decentralized application built on **Solana** using **Anchor**, designed for parents and children to manage chores, rewards, and wallet interactions in a secure, trustless way.

This system supports:

* Creating child wallets
* Assigning chores
* Submitting completion proofs
* Rating chores
* Automatic reward distribution
* Withdrawing SOL earnings

Fully on-chain & permissioned.

---

## ✨ Features

### 👪 **Child Wallet Management**

* Initialize a child wallet account
* Prevent double initialization

### 🧹 **Chore Management**

* Create chores with description & reward
* Assign each chore to a child

### ✔️ **Completion Submission**

* Child submits proof
* Only the assigned child may submit

### ⭐ **Rating + Payment**

* Parent gives rating (1–5)
* Reward auto-transferred to child balance

### 💰 **SOL Withdrawal**

* Child withdraws earnings from vault treasury

---

## 📦 Project Structure

```
programs/
└── chainvault/
    ├── src/
    │   ├── lib.rs
    │   ├── errors.rs
    │   ├── state.rs
    │   └── constants.rs
tests/
└── chainvault.ts
frontend/
└── (Optional React + Vite UI)
```

### **On-chain Accounts**

| Account         | Purpose                                      |
| --------------- | -------------------------------------------- |
| **Vault**       | Tracks parent, treasury, child PDAs          |
| **ChildWallet** | Tracks child's earnings                      |
| **Chore**       | Stores chore details, reward, status, rating |

---

# 🚀 Local Development

### 1. Install dependencies

```
anchor --version       # must be 0.31.x
solana --version       # 1.17.x / 1.18.x
node --version         # >= 18
```

### 2. Start local validator (if required)

```
solana-test-validator --reset
```

### 3. Run tests

```
anchor test
```

Expected result:

```
9 passing
0 failing
```

---

# 🌐 Deploy To Devnet

### 1. Airdrop SOL

```
solana airdrop 2 -u devnet
```

### 2. Build & Deploy

```
anchor build
anchor deploy --provider.cluster devnet
```

Deployment output:

```
Program Id: 6UUoNhQHHQjKiFjs5wbyQ8X5jHk4aVXEwi8Lzvt8cTFw
Deploy success
```

Update `Anchor.toml`:

```toml
[programs.devnet]
chainvault = "6UUoNhQHHQjKiFjs5wbyQ8X5jHk4aVXEwi8Lzvt8cTFw"
```

---

# 🖥️ Frontend Setup (React + Vite)

### 1. Move into folder

```
cd frontend
```

### 2. Install packages

```
npm install
```

### 3. Copy IDL

```
mkdir -p public/idl
cp ../anchor_project/chainvault/target/idl/chainvault.json public/idl/
```

### 4. Start dev server

```
npm run dev
```

### 5. Configure Program ID

In `src/constants.ts`:

```ts
export const PROGRAM_ID = "6UUoNhQHHQjKiFjs5wbyQ8X5jHk4aVXEwi8Lzvt8cTFw";
```

Frontend includes:

* Phantom wallet connection
* Initialize child wallet
* Create chores
* Submit completion
* Rate & pay
* Withdraw earnings

---

# 📘 Tech Stack

### **On-chain**

* Rust
* Solana
* Anchor Framework

### **Frontend**

* React
* Vite
* TypeScript
* Solana Wallet Adapter

---

# 🏁 Summary

ChainVault delivers:

✔ Full chore lifecycle
✔ Secure parent → child rewards system
✔ On-chain accounting
✔ Comprehensive test suite
✔ Devnet deployment
✔ Frontend integration-ready

---

