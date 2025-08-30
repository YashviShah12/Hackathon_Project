import { type NextRequest, NextResponse } from "next/server"
import { getCollection } from "@/lib/db"
import { newId } from "@/lib/ids"

export async function GET() {
  const data = await (await getCollection("certifications")).find({}).toArray()
  return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { iotId, certifier, notes } = body
  const iot = await (await getCollection("iotReadings")).findOne({ _id: iotId })
  if (!iot) return NextResponse.json({ error: "IoT reading not found" }, { status: 404 })
  if (!iot.preApproved) return NextResponse.json({ error: "Reading not pre-approved" }, { status: 400 })

  const certification = {
    _id: newId(),
    readingId: iotId,
    producerDid: iot.producerDid,
    certifier: certifier || "cert-body-X",
    status: "verified",
    notes: notes || "",
    createdAt: new Date().toISOString(),
  }
  await (await getCollection("certifications")).insertOne(certification)
  return NextResponse.json(certification, { status: 201 })
}
