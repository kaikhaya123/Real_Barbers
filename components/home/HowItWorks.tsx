"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import Section from "@/components/ui/Section"

const steps = [
  {
    number: "01",
    iconImage: "/Icons/calendar (1).png", // Replace with your calendar icon
    title: "Book your slot",
    description: "Choose a time that fits your day.",
  },
  {
    number: "02",
    iconImage: "/Icons/shop (1).png", // Replace with your scissors icon
    title: "Show up sharp",
    description: "Arrive on time. We handle the rest.",
  },
  {
    number: "03",
    iconImage: "/Icons/ok.png", // Replace with your checkmark icon
    title: "Leave fresh",
    description: "Clean fades. Precise beard work. Real confidence.",
  },
]

export default function HowItWorks() {
  return (
    <Section background="gray">
      {/* Section Header */}
      <div className="max-w-2xl mx-auto text-center mb-16">
        <h2 className="text-5xl md:text-7xl lg:text-8xl xl:text-9xl font-black text-dark-900 mb-6 leading-tight tracking-wide font-sans">
          HOW IT WORKS
        </h2>
        <p className="text-lg md:text-xl text-dark-600 leading-relaxed font-sans">
          From booking to fresh cut. Simple and smooth.
        </p>
      </div>

      {/* Steps */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-6xl mx-auto">
        {steps.map((step, index) => {
          return (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: index * 0.12 }}
              viewport={{ once: true }}
              className="relative text-center"
            >
              {/* Step number */}
              <span className="block text-lg font-black text-accent-600 mb-6 tracking-wide font-sans">
                {step.number}
              </span>

              {/* Icon Image */}
              <div className="flex items-center justify-center w-40 h-40 rounded-full bg-cream-100 mx-auto mb-8 shadow-lg">
                <Image
                  src={step.iconImage}
                  alt={`${step.title} icon`}
                  width={120}
                  height={120}
                  className="w-30 h-30 object-contain"
                />
              </div>

              {/* Text */}
              <h3 className="text-2xl font-black text-dark-900 mb-4 tracking-wide font-sans">
                {step.title}
              </h3>
              <p className="text-dark-600 max-w-xs mx-auto leading-relaxed font-sans">
                {step.description}
              </p>
            </motion.div>
          )
        })}
      </div>
    </Section>
  )
}
