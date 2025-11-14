import { ChevronLeft } from "lucide-react";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";

const BackButton = () => {
  const navigate = useNavigate();

  const handleOnClick = () => {
    navigate("/home")
  }
  
  return (
    <Button onClick={handleOnClick} className="absolute" size="backButton">
      <ChevronLeft className="invert" />
    </Button>
  );
};

export default BackButton;
