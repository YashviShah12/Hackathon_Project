import { TopNav } from "@/components/nav"
import { Hero } from "@/components/sections/hero"
import { Features } from "@/components/sections/features"
import { HowItWorks } from "@/components/sections/how-it-works"

export default function Page() {
  return (
    <main className="font-sans">
      <TopNav />
      <Hero />
      <Features />
      <HowItWorks />
      <footer className="border-t">
        <div className="mx-auto max-w-6xl px-4 py-8 text-sm text-slate-600">
          © 2025 Hydrogen Nexus — Team NexTech • Built for HackOut’25
        </div>
      </footer>
    </main>
  )
}
