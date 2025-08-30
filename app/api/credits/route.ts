import { type NextRequest, NextResponse } from "next/server"
import { getCollection } from "@/lib/db"
import { newId } from "@/lib/ids"
import { mintCreditOnChain, retireCreditOnChain } from "@/lib/blockchain"

export async function GET() {
  const credits = await (await getCollection("credits")).find({}).toArray()
  return NextResponse.json(credits)
}

// POST /api/credits with { certificationId, amountKg, metadata, action?: "retire", creditId? }
export async function POST(req: NextRequest) {
  const body = await req.json()
  const { certificationId, amountKg, metadata, action, creditId } = body

  if (action === "retire" && creditId) {
    const chain = await retireCreditOnChain(creditId)
    await (await getCollection("credits")).findOneAndUpdate(
      { _id: creditId },
      { $set: { status: "retired", retiredAt: new Date().toISOString(), chainTxRetire: chain.txHash } },
    )
    return NextResponse.json({ ok: true, chain })
  }

  const cert = await (await getCollection("certifications")).findOne({ _id: certificationId })
  if (!cert) return NextResponse.json({ error: "Certification not found" }, { status: 404 })

  const chain = await mintCreditOnChain({
    producerDid: cert.producerDid,
    amountKg,
    metadata: metadata || { certificationId },
  })

  const credit = {
    _id: newId(),
    chainTxHash: chain.txHash,
    chainNetwork: chain.network,
    producerDid: cert.producerDid,
    certificationId,
    amountKg,
    metadata: metadata || {},
    status: "minted",
    createdAt: new Date().toISOString(),
  }
  await (await getCollection("credits")).insertOne(credit)
  return NextResponse.json(credit, { status: 201 })
}
