import { type NextRequest, NextResponse } from "next/server"
import { getCollection } from "@/lib/db"
import { newDid, newId } from "@/lib/ids"

export async function GET() {
  const producers = await (await getCollection("producers")).find({}).toArray()
  return NextResponse.json(producers)
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { name, contactEmail, region } = body
  const did = newDid()
  const item = {
    _id: newId(),
    did,
    name,
    contactEmail,
    region,
    status: "onboarded",
    createdAt: new Date().toISOString(),
    role: "producer",
  }
  await (await getCollection("producers")).insertOne(item)
  // Also create Hydrogen Passport shell
  await (await getCollection("passports")).insertOne({
    _id: newId(),
    did,
    ownerName: name,
    status: "issued",
    nftTokenId: null, // optional future NFT binding
    history: [],
  })
  return NextResponse.json(item, { status: 201 })
}
