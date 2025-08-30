"use client"
import useSWR from "swr"
import { useState } from "react"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export function PassportAndHaaS() {
  const { data: passports, mutate } = useSWR("/api/passports", fetcher)
  const { data: haas, mutate: mutateHaas } = useSWR("/api/haas", fetcher)
  const [did, setDid] = useState("")
  const [plan, setPlan] = useState("standard")

  async function issueOrUpdate() {
    await fetch("/api/passports", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ did }),
    })
    mutate()
  }
  async function subscribe() {
    await fetch("/api/haas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ did, plan }),
    })
    mutateHaas()
  }

  return (
    <div className="rounded-lg border p-4">
      <h3 className="font-medium text-slate-900">Hydrogen Passport & HaaS</h3>
      <div className="grid md:grid-cols-2 gap-4 mt-3">
        <div>
          <h4 className="text-sm font-medium text-slate-700">Hydrogen Passport (DID)</h4>
          <div className="mt-2 grid gap-2">
            <input
              className="border rounded px-3 py-2 text-sm"
              placeholder="Producer DID"
              value={did}
              onChange={(e) => setDid(e.target.value)}
            />
            <button
              onClick={issueOrUpdate}
              className="inline-flex justify-center rounded bg-emerald-600 text-white text-sm px-3 py-2"
            >
              Issue/Update Passport
            </button>
          </div>
          <ul className="mt-3 text-sm text-slate-600 grid gap-1 max-h-36 overflow-auto">
            {passports?.map((p: any) => (
              <li key={p._id}>
                {p.did} — {p.status}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-medium text-slate-700">Hydrogen-as-a-Service</h4>
          <div className="mt-2 grid gap-2">
            <select className="border rounded px-3 py-2 text-sm" value={plan} onChange={(e) => setPlan(e.target.value)}>
              <option value="standard">Standard</option>
              <option value="enterprise">Enterprise</option>
            </select>
            <button
              onClick={subscribe}
              className="inline-flex justify-center rounded border border-emerald-600 text-emerald-700 text-sm px-3 py-2"
            >
              Subscribe
            </button>
          </div>
          <ul className="mt-3 text-sm text-slate-600 grid gap-1 max-h-36 overflow-auto">
            {haas?.map((h: any) => (
              <li key={h._id}>
                {h.did} — {h.plan} — {h.status}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
