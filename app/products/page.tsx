"use client"

import type React from "react"

import { useEffect, useMemo, useState } from "react"
import { motion } from "framer-motion"
import { Navbar } from "@/components/navbar"
import Link from "next/link"
import { products } from "@/lib/products"

type SortOption = "popular" | "price-low" | "price-high" | "rating" | "newest"

export default function ProductsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<SortOption>("popular")
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 2000])
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const [items, setItems] = useState<typeof products>([])
  const categories = useMemo(() => {
    const cats = Array.from(new Set(items.map((p) => p.category)))
    return cats.sort()
  }, [items])

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let result = [...items]

    // Filter by category
    if (selectedCategory) {
      result = result.filter((p) => p.category === selectedCategory)
    }

    // Filter by price range
    result = result.filter((p) => p.price >= priceRange[0] && p.price <= priceRange[1])

    // Search products based on query
    const query = searchQuery.toLowerCase()
    result = result.filter((product) => {
      const name = (product.name || '').toLowerCase()
      const brand = (product.brand || '').toLowerCase()
      const category = (product.category || '').toLowerCase()
      const desc = (product.description || '').toLowerCase()
      const ingredients = (product.ingredients || []).map((ing:any) => (ing || '').toLowerCase())
      return (
        name.includes(query) ||
        brand.includes(query) ||
        category.includes(query) ||
        ingredients.some((ing:string) => ing.includes(query)) ||
        desc.includes(query)
      )
    })

    // Sort
    switch (sortBy) {
      case "price-low":
        result.sort((a, b) => a.price - b.price)
        break
      case "price-high":
        result.sort((a, b) => b.price - a.price)
        break
      case "rating":
        result.sort((a, b) => b.rating - a.rating)
        break
      case "newest":
        result.reverse()
        break
      case "popular":
      default:
        result.sort((a, b) => b.reviews - a.reviews)
        break
    }

    return result
  }, [items, selectedCategory, sortBy, priceRange, searchQuery])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
  }

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const params = new URLSearchParams()
      if (searchQuery.trim()) params.set('search', searchQuery.trim())
      if (selectedCategory) params.set('category', selectedCategory)
      params.set('pageSize', '100')
      const resp = await fetch(`http://localhost:4000/api/products?${params.toString()}`)
      const data = await resp.json()
      const list = Array.isArray(data?.data) ? data.data : []
      setItems(list as any)
    } catch (e) {
      console.error(e)
      setItems([] as any)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    // initial load: fetch a page of products
    ;(async () => {
      try {
        setIsLoading(true)
        const resp = await fetch(`http://localhost:4000/api/products?pageSize=100`)
        const data = await resp.json()
        const list = Array.isArray(data?.data) ? data.data : []
        setItems(list as any)
      } catch (e) {
        console.error(e)
        setItems([] as any)
      } finally {
        setIsLoading(false)
      }
    })()
  }, [])

  useEffect(() => {
    // auto-fetch when category changes
    ;(async () => {
      try {
        setIsLoading(true)
        const params = new URLSearchParams()
        if (selectedCategory) params.set('category', selectedCategory)
        if (searchQuery.trim()) params.set('search', searchQuery.trim())
        params.set('pageSize', '100')
        const resp = await fetch(`http://localhost:4000/api/products?${params.toString()}`)
        const data = await resp.json()
        const list = Array.isArray(data?.data) ? data.data : []
        setItems(list as any)
      } catch (e) {
        console.error(e)
        setItems([] as any)
      } finally {
        setIsLoading(false)
      }
    })()
  }, [selectedCategory])

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="py-16 px-4 border-b border-border bg-gradient-to-b from-primary/5 to-transparent">
        <div className="max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-3 text-center">Search Products</h1>
            <p className="text-lg text-muted-foreground text-center mb-8">
              Find skincare products by name, brand, ingredients, or concerns
            </p>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="relative">
              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder="Search by product name, brand, or ingredients..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 px-6 py-4 rounded-lg border-2 border-border bg-card text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none transition"
                />
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isLoading}
                  className="px-8 py-4 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition disabled:opacity-50"
                >
                  {isLoading ? "Searching..." : "Search"}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <motion.aside
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:sticky lg:top-20 h-fit"
          >
            <div className="bg-card rounded-xl border border-border p-6 space-y-6">
              {/* Category Filter */}
              <div>
                <h3 className="font-semibold text-foreground mb-4">Categories</h3>
                <div className="space-y-2">
                  <motion.button
                    whileHover={{ x: 4 }}
                    onClick={() => setSelectedCategory(null)}
                    className={`block w-full text-left px-3 py-2 rounded-lg transition ${
                      selectedCategory === null
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    }`}
                  >
                    All Products
                  </motion.button>
                  {categories.map((category) => (
                    <motion.button
                      key={category}
                      whileHover={{ x: 4 }}
                      onClick={() => setSelectedCategory(category)}
                      className={`block w-full text-left px-3 py-2 rounded-lg transition ${
                        selectedCategory === category
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted"
                      }`}
                    >
                      {category}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Sort Filter */}
              <div className="border-t border-border pt-6">
                <h3 className="font-semibold text-foreground mb-4">Sort By</h3>
                <div className="space-y-2">
                  {[
                    { value: "popular", label: "Most Popular" },
                    { value: "price-low", label: "Price: Low to High" },
                    { value: "price-high", label: "Price: High to Low" },
                    { value: "rating", label: "Highest Rated" },
                  ].map((option) => (
                    <motion.button
                      key={option.value}
                      whileHover={{ x: 4 }}
                      onClick={() => setSortBy(option.value as SortOption)}
                      className={`block w-full text-left px-3 py-2 rounded-lg transition ${
                        sortBy === option.value
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted"
                      }`}
                    >
                      {option.label}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Price Range Filter */}
              <div className="border-t border-border pt-6">
                <h3 className="font-semibold text-foreground mb-4">Price Range</h3>
                <div className="space-y-4">
                  <input
                    type="range"
                    min="0"
                    max="2000"
                    step="50"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                    className="w-full cursor-pointer"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>₹{priceRange[0]}</span>
                    <span>₹{priceRange[1]}</span>
                  </div>
                </div>
              </div>

              {/* Clear Filters */}
              {(selectedCategory !== null ||
                sortBy !== "popular" ||
                priceRange[1] !== 2000 ||
                searchQuery.trim() !== "") && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setSelectedCategory(null)
                    setSortBy("popular")
                    setPriceRange([0, 2000])
                    setSearchQuery("")
                  }}
                  className="w-full py-2 rounded-lg bg-accent/20 text-accent hover:bg-accent/30 transition font-semibold text-sm"
                >
                  Clear All Filters
                </motion.button>
              )}
            </div>
          </motion.aside>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            {/* Results Header */}
            {searchQuery.trim() === "" ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
                <div className="text-6xl mb-4">🔍</div>
                <p className="text-xl text-muted-foreground mb-2">Start your search</p>
                <p className="text-sm text-muted-foreground">
                  Enter a product name, brand, or ingredient to get started
                </p>
              </motion.div>
            ) : filteredProducts.length === 0 ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
                <div className="text-6xl mb-4">❌</div>
                <p className="text-xl text-muted-foreground mb-2">No products found</p>
                <p className="text-sm text-muted-foreground">Try searching with different keywords</p>
              </motion.div>
            ) : (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="mb-8 flex justify-between items-center"
                >
                  <p className="text-muted-foreground">
                    Found <span className="font-semibold text-foreground">{filteredProducts.length}</span> product
                    {filteredProducts.length !== 1 ? "s" : ""}
                  </p>
                </motion.div>

                {/* Products */}
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {filteredProducts.map((product) => (
                    <motion.div key={product.id} variants={itemVariants}>
                      <Link href={`/product/${product.id}`}>
                        <motion.div
                          whileHover={{ y: -8, transition: { duration: 0.2 } }}
                          className="h-full bg-card rounded-xl border border-border overflow-hidden hover:border-primary/50 transition cursor-pointer"
                        >
                          {/* Product Image */}
                          <div className="relative w-full h-48 bg-muted overflow-hidden">
                            <img
                              src={product.image || "/placeholder.svg"}
                              alt={product.name}
                              className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                            />
                          </div>

                          {/* Product Info */}
                          <div className="p-5">
                            <p className="text-xs font-semibold text-accent uppercase tracking-wider mb-2">
                              {product.category}
                            </p>
                            <h3 className="font-bold text-foreground mb-1 line-clamp-2">{product.name}</h3>
                            <p className="text-sm text-muted-foreground mb-4">{product.brand}</p>

                            {/* Rating */}
                            <div className="flex items-center gap-2 mb-4">
                              <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                  <span
                                    key={i}
                                    className={`text-lg ${i < Math.round(product.rating) ? "text-accent" : "text-muted"}`}
                                  >
                                    ★
                                  </span>
                                ))}
                              </div>
                              <span className="text-xs text-muted-foreground">
                                {product.rating} ({product.reviews})
                              </span>
                            </div>

                            {/* Price and CTA */}
                            <div className="flex justify-between items-center">
                              <span className="text-lg font-bold text-primary">₹{product.price}</span>
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:bg-primary/90 transition"
                              >
                                Analyze
                              </motion.button>
                            </div>
                          </div>
                        </motion.div>
                      </Link>
                    </motion.div>
                  ))}
                </motion.div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-12 px-4 mt-20">
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
