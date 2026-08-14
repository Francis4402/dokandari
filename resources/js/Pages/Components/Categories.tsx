import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import { useRef, useState } from "react";
import { categoryType } from '@/types';
import Eyebrow from './Eyebrow';


const Categories = ({categories}: {categories: categoryType[]}) => {


  return (
    <section className="pt-24 pb-5" id="categories">
      <div className="max-w-[1240px] mx-auto px-8">
        <div className="mb-8">
          <Eyebrow>Browse the haat</Eyebrow>
          <h2 className="text-[30px] sm:text-[36px] lg:text-[44px]">Shop by category</h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3.5">
          {categories.map((c) => (
            <div
              key={c.id}
              className="clip-cat group flex flex-col items-center gap-2.5 text-center px-3.5 py-5 cursor-pointer bg-white border border-line transition-all duration-200 hover:border-marigold hover:-translate-y-1 hover:shadow-hard-sm"
            >
              <div className="text-xl transition-transform duration-200 group-hover:scale-110 group-hover:-rotate-3">
                <img src={`/storage/${c.image}`} alt={c.categories} className="w-25 h-25 object-contain" />
              </div>
              <span className="text-xs font-bold leading-tight">{c.categories}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;
