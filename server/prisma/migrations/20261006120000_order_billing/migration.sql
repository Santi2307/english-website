-- Datos de facturación y resumen del medio de pago (sin datos de tarjeta)
ALTER TABLE "Order" ADD COLUMN "paymentDetail" TEXT;
ALTER TABLE "Order" ADD COLUMN "billing" JSONB;
