import { BrowserRouter } from "react-router-dom";
import { Card } from "./components/ui/card";
import AppRoutes from "./routes/AppRoutes";

const App = () => {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex justify-center items-center flex-col bg-black">
        {
          // Wrapper Card for the Phone View on Dekstop
          // TODO: Dedicated Dekstop view in the future (tbh not a top priority i think....)
        }
        <Card className="flex-1 sm:flex-initial overflow-hidden w-full sm:w-[390px] sm:h-[844px] sm:rounded-[3rem] p-4 bg-[#204160] shadow-2xl text-white relative flex">
          <AppRoutes />
        </Card>
      </div>
    </BrowserRouter>
  );
};

export default App;
