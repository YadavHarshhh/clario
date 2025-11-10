"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { ProductCard } from "./product-card"

interface RecommendationResultsProps {
  recommendations: Array<any>
  userProfile: string
  onReset: () => void
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
}

export function RecommendationResults({ recommendations, userProfile, onReset }: RecommendationResultsProps) {
  return (
    <div className="space-y-12">
      {/* Results Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <h2 className="text-4xl font-bold text-foreground mb-4">Your Personalized Recommendations</h2>
        <p className="text-lg text-muted-foreground mb-6">{userProfile}</p>
        <div className="flex justify-center gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onReset}
            className="px-6 py-2 border-2 border-primary text-primary rounded-lg font-semibold hover:bg-primary/10 transition"
          >
            Try Again
          </motion.button>
          <Link href="/products">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-2 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition"
            >
              View All Products
            </motion.button>
          </Link>
        </div>
      </motion.div>

      {/* Products Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {recommendations.map((product) => (
          <motion.div key={product.id} variants={itemVariants}>
            <ProductCard {...product} />
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}
