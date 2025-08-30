import { type NextRequest, NextResponse } from "next/server"
import { getCollection } from "@/lib/db"
import { newId } from "@/lib/ids"

export async function GET() {
  const listings = await (await getCollection("listings")).find({ status: "active" }).toArray()
  return NextResponse.json(listings)
}

// POST /api/listings
// action: "create" | "buy"
// create: { creditId, sellerDid, pricePerKg }
// buy: { listingId, buyerDid }
export async function POST(req: NextRequest) {
  const body = await req.json()
  const { action } = body

  if (action === "create") {
    const { creditId, sellerDid, pricePerKg } = body
    const credit = await (await getCollection("credits")).findOne({ _id: creditId })
    if (!credit) return NextResponse.json({ error: "Credit not found" }, { status: 404 })
    if (credit.status !== "minted") return NextResponse.json({ error: "Credit not tradable" }, { status: 400 })

    const listing = {
      _id: newId(),
      creditId,
      sellerDid,
      pricePerKg,
      status: "active",
      createdAt: new Date().toISOString(),
    }
    await (await getCollection("listings")).insertOne(listing)
    return NextResponse.json(listing, { status: 201 })
  }

  if (action === "buy") {
    const { listingId, buyerDid } = body
    const listing = await (await getCollection("listings")).findOne({ _id: listingId })
    if (!listing) return NextResponse.json({ error: "Listing not found" }, { status: 404 })
    await (await getCollection("listings")).findOneAndUpdate(
      { _id: listingId },
      { $set: { status: "sold", buyerDid, soldAt: new Date().toISOString() } },
    )
    await (await getCollection("transactions")).insertOne({
      _id: newId(),
      type: "trade",
      listingId,
      creditId: listing.creditId,
      sellerDid: listing.sellerDid,
      buyerDid,
      pricePerKg: listing.pricePerKg,
      ts: new Date().toISOString(),
    })
    return NextResponse.json({ ok: true })
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 })
}
