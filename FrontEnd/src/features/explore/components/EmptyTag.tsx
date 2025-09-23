import { Link } from 'react-router-dom'

export const ExploreEmpty = () => (
  <div className="flex flex-col items-center w-full max-w-2xl mx-auto mt-8">
    <h1 className="font-bold text-xl md:text-3xl mb-6 text-[#200] text-center">
      سلام به کالج‌گرام خوش اومدی!
    </h1>
    <div className="font-bold text-xs md:text-xl text-[#400] mb-10 text-center leading-relaxed">
      برای دیدن پست‌ها در این صفحه، باید کالج‌گرامی‌ها رو دنبال کنی.
      <br />
      آماده‌ای؟
    </div>
    <Link to={'/search'}>
      <button className="bg-[#F37B8C] text-white border-none rounded-full px-12 py-2 text-s font-bold cursor-pointer">
        جستجوی کالج‌گرامی‌ها
      </button>
    </Link>
  </div>
)
