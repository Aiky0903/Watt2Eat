import BackButton from "@/components/BackButton";
import LoginForm from "./components/LoginForm";
import LogoNoText from "/LOGO_NO_TEXT.png";


const LoginPage = () => {
  return (
    <div className="flex-1 px-6 pt-8">
      <BackButton />
      <div className="flex justify-center items-center flex-col gap-3 py-9">
        <img src= {LogoNoText} className="scale-75"/>
        <div className="font-poppins font-bold text-3xl">
          Log in
        </div>
        <div className="font-poppins">
          Please sign in to your account
        </div>
      </div>
      <LoginForm />
    </div>
  );
};

export default LoginPage;
