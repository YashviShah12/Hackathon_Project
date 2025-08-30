"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

const links = [
  { href: "/", label: "Home" },
  { href: "/dashboard", label: "App" },
]

export function TopNav() {
  const pathname = usePathname()
  return (
    <header className="border-b bg-white/60 backdrop-blur supports-[backdrop-filter]:bg-white/50 sticky top-0 z-40">
      <div className="mx-auto max-w-6xl px-4 h-14 flex items-center justify-between">
        <Link href="/" className="font-semibold text-emerald-600">
          Hydrogen Nexus
        </Link>
        <nav className="flex items-center gap-4">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn("text-sm text-slate-600 hover:text-slate-900", pathname === l.href && "text-slate-900")}
            >
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  )
}
