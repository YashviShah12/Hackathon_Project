import { type NextRequest, NextResponse } from "next/server"
import { getCollection } from "@/lib/db"
import { newId } from "@/lib/ids"

export async function GET() {
  const p = await (await getCollection("passports")).find({}).toArray()
  return NextResponse.json(p)
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { did, update } = body
  const col = await getCollection("passports")
  const found = await col.findOne({ did })
  if (!found) {
    const passport = { _id: newId(), did, status: "issued", history: [], nftTokenId: null }
    await col.insertOne(passport)
    return NextResponse.json(passport, { status: 201 })
  } else {
    const updated = await col.findOneAndUpdate({ did }, { $set: update || {} })
    return NextResponse.json(updated.value || {}, { status: 200 })
  }
}
