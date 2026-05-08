import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { CartProvider } from "./contexts/CartContext";
import CartDrawer from "./components/CartDrawer";
import RouteSeo from "./components/RouteSeo";
import Home from "./pages/Home";
import Quiz from "./pages/Quiz";
import Checkout from "./pages/Checkout";
import SignIn from "./pages/SignIn";
import Account from "./pages/Account";
import Shop from "./pages/Shop";
import ProductDetail from "./pages/ProductDetail";
import About from "./pages/About";
import Ingredients from "./pages/Ingredients";
import Contact from "./pages/Contact";
import Shipping from "./pages/Shipping";
import { PrivacyPolicy, TermsOfService } from "./pages/Legal";
import Register from "./pages/Register";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/quiz" component={Quiz} />
      <Route path="/checkout" component={Checkout} />
      <Route path="/signin" component={SignIn} />
      <Route path="/account" component={Account} />
      <Route path="/shop" component={Shop} />
      <Route path="/products/:slug" component={ProductDetail} />
      <Route path="/about" component={About} />
      <Route path="/ingredients" component={Ingredients} />
      <Route path="/contact" component={Contact} />
      <Route path="/shipping" component={Shipping} />
      <Route path="/privacy" component={PrivacyPolicy} />
      <Route path="/terms" component={TermsOfService} />
      <Route path="/register" component={Register} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <CartProvider>
          <TooltipProvider>
            <Toaster />
            <RouteSeo />
            <CartDrawer />
            <Router />
          </TooltipProvider>
        </CartProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
