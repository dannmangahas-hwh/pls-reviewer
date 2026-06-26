"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"
import { cn } from "@workspace/ui/lib/utils"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@workspace/ui/components/navigation-menu"
import { Logo } from "./logo"

const navItems = [
  { label: "HOME", href: "/" },
  { label: "SUBJECTS", href: "/subjects" },
  { label: "PAST EXAMS", href: "/past-exams" },
  { label: "QUIZ", href: "/quiz" },
]

export function Navbar() {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  const isSubjects = pathname === "/subjects"

  return (
    <header
      className={cn(
        "top-0 z-50 w-full border-b border-white/10 transition-colors",
        isSubjects ? "absolute bg-[#0645a8]/90" : "relative bg-[#0645a8]"
      )}
    >
      {/* Philippine star — desktop only */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 opacity-15 md:block">
        <Image
          src="/philippine-star.png"
          alt=""
          width={220}
          height={220}
          className="max-w-none"
          priority
        />
      </div>

      {/* Main bar */}
      <div className="container relative mx-auto flex h-16 md:h-24 items-center justify-between px-4">
        <Link href="/" className="transition-opacity hover:opacity-90">
          <Logo />
        </Link>

        {/* Desktop nav */}
        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList className="gap-8">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <NavigationMenuItem key={item.href}>
                  <NavigationMenuLink
                    href={item.href}
                    data-active={isActive}
                    className={cn(
                      "bg-transparent p-0 text-sm font-bold tracking-widest transition-colors hover:bg-transparent",
                      isActive ? "text-gold" : "text-white hover:text-gold/80"
                    )}
                  >
                    {item.label}
                  </NavigationMenuLink>
                </NavigationMenuItem>
              )
            })}
          </NavigationMenuList>
        </NavigationMenu>

        {/* Mobile hamburger button */}
        <button
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((prev) => !prev)}
          className="relative flex h-8 w-8 flex-col items-center justify-center gap-0 md:hidden focus:outline-none"
        >
          {/* Top bar */}
          <span
            className={cn(
              "block h-0.5 w-6 rounded-full bg-white transition-all duration-300 ease-in-out",
              menuOpen ? "translate-y-[5px] rotate-45" : "-translate-y-[4px]"
            )}
          />
          {/* Middle bar */}
          <span
            className={cn(
              "block h-0.5 w-6 rounded-full bg-white transition-all duration-300 ease-in-out",
              menuOpen ? "scale-x-0 opacity-0" : "scale-x-100 opacity-100"
            )}
          />
          {/* Bottom bar */}
          <span
            className={cn(
              "block h-0.5 w-6 rounded-full bg-white transition-all duration-300 ease-in-out",
              menuOpen ? "-translate-y-[5px] -rotate-45" : "translate-y-[4px]"
            )}
          />
        </button>
      </div>

      {/* Mobile dropdown menu */}
      <div
        className={cn(
          "overflow-hidden transition-all duration-300 ease-in-out md:hidden",
          isSubjects ? "bg-[#0645a8]/90" : "bg-[#0645a8]",
          menuOpen ? "max-h-64 border-t border-white/10" : "max-h-0"
        )}
      >
        <nav className="container mx-auto flex flex-col px-4 py-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "py-3 text-[11px] font-bold tracking-[0.25em] transition-colors border-b border-white/10 last:border-0",
                  isActive ? "text-gold" : "text-white hover:text-gold/80"
                )}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>
      </div>
    </header>
  )
}
