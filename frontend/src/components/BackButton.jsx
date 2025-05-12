import { ChevronLeft } from "lucide-react";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";

const BackButton = () => {
  const navigate = useNavigate();
  return (
    <Button onClick={() => navigate(-1)} className="absolute" size="backButton">
      <ChevronLeft className="invert" />
    </Button>
  );
};

export default BackButton;
