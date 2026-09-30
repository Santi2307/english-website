import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { RequireAuth } from './components/auth/RequireAuth';
import { PageLoader } from './components/ui/Spinner';
import Home from './pages/Home';

// Code splitting por ruta
const Catalog = lazy(() => import('./pages/Catalog'));
const CourseDetail = lazy(() => import('./pages/CourseDetail'));
const AuthPage = lazy(() => import('./pages/Auth'));
const Checkout = lazy(() => import('./pages/Checkout'));
const PaymentResult = lazy(() => import('./pages/PaymentResult'));
const Dashboard = lazy(() => import('./pages/dashboard/Dashboard'));
const Learn = lazy(() => import('./pages/dashboard/Learn'));
const AdminLayout = lazy(() => import('./pages/admin/AdminLayout'));
const AdminMetrics = lazy(() => import('./pages/admin/Metrics'));
const AdminCourses = lazy(() => import('./pages/admin/Courses'));
const AdminCourseEditor = lazy(() => import('./pages/admin/CourseEditor'));
const AdminOrders = lazy(() => import('./pages/admin/Orders'));
const AdminCoupons = lazy(() => import('./pages/admin/Coupons'));
const NotFound = lazy(() => import('./pages/NotFound'));

export default function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="cursos" element={<Catalog />} />
          <Route path="cursos/:slug" element={<CourseDetail />} />
          <Route path="ingresar" element={<AuthPage mode="login" />} />
          <Route path="registro" element={<AuthPage mode="register" />} />
          <Route path="checkout/:slug" element={<RequireAuth><Checkout /></RequireAuth>} />
          <Route path="pago/resultado" element={<RequireAuth><PaymentResult /></RequireAuth>} />
          <Route path="mi-cuenta" element={<RequireAuth><Dashboard /></RequireAuth>} />
          <Route path="*" element={<NotFound />} />
        </Route>
  
        {/* Reproductor a pantalla completa, sin header/footer de marketing */}
        <Route path="aprender/:slug/:lessonId?" element={<RequireAuth><Learn /></RequireAuth>} />
  
        <Route path="admin" element={<RequireAuth admin><AdminLayout /></RequireAuth>}>
          <Route index element={<AdminMetrics />} />
          <Route path="cursos" element={<AdminCourses />} />
          <Route path="cursos/nuevo" element={<AdminCourseEditor />} />
          <Route path="cursos/:id" element={<AdminCourseEditor />} />
          <Route path="ordenes" element={<AdminOrders />} />
          <Route path="cupones" element={<AdminCoupons />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
