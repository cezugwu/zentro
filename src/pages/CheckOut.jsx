import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import OrderSummary from '../container/OrderSummary';
import {useQuery, useQueryClient, useMutation} from '@tanstack/react-query';
import { Link } from 'lucide-react';
import { BASE_URL } from '../utilis/config';

const CheckOut = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const guest = localStorage.getItem("guest")
    const token = localStorage.getItem("access");
    const headers = {
        "Content-Type": "application/json",
        ...(token && { "Authorization": `Bearer ${token}` }),
    };

    const fetchCart = async () => {
        const response = await fetch(`${BASE_URL}/cart/?session_id=${guest}`, {
        method:'GET',
        headers,
        });
        if (!response.ok) {
        throw new Error("Network response was not ok");
        }
        return response.json();
    }

    const fetchShipping = async () => {
        const response = await fetch(`${BASE_URL}/shippingcurrent/?session_id=${guest}`, {
        method:'GET',
        headers,
        });
        if (!response.ok) {
        throw new Error("Network response was not ok");
        }
        return response.json();
    }

    const {data:cart, isLoading:cartLoading, isError:cartError} = useQuery ({
        queryKey: ['cart'],
        queryFn: fetchCart,
        staleTime: 60*60*4
    })

    const {data:shipping, isLoading:shippingLoading, isError:shippingError} = useQuery ({
        queryKey: ['shipping'],
        queryFn: fetchShipping,
        staleTime: 60*60*4
    })

    const total = (Number(cart?.total_price) + 4).toFixed(2);

    const flutterPay = async() => {
        const response = await fetch(`${BASE_URL}/flutter/`, {
        method: "POST",
        headers,
        body: JSON.stringify({
            session_id: guest,
        }),
        });
        if (!response.ok) {
            throw new Error("failed to add to cart");
        }
        return response.json();
    }

    const mutationFlutterPay = useMutation({
        mutationFn: flutterPay,
        onSuccess: (data) => {
            window.location.href = data.data.link
        },
    });

    useEffect(() => {
        queryClient.invalidateQueries(['cart']);
        queryClient.invalidateQueries(['shipping']);
    }, []);

    return (
        <div className="mt-[90px] mb-[40px] px-4 md:px-10 text-[0.95em]">
            <div className="flex flex-col lg:flex-row md:gap-8 gap-10">
                {/* LEFT SECTION */}
                <div className="lg:w-[65%] w-full">
                    {/* SHIPPING INFO */}
                    <div className="border-2 border-gray-200 rounded-2xl shadow-sm mb-6 bg-white">
                        <div className="border-b-2 border-gray-100 py-3 px-6 flex justify-between items-center bg-gray-50 rounded-t-2xl">
                            <div className="font-semibold text-gray-700">Shipping Address</div>
                            <button onClick={() => navigate('/shipping')} className="text-green-500 hover:underline">Manage shipping</button>
                        </div>
                        {!shippingLoading ?
                            shipping ? (
                                <div className="py-3 px-6 text-gray-700 capitalize">
                                    <p className="my-1">{shipping?.address}, {shipping?.city}, {shipping?.state}</p>
                                    <p>{shipping?.zip_code}</p>
                                    <p className="mt-2">{shipping?.phone}</p>
                                </div>
                            ) : (
                                <div className="py-3 px-6 text-gray-500 italic">
                                    You have no shipping details yet.
                                </div>
                            ) : (<div className="py-3 px-6 text-gray-700 animate-pulse">
                                    <div className="my-1">
                                        <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                                        <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                                    </div>
                                    <div className="h-4 bg-gray-300 rounded w-1/3 mt-3"></div>
                                    <div className="h-4 bg-gray-300 rounded w-2/5 mt-4"></div>
                                </div>)
                        }
                    </div>

                    {/* CART SUMMARY */}
                    <div className="border-2 border-gray-200 rounded-2xl bg-white shadow-sm">
                        {cart?.link && <div className='p-2 flex items-center justify-end gap-1 text-green-500 hover:underline rounded-t-2xl w-fit cursor-pointer select-none'>Payment Pending <Link className='w-4 h-4' /></div>}
                        <div className="grid grid-cols-[5fr_1fr_1fr] items-center p-3 font-semibold text-gray-600 bg-gray-50">
                            <div>Products</div>
                            <div>Price</div>
                            <div className="text-right">Quantity</div>
                        </div>

                        <div className="max-h-[380px] overflow-y-auto px-2">
                            {!cartLoading ? (
                            cart?.cartitem?.length > 0 ? (
                                cart?.cartitem?.map((item, index) => (
                                <OrderSummary item={item} key={index} />
                                ))
                            ) : (
                                <div className="text-center py-10 text-gray-500">
                                Your cart is empty
                                </div>
                            )
                            ) : (
                            <div className="text-center py-10 text-gray-400">Loading...</div>
                            )}
                        </div>

                        <div className="flex justify-between px-6 py-3 bg-gray-50 text-gray-700 font-medium rounded-b-2xl">
                            <span>Total:</span>
                            <span className='flex items-center gap-[1px]'><span className='text-[0.8em]'>NGN</span>{Number(total).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                        </div>
                    </div>
                </div>

                {/* RIGHT SECTION */}
                <div className="lg:w-[35%] w-full h-fit bg-white border-2 border-gray-200 rounded-2xl shadow-md py-6 px-5 flex flex-col gap-4 items-center">
                    <h2 className="text-lg font-semibold text-gray-700 mb-2">Choose Payment Method</h2>

                    <button
                        onClick={() => mutationFlutterPay.mutate()}
                        disabled={!shipping || !cart?.length === 0}
                        className={`w-full py-3 rounded-xl font-medium transition ${
                            !shipping || !cart?.length === 0
                                ? 'bg-blue-300 cursor-not-allowed text-white'
                                : 'bg-blue-500 hover:bg-blue-600 text-white'
                        }`}
                    >
                        Pay with Flutterwave
                    </button>

                    <button
                        disabled={!shipping || !cart?.length === 0}
                        className={`w-full py-3 rounded-xl font-medium transition ${
                            !shipping || !cart?.length === 0
                                ? 'bg-red-300 cursor-not-allowed text-white'
                                : 'bg-red-500 hover:bg-red-600 text-white'
                        }`}
                    >
                        Pay with PayPal
                    </button>

                    <button
                        disabled={!shipping || !cart?.length === 0}
                        className={`w-full py-3 rounded-xl font-medium transition ${
                            !shipping || !cart?.length === 0
                                ? 'bg-gray-300 cursor-not-allowed text-white'
                                : 'bg-gray-700 hover:bg-gray-800 text-white'
                        }`}
                    >
                        Pay with Paystack
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CheckOut;
