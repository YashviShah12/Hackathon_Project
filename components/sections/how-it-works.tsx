const steps = [
  "Producer Onboarding → Digital identity verification",
  "Certification → Proof-of-Green verified via IoT/oracles",
  "Credit Minting → Tokenized credits issued on blockchain",
  "Exchange Listing → Credits available on GHX marketplace",
  "Transactions → Buyers purchase/trade/retire credits",
  "FraudShield AI → Monitors for double counting & fraud",
  "Governance DAO → Disputes and policy setting",
  "Regulators → Real-time dashboards & audits",
]

export function HowItWorks() {
  return (
    <section className="bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-12 md:py-16">
        <h2 className="text-2xl md:text-3xl font-semibold text-slate-900">How it works</h2>
        <ol className="mt-6 grid gap-3">
          {steps.map((s, i) => (
            <li key={i} className="flex gap-3 items-start">
              <span className="mt-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 text-xs font-medium">
                {i + 1}
              </span>
              <span className="text-slate-700">{s}</span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
