import { Check } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';


const categorys = ['Electronics', 'Clothings'];
const sizes = ['S', 'M', 'X', 'XL', 'XXL'];
const Filter = ({fil, setFil, size, setSize, q, setQ}) => {

const [grab, setGrab] = useState(false);
const boxRef = useRef(null);
const startY = useRef(0);
const scrollTop = useRef(0);
const [searchParams, setSearchParams] = useSearchParams();


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

const addCategory = (category) => {
    const params = new URLSearchParams(searchParams);
    params.set("category", category);
    setSearchParams(params);
};


  const filterRef = useRef(null);

  useEffect(() => {
    const closeBox = (e) => {
      if (filterRef.current && !filterRef.current.contains(e.target)) {
        setFil(false);
      }
    };
    document.addEventListener("mousedown", closeBox);
    return () => {
      document.removeEventListener("mousedown", closeBox);
    };
  }, []);


    return(
      <div 
        ref={filterRef} 
        className={`${fil ? 'left-0' : '-left-[100%]'} 
          fixed top-0 z-20 h-[100vh] w-[260px] 
          bg-white shadow-2xl border-r border-gray-200 
          transition-all duration-500 ease-in-out md:hidden`}
      >
        {/* Scrollable content */}
        <div 
          onMouseDown={mouseDown} 
          onMouseMove={mouseMove} 
          onMouseUp={mouseUp} 
          onMouseLeave={mouseLeave} 
          ref={boxRef}
          className={`h-[85vh] w-full overflow-y-auto px-5 py-6 
            ${grab ? 'cursor-grab' : 'cursor-grabbing'} 
            scrollbar-hide`}
        >
          {/* Category Section */}
          <h1 className="font-semibold text-lg text-gray-800 pb-4 border-b">Category</h1>
          <div className="mt-4 space-y-3">
            {categorys.map((item, index) => (
              <div 
                key={index} 
                className="flex items-center gap-3 group"
              >
                {/* Checkbox style */}
                <div 
                  onClick={() => { setQ(item); addCategory(item); window.scrollTo(0, 0) }} 
                  className={`w-5 h-5 flex items-center justify-center rounded-sm border 
                    transition-all duration-300 cursor-pointer select-none
                    ${q === item ? 'bg-black border-black' : 'border-gray-400 bg-gray-100 group-hover:border-gray-600'}`}
                >
                  <Check 
                    className={`w-3 h-3 text-white transition-all 
                      ${q === item ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}`} 
                    strokeWidth={3} 
                  />
                </div>
                <span 
                  className={`capitalize text-sm font-medium transition-colors 
                    ${q === item ? 'text-gray-900' : 'text-gray-600 group-hover:text-gray-800'}`}
                >
                  {item}
                </span>
              </div>
            ))}
          </div>

          {/* Size Section */}
          <div className="pt-6 pb-3 font-semibold text-lg text-gray-800 border-b">Size</div>
          <div className="flex flex-wrap gap-3 mt-4">
            {sizes.map((item, index) => (
              <div 
                key={index} 
                onClick={() => setSize(item)} 
                className={`w-9 h-9 flex items-center justify-center rounded-md border 
                  cursor-pointer select-none text-sm font-medium
                  transition-all duration-300
                  ${size === item 
                    ? 'bg-black text-white border-black shadow-md scale-105' 
                    : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200 hover:border-gray-500'}`}
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
}

export default Filter;