-- Pagos con Stripe: proveedor por orden, id del PaymentIntent, recibo y cliente por usuario
ALTER TABLE "Order" ADD COLUMN "provider" TEXT NOT NULL DEFAULT 'wompi';
ALTER TABLE "Order" ADD COLUMN "providerPaymentId" TEXT;
ALTER TABLE "Order" ADD COLUMN "receiptUrl" TEXT;
CREATE UNIQUE INDEX "Order_providerPaymentId_key" ON "Order"("providerPaymentId");

ALTER TABLE "User" ADD COLUMN "stripeCustomerId" TEXT;
CREATE UNIQUE INDEX "User_stripeCustomerId_key" ON "User"("stripeCustomerId");
