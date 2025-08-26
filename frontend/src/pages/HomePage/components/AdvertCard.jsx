import { Card } from "@/components/ui/card"
import { format } from 'date-fns'
import glazeImage from "/glaze_eatery.webp"
import { useNavigate } from "react-router-dom"

const AdvertCard = ({ advert }) => {
    const navigate = useNavigate()

    const formattedTime = format(new Date(advert.estimatedReturnTime), 'h:mm a')

    const handleClick = () => {
        navigate(`/advert/${advert._id}`)
    }

    return (
        <Card className="hover:shadow-lg transition-shadow duration-200 overflow-hidden font-poppins border border-[#DBD1DE] rounded-2xl cursor-pointer" onClick={handleClick}>
            <div>
                <img src={glazeImage} alt={advert.title} className="w-full h-36 object-cover" />
            </div>
            <div className="p-3">
                <div className="font-bold pb-0.5">{advert.restaurant.name}</div>
                <div className="text-gray-500 text-sm font-light">Arrival Time: {formattedTime}</div>
            </div>
        </Card>
    )
}

export default AdvertCard