import { NextResponse } from "next/server"
import { getCollection } from "@/lib/db"
import { detectAnomalies } from "@/lib/fraud"

export async function GET() {
  const iotReadings = await (await getCollection("iotReadings")).find({}).toArray()
  const certifications = await (await getCollection("certifications")).find({}).toArray()
  const credits = await (await getCollection("credits")).find({}).toArray()
  const transactions = await (await getCollection("transactions")).find({}).toArray()
  const anomalies = detectAnomalies({ iotReadings, certifications, credits, transactions })
  return NextResponse.json({ anomalies })
}
