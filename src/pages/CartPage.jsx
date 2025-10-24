import { RiDeleteBinLine } from "react-icons/ri";
import { useNavigate } from 'react-router-dom';
import {useQuery, useQueryClient, useMutation} from '@tanstack/react-query';
import CartItem from '../container/CartItem';
import { clearToCart } from "../utilis/api";
import { useContext } from "react";
import { CartContext } from "../contexts/CartContext";

const CartPage = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const {cart, cartLoading, cartError} = useContext(CartContext)

  const shipping = 4.00;
  const total = (Number(cart?.total_price) + shipping).toFixed(2);

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
      <div className="flex flex-col lg:flex-row gap-8 md:gap-6">
        {/* LEFT: Cart Items */}
        <div className="lg:w-[65%] border-2 border-gray-200 rounded-xl shadow-sm">
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
              [1,2,3].map((item, index) => 
                <div key={index} className="grid grid-cols-[4fr_1fr_1fr] items-center justify-between gap-4 py-3 border-b last:border-none animate-pulse">
                  {/* Product Section */}
                  <div className="flex gap-2 items-center">
                    <div className="w-4 h-4 rounded-full bg-gray-300"></div>
                    <div className="w-16 aspect-square rounded-md bg-gray-300"></div>
                    <div className="h-4 bg-gray-300 rounded w-[150px]"></div>
                  </div>

                  {/* Price */}
                  <div className="h-4 bg-gray-300 rounded w-12 mx-auto"></div>

                  {/* Quantity */}
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-10 h-[32px] rounded bg-gray-300"></div>
                    <div className="flex flex-col items-center -mt-1 gap-1">
                      <div className="w-5 h-5 rounded bg-gray-300"></div>
                      <div className="w-5 h-5 rounded bg-gray-300"></div>
                    </div>
                  </div>
                </div>
              )
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between px-5 py-3 border-t text-gray-800 font-semibold">
            <div className="flex gap-2 items-center">Total: {!cartLoading ? <span className="text-red-500 flex items-center gap-1"><div className="text-sm">NGN</div>{Number(cart?.total_price || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span> : <div className="h-4 bg-gray-300 rounded w-16 animate-pulse"></div>}</div>
            <button
              onClick={() => {if(cart?.cartitem.length !== 0) {mutationClear.mutate({})}}} 
              className="flex items-center gap-1 px-3 py-1 text-red-600 border border-red-400 rounded-lg hover:bg-red-500 hover:text-white transition-all duration-200"
            >
              <RiDeleteBinLine className="text-lg" /> Clear Cart
            </button>
          </div>
        </div>

        {/* RIGHT: Checkout Summary */}
        <div className="lg:w-[35%] border-2 border-gray-200 rounded-xl shadow-sm p-6 flex flex-col gap-4 justify-center items-center h-fit">
          <h3 className="text-lg font-semibold text-gray-700">Order Summary</h3>

          <div className="w-full flex justify-between text-gray-600 items-center">
            <span>Subtotal:</span>
            {!cartLoading ? <span className="flex items-center gap-1"><div className="text-sm">NGN</div>{Number(cart?.total_price || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span> : <div className="h-4 bg-gray-300 rounded w-16 animate-pulse"></div>}
          </div>


          <div className="w-full flex justify-between text-gray-600">
            <span>Shipping Fee:</span>
            <span className="flex items-center gap-1"><div className="text-sm">NGN</div>{shipping?.toFixed(2)}</span>
          </div>

          <div className="w-full border-t pt-2 flex justify-between font-semibold text-gray-800">
            <span>Total Payment:</span>
            {!cartLoading ? <span className="text-red-500 flex items-center gap-1"><div className="text-sm">NGN</div>{Number(total || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span> : <div className="h-4 bg-gray-300 rounded w-16 animate-pulse"></div>}
          </div>

          <button
          disabled={cartLoading}
            onClick={() => navigate('/checkout')}
            className={`w-full mt-3 text-white font-semibold py-2 rounded-lg shadow-md transition-all duration-300 ${cartLoading ? 'cursor-not-allowed bg-red-300' : 'bg-red-500 hover:bg-red-600'}`}
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
