"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
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

  return (
    <header className="top-0 z-50 w-full border-b border-white/10 bg-black">
      <div className="container mx-auto flex h-24 items-center justify-between px-4">
        <Link href="/" className="transition-opacity hover:opacity-90">
          <Logo />
        </Link>

        <NavigationMenu>
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
      </div>
    </header>
  )
}
