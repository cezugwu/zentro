import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import { ChevronDown, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { BASE_URL } from '../utilis/config';

const countries = ['Nigeria', 'Ghana', 'Kenya', 'South Africa'];

const Shipping  = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryClient = useQueryClient();
  const checkId = searchParams?.get('id') || '';

  const guest = localStorage.getItem("guest")
  const token = localStorage.getItem("access");
  const headers = {
      "Content-Type": "application/json",
      ...(token && { "Authorization": `Bearer ${token}` }),
  };

  const fetchShip = async () => {
      const response = await fetch(`${BASE_URL}/ship/?session_id=${guest}`, {
      method:'GET',
      headers,
      });
      if (!response.ok) {
      throw new Error("Network response was not ok");
      }
      return response.json();
  }

  const {data:ship, isLoading:shipLoading, isError:shipError} = useQuery ({
      queryKey: ['ship'],
      queryFn: fetchShip,
      staleTime: 60*60*4
  })

  const shippingTrue = async({id, isDefault}) => {
    const response = await fetch(`${BASE_URL}/shippingtrue/`, {
      method: "PUT",
      headers,
      body: JSON.stringify({
        session_id: guest,
        shipping_id: id,
        default: isDefault
      }),
    });
    if (!response.ok) {
      throw new Error("failed to add to cart");
    }
    return response.json();
  }

  const mutationTrue = useMutation({
    mutationFn: shippingTrue,
    onSuccess: () => {
      queryClient.invalidateQueries(['ship']); queryClient.invalidateQueries(['shipping']); window.scroll(0, 0)
    },
  });

  const shippingPost = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);

    const defaultChecked = formData.has("default");
    formData.set("default", defaultChecked);
    formData.set("session_id", guest);

    const data = Object.fromEntries(formData); 
    console.log(data)

    const response = await fetch(`${BASE_URL}/shipping/`, {
      method: "POST",
      headers,
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Failed to add shipping info");
    }

    return response.json();
  };

  const mutationPost = useMutation({
    mutationFn: shippingPost,
    onSuccess: () => {
      queryClient.invalidateQueries(["ship"]);
      queryClient.invalidateQueries(["shipping"]);
      window.scrollTo(0, 0);
      setShipping(false);
    },
  });

  const shippingUpdate = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);

    const defaultChecked = formData.has("default");
    formData.set("default", defaultChecked);
    formData.set("session_id", guest);
    formData.set("shipping_id", checkId);

    const data = Object.fromEntries(formData); 
    console.log(data)

    const response = await fetch(`${BASE_URL}/shippingupdate/`, {
      method: "PUT",
      headers,
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Failed to add shipping info");
    }

    return response.json();
  };

  const mutationUpdate = useMutation({
    mutationFn: shippingUpdate,
    onSuccess: () => {
      queryClient.invalidateQueries(["ship"]);
      queryClient.invalidateQueries(["shipping"]);
      window.scrollTo(0, 0);
      setShipping(false);
      searchParams.delete('id'); setSearchParams(searchParams, { replace: true });
    },
  });

  const getShipping = async ({id}) => {
    const response = await fetch(`${BASE_URL}/shippingid/?session_id=${guest}&shipping_id=${checkId}`, {
    method:'GET',
    headers,
    });
    if (!response.ok) {
    throw new Error("Network response was not ok");
    }
    return response.json();
  }

  const { data: sh, isLoading: shLoading, isError: shError } = useQuery({
    queryKey: ['sh', checkId],
    queryFn: getShipping,
    enabled: !!checkId,
  });

  console.log(sh)

  const [shipping, setShipping] = useState(false);
  const shippingRef = useRef(null);
  useEffect(() => {
      const handleClickOutside = (e) => {
          if (shippingRef.current && !shippingRef.current.contains(e.target)) {
              setShipping(false);
              searchParams.delete('id'); setSearchParams(searchParams, { replace: true });
          }
      };

      window.addEventListener("mousedown", handleClickOutside);
      return () => window.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const [country, setCountry] = useState('Nigeria');
  const [countryOn, setCountryOn] = useState(false);
  const countryOnRef = useRef(null);
  useEffect(() => {
      const handleClickOutside = (e) => {
          if (countryOnRef.current && !countryOnRef.current.contains(e.target)) {
              setCountryOn(false);
          }
      };

      window.addEventListener("mousedown", handleClickOutside);
      return () => window.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (sh) {
      setCountry(sh?.country)
    }
  }, [checkId])

  if (shipError) {return(<div>Something went wrong</div>)}
  return (
    <div>
      {mutationTrue.isPending &&
        <div className='fixed z-20 top-0 w-full h-full bg-white/30 backdrop-blur-sm flex items-center justify-center'>
          <div className="flex justify-center items-center py-6">
            <div className="w-[50px] h-[50px] border-[6px] border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      }

      <div className="mt-20 px-4 font-[Inter]">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">User Shipping Information</h2>

        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm">
          {/* Header */}
          <div className="flex justify-between items-center px-5 py-3 border-b border-gray-100 bg-gray-50 rounded-t-2xl">
            <span className="font-medium text-gray-700">Shipping Address</span>
            <button
              onClick={() => setShipping(!shipping)}
              className="text-blue-600 text-sm font-medium hover:text-blue-800 transition"
            >
              + Add Shipping
            </button>
          </div>

          {/* Shipping List */}
          <div className="p-4 space-y-3">
            {!shipLoading ? (
              ship?.shippings?.length > 0 ? (
                ship?.shippings.map((item, index) => (
                  <div className='border border-gray-200 p-3 rounded-lg transition-all duration-200 flex items-center justify-between'>
                    <div className='flex flex-col space-y-2'>
                      <div className='flex items-center gap-4'>
                        <div onClick={() => mutationTrue.mutate({id:item.id})} className={`w-5 h-5 cursor-pointer select-none rounded-full border-[4px] ${item.selected && 'bg-blue-400 '}`}></div>
                        <div key={index}>
                          <p className="font-medium text-gray-800">
                            {item.address}, {item.city}, {item.state}
                          </p>
                          <p className="text-gray-600 text-sm">{item.zip_code}</p>
                          <p className="text-gray-600 text-sm">{item.phone}</p>
                        </div>
                      </div>
                      {item.default && <div className='border bg-gray-400 rounded-md w-fit px-2'>default</div>}
                    </div>
                    <div className='flex flex-col items-end gap-2'>
                      <p onClick={() => {searchParams.set('id', item.id); setSearchParams(searchParams, { replace: true }); setShipping(!shipping)}} className='cursor-pointer select-none hover:underline text-red-500'>edit</p>
                      {!item.default && <p onClick={() => mutationTrue.mutate({id:item.id, isDefault:true})} className='cursor-pointer select-none hover:underline'>set as default</p>}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 italic text-center py-4">
                  You have no shipping details yet.
                </p>
              )
            ) : (
              <div className="space-y-3">
                {[1, 2, 3].map((item, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-lg p-3 animate-pulse"
                  >
                    <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-300 rounded w-2/3 mb-2"></div>
                    <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal for Adding New Address */}
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md bg-black/30 transition-all duration-300 ${
          shipping ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      >
        <div
          ref={shippingRef}
          className="relative bg-white/80 backdrop-blur-xl shadow-2xl rounded-2xl p-8 w-[90%] md:w-[600px] max-h-[90vh] overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden transition-all duration-500"
        >
          <X
            onClick={() => {setShipping(false); searchParams.delete('id'); setSearchParams(searchParams, { replace: true });}}
            className="absolute top-4 right-4 w-5 h-5 cursor-pointer text-gray-600 hover:text-red-500 hover:scale-110 transition"
          />
          <h3 className="text-xl font-semibold text-gray-800 mb-6">
            Add New Address
          </h3>

          <form key={sh?.id || 'new'} onSubmit={(e) => {if (checkId) {mutationUpdate.mutate(e)} else {mutationPost.mutate(e)}}}>
            {/* Country */}
            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Country/Region
              </label>
              <div ref={countryOnRef} className="relative">
                <input
                  type="text"
                  name="country"
                  className="border border-gray-300 w-full h-10 rounded-md outline-none px-3 bg-gray-50 cursor-pointer"
                  value={country}
                  readOnly
                />
                <div onClick={() => setCountryOn(!countryOn)} className='absolute top-0 right-0 w-full h-10'></div>
                <ChevronDown
                  onClick={() => setCountryOn(!countryOn)}
                  className={`absolute top-0 right-3 h-10 text-gray-600 cursor-pointer duration-300 ${
                    countryOn ? "rotate-180" : ""
                  }`}
                  strokeWidth={1.2}
                />
                <div
                  className={`absolute w-full bg-white border border-gray-200 mt-1 rounded-lg shadow-md overflow-y-auto h-48 z-10 transition-all ${
                    countryOn ? "opacity-100 visible" : "opacity-0 invisible"
                  }`}
                >
                  {countries.map((item, index) => (
                    <div
                      key={index}
                      onClick={() => {setCountry(item); setCountryOn(false)}}
                      className={`px-4 py-2 text-gray-700 hover:bg-blue-500 hover:text-white cursor-pointer duration-300 ${
                        item === country ? "bg-blue-500 text-white" : ""
                      }`}
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="mb-6">
              <h3 className="text-md font-semibold text-gray-700 mb-3">
                Contact Information
              </h3>
              <div className="grid grid-cols-1 gap-3">
                <input
                  type="text"
                  name="name"
                  defaultValue={sh?.name}
                  placeholder="Contact name"
                  className="border border-gray-300 w-full h-10 rounded-md outline-none px-4 focus:border-blue-400"
                />
                <input
                  type="text"
                  name="phone"
                  defaultValue={sh?.phone}
                  placeholder="Mobile number"
                  className="border border-gray-300 w-full h-10 rounded-md outline-none px-4 focus:border-blue-400"
                />
                <input
                  type="text"
                  name="email"
                  defaultValue={sh?.email}
                  placeholder="Email"
                  className="border border-gray-300 w-full h-10 rounded-md outline-none px-4 focus:border-blue-400"
                />
              </div>
            </div>

            {/* Address Section */}
            <div className="mb-6">
              <h3 className="text-md font-semibold text-gray-700 mb-3">Address</h3>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  name="address"
                  defaultValue={sh?.address}
                  placeholder="Street, house/apartment/unit*"
                  className="border border-gray-300 w-full h-10 rounded-md outline-none px-4 focus:border-blue-400 col-span-2"
                />
                <input
                  type="text"
                  name="state"
                  defaultValue={sh?.state}
                  placeholder="State"
                  className="border border-gray-300 w-full h-10 rounded-md outline-none px-4 focus:border-blue-400 col-span-1"
                />
                <input
                  type="text"
                  name="city"
                  defaultValue={sh?.city}
                  placeholder="City"
                  className="border border-gray-300 w-full h-10 rounded-md outline-none px-4 focus:border-blue-400"
                />
                <input
                  type="text"
                  name="zip_code"
                  defaultValue={sh?.zip_code}
                  placeholder="ZIP code"
                  className="border border-gray-300 w-full h-10 rounded-md outline-none px-4 focus:border-blue-400"
                />
              </div>
            </div>

            {/* Default Checkbox */}
            <div className="flex items-center gap-2 mb-6">
              <input type="checkbox" name="default"  className="w-4 h-4 accent-blue-500" />
              <label className="text-gray-700 text-sm">
                Set as default shipping address
              </label>
            </div>

            {/* Buttons */}
            <button className="w-full px-6 py-2 rounded-md bg-blue-500 text-white font-semibold hover:bg-blue-600 transition">
                Confirm
            </button>
          </form>
        
        </div>
      </div>
    </div>
  );
}

export default Shipping;