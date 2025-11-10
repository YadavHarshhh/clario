"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { useState } from "react"

export function Navbar() {
  const [isHovered, setIsHovered] = useState<string | null>(null)

  const links = [
    { href: "/", label: "Home" },
    { href: "/products", label: "Search Products" }, // renamed from "Products" to "Search Products"
    { href: "/recommend", label: "Get Recommendations" },

  ]

  return (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
            <Link href="/" className="text-2xl font-bold text-primary hover:text-primary/80 transition">
              Clario
            </Link>
          </motion.div>

          {/* Navigation Links */}
          <div className="hidden md:flex gap-8">
            {links.map((link, index) => (
              <motion.div
                key={link.href}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link
                  href={link.href}
                  className="relative text-foreground hover:text-primary transition-colors"
                  onMouseEnter={() => setIsHovered(link.href)}
                  onMouseLeave={() => setIsHovered(null)}
                >
                  {link.label}
                  {isHovered === link.href && (
                    <motion.div
                      layoutId="navbar-highlight"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                  )}
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="md:hidden p-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </motion.button>
        </div>
      </div>
    </nav>
  )
}
