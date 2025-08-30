"use client"
import useSWR from "swr"
import { useState } from "react"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export function GovernanceDAO() {
  const { data, mutate } = useSWR("/api/dao", fetcher)
  const [p, setP] = useState({ title: "", description: "", policyKey: "" })
  const [vote, setVote] = useState({ proposalId: "", did: "", choice: "for" })

  async function create() {
    await fetch("/api/dao", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "createProposal", ...p }),
    })
    setP({ title: "", description: "", policyKey: "" })
    mutate()
  }
  async function cast() {
    await fetch("/api/dao", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "vote", ...vote }),
    })
    mutate()
  }

  return (
    <div className="rounded-lg border p-4">
      <h3 className="font-medium text-slate-900">Governance DAO</h3>
      <div className="grid md:grid-cols-2 gap-4 mt-3">
        <div>
          <h4 className="text-sm font-medium text-slate-700">Create Proposal</h4>
          <div className="grid gap-2 mt-2">
            <input
              className="border rounded px-3 py-2 text-sm"
              placeholder="Title"
              value={p.title}
              onChange={(e) => setP({ ...p, title: e.target.value })}
            />
            <input
              className="border rounded px-3 py-2 text-sm"
              placeholder="Policy Key (e.g., RETIRE_THRESHOLD)"
              value={p.policyKey}
              onChange={(e) => setP({ ...p, policyKey: e.target.value })}
            />
            <textarea
              className="border rounded px-3 py-2 text-sm"
              placeholder="Description"
              value={p.description}
              onChange={(e) => setP({ ...p, description: e.target.value })}
            />
            <button
              onClick={create}
              className="inline-flex justify-center rounded bg-emerald-600 text-white text-sm px-3 py-2"
            >
              Create
            </button>
          </div>
        </div>
        <div>
          <h4 className="text-sm font-medium text-slate-700">Proposals</h4>
          <ul className="mt-2 grid gap-2">
            {data?.proposals?.map((pr: any) => (
              <li key={pr._id} className="rounded border p-3">
                <div className="text-sm font-medium">{pr.title}</div>
                <div className="text-xs text-slate-600">{pr.description}</div>
                <div className="text-xs text-slate-500 mt-1">Policy: {pr.policyKey}</div>
              </li>
            ))}
          </ul>
          <div className="mt-3">
            <h4 className="text-sm font-medium text-slate-700">Vote</h4>
            <div className="grid gap-2 mt-2">
              <input
                className="border rounded px-3 py-2 text-sm"
                placeholder="Proposal ID"
                value={vote.proposalId}
                onChange={(e) => setVote({ ...vote, proposalId: e.target.value })}
              />
              <input
                className="border rounded px-3 py-2 text-sm"
                placeholder="Your DID"
                value={vote.did}
                onChange={(e) => setVote({ ...vote, did: e.target.value })}
              />
              <select
                className="border rounded px-3 py-2 text-sm"
                value={vote.choice}
                onChange={(e) => setVote({ ...vote, choice: e.target.value })}
              >
                <option value="for">For</option>
                <option value="against">Against</option>
                <option value="abstain">Abstain</option>
              </select>
              <button
                onClick={cast}
                className="inline-flex justify-center rounded border border-emerald-600 text-emerald-700 text-sm px-3 py-2"
              >
                Cast Vote
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
