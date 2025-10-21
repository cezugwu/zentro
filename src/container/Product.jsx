import { ShoppingCart } from 'lucide-react';
import { useQueryClient, useMutation } from '@tanstack/react-query'
import { BASE_IMAGE_URL, BASE_URL } from '../utilis/config';

const Product = ({ product }) => {
  const { title, slug, price, category, image } = product;

  const queryClient = useQueryClient();
  
  const guest = localStorage.getItem("guest")
  const token = localStorage.getItem("access");
  // Build headers object
  const headers = {
    "Content-Type": "application/json",
    ...(token && { "Authorization": `Bearer ${token}` }), // only add if token exists
  };

  const addToCart = async({slug}) => {
    const response = await fetch(`${BASE_URL}/add/`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        session_id: guest,
        slug: slug,
        quantity: 1,
      }),
    });
    if (!response.ok) {
      throw new Error("failed to add to cart");
    }
    return response.json();
  }
  const mutation = useMutation({
    mutationFn:addToCart,
    onSuccess:() => {
      queryClient.invalidateQueries(['cart'])
    }
  })


  return (
    <div className='space-y-[1px] hover:shadow-xl duration-500 p-3'>
      <div className='relative'>
        <img src={`${BASE_IMAGE_URL}/${image}`} className='aspect-square object-cover' />
        <ShoppingCart onClick={() => mutation.mutate({slug})} className="absolute bottom-4 right-4 w-12 h-12 p-2 rounded-full bg-white/10 backdrop-blur-md shadow-lg border border-white/20 text-white hover:scale-110 duration-500 cursor-pointer select-none" strokeWidth={2} />
      </div>
      <div className='font-medium'>{title.slice(0,40)+' . . .'}</div>
      <div className='flex items-end font-semibold'><span className='text-[1.1em] mb-[2px]'>NGN</span><span className='text-[1.4em]'>{price}</span></div>
      <div className='text-[0.9em] text-gray-500 font-medium'>4.6 | 99+ sold</div>
      <div className='w-full text-center p-2 bg-black text-white font-semibold cursor-pointer select-none'>See preview</div>
      <div className='w-full text-center p-2 border border-black font-semibold cursor-pointer select-none'>Similar items</div>
    </div>
  );
};

export default Product;
