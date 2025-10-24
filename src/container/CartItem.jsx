import React, { useEffect, useRef, useState } from 'react';
import { FaCaretUp, FaCaretDown } from "react-icons/fa";
import { X } from 'lucide-react';
import { useQueryClient, useMutation} from '@tanstack/react-query';
import { BASE_IMAGE_URL, BASE_URL } from '../utilis/config';
import { useNavigate } from 'react-router-dom';
import { addToCart, removeToCart, deleteToCart } from '../utilis/api';

const CartItem = ({ item }) => {
  const { title, image, price, slug } = item?.product;
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: addToCart,
    onMutate: async ({ slug }) => {
      await queryClient.cancelQueries(['cart']);
      const previousCart = queryClient.getQueryData(['cart']);
      queryClient.setQueryData(['cart'], old => {
        if (!old) return old;
        return {
          ...old,
          cartitem: old.cartitem.map(ci =>
            ci.product.slug === slug
              ? { ...ci, quantity: ci.quantity+1 }
              : ci
          ),
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

  const mutationRemove = useMutation({
    mutationFn: removeToCart,
    onMutate: async ({ slug }) => {
      await queryClient.cancelQueries(['cart']);
      const previousCart = queryClient.getQueryData(['cart']);
      queryClient.setQueryData(['cart'], old => {
        if (!old) return old;
        return {
          ...old,
          cartitem: old.cartitem.map(ci =>
            ci.product.slug === slug
              ? { ...ci, quantity: ci.quantity-1 }
              : ci
          ),
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

  const mutationDelete = useMutation({
    mutationFn: deleteToCart,
    onMutate: async ({ slug }) => {
      await queryClient.cancelQueries(['cart']);
      const previousCart = queryClient.getQueryData(['cart']);

      queryClient.setQueryData(['cart'], old => {
        if (!old) return old;
        return {
          ...old,
          cartitem: old.cartitem.filter(ci => ci.product.slug !== slug),
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

  const [quantity, setQuantity] = useState('');
  const timerRef = useRef(null);
  const inputChange = (e) => {
    setQuantity(e.target.value);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      mutation.mutate({ slug, quantity: e.target.value, action:'true' });
    }, 1000);
  };

  useEffect(() => {
    setQuantity(item.quantity);
  }, [item.quantity]);

  return (
    <div className="grid grid-cols-[4fr_1fr_1fr] items-center justify-between gap-4 py-3 border-b last:border-none text-gray-800 hover:bg-gray-50 transition-all duration-150 text-sm">
      <div className="flex gap-2 items-center all group">
        <X onClick={() => mutationDelete.mutate({ slug })} className="w-4 h-4 cursor-pointer select-none hover:scale-[1.4] hover:text-red-600 duration-300" />

        <img src={`${BASE_IMAGE_URL}/${image}`} className="w-16 aspect-square object-cover rounded-md border border-gray-400" />

        <h1 onClick={() => navigate(`/product/${slug}`)} className="flex-1 max-w-[180px] text-sm text-gray-800 hover:text-blue-600 transition-colors duration-200 cursor-pointer" >{title}</h1>
      </div>

      {/* Price */}
      <div className="text-gray-600 text-center ">{Number(price || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
      
      {/* Quantity */}
      <div className="flex items-center justify-center gap-2">
        <input
          type="text"
          className='w-full h-[32px] p-1 outline-none border border-gray-500 rounded text-[0.95em]'
          value={quantity}
          onChange={inputChange}
        />
        <div className="flex flex-col items-center -mt-1">
          <button
            onClick={() => mutation.mutate({ slug, quantity: 1 })}
            className="text-gray-500 hover:text-gray-800 transition-all duration-150"
          >
            <FaCaretUp className='w-6 h-6' />
          </button>
          <button
            onClick={() => mutationRemove.mutate({ slug, quantity: 1 })}
            className="text-gray-500 hover:text-gray-800 transition-all duration-150"
          >
            <FaCaretDown className='w-6 h-6' />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
