-- Insert the 4 stores for Nexus Center
INSERT INTO stores (name, slug, description, type, category, image_url, api_endpoint) VALUES
(
  'Urban Style',
  'urban-style',
  'Tienda de ropa moderna y elegante para todas las ocasiones',
  'product',
  'clothing',
  '/placeholder.svg?height=400&width=600',
  '/api/stores/urban-style'
),
(
  'Café Nexus',
  'cafe-nexus',
  'Cafetería artesanal con las mejores bebidas y postres',
  'product',
  'cafeteria',
  '/placeholder.svg?height=400&width=600',
  '/api/stores/cafe-nexus'
),
(
  'Barber Studio',
  'barber-studio',
  'Barbería profesional con servicios de corte y estilo',
  'service',
  'barbershop',
  '/placeholder.svg?height=400&width=600',
  '/api/stores/barber-studio'
),
(
  'Zen Spa',
  'zen-spa',
  'Spa de relajación con tratamientos faciales y corporales',
  'service',
  'spa',
  '/placeholder.svg?height=400&width=600',
  '/api/stores/zen-spa'
);
