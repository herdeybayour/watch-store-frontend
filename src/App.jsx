import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import WhatsAppButton from "./components/WhatsAppButton";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import About from "./pages/About";
import Contact from "./pages/Contact";
import { useAuth } from "./context/AuthContext";
import AdminLayout from "./admin/AdminLayout";
import { Login, Dashboard, ProductsAdmin, ProductForm, CategoriesAdmin, SettingsAdmin } from "./admin/pages";

function Customer() {
  const { pathname } = useLocation();
  return (
    <>
      <Navbar />
      <main key={pathname} className="page min-h-[70vh]">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
function RequireAdmin({ children }) { const { token } = useAuth(); return token ? children : <Navigate to="/admin/login" replace />; }

export default function App() {
  return (
    <Routes>
      <Route path="/admin/login" element={<Login />} />
      <Route path="/admin" element={<RequireAdmin><AdminLayout /></RequireAdmin>}>
        <Route index element={<Dashboard />} />
        <Route path="products" element={<ProductsAdmin />} />
        <Route path="products/new" element={<ProductForm />} />
        <Route path="products/edit/:id" element={<ProductForm />} />
        <Route path="categories" element={<CategoriesAdmin />} />
        <Route path="settings" element={<SettingsAdmin />} />
      </Route>
      <Route path="*" element={<Customer />} />
    </Routes>
  );
}
