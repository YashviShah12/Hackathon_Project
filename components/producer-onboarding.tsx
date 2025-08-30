"use client"
import useSWR from "swr"
import { useState } from "react"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export function ProducerOnboarding() {
  const { data, mutate } = useSWR("/api/producers", fetcher)
  const [form, setForm] = useState({ name: "", contactEmail: "", region: "" })
  const [loading, setLoading] = useState(false)

  async function submit() {
    setLoading(true)
    await fetch("/api/producers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })
    setLoading(false)
    setForm({ name: "", contactEmail: "", region: "" })
    mutate()
  }

  return (
    <div className="rounded-lg border p-4">
      <h3 className="font-medium text-slate-900">Producer Onboarding</h3>
      <div className="mt-3 grid gap-2">
        <input
          className="border rounded px-3 py-2 text-sm"
          placeholder="Company Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          className="border rounded px-3 py-2 text-sm"
          placeholder="Contact Email"
          value={form.contactEmail}
          onChange={(e) => setForm({ ...form, contactEmail: e.target.value })}
        />
        <input
          className="border rounded px-3 py-2 text-sm"
          placeholder="Region"
          value={form.region}
          onChange={(e) => setForm({ ...form, region: e.target.value })}
        />
        <button
          disabled={loading}
          onClick={submit}
          className="inline-flex justify-center rounded bg-emerald-600 text-white text-sm px-3 py-2 disabled:opacity-50"
        >
          {loading ? "Onboarding..." : "Onboard Producer"}
        </button>
      </div>
      <div className="mt-4">
        <h4 className="text-sm font-medium text-slate-700">Producers</h4>
        <ul className="mt-2 text-sm text-slate-600 grid gap-1">
          {data?.map((p: any) => (
            <li key={p._id} className="flex items-center justify-between">
              <span>
                {p.name} — {p.did}
              </span>
              <span className="text-xs text-slate-500">{p.region}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
