import { Button } from "@/components/ui/button";
import { useUserStore } from "@/store/userStore";

const HomePage = () => {
  const { logoutUser } = useUserStore();
  return (
    <div>
      HomePage
      <Button onClick={logoutUser}>Logout</Button>
    </div>
  );
};

export default HomePage;
