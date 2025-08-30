"use client"
import useSWR from "swr"
import { useState } from "react"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export function IotAndCertification() {
  const { data: producers } = useSWR("/api/producers", fetcher)
  const { data: iot, mutate: mutateIot } = useSWR("/api/iot", fetcher)
  const { data: certs, mutate: mutateCerts } = useSWR("/api/certifications", fetcher)
  const [form, setForm] = useState({ producerDid: "", kWhRenewable: 1000, kWhTotal: 1100 })
  const [certIoTId, setCertIoTId] = useState("")

  async function addReading() {
    await fetch("/api/iot", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        producerDid: form.producerDid,
        reading: {
          kWhRenewable: Number(form.kWhRenewable),
          kWhTotal: Number(form.kWhTotal),
          timestamp: new Date().toISOString(),
        },
      }),
    })
    mutateIot()
  }
  async function certify() {
    await fetch("/api/certifications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ iotId: certIoTId, certifier: "GreenCert Intl" }),
    })
    mutateCerts()
  }

  return (
    <div className="rounded-lg border p-4">
      <h3 className="font-medium text-slate-900">Proof-of-Green</h3>
      <div className="mt-3 grid gap-2">
        <select
          className="border rounded px-3 py-2 text-sm"
          value={form.producerDid}
          onChange={(e) => setForm({ ...form, producerDid: e.target.value })}
        >
          <option value="">Select Producer</option>
          {producers?.map((p: any) => (
            <option key={p.did} value={p.did}>
              {p.name} — {p.did}
            </option>
          ))}
        </select>
        <div className="grid grid-cols-2 gap-2">
          <input
            className="border rounded px-3 py-2 text-sm"
            type="number"
            placeholder="kWh Renewable"
            value={form.kWhRenewable}
            onChange={(e) => setForm({ ...form, kWhRenewable: Number(e.target.value) })}
          />
          <input
            className="border rounded px-3 py-2 text-sm"
            type="number"
            placeholder="kWh Total"
            value={form.kWhTotal}
            onChange={(e) => setForm({ ...form, kWhTotal: Number(e.target.value) })}
          />
        </div>
        <button
          onClick={addReading}
          className="inline-flex justify-center rounded bg-emerald-600 text-white text-sm px-3 py-2"
        >
          Submit IoT Reading
        </button>
      </div>
      <div className="mt-4">
        <h4 className="text-sm font-medium text-slate-700">IoT Readings</h4>
        <ul className="mt-2 text-sm text-slate-600 grid gap-1 max-h-40 overflow-auto">
          {iot?.map((r: any) => (
            <li key={r._id} className="flex items-center justify-between">
              <span>
                {r.producerDid} — ratio {(r.greenRatio * 100).toFixed(1)}%{" "}
                {r.preApproved ? "(pre-approved)" : "(rejected)"}
              </span>
              <button onClick={() => setCertIoTId(r._id)} className="text-sky-600 text-xs">
                Use
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-3 flex items-center gap-2">
        <input
          className="border rounded px-3 py-2 text-sm flex-1"
          placeholder="Selected IoT ID"
          value={certIoTId}
          onChange={(e) => setCertIoTId(e.target.value)}
        />
        <button
          onClick={certify}
          className="inline-flex justify-center rounded border border-emerald-600 text-emerald-700 text-sm px-3 py-2"
        >
          Certify
        </button>
      </div>
      <div className="mt-4">
        <h4 className="text-sm font-medium text-slate-700">Certifications</h4>
        <ul className="mt-2 text-sm text-slate-600 grid gap-1 max-h-40 overflow-auto">
          {certs?.map((c: any) => (
            <li key={c._id}>
              {c.producerDid} — {c.status} — reading {c.readingId}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
