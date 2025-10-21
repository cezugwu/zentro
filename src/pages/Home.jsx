import Product from '../container/Product';
import Hero from '../components/hero';
import {useQuery} from '@tanstack/react-query'
import { BASE_URL } from '../utilis/config';

const Home = () => {
  const fetchData = async () => {
    const response = await fetch(`${BASE_URL}/product/`);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  }

  const {data:product, isLoading:productLoading, isError:productError} = useQuery ({
    queryKey: ['product'],
    queryFn: fetchData,
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
              product.map((product) => <Product key={product.id} product={product} />)
            ) : (
              <p className="col-span-full text-center text-gray-500 text-sm md:text-base">
                No products found.
              </p>
            )
          ) : (
            <p className="col-span-full text-center text-gray-500 text-sm md:text-base animate-pulse">
              Loading products...
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
