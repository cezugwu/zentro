import React, { useContext, useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { Menu, Search, ShoppingCart, Home, ShoppingBag, Grid, Tag, Sparkles, Info, Phone, ChevronDown, User, UserRound,} from 'lucide-react';
import ProfileMenu from './profilemenu';
import { CartContext } from '../contexts/CartContext';

export const navbarItems = [
  { name: "Home", link: "/", icon: <Home className="w-6 h-6 text-gray-500" /> },

  {
    name: "Category",
    link: "/categories",
    icon: <Grid className="w-6 h-6 text-gray-500" />,
    attr: <ChevronDown className="w-5 h-5 text-gray-500" />,
  },

  {
    name: "Shop",
    link: "/shop",
    icon: <ShoppingBag className="w-6 h-6 text-gray-500" />,
  },

  { name: "Deals", link: "/deals", icon: <Tag className="w-6 h-6 text-gray-500" /> },

  {
    name: "New Arrivals",
    link: "/new-arrivals",
    icon: <Sparkles className="w-6 h-6 text-gray-500" />,
  },

  { name: "About Us", link: "/about", icon: <Info className="w-6 h-6 text-gray-500" /> },

  { name: "Contact", link: "/contact", icon: <Phone className="w-6 h-6 text-gray-500" /> },
];

export const categories = [
  { name: "Clothing", link: "/categories/clothing" },
  { name: "Electronics", link: "/categories/electronics" },
  { name: "Shoes", link: "/categories/shoes" },
  { name: "Accessories", link: "/categories/accessories" },
]

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {cart} = useContext(CartContext)
  console.log(cart)

  const total_item = cart?.cartitem?.reduce((a, c) => a + c.quantity, 0);

  const [header, setHeader] = useState(false);
  useEffect(() => {
    const scrollPosition = () => {
      if (window.scrollY >= 50) {
        setHeader(true);
      } else {
        setHeader(false);
      }
    } 
    scrollPosition();
    window.addEventListener('scroll', scrollPosition)

    return () => {
      window.removeEventListener('scroll', scrollPosition)
    }
  }, [])

  const [navbar, setNavbar] = useState(false);
  const navRef = useRef(null);
  const categoryRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        navRef.current &&
        !navRef.current.contains(e.target) &&
        categoryRef.current &&
        !categoryRef.current.contains(e.target)
      ) {
        setNavbar(false);
        setCategory(false);
      }
    };

    window.addEventListener("mousedown", handleClickOutside);
    return () => window.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const [navInfo, setNavInfo] = useState('');
  useEffect(() => {
    if (location.pathname === '/') {
      setNavInfo('Home')
    }
  }, [])

  const [category, setCategory] = useState(false);
  const timeoutRef = useRef(null);
  const handleMouseEnter = (item) => {
    if (item.name === "Category") {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      setCategory(true);
    }
  };
  const handleMouseLeave = (item) => {
    if (item.name === "Category") {
      timeoutRef.current = setTimeout(() => {
        setCategory(false);
      }, 400);
    }
  };

  const [search, setSearch] = useState(false);
  const searchRef = useRef(null);
  const inputRef = useRef(null);
  const [inputSearch, setInputSearch] = useState('');
  const [searchParams] = useSearchParams();
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSearch(false);
      }
    };
    setInputSearch(searchParams.get('q') || '');
    window.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("scroll", handleClickOutside);
    return () => {
      window.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleClickOutside);
    }
  }, []); 

  const [profileMenu, setProfileMenu] = useState(false);
  const profileMenuRef = useRef(null);
  const timeoutRefMenu = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target)) {
        setProfileMenu(false);
      }
    };

    window.addEventListener("mousedown", handleClickOutside);
    return () => {
      window.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleMouseEnterMenu = () => {
    if (timeoutRefMenu.current) {
      clearTimeout(timeoutRefMenu.current);
      timeoutRefMenu.current = null;
    }
    setProfileMenu(true);
  };

  const handleMouseLeaveMenu = () => {
    timeoutRefMenu.current = setTimeout(() => {
      setProfileMenu(false);
    }, 400);
  };


  return ( 
    <div className={`w-full h-16 fixed z-20 top-0 flex justify-between px-8 items-center font-jost duration-500 ${header ? 'bg-white shadow-2xl' : ''}`}>   
      <div
        ref={navRef}
        className={`fixed top-0 left-0 z-10 flex flex-col h-screen w-[220px] 
        bg-white/30 backdrop-blur-lg shadow-lg border border-white/20 
        lg:hidden transition-all duration-500 overflow-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden ${navbar ? 'left-0' : '-left-[100%]'}`}
      >
        <div className="text-2xl font-extrabold tracking-wide p-4 text-center border-b border-white/30 text-blue-900">
          Zent<span className="text-red-400">ro</span>
        </div>

        <div className="flex flex-col gap-2 p-4 mt-4">
          {navbarItems.map((item) => (
            <div key={item.name} className="relative">
              {/* Main item container */}
              <div
                onClick={() => {
                  setNavInfo(item.name);
                  if (item.name !== "Category") setCategory(false);
                  if (item.name === "Category") setCategory(!category);
                }}
                className={`flex items-center justify-between gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all duration-300 relative ${
                  navInfo === item.name
                    ? "bg-white/60 text-blue-700 shadow-md scale-[1.02]"
                    : "hover:bg-white/20 hover:translate-x-1 h-fit"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{item.icon}</span>
                  <span className="font-medium flex items-center gap-2">
                    {item.name}
                  </span>
                </div>

                <span className="font-medium">{item.attr}</span>

                {navInfo === item.name && (
                  <span className="absolute left-0 top-0 w-[4px] h-full bg-red-400 rounded-r-md"></span>
                )}
              </div>

              {/* Smooth dropdown animation */}
              {item.name === "Category" && (
                <div
                  className={`transition-all duration-500 ease-in-out ${
                    category ? "opacity-100 mt-2" : "max-h-0 opacity-0"
                  }`}>
                <div className="text-black bg-white/60 backdrop-blur-md rounded-xl shadow-lg flex flex-col gap-2 py-3 px-2 border border-white/40 transition-all duration-500 ease-in-out">
                  {categories.map((item, index) => (
                    <div
                      key={index}
                      className="cursor-pointer select-none px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:text-white hover:bg-gradient-to-r hover:from-blue-500 hover:to-indigo-500 transition-all duration-300 ease-in-out shadow-sm hover:shadow-md active:scale-95"
                    >
                      {item.name}
                    </div>
                  ))}
                </div>

                </div>
              )}
            </div>
          ))}
        </div>

      </div>

      <div onClick={() => {if (location.pathname !== '/') {navigate('/'); window.scrollTo(0, 0)}}} className='cursor-pointer text-[1.2em] md:text-[1.4em] lg:text-[1.6em] font-bold text-blue-900'>Zentr<span className='text-red-500'>o</span></div>

      <div className='lg:flex gap-5 w-fit items-center hidden '>
        {navbarItems.map((item) => (
          <div key={item.name} className="flex items-center gap-1">
            <h1 onClick={() => handleMouseEnter(item)} onMouseEnter={() => handleMouseEnter(item)} onMouseLeave={() => handleMouseLeave(item)}
            className="font-medium text-[0.95em] cursor-pointer select-none relative">
              {item.name}
              {item.name === "Category" && (
                <div
                  className={`absolute left-1/2 -translate-x-1/2 mt-3
                  w-[420px] rounded-2xl shadow-xl p-5
                  bg-white/25 backdrop-blur-lg border border-white/20
                  flex flex-wrap justify-center gap-4 transition-all duration-500 ${category ? 'top-full opacity-100 pointer-events-auto' : 'top-20 opacity-0 pointer-events-none'}`}
                >
                  {categories.map((item, index) => (
                    <div
                      key={index}
                      className="px-4 py-2 text-sm font-medium text-gray-800 
                      bg-white/40 rounded-xl cursor-pointer hover:bg-blue-100/60 
                      hover:text-blue-600 transition-all duration-500" 
                    >
                      {item.name}
                    </div>
                  ))}
                </div>
              )}
            </h1>
            <span>{item.attr}</span>
          </div>
        ))}
      </div>

      <div className='flex items-center gap-4'>
        <Search onClick={() => {setSearch(true); if (inputRef.current) {inputRef.current.focus()}}} className='cursor-pointer select-none text-blue-600' />
          {localStorage.getItem('access') ? 
            <div ref={profileMenuRef} className='relative' onClick={() => handleMouseEnterMenu()} onMouseEnter={() => handleMouseEnterMenu()} onMouseLeave={() => handleMouseLeaveMenu()}>
              <UserRound className='cursor-pointer select-none fill-red-400 text-red-400' />
              <div className={`absolute top-8 w-[230px] bg-white duration-500 ${profileMenu ? ' opacity-100 visible left-1 lg:-left-8 -translate-x-1/2' : 'left-[-100%] opacity-0 invisible'}`}><ProfileMenu /></div>
            </div> 
            : 
            <><div onClick={() => navigate('/login')} className='text-[0.9em] font-medium cursor-pointer select-none'>Log in</div><div onClick={() => navigate('/register')} className='bg-pink-700/50 px-3 py-2 rounded-md text-white text-[0.9em] font-medium cursor-pointer select-none'>Sign up</div></>
          }
        <div className='relative'>
          <ShoppingCart onClick={() => {if(location.pathname !== '/cart'){navigate(`/cart`); window.scrollTo(0, 0)}}} className='cursor-pointer select-none text-gray-500 fill-gray-500 w-7 h-7' />
          {total_item ? <p className='absolute -top-2 -right-2 bg-black rounded-full w-5 h-5 flex items-center justify-center font-medium text-white text-sm'>{total_item}</p> : ''}
        </div>
        <Menu ref={categoryRef} onClick={() => setNavbar(!navbar)} className='cursor-pointer select-none lg:hidden' />
      </div>

      <div ref={searchRef} className={`${search ? 'top-0' : '-top-[100%]'} fixed left-0 w-full h-20 backdrop-blur-xl bg-white/10 border-b border-white/20 shadow-lg z-20 flex items-center justify-center px-6 duration-500`}>
        <div className="relative w-full max-w-lg">
          <input ref={inputRef}
          value={inputSearch}
          onChange={(e) => setInputSearch(e.target.value)}
            type="text"
            placeholder="Search for products, categories..."
            className="w-full h-12 rounded-full pl-5 pr-12 text-gray-900 placeholder-gray-700 
            bg-white/40 backdrop-blur-md border border-white/30 focus:outline-none 
            focus:ring-2 focus:ring-gray-500 shadow-inner shadow-[inset_0_2px_6px_rgba(0,0,0,0.25)] 
            transition-all duration-300"
          />
          <Search onClick={() => navigate(`/?q=${inputSearch}`)} className="absolute top-1/2 right-4 -translate-y-1/2 text-gray-500 hover:text-gray-700 cursor-pointer transition-transform duration-300 hover:scale-110" />
        </div>
      </div>

    </div>
  );
};

export default Header;
