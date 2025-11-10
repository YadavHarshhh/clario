"use client"

import { useEffect, useMemo, useState } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { ProductCard } from "@/components/product-card"
import { products } from "@/lib/products"
import { useParams } from "next/navigation"

export default function ProductDetailPage() {
  const params = useParams()
  const productId = Number(params.id)

  const [product, setProduct] = useState<any | null>(null)
  const [relatedProducts, setRelatedProducts] = useState<any[]>([])

  useEffect(() => {
    let mounted = true
    async function load() {
      try {
        const r = await fetch(`http://localhost:4000/api/products/${productId}`)
        if (!r.ok) throw new Error('not found')
        const p = await r.json()
        if (!mounted) return
        setProduct(p)
        // load related by category
        if (p?.category) {
          const rel = await fetch(`http://localhost:4000/api/products?category=${encodeURIComponent(p.category)}&pageSize=4`)
          const relJson = await rel.json()
          const items = Array.isArray(relJson?.data) ? relJson.data.filter((x:any)=>x.id !== p.id).slice(0,4) : []
          if (mounted) setRelatedProducts(items)
        }
      } catch {
        if (mounted) setProduct(null)
      }
    }
    load()
    return () => { mounted = false }
  }, [productId])

  // keep aiAnalysis memoized

  const aiAnalysis = useMemo(() => {
    if (!product) return null
    return {
      ingredientScore: Math.min(95, 60 + product.ingredients.length * 5),
      safetyRating: Math.min(100, 75 + Math.random() * 20),
      efficacy: Math.min(100, 70 + product.rating * 5),
      ingredientBreakdown: product.ingredients.map((ing, idx) => ({
        name: ing,
        benefit: [
          "Antioxidant protection",
          "Deep moisturizing",
          "Natural cleansing",
          "Anti-inflammatory",
          "Brightening effect",
          "Soothing properties",
        ][idx % 6],
      })),
      recommendations: [
        `Ideal for ${product.skinTypes?.[0] ? product.skinTypes[0].charAt(0).toUpperCase() + product.skinTypes[0].slice(1) : "all"} skin types`,
        `Best used for addressing ${product.concerns?.[0] ? product.concerns[0].replace("-", " ") : "skin concerns"}`,
        `Contains ${product.ingredients.length} natural ingredients`,
        `Rated ${product.rating}/5 by ${product.reviews} users`,
      ],
    }
  }, [product])

  if (!product) {
    return (
      <main className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-6xl mx-auto px-4 py-20 text-center">
          <h1 className="text-3xl font-bold text-foreground mb-4">Product Not Found</h1>
          <p className="text-muted-foreground mb-6">The product you're looking for doesn't exist.</p>
          <Link href="/products">
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90"
            >
              Back to Products
            </motion.button>
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      {/* Breadcrumb */}
      <div className="border-b border-border">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-primary transition">
              Home
            </Link>
            <span>/</span>
            <Link href="/products" className="hover:text-primary transition">
              Search Products
            </Link>
            <span>/</span>
            <span className="text-foreground">{product.name}</span>
          </div>
        </div>
      </div>

      {/* Product Detail */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Product Image */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-center justify-center"
            >
              <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-muted">
                <Image
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute top-6 right-6 bg-primary text-primary-foreground px-4 py-2 rounded-full font-semibold">
                  ★ {product.rating}
                </div>
              </div>
            </motion.div>

            {/* Product Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              {/* Brand & Category */}
              <div>
                <p className="text-sm text-muted-foreground uppercase tracking-wider font-semibold mb-2">
                  {product.brand}
                </p>
                <h1 className="text-4xl font-bold text-foreground mb-2">{product.name}</h1>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-semibold text-foreground">★ {product.rating}</span>
                    <span className="text-muted-foreground">({product.reviews} reviews)</span>
                  </div>
                  <span className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm font-semibold">
                    {product.category}
                  </span>
                </div>
              </div>

              {/* Description */}
              <p className="text-lg text-muted-foreground leading-relaxed">{product.description}</p>

              {/* Price & Purchase */}
              <div className="border-t border-b border-border py-6">
                <p className="text-sm text-muted-foreground mb-2">Price</p>
                <div className="flex items-baseline gap-4 mb-6">
                  <span className="text-4xl font-bold text-primary">₹{product.price}</span>
                  <span className="text-muted-foreground line-through">₹{Math.round(product.price * 1.2)}</span>
                </div>
                <a href="https://example.com/products" target="_blank" rel="noopener noreferrer">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-3 bg-accent text-accent-foreground rounded-lg font-semibold hover:bg-accent/90 transition"
                  >
                    Buy Now
                  </motion.button>
                </a>
              </div>

              {/* Skin Type & Concerns */}
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-foreground mb-3">Suitable For</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.skinTypes?.map((type) => (
                      <span key={type} className="px-3 py-1 bg-accent/20 text-accent rounded-full text-sm capitalize">
                        {type === "all" ? "All Skin Types" : type.charAt(0).toUpperCase() + type.slice(1)}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-3">Addresses</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.concerns?.map((concern) => (
                      <span
                        key={concern}
                        className="px-3 py-1 bg-primary/20 text-primary rounded-full text-sm capitalize"
                      >
                        {concern.replace("-", " ")}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Key Benefits */}
              <div className="bg-secondary/30 rounded-xl p-6 space-y-3 border border-border">
                <h3 className="font-semibold text-foreground mb-4">Key Benefits</h3>
                <div className="space-y-2 text-sm text-muted-foreground">
                  {product.benefits?.map((benefit) => (
                    <div key={benefit} className="flex gap-2">
                      <span className="text-primary font-bold">✓</span>
                      <span>{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {aiAnalysis && (
        <section className="py-20 px-4 bg-gradient-to-r from-primary/5 to-accent/5 border-y border-border">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="mb-12"
            >
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">🤖</span>
                <h2 className="text-4xl font-bold text-foreground">AI Analysis</h2>
              </div>
              <p className="text-muted-foreground text-lg">
                Deep dive into this product's ingredients, benefits, and suitability for your skin
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              {/* Score Cards */}
              {[
                { label: "Ingredient Quality", value: aiAnalysis.ingredientScore, icon: "🧪" },
                { label: "Safety Rating", value: aiAnalysis.safetyRating, icon: "✅" },
                { label: "Efficacy", value: aiAnalysis.efficacy, icon: "⭐" },
              ].map((card, idx) => (
                <motion.div
                  key={card.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-card rounded-xl border border-border p-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-foreground">{card.label}</h3>
                    <span className="text-2xl">{card.icon}</span>
                  </div>
                  <div className="relative h-2 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${card.value}%` }}
                      transition={{ duration: 1, delay: 0.3 }}
                      viewport={{ once: true }}
                      className="h-full bg-gradient-to-r from-primary to-accent"
                    />
                  </div>
                  <p className="text-right mt-3 font-bold text-lg text-primary">{card.value.toFixed(0)}%</p>
                </motion.div>
              ))}
            </div>

            {/* Ingredients Breakdown */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="mb-12"
            >
              <h3 className="text-2xl font-bold text-foreground mb-6">Ingredient Breakdown</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {aiAnalysis.ingredientBreakdown.map((ing, idx) => (
                  <motion.div
                    key={ing.name}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: idx * 0.05 }}
                    viewport={{ once: true }}
                    className="bg-card rounded-lg border border-border p-4 hover:border-primary/50 transition"
                  >
                    <h4 className="font-semibold text-foreground capitalize mb-1">{ing.name}</h4>
                    <p className="text-sm text-muted-foreground">{ing.benefit}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* AI Recommendations */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
              className="bg-card rounded-xl border border-border p-8"
            >
              <h3 className="text-2xl font-bold text-foreground mb-6">AI Recommendations</h3>
              <div className="space-y-4">
                {aiAnalysis.recommendations.map((rec, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.4 + idx * 0.1 }}
                    viewport={{ once: true }}
                    className="flex gap-3 items-start"
                  >
                    <span className="text-primary font-bold text-xl mt-1">→</span>
                    <p className="text-muted-foreground">{rec}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="py-20 px-4 bg-secondary/20">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-bold text-foreground mb-4">Related Products</h2>
              <p className="text-muted-foreground text-lg">Similar items from the {product.category} category</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {relatedProducts.map((relatedProduct, index) => (
                <motion.div
                  key={relatedProduct.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <ProductCard {...relatedProduct} />
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      )}

      <footer className="bg-card border-t border-border py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-bold text-lg mb-4">Clario AI</h3>
              <p className="text-muted-foreground text-sm">AI-powered skincare product analyzer</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Explore</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/products" className="hover:text-primary transition">
                    Search Products
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
              </ul>
            </div>
          </div>
          <div className="border-t border-border pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2025 Clario AI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  )
}
