import { Card } from "@/components/ui/card";
import HomePage from "@/pages/HomePage";
import LoginPage from "@/pages/LoginPage";
import { useUserStore } from "@/store/userStore";
import { Loader } from "lucide-react";
import { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

const AppRoutes = () => {
  const { authUser, checkAuth, isCheckingAuth } = useUserStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Loading Spinner
  if (isCheckingAuth && !authUser) {
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
            element={authUser ? <HomePage /> : <Navigate to="/login" />}
          />
          <Route path="/login" element={<LoginPage />} />
          <Route />
          <Route />
        </Routes>
      </Router>
    </Card>
  );
};

export default AppRoutes;
