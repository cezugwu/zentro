import { createContext } from 'react'
import { useQuery } from "@tanstack/react-query";
import { fetchCart } from '../utilis/api';

export const CartContext = createContext();

const CartProvider = ({children}) => {
    const {data:cart, isLoading:cartLoading, isError:cartError} = useQuery ({
        queryKey: ['cart'],
        queryFn: fetchCart,
        staleTime: 60*60*4
    })

    return(
        <CartContext.Provider value={{cart, cartLoading, cartError}}>
            {children}
        </CartContext.Provider>
    );
}

export default CartProvider;