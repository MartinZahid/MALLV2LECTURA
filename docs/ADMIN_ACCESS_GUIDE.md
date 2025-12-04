# Guía de Acceso Administrativo - Nexus Center

## Cómo dar acceso de administrador a un usuario

### Opción 1: Desde Supabase Dashboard (Recomendado)

1. Ve a tu proyecto en [Supabase Dashboard](https://supabase.com/dashboard)
2. Selecciona tu proyecto **zetkvbkrsrkgwpqpgnni**
3. Ve a **Table Editor** en el menú lateral
4. Selecciona la tabla **profiles**
5. Encuentra el usuario por su email
6. Edita el campo **role** y cámbialo de `customer` a `admin`
7. Guarda los cambios

### Opción 2: SQL Query

Ejecuta esta consulta SQL en el SQL Editor de Supabase:

\`\`\`sql
-- Reemplaza 'usuario@example.com' con el email del usuario
UPDATE profiles 
SET role = 'admin' 
WHERE email = 'usuario@example.com';
\`\`\`

### Opción 3: Crear tu primer admin durante el registro

Modifica temporalmente el trigger en Supabase para asignar role 'admin' al primer usuario:

\`\`\`sql
-- Hacer que el primer usuario sea admin automáticamente
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role)
  VALUES (
    new.id,
    new.email,
    CASE 
      WHEN (SELECT COUNT(*) FROM public.profiles) = 0 THEN 'admin'
      ELSE 'customer'
    END
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
\`\`\`

## Tipos de Roles

- **customer**: Usuario normal (por defecto)
- **admin**: Administrador con acceso al panel administrativo
- **super_admin**: Super administrador (para funcionalidades futuras)

## Acceso al Panel Administrativo

Una vez que un usuario tenga el rol `admin` o `super_admin`:

1. Inicia sesión normalmente en `/auth/login`
2. Verás el enlace **"Admin"** en el header
3. Haz clic para acceder al **Panel Administrativo** en `/admin`
4. Podrás ver:
   - Ventas totales y estadísticas
   - Ventas por negocio (Urban Style, Café Nexus, Barber Studio, Zen Spa)
   - Productos más vendidos
   - Órdenes recientes
   - Citas agendadas

## Seguridad

El acceso administrativo está protegido en múltiples capas:

1. **Middleware**: Verifica el rol antes de permitir acceso a `/admin`
2. **Layout**: Verifica el rol del lado del servidor
3. **Header**: Solo muestra enlaces admin a usuarios con rol apropiado
4. **RLS (Row Level Security)**: Políticas de seguridad en Supabase

## Verificar tu rol actual

Para verificar tu rol actual, puedes:

1. Ir a tu perfil en `/profile`
2. O ejecutar esta query en Supabase:

\`\`\`sql
SELECT email, role FROM profiles WHERE email = 'tu-email@example.com';
