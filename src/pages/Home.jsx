import Product from '../container/Product';
import Hero from '../components/hero';
import {useQuery} from '@tanstack/react-query'
import { fetchProduct } from '../utilis/api';

const Home = () => {
  const {data:product, isLoading:productLoading, isError:productError} = useQuery ({
    queryKey: ['product'],
    queryFn: fetchProduct,
    staleTime: 60*60*4
  })

  if (productError) {return(<div>Something went wrong</div>)}

  return (
    <div className="w-full min-h-screen bg-white flex flex-col items-center mb-10">
      {/* HERO SECTION */}
      <Hero />
      {/* PRODUCTS SECTION */}
      <div className="w-full mt-6 md:mt-10 px-5 md:px-10">
        {/* PRODUCT GRID */}
        <div className="grid grids gap-4 md:gap-6">
          {!productLoading ? (
            product.length > 0 ? (
              product.map((product, index) => <Product key={index} product={product} />)
            ) : (
              <p className="col-span-full text-center text-gray-500 text-sm md:text-base">
                No products found.
              </p>
            )
          ) : (
            [1,2,3,4].map((item, index) => 
              <div key={index} className="p-3 space-y-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-md animate-pulse">
                {/* Image skeleton */}
                <div className="relative">
                  <div className="aspect-square rounded-xl bg-gradient-to-br from-gray-300/40 to-gray-400/20"></div>
                  <div className="absolute bottom-4 right-4 w-12 h-12 rounded-full bg-gray-300/40 border border-white/20 shadow-sm"></div>
                </div>

                {/* Title */}
                <div className="h-4 bg-gray-300/60 rounded w-4/5"></div>

                {/* Price */}
                <div className="flex items-end space-x-3">
                  <div className="h-4 bg-gray-300/60 rounded w-10"></div>
                  <div className="h-5 bg-gray-300/60 rounded w-20"></div>
                </div>

                {/* Rating */}
                <div className="h-3 bg-gray-300/40 rounded w-1/2"></div>

                {/* Buttons */}
                <div className="w-full h-9 bg-gray-300/70 rounded-lg"></div>
                <div className="w-full h-9 bg-gray-300/50 rounded-lg"></div>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
