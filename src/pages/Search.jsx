import { Check, ChevronDown, ChevronRight, ListFilterPlus, MessageCircleQuestionMark, PackageOpen, Plus, Star, X } from 'lucide-react';
import { useContext, useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import {
  useQuery,
  useMutation,
} from '@tanstack/react-query'
import { BASE_URL } from '../utilis/config';
import Filter from '../components/Filter';
import Product from '../container/Product';

const sizes = ['S', 'M', 'X', 'XL', 'XXL'];

const Search = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const categ = searchParams.get("category");
  const search = searchParams.get("q");

  const fetchProducts = async () => {
    const response = await fetch(`${BASE_URL}/product/?category=${categ || ""}&search=${search || ""}`);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  };

  const { data:products, isLoading:productsLoading, isError:productsError } = useQuery({
    queryKey: ["products", categ, search],
    queryFn: fetchProducts,
    staleTime: 60*1000*4,
  });

  const [q, setQ] = useState('');
  const [category, setCategory] = useState('');
  const [size, setSize] = useState('');
  const [fil, setFil] = useState(false);
      
  useEffect(() => {
    setCategory(categ)
  }, [categ, q])

  const addCategory = (category) => {
    searchParams.set("category", category);
    setSearchParams(searchParams);
  };

  const removeCategory = () => {
    searchParams.delete("category");
    setSearchParams(searchParams); 
  };

  const [grab, setGrab] = useState(false);
  const boxRef = useRef(null);
  const startY = useRef(0);
  const scrollTop = useRef(0);

  const mouseDown = (e) => {
    e.preventDefault();
    setGrab(true);
    if (boxRef.current) {
      console.log(e.pageY)
      startY.current = e.pageY;
      scrollTop.current = boxRef.current.scrollTop;
    }
  }

  const mouseLeave = () => setGrab(false);
  const mouseUp = () => setGrab(false);

  const mouseMove = (e) => {
    e.preventDefault();
    if (!grab) return;
    if (boxRef.current) {
      const y = e.pageY;
      const walk = y - startY.current;
      boxRef.current.scrollTop = scrollTop.current - walk;
    }
  }

  
  return(
    <div className="mt-20 font-jost bg-gray-50 min-h-screen">
      {/* Breadcrumb */}
      <div className="py-4 px-6 shadow-sm">
        <div className="flex items-center text-sm tracking-wide text-gray-500">
          <span
            className="hover:underline cursor-pointer"
            onClick={() => {
              navigate("../");
              window.scrollTo(0, 0);
            }}
          >
            Ecommerce
          </span>
          <ChevronRight className="w-4 h-4 mx-1" strokeWidth={1.5} />
          <span className="font-light text-gray-700">Search</span>
        </div>
      </div>

      <div className="flex justify-around bg-gray-50 p-4 gap-6 text-[0.9em]">
        {/* Sidebar */}
        <div
          onMouseDown={mouseDown}
          onMouseMove={mouseMove}
          onMouseUp={mouseUp}
          onMouseLeave={mouseLeave}
          ref={boxRef}
          className={`h-[80vh] min-h-[300px] w-[260px] hidden lg:flex flex-col sticky top-24 overflow-auto rounded-xl bg-white p-5 shadow-2xl ${
            grab ? "cursor-grab" : "cursor-grabbing"
          } scrollbar-hide`}
        >
          <h1 className="font-medium pb-3 text-[1em] border-b">Categories</h1>
          <div className="mt-3 space-y-3">
            {['Electronics', 'Clothings'].map((item, index) => (
              <div
                key={index}
                onClick={() => {
                  addCategory(item);
                  window.scrollTo(0, 0);
                }}
                className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition ${
                  category === item
                    ? "bg-black text-white"
                    : "hover:bg-gray-100 text-gray-700"
                }`}
              >
                <Check
                  className={`w-4 h-4 ${
                    category === item ? "opacity-100" : "opacity-0"
                  } transition`}
                />
                <span className="capitalize">{item}</span>
              </div>
            ))}
          </div>

          <div className="py-3 font-medium text-[1em] border-b mt-4">Size</div>
          <div className="flex gap-3 mt-3 flex-wrap">
            {sizes.map((item, index) => (
              <div
                key={index}
                onClick={() => setSize(item)}
                className={`rounded-md w-8 h-8 flex items-center justify-center cursor-pointer transition ${
                  size === item
                    ? "bg-black text-white border-black"
                    : "hover:bg-gray-200"
                }`}
              >
                {item}
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {/* Applied Filters */}
          <div className="flex items-center gap-4 text-[1.1em]">
            <h1>Applied Filters</h1>
            <ListFilterPlus
              onClick={() => setFil(true)}
              className="w-5 h-5 cursor-pointer lg:hidden"
              strokeWidth={2.5}
            />
          </div>

          <div className="flex gap-3 my-3 flex-wrap">
            {category && (
              <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-black text-white text-sm shadow-sm">
                <p>{category}</p>
                <X
                  onClick={() => {
                    setCategory("");
                    removeCategory();
                  }}
                  className="w-4 h-4 cursor-pointer hover:scale-110 transition"
                  strokeWidth={1.5}
                />
              </div>
            )}
            {size && (
              <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-gray-700 text-white text-sm shadow-sm">
                <p>{size}</p>
                <X
                  onClick={() => setSize("")}
                  className="w-4 h-4 cursor-pointer hover:scale-110 transition"
                  strokeWidth={1.5}
                />
              </div>
            )}
          </div>

          {/* Product Grid */}
          <div className="grid size gap-6">
          {!productsLoading ? (
            products?.length > 0 ? (
              products?.map((product, index) => <Product key={index} product={product} />)
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

      <Filter
        size={size}
        setSize={setSize}
        category={category}
        fil={fil}
        setFil={setFil}
      />
    </div>
  );
}

export default Search;