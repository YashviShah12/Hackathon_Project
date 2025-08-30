import { type NextRequest, NextResponse } from "next/server"
import { getCollection } from "@/lib/db"
import { newId } from "@/lib/ids"

export async function GET() {
  const proposals = await (await getCollection("proposals")).find({}).toArray()
  const votes = await (await getCollection("votes")).find({}).toArray()
  return NextResponse.json({ proposals, votes })
}

// POST with action: createProposal | vote
export async function POST(req: NextRequest) {
  const body = await req.json()
  if (body.action === "createProposal") {
    const { title, description, policyKey } = body
    const proposal = {
      _id: newId(),
      title,
      description,
      policyKey,
      status: "open",
      createdAt: new Date().toISOString(),
    }
    await (await getCollection("proposals")).insertOne(proposal)
    return NextResponse.json(proposal, { status: 201 })
  }
  if (body.action === "vote") {
    const { proposalId, did, choice } = body // "for" | "against" | "abstain"
    const existing = await (await getCollection("votes")).findOne({ proposalId, did })
    if (existing) return NextResponse.json({ error: "Already voted" }, { status: 400 })
    const vote = { _id: newId(), proposalId, did, choice, ts: new Date().toISOString() }
    await (await getCollection("votes")).insertOne(vote)
    return NextResponse.json(vote, { status: 201 })
  }
  return NextResponse.json({ error: "Invalid action" }, { status: 400 })
}
