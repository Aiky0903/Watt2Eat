import BackButton from "@/components/BackButton"
import glazeImage from "/glaze_eatery.webp"
import { useAdvertStore } from "@/store/advertStore"
import { useParams } from "react-router-dom"
import { useCartStore } from "@/store/cartStore"
import { Clock, Minus, Plus } from "lucide-react"
import { useEffect } from "react"
import { format } from 'date-fns'
import { ScrollArea } from "@/components/ui/scroll-area"


const AdvertPage = () => {
  const { selectedAdvert, fetchAdvertById, isAdvertLoading } = useAdvertStore()
  const { addToCart, cartItems, updateQuantity, getTotalPrice } = useCartStore(); // Cart actions
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
    return <div className="p-6">Fetching advert...</div>
  }

  const formattedTime = format(new Date(selectedAdvert.estimatedReturnTime), 'h:mm a')

  return (
    <div className="flex flex-col h-full w-full relative">
      {/* Header */}
      <div className="font-poppins pt-8 px-6 h-48">
        <BackButton />
        <div className="flex flex-col gap-2 justify-center items-center">
          <img src={glazeImage} className="rounded-md h-16"></img>
          <div className="text-md font-medium">{selectedAdvert.restaurant.name}</div>
          <div className="text-[12px] bg-white rounded-xl text-black py-2 px-4 font-medium text-center"><Clock className="inline-block size-4 mr-2" /> Estimated arrival time is {formattedTime}</div>
        </div>
      </div>

      {/* Menu */}
      <ScrollArea className="bg-white flex-1 rounded-t-3xl">
        {
          selectedAdvert.restaurant.menu.slice().sort((a, b) => a.displayOrder - b.displayOrder).map((item) => (
            <div key={item.id} className="flex justify-between items-center font-poppins border-b-8 px-8 border-[#F5EBF9] w-full">
              <div className="text-black pt-4 font-bold w-full select-none">
                <div className="">{item.name}</div>
                <div>
                  { // Render each sub-item in category sorted by displayOrder
                    item.items.map((subItem, index) => {
                      const inCart = cartItems.find(cartItem => cartItem.id === subItem._id);
                      const quantity = inCart ? inCart.quantity : 0;
                      return (
                        <div key={subItem.id} className="flex flex-col font-medium w-full h-28 border-b border-gray-200 justify-center gap-1 relative">
                          <div className="text-sm font-bold">{subItem.name}</div>
                          <div className="text-sm text-green-500 font-medium">
                            RM {subItem.price.toFixed(2)}
                          </div>
                          <div className="text-xs text-gray-500 font-light w-8/12">
                            {subItem.description}
                          </div>

                          {/* Dynamic Button */}
                          {quantity === 0 ? (
                            <button
                              onClick={() => addToCart({ id: subItem._id, name: subItem.name, price: subItem.price, quantity: 1 })}
                              className="absolute bottom-6 right-3 border-[#DBD1DE] border rounded-full p-1"
                            >
                              <Plus className="size-5" />
                            </button>
                          ) : (
                            <div className="absolute bottom-6 right-3 flex items-center gap-2 border-[#DBD1DE] border rounded-full px-2 py-1 bg-white">
                              <button
                                onClick={() => updateQuantity(subItem._id, quantity - 1)}
                                className="font-bold"
                              >
                                <Minus className="size-5" />
                              </button>
                              <span className="text-sm font-semibold">{quantity}</span>
                              <button
                                onClick={() => updateQuantity(subItem._id, quantity + 1)}
                                className="font-bold"
                              >
                                <Plus className="size-5" />
                              </button>
                            </div>
                          )}

                        </div>
                      )
                    })}
                </div>
              </div>
            </div>
          ))}
      </ScrollArea>

      {/* Footer */}
      {cartItems.length > 0 && (
        <div className="absolute bottom-0 left-0 w-full bg-mainBlue text-white flex justify-center gap-12 items-center px-6 py-3 font-poppins rounded-t-lg font-bold text-sm">
          <div className="bg-logoOrange rounded-full px-3 py-1 text-mainBlue">
            {
              cartItems.reduce((total, item) => total + item.quantity, 0)
            }
          </div>
          <div >
            View Your Cart
          </div>
          <div>
            RM {getTotalPrice().toFixed(2)}
          </div>
        </div>
      )}
    </div>
  )
}

export default AdvertPage