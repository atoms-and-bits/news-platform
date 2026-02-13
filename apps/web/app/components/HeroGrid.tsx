'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArticleCard } from './ArticleCard';
import { TopHeadlines } from './TopHeadlines';
import { allArticles } from '../data/articles';

export function HeroGrid() {
  // Use specific articles for the hero grid to match design
  const anchorStory = allArticles[0]!; // OpenAI
  const featuredStory = allArticles[1]!; // CRDB
  const roundupStory = allArticles[2]!; // Nala
  const container = {
    hidden: {
      opacity: 0
    },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  const item = {
    hidden: {
      opacity: 0,
      y: 20
    },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: 'easeOut' as const
      }
    }
  };
  return (
    <section className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <motion.div
        className="grid grid-cols-1 lg:grid-cols-12 gap-6"
        variants={container}
        initial="hidden"
        animate="show">

        {/* Left Column - Anchor Story (50% width on desktop) */}
        <motion.div
          className="lg:col-span-6 flex flex-col h-[500px] lg:h-[600px]"
          variants={item}>

          <Link href={`/article/${anchorStory.id}`}>
            <ArticleCard
              category={anchorStory.category}
              title={anchorStory.title}
              author={anchorStory.author}
              time={anchorStory.time}
              imageUrl={anchorStory.imageUrl}
              size="large"
              className="h-full shadow-lg"
              premium={anchorStory.premium} />
          </Link>

        </motion.div>

        {/* Middle Column - Stacked Stories (25% width on desktop) */}
        <motion.div
          className="lg:col-span-3 flex flex-col gap-6 h-full"
          variants={item}>

          <Link href={`/article/${featuredStory.id}`}>
            <ArticleCard
              category={featuredStory.category}
              title={featuredStory.title}
              author={featuredStory.author}
              time={featuredStory.time}
              imageUrl={featuredStory.imageUrl}
              className="flex-1 shadow-md"
              premium={featuredStory.premium} />
          </Link>

          <Link href={`/article/${roundupStory.id}`}>
            <ArticleCard
              category={roundupStory.category}
              title={roundupStory.title}
              author={roundupStory.author}
              time={roundupStory.time}
              imageUrl={roundupStory.imageUrl}
              className="flex-1 shadow-md" />
          </Link>

        </motion.div>

        {/* Right Column - Top Headlines (25% width on desktop) */}
        <motion.div className="lg:col-span-3 h-full" variants={item}>
          <TopHeadlines />
        </motion.div>
      </motion.div>
    </section>);

}