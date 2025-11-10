"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Navbar } from "@/components/navbar"

export default function AboutPage() {
  const timelineEvents = [
    {
      year: "2020",
      title: "Our Journey Begins",
      description: "Clario was founded with a vision to bring authentic, luxury Indian skincare to the world.",
    },
    {
      year: "2021",
      title: "First Product Line Launch",
      description: "We introduced our signature collection inspired by Ayurvedic wisdom and modern science.",
    },
    {
      year: "2022",
      title: "Expanded Distribution",
      description: "Clario products reached customers across 15 countries with over 50,000 happy customers.",
    },
    {
      year: "2023",
      title: "Sustainability Initiative",
      description: "Launched eco-friendly packaging and committed to carbon-neutral operations by 2025.",
    },
    {
      year: "2024",
      title: "Global Recognition",
      description: "Awarded Best Natural Skincare Brand for our commitment to quality and sustainability.",
    },
  ]

  const values = [
    {
      icon: "🌿",
      title: "Natural Ingredients",
      description: "We source the finest natural ingredients from sustainable farms across India.",
    },
    {
      icon: "🔬",
      title: "Science-Backed",
      description: "Every product is formulated with rigorous scientific research and testing.",
    },
    {
      icon: "♻️",
      title: "Sustainable",
      description: "Eco-friendly packaging and ethical production practices are our commitment.",
    },
    {
      icon: "✨",
      title: "Quality First",
      description: "Premium formulations that deliver visible results without compromise.",
    },
  ]

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

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-32 px-4">
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

        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-center mb-8"
          >
            <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6 text-balance">Our Story</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed text-balance">
              Clario is dedicated to bringing the wisdom of ancient Ayurvedic traditions together with modern skincare
              science to create transformative beauty solutions.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 px-4 bg-gradient-to-b from-secondary/20 to-transparent">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Mission */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="bg-card rounded-2xl border border-border p-8 hover:shadow-lg transition"
            >
              <div className="text-4xl font-bold text-primary mb-4">Our Mission</div>
              <p className="text-muted-foreground leading-relaxed text-lg">
                To empower individuals with premium, naturally-derived skincare products that celebrate their natural
                beauty while honoring traditional Indian beauty wisdom and modern scientific innovation.
              </p>
            </motion.div>

            {/* Vision */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="bg-card rounded-2xl border border-border p-8 hover:shadow-lg transition"
            >
              <div className="text-4xl font-bold text-accent mb-4">Our Vision</div>
              <p className="text-muted-foreground leading-relaxed text-lg">
                To become the world's most trusted luxury Indian skincare brand by creating products that are
                environmentally sustainable, ethically produced, and scientifically proven to deliver exceptional
                results.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-foreground mb-4">Our Core Values</h2>
            <p className="text-muted-foreground text-lg">The principles that guide everything we do</p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {values.map((value, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="bg-card rounded-xl border border-border p-6 hover:shadow-lg transition text-center"
              >
                <div className="text-5xl mb-4">{value.icon}</div>
                <h3 className="text-xl font-semibold text-foreground mb-2">{value.title}</h3>
                <p className="text-muted-foreground text-sm">{value.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 px-4 bg-secondary/20">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-foreground mb-4">Our Journey</h2>
            <p className="text-muted-foreground text-lg">Key milestones in our growth and impact</p>
          </motion.div>

          {/* Timeline Items */}
          <div className="space-y-12">
            {timelineEvents.map((event, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="flex gap-8 items-start">
                  {/* Timeline marker */}
                  <div className="flex flex-col items-center flex-shrink-0">
                    <motion.div
                      whileHover={{ scale: 1.2 }}
                      className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm"
                    >
                      {event.year.slice(-2)}
                    </motion.div>
                    {index !== timelineEvents.length - 1 && (
                      <div className="w-1 h-24 bg-gradient-to-b from-primary to-primary/30 mt-4" />
                    )}
                  </div>

                  {/* Content */}
                  <motion.div
                    whileHover={{ x: 8 }}
                    className="bg-card rounded-xl border border-border p-6 flex-1 hover:shadow-lg transition"
                  >
                    <div className="text-sm font-semibold text-primary uppercase tracking-wider mb-2">{event.year}</div>
                    <h3 className="text-2xl font-bold text-foreground mb-2">{event.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{event.description}</p>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl border border-border p-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-foreground mb-4">Join Our Community</h2>
            <p className="text-lg text-muted-foreground mb-8 text-balance">
              Discover the transformative power of our luxury skincare products. Experience the difference that natural,
              science-backed formulations can make.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/products">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition"
                >
                  Explore Products
                </motion.button>
              </Link>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 border-2 border-primary text-primary rounded-lg font-semibold hover:bg-primary/5 transition"
              >
                Contact Us
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-12 px-4 mt-20">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-bold text-lg mb-4">Clario</h3>
              <p className="text-muted-foreground text-sm">Luxury Indian skincare products for your natural beauty.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Shop</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/products" className="hover:text-primary transition">
                    Products
                  </Link>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition">
                    New Arrivals
                  </a>
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
