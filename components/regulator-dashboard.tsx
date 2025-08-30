"use client"
import useSWR from "swr"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export function RegulatorDashboard() {
  const { data: credits } = useSWR("/api/credits", fetcher)
  const { data: listings } = useSWR("/api/listings", fetcher)
  const { data: fraud } = useSWR("/api/fraud", fetcher)

  const totalKg = (credits || []).reduce((a: number, c: any) => a + (c.amountKg || 0), 0)
  const minted = (credits || []).filter((c: any) => c.status === "minted").length
  const retired = (credits || []).filter((c: any) => c.status === "retired").length
  const anomalies = fraud?.anomalies?.length || 0

  return (
    <div className="rounded-lg border p-4">
      <h3 className="font-medium text-slate-900">Regulator Dashboard</h3>
      <div className="grid md:grid-cols-4 gap-3 mt-3">
        <StatCard label="Total Credits (kg)" value={totalKg.toLocaleString()} />
        <StatCard label="Minted" value={minted} />
        <StatCard label="Retired" value={retired} />
        <StatCard label="Anomalies" value={anomalies} />
      </div>
      <div className="mt-4">
        <h4 className="text-sm font-medium text-slate-700">Active Listings</h4>
        <ul className="mt-2 text-sm text-slate-600 grid gap-1 max-h-36 overflow-auto">
          {listings?.map((l: any) => (
            <li key={l._id}>
              {l._id} — credit {l.creditId} — {l.pricePerKg}$/kg
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

function StatCard({ label, value }: { label: string; value: any }) {
  return (
    <div className="rounded-lg border p-4">
      <div className="text-xs text-slate-500">{label}</div>
      <div className="text-xl font-semibold text-slate-900">{value}</div>
    </div>
  )
}
