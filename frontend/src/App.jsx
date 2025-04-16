import { Card } from "./components/ui/card";
import AppRoutes from "./routes/AppRoutes";

const App = () => {
  return (
    <div className="min-h-screen flex justify-center items-center flex-col sm:p-4">
      <Card className="flex-1 sm:flex-initial overflow-hidden w-full sm:w-[430px] sm:h-[900px] sm:rounded-[3rem] p-4 bg-[#204160] shadow-2xl text-white relative">
        <AppRoutes />
      </Card>
    </div>
  );
};

export default App;
