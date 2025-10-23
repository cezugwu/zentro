import { useNavigate } from 'react-router-dom';
import {useQuery, useQueryClient, useMutation} from '@tanstack/react-query';
import { BASE_URL } from "../utilis/config";
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
<div className="mt-20 m-4 space-y-4">
  <div className="mb-6 md:mb-8 font-semibold text-gray-800 flex items-center justify-between">
    Order history page <ArrowUpNarrowWide />
  </div>

  {order?.map((orderItem, orderIndex) => (
    <div key={orderIndex} className="border border-black rounded-lg">
      <div className='flex items-center justify-between bg-gray-200 rounded-t-lg p-2'><h2>Order - {orderIndex+1}</h2><p>{new Date(orderItem.updated_at).toLocaleString('en-GB', {dateStyle: 'full', timeStyle: 'short'})}</p></div>

      {orderItem?.cartitem?.map((item, itemIndex) => (
        <div key={itemIndex} className="border-b p-2">
          <p className="font-semibold">{item.product.title}</p>
          <p>Price: ₦{item.product.price}</p>
          <p>Quantity: {item.quantity}</p>
        </div>
      ))}
    </div>
  ))}
</div>

  );
}

export default OrderPage;
