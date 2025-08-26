import BackButton from "@/components/BackButton"
import glazeImage from "/glaze_eatery.webp"
import { useAdvertStore } from "@/store/advertStore"
import { useParams } from "react-router-dom"
import { Clock } from "lucide-react"
import { useEffect } from "react"
import { format } from 'date-fns'
import { ScrollArea } from "@/components/ui/scroll-area"


const AdvertPage = () => {
  const { selectedAdvert, fetchAdvertById, isAdvertLoading } = useAdvertStore()
  const { id } = useParams()

  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        await fetchAdvertById(id);
      }
    };
    fetchData();
  }, [id, fetchAdvertById]);

  // Handle loading state
  if (isAdvertLoading || !selectedAdvert) {
    // TODO: Replace with a proper laoding page for all the other pages with laoding states
    return <div className="p-6">Loading advert...</div>
  }
  const formattedTime = format(new Date(selectedAdvert.estimatedReturnTime), 'h:mm a')
  return (
    <div className="flex flex-col h-full w-full">
      <div className="font-poppins pt-8 px-6 h-48">
        <BackButton />
        <div className="flex flex-col gap-2 justify-center items-center">
          <img src={glazeImage} className="rounded-md h-16"></img>
          <div className="text-md font-medium">{selectedAdvert.restaurant.name}</div>
          <div className="text-[12px] bg-white rounded-xl text-black py-2 px-4 font-medium text-center"><Clock className="inline-block size-4 mr-2" /> Estimated arrival time is {formattedTime}</div>
        </div>
      </div>
      <ScrollArea className="bg-white flex-1 rounded-t-3xl">
        {selectedAdvert.restaurant.menu.slice().sort((a, b) => a.displayOrder - b.displayOrder).map((item) => (
          <div key={item.id} className="flex justify-between items-center font-poppins border-b-8 px-8 border-[#F5EBF9] w-full">
            <div className="text-black pt-4 font-bold w-full select-none">
              <div className="">{item.name}</div>
              <div>
                {item.items.map((subItem, index) => (
                  <div key={subItem.id} className="flex flex-col font-medium w-full h-28 border-b border-gray-200 justify-center gap-1">
                    <div className="text-sm font-bold">{subItem.name}</div>
                    <div className="text-sm text-green-500 font-light">
                      RM {subItem.price.toFixed(2)}
                    </div>
                    <div className="text-xs text-gray-500 font-light w-9/12">
                      {subItem.description}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </ScrollArea>
    </div>
  )
}

export default AdvertPage