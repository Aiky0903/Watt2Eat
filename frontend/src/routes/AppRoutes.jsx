import { Card } from "@/components/ui/card";
import HomePage from "@/pages/HomePage/HomePage";
import LoginPage from "@/pages/LoginPage/LoginPage";
import SignUpPage from "@/pages/SignUpPage/SignUpPage";
import { useUserStore } from "@/store/userStore";
import { Loader } from "lucide-react";
import { useEffect } from "react";
import LogoText from "../../public/LOGO_TEXT.png";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Toaster } from "sonner";
import LandingPage from "@/pages/LandingPage/LandingPage";

const AppRoutes = () => {
  const { user, checkAuth, isCheckingAuth } = useUserStore();

  // All the routes listed here for abstractioon
  const homePageRoute = "/home";
  const loginPageRoute = "/login";

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Loading Page state
  if (isCheckingAuth && !user) {
    return (
      <div className="absolute flex items-center justify-center h-full w-full">
        <img src={LogoText}></img>
      </div>
    );
  }

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route
            path={homePageRoute}
            element={user ? <HomePage /> : <Navigate to={loginPageRoute} />}
          />
          <Route
            path={loginPageRoute}
            element={!user ? <LoginPage /> : <Navigate to={homePageRoute} />}
          />
          <Route
            path="/signup"
            element={!user ? <SignUpPage /> : <Navigate to={homePageRoute} />}
          />
          <Route />
        </Routes>
      </Router>
      <Toaster richColors position="bottom-center" />
    </>
  );
};

export default AppRoutes;
