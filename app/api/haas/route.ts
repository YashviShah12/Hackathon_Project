import { type NextRequest, NextResponse } from "next/server"
import { getCollection } from "@/lib/db"
import { newId } from "@/lib/ids"

export async function GET() {
  const subs = await (await getCollection("haas")).find({}).toArray()
  return NextResponse.json(subs)
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { did, plan } = body
  const item = { _id: newId(), did, plan, status: "active", startedAt: new Date().toISOString() }
  await (await getCollection("haas")).insertOne(item)
  return NextResponse.json(item, { status: 201 })
}
