import { Check, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';


const categorys = ['Electronics', 'Clothings'];
const sizes = ['S', 'M', 'X', 'XL', 'XXL'];
const Filter = ({fil, setFil, size, setSize, category}) => {

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
          bg-white/25 backdrop-blur-lg border border-white/20
          transition-all duration-500 ease-in-out lg:hidden text-[0.9em]`}>
        {/* Scrollable content */}
        <div
          onMouseDown={mouseDown}
          onMouseMove={mouseMove}
          onMouseUp={mouseUp}
          onMouseLeave={mouseLeave}
          ref={boxRef}
          className={`h-[80vh] min-h-[300px] w-[260px] flex flex-col overflow-auto p-5 shadow-sm ${
            grab ? "cursor-grab" : "cursor-grabbing"
          } scrollbar-hide`}
        >
          <div className='flex items-center justify-between border-b pb-3 text-[1.2em]'><h1>Filter</h1> <X onClick={() => setFil(false)} className='w-5 h-5 hover:text-red-500 cursor-pointer hover:scale-[1.3] select-none duration-300' /></div>
          <h1 className="py-3 text-[1em] px-2">Categories</h1>
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

          <div className="py-3 text-[1em] mt-4 px-2">Size</div>
          <div className="flex gap-3 mt-3 flex-wrap">
            {sizes.map((item, index) => (
              <div
                key={index}
                onClick={() => setSize(item)}
                className={`rounded-md w-8 h-8 flex items-center justify-center cursor-pointer transition ${
                  size === item
                    ? "bg-black text-white"
                    : "hover:bg-gray-200"
                }`}
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