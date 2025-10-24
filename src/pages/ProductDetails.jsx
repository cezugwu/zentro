import { useParams } from 'react-router-dom';
import {useQuery, useQueryClient, useMutation} from '@tanstack/react-query';
import { BASE_URL } from '../utilis/config';
import { fetchProductDetail, addToCart } from '../utilis/api';

const ProductDetails = () => {
  const {slug} = useParams();
  const queryClient = useQueryClient();

  const {data:product, isLoading:productLoading, isError:productError} = useQuery ({
    queryKey: ['productdetail'],
    queryFn: () => fetchProductDetail(slug),
    staleTime: 60*60*4
  })

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

  return (
      <div>
        {
          !productLoading ? 
          (<div className='mt-[100px]'>
          <div className='w-full h-[700px] md:h-[500px] flex justify-center items-center flex-col gap-2 md:flex-row lg:flex-row mt-[100px] px-[30px] py-2 my-5'>
            <div className='w-full h-[40%] md:h-[100%] md:w-[40%] flex justify-center items-center'>
                <div className='w-[190px] h-[260px] md:w-[250px] md:h-[350px]'><img className='w-full h-full' src={`${BASE_URL}/${product.image}`} alt="" /></div>
            </div>
            <div className='w-full h-[60%] md:h-[100%] md:w-[60%] flex flex-col md:justify-center md:items-start items-center py-5 px-5 md:pd-[0px]'>
                <div>
                    <div className='font-semibold text-[1.3em] uppercase mb-8'>{product?.name}</div>
                    <div className='text-[1em] text-red-500 my-3'>${product?.price}</div>
                    <div className='text-[0.95em] my-3'>{product?.description}</div>
                    <div className='text-[1em] w-[100px] h-[35px] bg-black text-white my-3 flex justify-center items-center rounded-[5px] cursor-pointer'>
                      <button onClick={() => mutation.mutate({slug})} className='w-full h-full rounded-[5px]'>add to cart</button>
                    </div>
                </div>
            </div>
          </div>
        </div>) 
          : 
        (<p>loading ...</p>)
        }
      </div>
    );
};

export default ProductDetails;
