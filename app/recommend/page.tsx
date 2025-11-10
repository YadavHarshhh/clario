"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Navbar } from "@/components/navbar"
import { RecommendationForm, type UserPreferences } from "@/components/recommendation-form"
import { RecommendationResults } from "@/components/recommendation-results"
import { products } from "@/lib/products"
import Link from "next/link"

export default function RecommendationPage() {
  const [showResults, setShowResults] = useState(false)
  const [recommendations, setRecommendations] = useState<typeof products>([])
  const [userProfile, setUserProfile] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const getRecommendations = async (preferences: UserPreferences) => {
    setIsLoading(true)
    try {
      const resp = await fetch("http://localhost:4000/api/recommendations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          skinType: preferences.skinType,
          concerns: preferences.concerns,
          hasAllergies: preferences.hasAllergies,
          allergies: preferences.allergies,
          productPreference: preferences.productPreference,
          limit: 8,
        }),
      })
      const data = await resp.json()
      const recs = Array.isArray(data?.data) ? data.data : []
      const profile = `Based on your ${preferences.skinType} skin and concerns with ${preferences.concerns.join(", ")}, here are our top picks.`
      setRecommendations(recs as any)
      setUserProfile(profile)
      setShowResults(true)
    } catch (e) {
      console.error(e)
      setRecommendations([])
      setShowResults(true)
    } finally {
      setIsLoading(false)
    }
  }

  const handleReset = () => {
    setShowResults(false)
    setRecommendations([])
    setUserProfile("")
  }

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-20 px-4">
        {/* Background Pattern */}
        <div className="absolute inset-0 -z-10">
          <motion.div
            className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl"
            animate={{
              y: [0, 50, 0],
              x: [0, 30, 0],
            }}
            transition={{
              duration: 8,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          />
        </div>

        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-center mb-12"
          >
            <h1 className="text-5xl md:text-5xl font-bold text-foreground mb-6 text-balance">
              Find Your Perfect <span className="text-primary">Skincare</span> Match
            </h1>
            <p className="text-xl text-muted-foreground max-w-xl mx-auto leading-relaxed text-balance">
              Answer a few simple questions about your skin, and our AI will recommend the perfect products tailored
              just for you.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 px-4">
        <div className="max-w-2xl mx-auto">
          {!showResults ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-card border border-border rounded-2xl p-8"
            >
              <RecommendationForm onSubmit={getRecommendations} isLoading={isLoading} />
            </motion.div>
          ) : recommendations.length > 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-12"
            >
              <RecommendationResults
                recommendations={recommendations}
                userProfile={userProfile}
                onReset={handleReset}
              />
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center py-12"
            >
              <h2 className="text-2xl font-bold text-foreground mb-4">No Recommendations Found</h2>
              <p className="text-muted-foreground mb-6">
                We couldn't find products that match all your preferences. Try adjusting your selections.
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleReset}
                className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition"
              >
                Start Over
              </motion.button>
            </motion.div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      {!showResults && (
        <section className="py-16 px-4 bg-gradient-to-b from-secondary/20 to-transparent">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <h2 className="text-3xl font-bold text-foreground">Explore All Products</h2>
              <p className="text-lg text-muted-foreground">
                Browse our complete collection of premium Indian skincare products
              </p>
              <Link href="/products">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition"
                >
                  View All Products
                </motion.button>
              </Link>
            </motion.div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="bg-card border-t border-border py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-bold text-lg mb-4">Clario</h3>
              <p className="text-muted-foreground text-sm">Luxury Indian skincare products for your natural beauty.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Explore</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/products" className="hover:text-primary transition">
                    Products
                  </Link>
                </li>
                <li>
                  <Link href="/recommend" className="hover:text-primary transition">
                    Get Recommendations
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/about" className="hover:text-primary transition">
                    About
                  </Link>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Connect</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-primary transition">
                    Instagram
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition">
                    Twitter
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2025 Clario. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  )
}
