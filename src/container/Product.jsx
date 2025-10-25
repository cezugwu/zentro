import { ShoppingCart } from 'lucide-react';
import { useQueryClient, useMutation } from '@tanstack/react-query'
import { BASE_IMAGE_URL, BASE_URL } from '../utilis/config';
import { addToCart } from '../utilis/api';
import { useNavigate } from 'react-router-dom';

const Product = ({ product }) => {
  const navigate = useNavigate();
  const { title, slug, price, image } = product;
  const queryClient = useQueryClient();
  
  const mutation = useMutation({
    mutationFn: addToCart,

    onMutate: async ({ slug, product }) => {
      await queryClient.cancelQueries(['cart']);
      const previousCart = queryClient.getQueryData(['cart']);

      queryClient.setQueryData(['cart'], old => {
        if (!old) return old;

        const existingItem = old.cartitem.find(ci => ci.product.slug === slug);

        let updatedCartItems;

        if (existingItem) {
          // If item already exists, increase quantity
          updatedCartItems = old.cartitem.map(ci =>
            ci.product.slug === slug
              ? { ...ci, quantity: ci.quantity + 1 }
              : ci
          );
        } else {
          // If item doesn't exist, add new one
          updatedCartItems = [
            ...old.cartitem,
            { product, quantity: 1 },
          ];
        }

        return {
          ...old,
          cartitem: updatedCartItems,
        };
      });

      return { previousCart };
    },

    onError: (_err, _vars, context) => {
      if (context?.previousCart) {
        queryClient.setQueryData(['cart'], context.previousCart);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries(['cart']);
    },
  });

  return (
    <div className="space-y-1 hover:shadow-lg transition-all duration-500 p-3 rounded-md bg-white">
      <div className="relative">
        <img
          src={`${BASE_IMAGE_URL}/${image}`}
          className="aspect-square object-cover rounded-md"
        />
        <ShoppingCart
          onClick={() => mutation.mutate({ slug, product })}
          className="absolute bottom-3 right-3 w-10 h-10 p-2 rounded-full bg-black/60 text-white hover:bg-black duration-300 cursor-pointer select-none"
          strokeWidth={2}
        />
      </div>

      <div className="font-medium text-gray-800">{title.slice(0, 40) + '...'}</div>

      <div className="flex items-end font-semibold text-gray-900">
        <span className="text-[1em] mb-[2px]">NGN</span>
        <span className="text-[1.2em] ml-1">{price}</span>
      </div>

      <div className="text-[0.85em] text-gray-500 font-medium">⭐ 4.6 | 99+ sold</div>

      <div onClick={() => navigate(`../product/${slug}`)} className="w-full text-center p-2 bg-black text-white font-semibold text-[0.9em] hover:bg-gray-900 transition-colors rounded-sm cursor-pointer">
        See preview
      </div>
      <div className="w-full text-center p-2 border border-black text-[0.9em] font-semibold hover:bg-gray-100 transition-colors rounded-sm">
        Similar items
      </div>
    </div>
  );
};

export default Product;
