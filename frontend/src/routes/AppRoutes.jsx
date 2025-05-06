import { useUserStore } from "@/store/userStore";
import { useEffect } from "react";
import LogoText from "/LOGO_TEXT.png";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { Toaster } from "sonner";
import { AnimatePresence } from "framer-motion";
import PageWrapper from "@/components/ui/animation/PageWrapper";

// TODO: Import pages here
import { HomePage, LoginPage, SignUpPage, LandingPage } from "@/pages";

const AppRoutes = () => {
  const { user, checkAuth, isCheckingAuth } = useUserStore();
  const location = useLocation(); // To track route changes

  // TODO: List all routes here for abstractioon
  const homePageRoute = "/home";
  const loginPageRoute = "/login";
  const signUpPageRoute = "/signup";

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <>
      <AnimatePresence mode="wait">
        {
          //*Loading Page State
          isCheckingAuth && !user ? (
            <PageWrapper key="loading">
              <div className="absolute flex items-center justify-center h-full w-full">
                <img src={LogoText} alt="Loading..." />
              </div>
            </PageWrapper>
          ) : (
            //TODO: Add Routes Here
            //* Make sure to wrap the actual routes
            <Routes location={location} key={location.pathname}>
              <Route
                path="/"
                element={
                  <PageWrapper>
                    <LandingPage />
                  </PageWrapper>
                }
              />
              <Route
                path={homePageRoute}
                element={
                  user ? (
                    <PageWrapper>
                      <HomePage />
                    </PageWrapper>
                  ) : (
                    <Navigate to={loginPageRoute} />
                  )
                }
              />
              <Route
                path={loginPageRoute}
                element={
                  !user ? (
                    <PageWrapper>
                      <LoginPage />
                    </PageWrapper>
                  ) : (
                    <Navigate to={homePageRoute} />
                  )
                }
              />
              <Route
                path={signUpPageRoute}
                element={
                  !user ? (
                    <PageWrapper>
                      <SignUpPage />
                    </PageWrapper>
                  ) : (
                    <Navigate to={homePageRoute} />
                  )
                }
              />
            </Routes>
          )
        }
      </AnimatePresence>
      <Toaster richColors position="bottom-center" />
    </>
  );
};

export default AppRoutes;
