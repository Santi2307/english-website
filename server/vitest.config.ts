import { defineConfig } from 'vitest/config';

// Entorno aislado: los tests no leen el .env local ni tocan la BD ni el proveedor real
export default defineConfig({
  test: {
    include: ['src/**/*.test.ts'],
    env: {
      NODE_ENV: 'test',
      CLIENT_URL: 'https://app.test',
      API_URL: 'https://api.test',
      DATABASE_URL: 'postgresql://test:test@localhost:5432/test',
      JWT_SECRET: 'test-secret-that-is-long-enough-for-validation-123',
      WOMPI_PUBLIC_KEY: 'pub_test_x',
      WOMPI_INTEGRITY_SECRET: 'test_integrity_x',
      WOMPI_EVENTS_SECRET: 'test_events_x',
      EMAIL_MODE: 'preview',
      RESEND_API_KEY: '',
      SUPPORT_EMAIL: 'soporte@app.test',
    },
  },
});
