import React from 'react';
import Heros from '../img/hero.png';

const Hero = () => {
  return (
    <section className="w-full h-[400px] md:h-[600px] bg-pink-100/50 flex flex-col lg:flex-row justify-between items-center px-6 md:px-12 lg:px-20 overflow-hidden">
      {/* LEFT CONTENT */}
      <div className="flex-1 flex flex-col justify-center items-start text-gray-800 gap-3 md:gap-6 mt-8 md:mt-0">
        <div className="flex items-center gap-3">
          <div className="w-[50px] h-[4px] bg-red-500"></div>
          <p className="text-[1rem] md:text-[1.5rem] uppercase font-semibold tracking-wide">New Trend</p>
        </div>

        <h1 className="uppercase text-[1.8rem] md:text-[3rem] font-bold leading-tight">
          Autumn Sale <br />
          <span className="text-red-500">Stylish Women’s</span> Collection
        </h1>

        <p className="text-[0.9rem] md:text-[1.1rem] text-gray-600 max-w-[400px]">
          Explore the latest designs crafted for comfort and style this autumn season.
        </p>

        <button className="mt-4 bg-red-500 text-white px-5 py-2 rounded-full text-[0.9rem] md:text-[1rem] font-semibold hover:bg-red-600 transition duration-300">
          Get started
        </button>
      </div>

      {/* RIGHT IMAGE */}
      <div className="flex-1 hidden lg:flex justify-center items-center relative">
        <img
          src={Heros}
          alt="Shop"
          className="w-[350px] md:w-[450px] h-auto drop-shadow-lg hover:scale-105 transition-transform duration-500"
        />
      </div>
    </section>
  );
};

export default Hero;
