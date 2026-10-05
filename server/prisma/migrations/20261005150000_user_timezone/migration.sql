-- Zona horaria del navegador del usuario (para mostrar fechas en su hora local en los emails)
ALTER TABLE "User" ADD COLUMN "timeZone" TEXT;
