import { CheckCircle2, ShieldCheck, Coins, FileCheck2, Cpu, Network, Gavel } from "lucide-react"

const items = [
  { icon: ShieldCheck, title: "Proof-of-Green", desc: "IoT + Oracle-verified renewable input and certification." },
  { icon: Coins, title: "GHX Marketplace", desc: "Tokenized hydrogen credits — list, trade, or retire." },
  { icon: FileCheck2, title: "Compliance", desc: "Auditable ledger and real-time regulator dashboards." },
  { icon: Cpu, title: "FraudShield AI", desc: "Detects double counting, anomalies, and suspicious flows." },
  { icon: Network, title: "Hydrogen Passport (DID)", desc: "DID-based supply chain identity and traceability." },
  { icon: Gavel, title: "Governance DAO", desc: "Proposals and votes for policies and dispute resolution." },
]

export function Features() {
  return (
    <section id="features" className="bg-white">
      <div className="mx-auto max-w-6xl px-4 py-12 md:py-16">
        <h2 className="text-2xl md:text-3xl font-semibold text-slate-900">All-in-one ecosystem</h2>
        <p className="text-slate-600 mt-2 max-w-2xl">
          Credits, exchange, passport, DAO, and AI combined to accelerate net-zero adoption.
        </p>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          {items.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="rounded-lg border p-5 hover:shadow-sm transition">
              <Icon className="text-emerald-600" size={24} />
              <h3 className="mt-3 font-medium text-slate-900">{title}</h3>
              <p className="text-sm text-slate-600 mt-1">{desc}</p>
            </div>
          ))}
        </div>
        <div className="mt-6 flex items-center gap-2 text-slate-600">
          <CheckCircle2 className="text-emerald-600" size={18} />
          <span className="text-sm">Interoperable with carbon markets and future-ready for NFT passports.</span>
        </div>
      </div>
    </section>
  )
}
