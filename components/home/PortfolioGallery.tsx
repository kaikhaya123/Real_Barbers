"use client"

import { motion, useTransform, useScroll } from "framer-motion"
import { useRef } from "react"

const PortfolioGallery = () => {
  return (
    <div className="bg-dark-900">
      <div className="flex h-32 items-center justify-center">
        <span className="font-semibold uppercase text-cream-600 tracking-wide">
          Our Work
        </span>
      </div>
      <HorizontalScrollCarousel />
      <div className="flex h-32 items-center justify-center">
        <span className="font-semibold uppercase text-cream-600 tracking-wide">
          Book Your Style
        </span>
      </div>
    </div>
  )
}

const HorizontalScrollCarousel = () => {
  const targetRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: targetRef,
  })

  const x = useTransform(scrollYProgress, [0, 1], ["1%", "-95%"])

  return (
    <section ref={targetRef} className="relative h-[300vh] bg-dark-800">
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        <motion.div style={{ x }} className="flex gap-6">
          {portfolioCards.map((card) => {
            return <Card card={card} key={card.id} />
          })}
        </motion.div>
      </div>
    </section>
  )
}

interface CardType {
  id: number
  url: string
  title: string
}

const Card = ({ card }: { card: CardType }) => {
  return (
    <div className="group relative h-[350px] w-[280px] overflow-hidden bg-cream-100 rounded-xl shadow-lg">
      <div
        style={{
          backgroundImage: `url(${card.url})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
        className="absolute inset-0 z-0 transition-transform duration-500 group-hover:scale-110"
      ></div>
      
      {/* Simple gradient overlay */}
      <div className="absolute inset-0 z-5 bg-gradient-to-t from-black/70 to-transparent"></div>
      
      {/* Simplified content */}
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <div className="bg-black/60 backdrop-blur-sm rounded-lg p-3">
          <h3 className="text-lg font-bold text-white mb-1">
            {card.title}
          </h3>
        </div>
      </div>
    </div>
  )
}

export default PortfolioGallery

const portfolioCards: CardType[] = [
  {
    url: "/Images/Photo_1.png",
    title: "#1",
    id: 1,
  },
  {
    url: "/Images/1767330787427.jpeg",
    title: "#2",
    id: 2,
  },
  {
    url: "/Images/1767330865876.jpeg",
    title: "#3",
    id: 3,
  },
  {
    url: "/Images/1767331692043.jpeg",
    title: "#4",
    id: 4,
  },
  {
    url: "/Images/1767331960061.jpeg",
    title: "#5",
    id: 5,
  },
  {
    url: "/Images/1767331758884.jpeg",
    title: "#6",
    id: 6,
  },
  {
    url: "/Images/1767332093257.jpeg",
    title: "#7",
    id: 7,
  },
]
