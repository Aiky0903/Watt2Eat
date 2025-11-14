import BackButton from '@/components/BackButton'
import { useAdvertStore } from '@/store/advertStore';
import { useCartStore } from '@/store/cartStore';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { useNavigate, useParams } from 'react-router-dom';
import { Minus, Plus } from 'lucide-react';

const OrderSummary = () => {
    const navigate = useNavigate()
    const { selectedAdvert, fetchAdvertById, isAdvertLoading } = useAdvertStore()
    const { addToCart, cartItems, updateQuantity, getTotalPrice } = useCartStore(); // Cart actions
    const { id } = useParams()

    const handleOnClick = () => {
        navigate(`/advert/${id}`)
    }

    return (
        <div className="flex flex-col h-full w-full relative bg-white items-center">
            {/* Header */}
            <div className="font-poppins pt-8 px-6 flex flex-col w-full">
                <div className='relative'>
                    <BackButton />
                    <div className="flex flex-col text-black pl-10">
                        <p className="text-md font-bold">Cart</p>
                        <p className="text-sm font-light text-mutedText">{selectedAdvert.restaurant.name}</p>
                    </div>
                </div>
                <Breadcrumb className="mt-4 flex justify-center items-center">
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink onClick={handleOnClick} className="cursor-pointer">Menu</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage>Cart</BreadcrumbPage>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbLink>Checkout</BreadcrumbLink>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            </div>

            {/* Order Summary */}
            <div className='font-poppins p-10 w-full'>
                <p className='font-semibold text-[#554F57] text-sm mb-2'>Order Summary</p>
                <div className='border-2 border-gray-200 text-black rounded-lg px-4 flex flex-col'>
                    {cartItems.map((item) => {
                        const inCart = cartItems.find(cartItem => cartItem._id === item._id);
                        const quantity = inCart ? inCart.quantity : 0;
                        console.log(item._id)
                        return (
                            <div key={item.id} className="h-24 border-b border-[#DBD1DE] relative flex flex-col gap-1 py-4">
                                <div className='text-md font-bold'>{item.name}</div>
                                <div className='text-sm text-greyText absolute bottom-2 right-1 font-medium'>RM {(item.price * item.quantity).toFixed(2)}</div>
                                {/* Dynamic Button */}
                                <div className='w-auto flex-none self-start'>
                                    {quantity === 0 ? (
                                        // If quantity is 0, show "Add" button
                                        <button
                                            onClick={() => addToCart({ _id: item._id, name: item.name, price: item.price, quantity: 1 })}
                                            className="border-[#DBD1DE] border rounded-full p-1"
                                        >
                                            <Plus className="size-4" />
                                        </button>
                                    ) : (
                                        // If quantity > 0, show quantity selector
                                        <div className="flex gap-2 border-[#DBD1DE] border rounded-full px-2 py-1 bg-white w-auto flex-none">
                                            <button
                                                onClick={() => updateQuantity(item._id, quantity - 1)}
                                                className="font-bold"
                                            >
                                                <Minus className="size-4" />
                                            </button>
                                            <span className="text-[12px] font-semibold">{quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item._id, quantity + 1)}
                                                className="font-bold"
                                            >
                                                <Plus className="size-4" />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )
                    })}
                    <button className='h-12 text-[12px] text-mainBlue font-bold flex items-center justify-end' onClick={handleOnClick}>
                        <Plus className='size-5' /> Add more items
                    </button>
                </div>
            </div>

            {/* Footer */}
            <button onClick={() => navigate(`/checkout/${id}`)} className="absolute bottom-8 bg-mainBlue text-white px-6 py-3 font-poppins rounded-full font-bold text-sm w-[90%]">
                Confirm Order
            </button>
        </div>
    )
}

export default OrderSummary