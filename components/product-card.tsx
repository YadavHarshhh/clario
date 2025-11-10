"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"

interface ProductCardProps {
  id: number
  name: string
  brand: string
  price: number
  image: string
  rating: number
  reviews: number
}

export function ProductCard({ id, name, brand, price, image, rating, reviews }: ProductCardProps) {
  return (
    <motion.div whileHover={{ y: -8 }} transition={{ duration: 0.3 }}>
      <Link href={`/product/${id}`}>
        <div className="rounded-2xl overflow-hidden bg-card border border-border hover:shadow-xl transition-shadow cursor-pointer group">
          {/* Image Container */}
          <div className="relative overflow-hidden h-64 bg-muted">
            <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.4 }} className="w-full h-full">
              <Image src={image || "/placeholder.svg"} alt={name} fill className="object-cover" />
            </motion.div>
            {/* Rating Badge */}
            <div className="absolute top-3 right-3 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-semibold backdrop-blur-sm bg-opacity-90">
              ★ {rating}
            </div>
          </div>

          {/* Content */}
          <div className="p-4">
            <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">{brand}</p>
            <h3 className="text-lg font-semibold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition">
              {name}
            </h3>

            {/* Rating and Reviews */}
            <div className="flex items-center gap-1 mb-3">
              <span className="text-sm text-muted-foreground">({reviews} reviews)</span>
            </div>

            {/* Price */}
            <div className="flex justify-between items-center">
              <span className="text-2xl font-bold text-primary">₹{price}</span>
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="text-muted-foreground group-hover:text-primary transition"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </motion.div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
