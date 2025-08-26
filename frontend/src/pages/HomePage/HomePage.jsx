import { Button } from "@/components/ui/button";
import { useAdvertStore } from "@/store/advertStore";
import { useUserStore } from "@/store/userStore";
import { useEffect } from "react";
import AdvertCard from "./components/AdvertCard";

const HomePage = () => {
  const { user, logoutUser } = useUserStore();
  const { activeAdverts, selectedAdvert, fetchActiveAdverts } = useAdvertStore();

  // Fetch active adverts when the component mounts
  useEffect(() => {
    fetchActiveAdverts();
  }, [fetchActiveAdverts]);

  return (
    <div className="flex flex-col h-full w-full">
      <div className="font-poppins pt-12 px-8 pb-8 h-44">
        <p className="text-3xl">Hi {user.username}</p>
        <p className="text-[12px] font-light">What do you want to order today?</p>
      </div>
      <div className="bg-white flex-1 px-6 rounded-t-3xl">
        <div className="text-black font-bold font-poppins pt-4 pb-3">Current Adverts</div>
        <div>
          {activeAdverts.length > 0 ? (
            activeAdverts.map((advert) => (
              <AdvertCard advert={advert} />
            ))
          ) :
            // No Active Adverts State
            (
              <p className="text-gray-500 font-poppins">No active adverts available.</p>
            )}
        </div>
      </div>
      <Button onClick={logoutUser}>Logout</Button>
    </div>
  );
};

export default HomePage;
