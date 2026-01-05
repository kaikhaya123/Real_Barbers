"use client"

import { motion, useTransform, useScroll } from "framer-motion"
import { useRef } from "react"

const PortfolioGallery = () => {
  return (
    <div className="bg-black mt-24 md:mt-32 lg:mt-40">
      <div className="flex min-h-32 sm:min-h-40 md:min-h-48 lg:min-h-56 xl:min-h-64 items-center justify-center px-4 py-8 md:py-12 lg:py-16">
        <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black tracking-wide text-center leading-tight transform hover:scale-105 transition-all duration-300 drop-shadow-2xl">
          <span className="text-black">
            OUR
          </span>{" "}
          <span className="text-white">
            REAL_BARBERSHOP HAIRCUTS
          </span>
        </h2>
      </div>
      <HorizontalScrollCarousel />
    </div>
  )
}

const HorizontalScrollCarousel = () => {
  const targetRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: targetRef,
  })

  const x = useTransform(scrollYProgress, [0, 1], ["1%", "-85%"])

  return (
    <section ref={targetRef} className="relative h-[250vh] bg-black -mt-8">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-80 right-20 text-4xl font-bold text-white transform rotate-12">CUTS</div>
        <div className="absolute bottom-40 left-20 text-5xl font-bold text-white transform -rotate-6">STYLE</div>
      </div>
      
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        <motion.div style={{ x }} className="flex gap-8">
          {portfolioCards.map((card, index) => {
            return (
              <Card key={card.id} card={card} />
            )
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
  service: string
  description: string
}

const Card = ({ card }: { card: CardType }) => {
  return (
    <div className="group relative h-[400px] w-[350px] overflow-hidden bg-cream-100 rounded-xl shadow-lg">
      <div
        style={{
          backgroundImage: `url(${card.url})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
        className="absolute inset-0 z-0 transition-transform duration-500 group-hover:scale-110"
      ></div>
    </div>
  )
}

export default PortfolioGallery

const portfolioCards: CardType[] = [
  {
    url: "/Images/Photo_1.png",
    title: "#1",
    service: "Classic Fade",
    description: "Perfect blend, smooth finish",
    id: 1,
  },
  {
    url: "/Images/1767330787427.jpeg",
    title: "#2",
    service: "Beard Trim",
    description: "Precision grooming artistry",
    id: 2,
  },
  {
    url: "/Images/1767330865876.jpeg",
    title: "#3",
    service: "Full Service",
    description: "Complete style transformation",
    id: 3,
  },
  {
    url: "/Images/1767331692043.jpeg",
    title: "#4",
    service: "Modern Cut",
    description: "Contemporary edge styling",
    id: 4,
  },
  {
    url: "/Images/1767331960061.jpeg",
    title: "#5",
    service: "Hot Towel",
    description: "Premium relaxation experience",
    id: 5,
  },
  {
    url: "/Images/1767331758884.jpeg",
    title: "#6",
    service: "Straight Razor",
    description: "Traditional craftsmanship",
    id: 6,
  },
  {
    url: "/Images/1767332093257.jpeg",
    title: "#7",
    service: "Styling Finish",
    description: "Perfect final touches",
    id: 7,
  },
  {
    url: "/Images/1767332431682.jpeg",
    title: "#8",
    service: "Premium Cut",
    description: "Luxury barbering experience",
    id: 8,
  },
  {
    url: "/Images/1767374000777.jpeg",
    title: "#9",
    service: "Classic Style",
    description: "Timeless elegance redefined",
    id: 9,
  },
]
