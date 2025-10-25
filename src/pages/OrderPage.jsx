import { useNavigate } from 'react-router-dom';
import {useQuery, useQueryClient, useMutation} from '@tanstack/react-query';
import { BASE_IMAGE_URL, BASE_URL } from "../utilis/config";
import { ArrowUpNarrowWide } from 'lucide-react';

const OrderPage = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const guest = localStorage.getItem("guest")
  const token = localStorage.getItem("access");
  const headers = {
    "Content-Type": "application/json",
    ...(token && { "Authorization": `Bearer ${token}` }),
  };
  
  const fetchOrder = async () => {
    const response = await fetch(`${BASE_URL}/order/?session_id=${guest}`, {
      method:'GET',
      headers,
    });
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  }

  const {data:order, isLoading:orderLoading, isError:orderError} = useQuery ({
    queryKey: ['order', localStorage.getItem('access')],
    queryFn: fetchOrder,
    staleTime: 1000*60*4
  })

  console.log(order)

  return(
<div className="mt-[90px] mb-[40px] px-4 md:px-10 text-[0.95em]">
  <div className="max-w-5xl mx-auto space-y-10">

    {/* HEADER */}
    <div className="flex items-center justify-between border-b border-gray-300 pb-3">
      <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-500 bg-clip-text text-transparent flex items-center gap-2">
        Order History
        <ArrowUpNarrowWide className="w-6 h-6 text-indigo-500" />
      </h1>
    </div>

    {/* ORDERS */}
    {order?.length > 0 ? (
      order.map((orderItem, orderIndex) => (
        <div
          key={orderIndex}
          className="border border-gray-200 rounded-3xl shadow-lg bg-gradient-to-br from-white to-gray-50/70 backdrop-blur-sm overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
        >
          {/* ORDER HEADER */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-gray-100 py-4 px-6">
            <h2 className="font-semibold text-gray-700">
              🛍️ Order #{orderIndex + 1}
            </h2>
            <p className="text-gray-500 text-sm">
              {new Date(orderItem.updated_at).toLocaleString("en-GB", {
                dateStyle: "full",
                timeStyle: "short",
              })}
            </p>
          </div>

          {/* ITEMS */}
          <div className="divide-y divide-gray-200">
            {orderItem.cartitem.map((item, itemIndex) => (
              <div
                key={itemIndex}
                className="flex justify-between items-center gap-4 py-4 px-6 hover:bg-gray-50/80 transition-colors duration-200"
              >
                {/* LEFT: Product Info */}
                <div className="flex items-center gap-4">
                  <img
                    src={`${BASE_IMAGE_URL}/${item.product.image}`}
                    className="w-16 h-16 object-cover rounded-xl border border-gray-200 shadow-sm"
                  />
                  <div>
                    <p className="font-semibold text-gray-800">{item.product.title}</p>
                    <p className="text-sm text-gray-600">
                      NGN{item.product.price.toLocaleString()} × {item.quantity}
                    </p>
                  </div>
                </div>

                {/* RIGHT: Total */}

              </div>
            ))}
          </div>

          {/* FOOTER */}
          <div className="flex justify-between items-center bg-gradient-to-r from-indigo-50 to-purple-50 border-t border-gray-100 py-4 px-6 rounded-b-3xl">
            <p className="font-medium text-gray-700">Total Amount</p>
            <p className="font-bold text-indigo-700 text-lg">
              NGN
              {orderItem.cartitem
                .reduce(
                  (sum, item) => sum + item.product.price * item.quantity,
                  0
                )
                .toLocaleString()}
            </p>
          </div>
        </div>
      ))
    ) : (
      <div className="text-center text-gray-500 italic py-10">
        You have no orders yet.
      </div>
    )}
  </div>
</div>


  );
}

export default OrderPage;
