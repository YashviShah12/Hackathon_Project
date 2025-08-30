import { type NextRequest, NextResponse } from "next/server"
import { getCollection } from "@/lib/db"
import { newId } from "@/lib/ids"

export async function GET() {
  const data = await (await getCollection("iotReadings")).find({}).toArray()
  return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { producerDid, reading } = body
  // reading example: { kWhRenewable: number, kWhTotal: number, timestamp: string }
  const greenRatio = reading.kWhRenewable / Math.max(1, reading.kWhTotal)
  const preApproved = greenRatio >= 0.85 // threshold
  const item = {
    _id: newId(),
    producerDid,
    reading,
    greenRatio,
    oracle: { provider: "chainlink-stub", roundId: "sim-1" },
    preApproved,
    createdAt: new Date().toISOString(),
  }
  await (await getCollection("iotReadings")).insertOne(item)
  return NextResponse.json(item, { status: 201 })
}
