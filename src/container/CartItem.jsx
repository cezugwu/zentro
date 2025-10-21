import React, { useEffect, useRef, useState } from 'react';
import { FaCaretUp, FaCaretDown } from "react-icons/fa";
import { X } from 'lucide-react';
import { useQueryClient, useMutation} from '@tanstack/react-query';
import { BASE_IMAGE_URL, BASE_URL } from '../utilis/config';

const CartItem = ({ item }) => {
  const { title, image, price, slug } = item?.product;
  const queryClient = useQueryClient();

  const guest = localStorage.getItem("guest")
  const token = localStorage.getItem("access");
  const headers = {
    "Content-Type": "application/json",
    ...(token && { "Authorization": `Bearer ${token}` }),
  };

  const addToCart = async ({ slug, quantity, action }) => {
    const response = await fetch(`${BASE_URL}/add/`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        session_id: guest,
        slug,
        quantity,
        action,
      }),
    });
    if (!response.ok) throw new Error("failed to add to cart");
    return response.json();
  };
  const mutation = useMutation({
    mutationFn: addToCart,
    onMutate: async ({ slug, quantity }) => {
      await queryClient.cancelQueries(['cart']);
      const previousCart = queryClient.getQueryData(['cart']);
      queryClient.setQueryData(['cart'], old => {
        if (!old) return old;
        return {
          ...old,
          cartitem: old.cartitem.map(ci =>
            ci.product.slug === slug
              ? { ...ci, quantity: quantity }
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

  const removeToCart = async({slug}) => {
    const response = await fetch(`${BASE_URL}/remove/`, {
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
  const mutationRemove = useMutation({
    mutationFn: removeToCart,
    onMutate: async ({ slug, quantity }) => {
      await queryClient.cancelQueries(['cart']);
      const previousCart = queryClient.getQueryData(['cart']);
      queryClient.setQueryData(['cart'], old => {
        if (!old) return old;
        return {
          ...old,
          cartitem: old.cartitem.map(ci =>
            ci.product.slug === slug
              ? { ...ci, quantity: quantity }
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

  const deleteToCart = async({slug}) => {
    const response = await fetch(`${BASE_URL}/delete/`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        session_id: guest,
        slug: slug,
      }),
    });
    if (!response.ok) {
      throw new Error("failed to add to cart");
    }
    return response.json();
  }
  const mutationDelete = useMutation({
    mutationFn: deleteToCart,
    onMutate: async ({ slug, quantity }) => {
      await queryClient.cancelQueries(['cart']);
      const previousCart = queryClient.getQueryData(['cart']);
      queryClient.setQueryData(['cart'], old => {
        if (!old) return old;
        return {
          ...old,
          cartitem: old.cartitem.map(ci =>
            ci.product.slug === slug
              ? { ...ci, quantity: quantity }
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
    <div className="grid grid-cols-[4fr_1fr_1fr] items-center justify-between gap-4 py-3 border-b last:border-none text-gray-800 hover:bg-gray-50 transition-all duration-150">
      <div className='flex gap-2 items-center justify-center'>
        <X onClick={() => mutationDelete.mutate({ slug })} className='w-4 h-4 cursor-pointer select-none hover:scale-[1.4] hover:text-red-600 duration-300' />
        <img src={`${BASE_IMAGE_URL}/${image}`} className='w-[100px] aspect-square object-cover rounded-md' alt="" />
        <h1 className='flex-1 font-medium'>{title?.slice(0,30)+' . . .'}</h1>
      </div>

      {/* Price */}
      <div className="text-gray-600 text-center">${parseFloat(price).toFixed(2)}</div>
      
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
