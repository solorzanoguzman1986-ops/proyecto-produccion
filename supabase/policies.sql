-- Políticas de seguridad para Supabase (Row Level Security)
-- Estas políticas garantizan que los usuarios solo puedan acceder a sus propios datos

-- Habilitar RLS en las tablas
ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Subscription" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Payment" ENABLE ROW LEVEL SECURITY;

-- Política para User: Los usuarios solo pueden ver su propio perfil
CREATE POLICY "Users can view own profile"
ON "User" FOR SELECT
USING (auth.uid()::text = id);

-- Política para User: Los usuarios solo pueden actualizar su propio perfil
CREATE POLICY "Users can update own profile"
ON "User" FOR UPDATE
USING (auth.uid()::text = id);

-- Política para Subscription: Los usuarios solo pueden ver su propia suscripción
CREATE POLICY "Users can view own subscription"
ON "Subscription" FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM "User"
        WHERE "User".id = "Subscription"."userId"
        AND "User".id::text = auth.uid()::text
    )
);

-- Política para Payment: Los usuarios solo pueden ver sus propios pagos
CREATE POLICY "Users can view own payments"
ON "Payment" FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM "User"
        WHERE "User".id = "Payment"."userId"
        AND "User".id::text = auth.uid()::text
    )
);

-- Nota: Estas políticas asumen que estás usando Supabase Auth
-- Si usas NextAuth, estas políticas pueden necesitar ajustes
-- Para NextAuth, las políticas se manejan a nivel de aplicación

