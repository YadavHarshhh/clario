"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"

interface RecommendationFormProps {
  onSubmit: (preferences: UserPreferences) => void
  isLoading?: boolean
}

export interface UserPreferences {
  skinType: string
  concerns: string[]
  hasAllergies: boolean
  allergies: string
  productPreference: string
}

export function RecommendationForm({ onSubmit, isLoading }: RecommendationFormProps) {
  const [preferences, setPreferences] = useState<UserPreferences>({
    skinType: "",
    concerns: [],
    hasAllergies: false,
    allergies: "",
    productPreference: "all",
  })

  const handleSkinTypeChange = (value: string) => {
    setPreferences({ ...preferences, skinType: value })
  }

  const handleConcernChange = (concern: string) => {
    setPreferences((prev) => {
      const newConcerns = prev.concerns.includes(concern)
        ? prev.concerns.filter((c) => c !== concern)
        : [...prev.concerns, concern]
      return { ...prev, concerns: newConcerns }
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!preferences.skinType || preferences.concerns.length === 0) {
      alert("Please select a skin type and at least one concern")
      return
    }
    onSubmit(preferences)
  }

  const skinTypes = [
    { id: "dry", label: "Dry" },
    { id: "oily", label: "Oily" },
    { id: "combination", label: "Combination" },
    { id: "sensitive", label: "Sensitive" },
    { id: "mature", label: "Mature" },
  ]

  const concernsList = [
    { id: "acne", label: "Acne & Breakouts" },
    { id: "hydration", label: "Dryness & Dehydration" },
    { id: "anti-aging", label: "Anti-Aging & Wrinkles" },
    { id: "brightening", label: "Dull Skin & Brightening" },
    { id: "sensitivity", label: "Sensitivity & Irritation" },
    { id: "oiliness", label: "Oiliness" },
    { id: "pores", label: "Large Pores" },
    { id: "glow", label: "Radiance & Glow" },
  ]

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Skin Type */}
      <div>
        <label className="block text-lg font-semibold text-foreground mb-4">What is your skin type?</label>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {skinTypes.map((type) => (
            <motion.button
              key={type.id}
              type="button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleSkinTypeChange(type.id)}
              className={`p-3 rounded-lg font-semibold transition-all border-2 ${
                preferences.skinType === type.id
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-card text-foreground border-border hover:border-primary"
              }`}
            >
              {type.label}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Skin Concerns */}
      <div>
        <label className="block text-lg font-semibold text-foreground mb-4">
          What are your main skin concerns? (Select all that apply)
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {concernsList.map((concern) => (
            <motion.label
              key={concern.id}
              whileHover={{ x: 4 }}
              className={`p-4 rounded-lg border-2 cursor-pointer transition-all flex items-center gap-3 ${
                preferences.concerns.includes(concern.id)
                  ? "bg-accent/20 border-accent"
                  : "bg-card border-border hover:border-accent/50"
              }`}
            >
              <input
                type="checkbox"
                checked={preferences.concerns.includes(concern.id)}
                onChange={() => handleConcernChange(concern.id)}
                className="w-5 h-5 rounded"
              />
              <span className="font-medium text-foreground">{concern.label}</span>
            </motion.label>
          ))}
        </div>
      </div>

      {/* Allergies */}
      <div>
        <label className="flex items-center gap-3 mb-4 cursor-pointer">
          <input
            type="checkbox"
            checked={preferences.hasAllergies}
            onChange={(e) => setPreferences({ ...preferences, hasAllergies: e.target.checked })}
            className="w-5 h-5 rounded"
          />
          <span className="text-lg font-semibold text-foreground">I have ingredient allergies or sensitivities</span>
        </label>
        {preferences.hasAllergies && (
          <motion.input
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            type="text"
            placeholder="e.g., parabens, sulfates, fragrance..."
            value={preferences.allergies}
            onChange={(e) => setPreferences({ ...preferences, allergies: e.target.value })}
            className="w-full px-4 py-3 rounded-lg border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        )}
      </div>

      {/* Product Preference */}
      <div>
        <label className="block text-lg font-semibold text-foreground mb-4">Product Preference</label>
        <div className="space-y-2">
          {[
            { value: "all", label: "All products" },
            { value: "natural", label: "Natural/Organic only" },
            { value: "chemical-free", label: "Chemical-free formulations" },
          ].map((option) => (
            <motion.label
              key={option.value}
              whileHover={{ x: 4 }}
              className="flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-secondary transition-colors"
            >
              <input
                type="radio"
                name="preference"
                value={option.value}
                checked={preferences.productPreference === option.value}
                onChange={(e) => setPreferences({ ...preferences, productPreference: e.target.value })}
                className="w-5 h-5"
              />
              <span className="font-medium text-foreground">{option.label}</span>
            </motion.label>
          ))}
        </div>
      </div>

      {/* Submit Button */}
      <motion.button
        type="submit"
        disabled={isLoading}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full py-4 bg-primary text-primary-foreground rounded-lg font-semibold text-lg hover:bg-primary/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? "Getting Recommendations..." : "Get My Personalized Recommendations"}
      </motion.button>
    </form>
  )
}
