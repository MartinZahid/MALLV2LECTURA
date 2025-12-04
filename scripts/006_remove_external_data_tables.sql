-- Drop tables that store external data (products, services, availability)
-- These will be queried from external APIs instead

-- Drop service availability table
DROP TABLE IF EXISTS service_availability CASCADE;

-- Drop services table
DROP TABLE IF EXISTS services CASCADE;

-- Drop products table
DROP TABLE IF EXISTS products CASCADE;

-- Note: We keep order_items and appointments tables because they store
-- historical snapshots of products/services at the time of purchase/booking
