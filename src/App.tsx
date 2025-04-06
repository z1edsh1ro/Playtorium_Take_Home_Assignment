
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ShopProvider } from "./context/ShopContext";
import Index from "./pages/Index";
import CartPage from "./pages/CartPage";


const App = () => (
  <ShopProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/cart" element={<CartPage />} />
      </Routes>
    </BrowserRouter>
  </ShopProvider>
);

export default App;
