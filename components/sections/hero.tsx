import Link from "next/link"

export function Hero() {
  return (
    <section className="bg-emerald-600 text-white">
      <div className="mx-auto max-w-6xl px-4 py-16 md:py-24">
        <div className="max-w-2xl space-y-6">
          <h1 className="text-balance text-4xl md:text-5xl font-semibold">
            Blockchain-based Green Hydrogen Credit System
          </h1>
          <p className="text-pretty text-white/90">
            Hydrogen Nexus: an end-to-end ecosystem for issuance, trading, compliance, and auditing — transparent,
            fraud-proof, and globally scalable.
          </p>
          <div className="flex gap-3">
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center rounded-md bg-white text-emerald-700 px-4 py-2 text-sm font-medium"
            >
              Launch App
            </Link>
            <a
              href="#features"
              className="inline-flex items-center justify-center rounded-md border border-white/40 px-4 py-2 text-sm font-medium"
            >
              Learn More
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
