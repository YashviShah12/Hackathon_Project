"use client"
import useSWR from "swr"

const fetcher = (url: string) => fetch(url).then(r => r.json())

export function FraudShieldPanel() {
  const { data } = useSWR("/api/fraud", fetcher, { refreshInterval: 5000 })
  return (
    <div className="rounded-lg border p-4">
      <h3 className="font-medium text-slate-900">FraudShield AI</h3>
      <p className="text-sm text-slate-600 mt-1">Real-time anomaly detection for double-counting and suspicious activity.</p>
      <ul className="mt-3 grid gap-2">
        {data?.anomalies?.length
          ? data.anomalies.map((a: any) => (
              <li key={a.id} className="rounded border p-3">
                <div className="text-sm font-medium">{a.type} — <span className="capitalize">{a.severity}</span></div>
                <div className="text-sm text-slate-600">{a.details}</div>
              </li>
            ))
          : <li className="text-sm text-slate-500">No anomalies detected</li>
        }
      </ul>
    </div>
  )
}
