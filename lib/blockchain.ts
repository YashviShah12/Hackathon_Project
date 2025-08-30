import { createHash } from "crypto"

const inMemoryChain: {
  credits: {
    id: string
    producerDid: string
    amountKg: number
    metadata: any
    status: "minted" | "retired"
    txHash: string
  }[]
  events: { type: string; payload: any; txHash: string; ts: number }[]
} = {
  credits: [],
  events: [],
}

type MintParams = {
  producerDid: string
  amountKg: number
  metadata: Record<string, any>
}

export type ChainResult = {
  txHash: string
  network: "in-memory" | "ethereum"
}

async function getEthers() {
  try {
    const { ethers } = await import("ethers")
    return ethers
  } catch {
    return null
  }
}

function fakeTxHash(payload: any) {
  return createHash("sha256")
    .update(JSON.stringify(payload) + Date.now())
    .digest("hex")
}

export async function mintCreditOnChain({ producerDid, amountKg, metadata }: MintParams): Promise<ChainResult> {
  const RPC_URL = process.env.RPC_URL
  const PRIVATE_KEY = process.env.WALLET_PRIVATE_KEY

  const ethers = await getEthers()
  if (ethers && RPC_URL && PRIVATE_KEY) {
    const provider = new ethers.JsonRpcProvider(RPC_URL)
    const wallet = new ethers.Wallet(PRIVATE_KEY, provider)
    // Minimal on-chain write simulation: send a self-tx with embedded metadata hash
    const dataHash = fakeTxHash({ producerDid, amountKg, metadata })
    const tx = await wallet.sendTransaction({ to: wallet.address, value: 0n, data: "0x" + dataHash.slice(0, 64) })
    const receipt = await tx.wait()
    return { txHash: receipt?.hash || tx.hash, network: "ethereum" }
  }

  // Fallback: in-memory ledger
  const txHash = fakeTxHash({ producerDid, amountKg, metadata })
  inMemoryChain.credits.push({ id: txHash.slice(0, 16), producerDid, amountKg, metadata, status: "minted", txHash })
  inMemoryChain.events.push({ type: "Mint", payload: { producerDid, amountKg, metadata }, txHash, ts: Date.now() })
  return { txHash, network: "in-memory" }
}

export async function retireCreditOnChain(creditId: string): Promise<ChainResult> {
  const RPC_URL = process.env.RPC_URL
  const PRIVATE_KEY = process.env.WALLET_PRIVATE_KEY
  const ethers = await getEthers()
  if (ethers && RPC_URL && PRIVATE_KEY) {
    const provider = new ethers.JsonRpcProvider(RPC_URL)
    const wallet = new ethers.Wallet(PRIVATE_KEY, provider)
    const tx = await wallet.sendTransaction({ to: wallet.address, value: 0n })
    const receipt = await tx.wait()
    return { txHash: receipt?.hash || tx.hash, network: "ethereum" }
  }

  const txHash = fakeTxHash({ creditId, action: "retire" })
  const c = inMemoryChain.credits.find((x) => x.id === creditId)
  if (c) c.status = "retired"
  inMemoryChain.events.push({ type: "Retire", payload: { creditId }, txHash, ts: Date.now() })
  return { txHash, network: "in-memory" }
}

export function getChainEvents() {
  return inMemoryChain.events
}
