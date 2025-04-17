import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import LOGO from "/LOGO_NO_TEXT.png";
import BURGER from "/burger.png"

const LandingPage = () => {
  const navigate = useNavigate();
  const navigateLogin = () => {
    navigate("login");
  };
  const navigateSignup = () => {
    navigate("signup");
  };
  return (
    <div>
      <div className="flex items-center">
        <img src={LOGO} />
        <img src={BURGER} />
      </div>
      <div className="flex flex-col gap-12">
        <div className="font-poppins font-bold text-3xl leading-[44px] px-6 ">
          Stuck on campus? Let a friend bring it to you. Already out? Be the one
          to help.
        </div>
        <div className="flex justify-around">
          <Button
            onClick={navigateSignup}
            className="bg-white/20 border"
            size="welcome"
          >
            Sign up
          </Button>
          <Button
            onClick={navigateLogin}
            className="bg-logoOrange text-[#204160] font-poppins"
            size="welcome"
          >
            Log in
          </Button>
        </div>
        <div className="font-poppins text-sm text-[#C1C1C1] text-center font-medium">
          <p>Just students helping students get fed.</p>
          <p>Order or deliver, it’s a win-win!</p>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
