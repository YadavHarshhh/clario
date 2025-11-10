CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  brand TEXT NOT NULL,
  price INTEGER NOT NULL DEFAULT 0,
  image TEXT,
  category TEXT NOT NULL,
  rating NUMERIC(2,1) NOT NULL DEFAULT 0,
  reviews INTEGER NOT NULL DEFAULT 0,
  description TEXT,
  skin_types TEXT[] NOT NULL DEFAULT '{}',
  concerns TEXT[] NOT NULL DEFAULT '{}',
  ingredients TEXT[] NOT NULL DEFAULT '{}',
  benefits TEXT[] NOT NULL DEFAULT '{}',
  is_natural BOOLEAN NOT NULL DEFAULT false,
  is_chemical_free BOOLEAN NOT NULL DEFAULT false,
  product_url TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  skin_type TEXT NOT NULL,
  concerns TEXT[] NOT NULL DEFAULT '{}',
  has_allergies BOOLEAN NOT NULL DEFAULT false,
  allergies TEXT,
  product_preference TEXT NOT NULL DEFAULT 'all',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_products_brand ON products (brand);
CREATE INDEX IF NOT EXISTS idx_products_category ON products (category);
CREATE INDEX IF NOT EXISTS idx_products_price ON products (price);
CREATE INDEX IF NOT EXISTS idx_products_rating ON products (rating DESC);
CREATE INDEX IF NOT EXISTS idx_products_skin_types ON products USING GIN (skin_types);
CREATE INDEX IF NOT EXISTS idx_products_concerns ON products USING GIN (concerns);
CREATE INDEX IF NOT EXISTS idx_products_ingredients ON products USING GIN (ingredients);


