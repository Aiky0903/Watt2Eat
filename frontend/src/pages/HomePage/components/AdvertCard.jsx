import { Card } from "@/components/ui/card"
import { format } from 'date-fns'

const AdvertCard = ({ advert }) => {
    const formattedTime = format(new Date(advert.estimatedReturnTime), 'h:mm a')

    return (
        <Card className="hover:shadow-lg transition-shadow duration-200 overflow-hidden font-poppins border border-[#DBD1DE] rounded-2xl">
            <div>
                <img src={advert.image} alt={advert.title} className="w-full h-48 object-cover" />
            </div>
            <div className="p-3">
                <div className="font-bold">{advert.restaurant.name}</div>
                <div className="text-gray-500 text-[13px]">Arrival Time: {formattedTime}</div>
            </div>
        </Card>
    )
}

export default AdvertCard