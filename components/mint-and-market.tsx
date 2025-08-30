"use client"
import useSWR from "swr"
import { useState } from "react"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export function MintAndMarket() {
  const { data: certs } = useSWR("/api/certifications", fetcher)
  const { data: credits, mutate: mutateCredits } = useSWR("/api/credits", fetcher)
  const { data: listings, mutate: mutateListings } = useSWR("/api/listings", fetcher)

  const [mint, setMint] = useState({ certificationId: "", amountKg: 1000 })
  const [list, setList] = useState({ creditId: "", sellerDid: "", pricePerKg: 1.25 })
  const [buy, setBuy] = useState({ listingId: "", buyerDid: "" })
  const [retireId, setRetireId] = useState("")

  async function doMint() {
    await fetch("/api/credits", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(mint),
    })
    mutateCredits()
  }
  async function doList() {
    await fetch("/api/listings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "create", ...list }),
    })
    mutateListings()
  }
  async function doBuy() {
    await fetch("/api/listings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "buy", ...buy }),
    })
    mutateListings()
  }
  async function doRetire() {
    await fetch("/api/credits", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "retire", creditId: retireId }),
    })
    mutateCredits()
  }

  return (
    <div className="rounded-lg border p-4">
      <h3 className="font-medium text-slate-900">Mint & GHX Marketplace</h3>
      <div className="grid md:grid-cols-2 gap-4 mt-3">
        <div className="rounded border p-3">
          <h4 className="text-sm font-medium text-slate-700">Mint Credit</h4>
          <select
            className="border rounded px-3 py-2 text-sm mt-2 w-full"
            value={mint.certificationId}
            onChange={(e) => setMint({ ...mint, certificationId: e.target.value })}
          >
            <option value="">Select Certification</option>
            {certs?.map((c: any) => (
              <option key={c._id} value={c._id}>
                {c._id} — {c.producerDid}
              </option>
            ))}
          </select>
          <input
            className="border rounded px-3 py-2 text-sm mt-2 w-full"
            type="number"
            value={mint.amountKg}
            onChange={(e) => setMint({ ...mint, amountKg: Number(e.target.value) })}
          />
          <button
            onClick={doMint}
            className="mt-2 inline-flex justify-center rounded bg-emerald-600 text-white text-sm px-3 py-2"
          >
            Mint
          </button>
          <ul className="mt-3 text-sm text-slate-600 grid gap-1 max-h-36 overflow-auto">
            {credits?.map((cr: any) => (
              <li key={cr._id}>
                {cr._id} — {cr.amountKg}kg — {cr.status} — tx {cr.chainTxHash?.slice(0, 10)}...
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded border p-3">
          <h4 className="text-sm font-medium text-slate-700">List / Buy / Retire</h4>
          <div className="grid gap-2">
            <input
              className="border rounded px-3 py-2 text-sm"
              placeholder="Credit ID to list"
              value={list.creditId}
              onChange={(e) => setList({ ...list, creditId: e.target.value })}
            />
            <input
              className="border rounded px-3 py-2 text-sm"
              placeholder="Seller DID"
              value={list.sellerDid}
              onChange={(e) => setList({ ...list, sellerDid: e.target.value })}
            />
            <input
              className="border rounded px-3 py-2 text-sm"
              type="number"
              step="0.01"
              value={list.pricePerKg}
              onChange={(e) => setList({ ...list, pricePerKg: Number(e.target.value) })}
            />
            <button
              onClick={doList}
              className="inline-flex justify-center rounded border border-emerald-600 text-emerald-700 text-sm px-3 py-2"
            >
              Create Listing
            </button>
          </div>
          <div className="mt-3 grid gap-2">
            <input
              className="border rounded px-3 py-2 text-sm"
              placeholder="Listing ID to buy"
              value={buy.listingId}
              onChange={(e) => setBuy({ ...buy, listingId: e.target.value })}
            />
            <input
              className="border rounded px-3 py-2 text-sm"
              placeholder="Buyer DID"
              value={buy.buyerDid}
              onChange={(e) => setBuy({ ...buy, buyerDid: e.target.value })}
            />
            <button
              onClick={doBuy}
              className="inline-flex justify-center rounded bg-sky-600 text-white text-sm px-3 py-2"
            >
              Buy
            </button>
          </div>
          <div className="mt-3 grid gap-2">
            <input
              className="border rounded px-3 py-2 text-sm"
              placeholder="Credit ID to retire"
              value={retireId}
              onChange={(e) => setRetireId(e.target.value)}
            />
            <button
              onClick={doRetire}
              className="inline-flex justify-center rounded bg-slate-800 text-white text-sm px-3 py-2"
            >
              Retire
            </button>
          </div>
          <div className="mt-3">
            <h5 className="text-sm font-medium text-slate-700">Active Listings</h5>
            <ul className="mt-2 text-sm text-slate-600 grid gap-1 max-h-28 overflow-auto">
              {listings?.map((l: any) => (
                <li key={l._id}>
                  {l._id} — credit {l.creditId} — {l.pricePerKg}$/kg — seller {l.sellerDid}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
