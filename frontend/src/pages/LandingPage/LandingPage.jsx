import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import HERO from "/LANDING_HERO.png";
import BURGER from "/burger.png";

const LandingPage = () => {
  const navigate = useNavigate();
  const navigateLogin = () => {
    navigate("login");
  };
  const navigateSignup = () => {
    navigate("signup");
  };
  return (
    <div className="flex-1 flex flex-col gap-6 pt-14">
      <div className="flex items-center justify-center">
        <img src={HERO} />
      </div>
      <div className="flex flex-col gap-8">
        <div className="font-poppins font-bold text-3xl leading-[44px] px-6 text-pretty">
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
            className="bg-logoOrange text-[#204160]"
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
