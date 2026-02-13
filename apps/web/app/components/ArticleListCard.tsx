import React from 'react';
import { motion } from 'framer-motion';
interface ArticleListCardProps {
  category: string;
  title: string;
  excerpt: string;
  author: string;
  time: string;
  imageUrl: string;
  onClick?: () => void;
}
export function ArticleListCard({
  category,
  title,
  excerpt,
  author,
  time,
  imageUrl,
  onClick
}: ArticleListCardProps) {
  return (
    <motion.article
      className="flex flex-col md:flex-row gap-6 bg-white p-4 rounded-xl shadow-sm border border-gray-100 cursor-pointer group hover:shadow-md transition-shadow"
      onClick={onClick}
      whileHover={{
        y: -2
      }}
      initial={{
        opacity: 0,
        y: 10
      }}
      animate={{
        opacity: 1,
        y: 0
      }}
      transition={{
        duration: 0.3
      }}>

      {/* Image Container */}
      <div className="w-full md:w-[280px] h-48 md:h-auto flex-shrink-0 overflow-hidden rounded-lg">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />

      </div>

      {/* Content */}
      <div className="flex flex-col justify-center flex-1 py-1">
        <div className="mb-3">
          <span className="inline-block px-2.5 py-0.5 bg-[#2f3192]/10 text-[#2f3192] text-xs font-bold uppercase tracking-wider rounded-full">
            {category}
          </span>
        </div>

        <h3 className="font-serif font-bold text-xl md:text-2xl text-[#000137] mb-2 leading-tight group-hover:text-[#2f3192] transition-colors">
          {title}
        </h3>

        <p className="font-sans text-gray-600 text-sm md:text-base mb-4 line-clamp-2">
          {excerpt}
        </p>

        <div className="flex items-center text-gray-400 text-xs md:text-sm font-medium font-sans mt-auto">
          <span className="text-[#000137]">{author}</span>
          <span className="mx-2">·</span>
          <span>{time}</span>
        </div>
      </div>
    </motion.article>);

}