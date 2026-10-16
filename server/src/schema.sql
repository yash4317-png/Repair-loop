CREATE TABLE IF NOT EXISTS shops (
  id VARCHAR(64) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  location VARCHAR(255) NOT NULL,
  area_name VARCHAR(255) NOT NULL,
  lat DECIMAL(10, 6) NOT NULL,
  lng DECIMAL(10, 6) NOT NULL,
  map_x INT NOT NULL,
  map_y INT NOT NULL,
  distance_km DECIMAL(6, 2) NOT NULL,
  travel_time_min INT NOT NULL,
  rating DECIMAL(3, 2) NOT NULL,
  specialties JSON NOT NULL,
  authorized_brands JSON NOT NULL,
  technician_capacity INT NOT NULL,
  active_jobs INT NOT NULL DEFAULT 0,
  labor_rate_per_hour DECIMAL(10, 2) NOT NULL,
  avatar_url MEDIUMTEXT,
  certifications JSON NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(64) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('customer', 'shopkeeper', 'admin') NOT NULL,
  shop_id VARCHAR(64) NULL,
  phone VARCHAR(64) NULL,
  avatar MEDIUMTEXT,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_users_shop FOREIGN KEY (shop_id) REFERENCES shops(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS technicians (
  id VARCHAR(64) PRIMARY KEY,
  shop_id VARCHAR(64) NOT NULL,
  name VARCHAR(255) NOT NULL,
  role_title VARCHAR(255) NOT NULL,
  avatar MEDIUMTEXT,
  certifications JSON NOT NULL,
  experience_years INT NOT NULL,
  rating DECIMAL(3, 2) NOT NULL,
  bench_device_id VARCHAR(64) NULL,
  bench_model VARCHAR(255) NULL,
  bench_task VARCHAR(255) NULL,
  bench_started_at VARCHAR(64) NULL,
  bench_est_min INT NULL,
  CONSTRAINT fk_tech_shop FOREIGN KEY (shop_id) REFERENCES shops(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS inventory_parts (
  id VARCHAR(64) PRIMARY KEY,
  shop_id VARCHAR(64) NOT NULL,
  sku VARCHAR(128) NOT NULL,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(64) NOT NULL,
  compatible_models JSON NOT NULL,
  quantity_in_stock INT NOT NULL DEFAULT 0,
  min_threshold INT NOT NULL DEFAULT 1,
  unit_cost DECIMAL(12, 2) NOT NULL,
  retail_price DECIMAL(12, 2) NOT NULL,
  part_condition VARCHAR(64) NOT NULL,
  last_restocked DATE NOT NULL,
  CONSTRAINT fk_inv_shop FOREIGN KEY (shop_id) REFERENCES shops(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS inspections (
  id VARCHAR(64) PRIMARY KEY,
  tracking_number VARCHAR(64) NOT NULL UNIQUE,
  customer_id VARCHAR(64) NOT NULL,
  customer_name VARCHAR(255) NOT NULL,
  customer_email VARCHAR(255) NOT NULL,
  category VARCHAR(64) NOT NULL,
  brand VARCHAR(128) NOT NULL,
  model VARCHAR(255) NOT NULL,
  specs JSON NOT NULL,
  age_months INT NOT NULL,
  purchase_year INT NOT NULL,
  condition_rating VARCHAR(32) NOT NULL,
  damages JSON NOT NULL,
  functional_checks JSON NOT NULL,
  photos JSON NOT NULL,
  notes TEXT,
  submitted_at DATETIME NOT NULL,
  status VARCHAR(64) NOT NULL,
  ai_valuation JSON NOT NULL,
  accepted_offer_id VARCHAR(64) NULL,
  assigned_technician_id VARCHAR(64) NULL,
  CONSTRAINT fk_insp_customer FOREIGN KEY (customer_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS offers (
  id VARCHAR(64) PRIMARY KEY,
  inspection_id VARCHAR(64) NOT NULL,
  shop_id VARCHAR(64) NOT NULL,
  shop_name VARCHAR(255) NOT NULL,
  shop_location VARCHAR(255) NOT NULL,
  shop_rating DECIMAL(3, 2) NOT NULL,
  disposition VARCHAR(64) NOT NULL,
  proposed_price DECIMAL(12, 2) NOT NULL,
  used_inventory_parts JSON NOT NULL,
  total_parts_cost DECIMAL(12, 2) NOT NULL,
  estimated_labor_hours DECIMAL(8, 2) NOT NULL,
  labor_rate_per_hour DECIMAL(10, 2) NOT NULL,
  total_labor_cost DECIMAL(12, 2) NOT NULL,
  projected_profit DECIMAL(12, 2) NOT NULL,
  profit_margin_percent DECIMAL(6, 2) NOT NULL,
  turnaround_days INT NOT NULL,
  warranty_months INT NOT NULL,
  notes TEXT,
  created_at DATETIME NOT NULL,
  status VARCHAR(32) NOT NULL,
  CONSTRAINT fk_offer_insp FOREIGN KEY (inspection_id) REFERENCES inspections(id) ON DELETE CASCADE,
  CONSTRAINT fk_offer_shop FOREIGN KEY (shop_id) REFERENCES shops(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS quick_requests (
  id VARCHAR(64) PRIMARY KEY,
  customer_id VARCHAR(64) NOT NULL,
  customer_name VARCHAR(255) NOT NULL,
  customer_email VARCHAR(255) NOT NULL,
  category VARCHAR(64) NOT NULL,
  brand VARCHAR(128) NOT NULL,
  model VARCHAR(255) NOT NULL,
  action VARCHAR(64) NOT NULL,
  estimated_payout DECIMAL(12, 2) NOT NULL,
  pickup_address TEXT NOT NULL,
  pickup_time_slot VARCHAR(128) NOT NULL,
  created_at DATETIME NOT NULL,
  status VARCHAR(32) NOT NULL,
  tracking_code VARCHAR(64) NOT NULL UNIQUE,
  CONSTRAINT fk_quick_customer FOREIGN KEY (customer_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
