import { Card } from "@/components/ui/card";
import HomePage from "@/pages/HomePage/HomePage";
import LoginPage from "@/pages/LoginPage/LoginPage";
import SignUpPage from "@/pages/SignUpPage/SignUpPage";
import { useUserStore } from "@/store/userStore";
import { Loader } from "lucide-react";
import { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Toaster } from "sonner";

const AppRoutes = () => {
  const { user, checkAuth, isCheckingAuth } = useUserStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Loading Spinner
  if (isCheckingAuth && !user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );
  }

  return (
    <Card className="flex-1 overflow-hidden w-full sm:w-[430px] sm:h-[900px] sm:rounded-[3rem] p-4 bg-[#204160] shadow-2xl text-white">
      <Router>
        <Routes>
          <Route
            path="/"
            element={user ? <HomePage /> : <Navigate to="/login" />}
          />
          <Route
            path="/login"
            element={!user ? <LoginPage /> : <Navigate to="/" />}
          />
          <Route
            path="/signup"
            element={!user ? <SignUpPage /> : <Navigate to="/" />}
          />
          <Route />
        </Routes>
      </Router>
      <Toaster richColors position="bottom-center" />
    </Card>
  );
};

export default AppRoutes;
