import { TopNav } from "@/components/nav"
import { ProducerOnboarding } from "@/components/producer-onboarding"
import { IotAndCertification } from "@/components/iot-and-cert"
import { MintAndMarket } from "@/components/mint-and-market"
import { FraudShieldPanel } from "@/components/fraudshield"
import { GovernanceDAO } from "@/components/dao"
import { RegulatorDashboard } from "@/components/regulator-dashboard"
import { PassportAndHaaS } from "@/components/passport-and-haas"

export default function DashboardPage() {
  return (
    <main className="font-sans">
      <TopNav />
      <div className="mx-auto max-w-6xl px-4 py-8 grid gap-6">
        <Header />
        <div className="grid md:grid-cols-2 gap-6">
          <ProducerOnboarding />
          <PassportAndHaaS />
        </div>
        <IotAndCertification />
        <MintAndMarket />
        <div className="grid md:grid-cols-2 gap-6">
          <FraudShieldPanel />
          <GovernanceDAO />
        </div>
        <RegulatorDashboard />
      </div>
    </main>
  )
}

function Header() {
  return (
    <section className="rounded-lg border p-5 bg-white">
      <h1 className="text-2xl font-semibold text-slate-900">Hydrogen Nexus App</h1>
      <p className="text-slate-600 mt-1 text-sm">
        Issue, trade, and manage green hydrogen credits with Proof-of-Green, DAO, and regulator-ready transparency.
      </p>
      <div className="mt-3 inline-flex items-center gap-2 rounded-md bg-emerald-50 px-3 py-2 text-emerald-800 text-sm">
        Connected Blockchain: {process.env.RPC_URL ? "Ethereum RPC configured" : "In-memory ledger (demo)"}
      </div>
    </section>
  )
}
