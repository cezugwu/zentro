import { RiDeleteBinLine } from "react-icons/ri";
import { useNavigate } from 'react-router-dom';
import {useQuery, useQueryClient, useMutation} from '@tanstack/react-query';
import CartItem from '../container/CartItem';
import { BASE_URL } from "../utilis/config";

const CartPage = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const guest = localStorage.getItem("guest")
  const token = localStorage.getItem("access");
  const headers = {
    "Content-Type": "application/json",
    ...(token && { "Authorization": `Bearer ${token}` }),
  };

  const fetchData = async () => {
    const response = await fetch(`${BASE_URL}/cart/?session_id=${guest}`, {
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
    queryFn: fetchData,
    staleTime: 60*60*4
  })

  const shipping = 4.00;
  const total = (Number(cart?.total_price) + shipping).toFixed(2);

  const clearToCart = async() => {
    const response = await fetch(`${BASE_URL}/clear/`, {
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

  const mutationClear = useMutation({
    mutationFn: clearToCart,
    onSuccess: () => {
      queryClient.invalidateQueries(['cart']);
    },
  });
  
  if (cartError) {return(<div>Something went wrong</div>)}

  return (
    <div className="mt-[80px] md:mt-[100px] mb-[100px] px-5 text-[0.95em] md:text-[1em]">
      {/* Header */}
      <div className="mb-6 md:mb-8 font-semibold text-gray-800">
        You have <span className="text-red-500">{cart?.total_items}</span> item{cart?.total_items !== 1 && 's'} in your cart
      </div>

      {/* Main Layout */}
      <div className="flex flex-col md:flex-row gap-8 md:gap-6">
        {/* LEFT: Cart Items */}
        <div className="md:w-[65%] border-2 border-gray-200 rounded-xl shadow-sm">
          {/* Table Header */}
          <div className="grid grid-cols-[5fr_1fr_1fr] px-4 py-3 font-semibold bg-gray-100 text-gray-700 border-b">
            <div>Product</div>
            <div>Price</div>
            <div>Quantity</div>
          </div>

          {/* Cart Items */}
          <div className="max-h-[380px] overflow-y-auto px-2">
            {!cartLoading ? (
              cart?.cartitem?.length > 0 ? (
                cart?.cartitem?.map((item, index) => (
                  <CartItem item={item} key={index} />
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

          {/* Footer */}
          <div className="flex items-center justify-between px-5 py-3 border-t text-gray-800 font-semibold">
            <div>Total: <span className="text-red-500">${parseFloat(cart?.total_price).toFixed(2)}</span></div>
            <button
              onClick={() => {if(cart?.cartitem.length !== 0) {mutationClear.mutate({})}}} 
              className="flex items-center gap-1 px-3 py-1 text-red-600 border border-red-400 rounded-lg hover:bg-red-500 hover:text-white transition-all duration-200"
            >
              <RiDeleteBinLine className="text-lg" /> Clear Cart
            </button>
          </div>
        </div>

        {/* RIGHT: Checkout Summary */}
        <div className="md:w-[35%] border-2 border-gray-200 rounded-xl shadow-sm p-6 flex flex-col gap-4 justify-center items-center">
          <h3 className="text-lg font-semibold text-gray-700">Order Summary</h3>

          <div className="w-full flex justify-between text-gray-600">
            <span>Subtotal:</span>
            <span>${parseFloat(cart?.total_price).toFixed(2)}</span>
          </div>

          <div className="w-full flex justify-between text-gray-600">
            <span>Shipping Fee:</span>
            <span>${shipping?.toFixed(2)}</span>
          </div>

          <div className="w-full border-t pt-2 flex justify-between font-semibold text-gray-800">
            <span>Total Payment:</span>
            <span className="text-red-500">${total}</span>
          </div>

          <button
            onClick={() => navigate('/checkout')}
            className="w-full mt-3 bg-red-500 text-white font-semibold py-2 rounded-lg shadow-md hover:bg-red-600 transition-all duration-300"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
