import React from 'react';
import { motion } from 'framer-motion';
import { PremiumBadge } from './PremiumBadge';
interface ArticleCardProps {
  category: string;
  title: string;
  author: string;
  time: string;
  imageUrl: string;
  className?: string;
  size?: 'large' | 'medium';
  onClick?: () => void;
  premium?: boolean;
}
export function ArticleCard({
  category,
  title,
  author,
  time,
  imageUrl,
  className = '',
  size = 'medium',
  onClick,
  premium
}: ArticleCardProps) {
  return (
    <motion.article
      className={`relative group overflow-hidden rounded-xl cursor-pointer ${className}`}
      whileHover={{
        scale: 1.01
      }}
      transition={{
        duration: 0.3,
        ease: 'easeOut'
      }}
      onClick={onClick}>

      {/* Premium Badge - hidden for premium users */}
      {premium && <PremiumBadge />}

      {/* Background Image */}
      <div className="absolute inset-0 w-full h-full">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />

        {/* Gradient Overlay - Deep Navy */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#000137] via-[#000137]/60 to-transparent opacity-90" />
      </div>

      {/* Content Overlay */}
      <div className="relative h-full flex flex-col justify-end p-6 md:p-8 z-10">
        <div className="space-y-3">
          {/* Category Badge */}
          <span className="inline-block px-3 py-1 bg-[#2f3192] text-white text-xs font-bold uppercase tracking-wider rounded-md mb-2">
            {category}
          </span>

          {/* Headline */}
          <h2
            className={`font-serif font-bold text-white leading-tight ${size === 'large' ? 'text-3xl md:text-4xl lg:text-5xl' : 'text-xl md:text-2xl'}`}>

            {title}
          </h2>

          {/* Metadata */}
          <div className="flex items-center text-white/80 text-sm font-medium font-sans mt-2">
            <span>{author}</span>
            <span className="mx-2">·</span>
            <span>{time}</span>
          </div>
        </div>
      </div>
    </motion.article>);

}