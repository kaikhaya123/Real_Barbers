'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Button from '@/components/ui/Button'

export default function IntroSection() {
  return (
    <section className="bg-cream-50 py-20 md:py-32 font-sans" role="region" aria-labelledby="intro-heading">
      <div className="container mx-auto px-6 lg:px-8 max-w-7xl">
        
        {/* Content Grid */}
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center min-h-[80vh]">
          
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-12 py-8"
          >
            <div className="space-y-6">
              <h2 id="intro-heading" className="text-7xl md:text-8xl lg:text-9xl xl:text-9xl font-black text-dark-900 leading-tight font-sans">
                More than a haircut.
                <span className="block text-dark-600 text-6xl md:text-7xl lg:text-8xl xl:text-8xl font-black font-sans">It&#39;s a culture.</span>
              </h2>
              <p className="text-lg md:text-xl text-dark-700 leading-relaxed max-w-lg font-sans">
               Real Barbershop delivers sharp haircuts and styling  in the heart of Lamontville. Built on skill, precision, and modern style.
              </p>
            </div>
            
            {/* Benefits List */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-dark-900 font-sans sr-only">Our Services</h3>
              <ul className="space-y-3 font-sans" role="list">
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-dark-900 rounded-full mt-3 flex-shrink-0" aria-hidden="true"></div>
                  <span className="text-dark-800 font-medium leading-relaxed font-sans">Expert barbers with experience</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-dark-900 rounded-full mt-3 flex-shrink-0" aria-hidden="true"></div>
                  <span className="text-dark-800 font-medium leading-relaxed font-sans">Premium haircuts, products and tools</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-dark-900 rounded-full mt-3 flex-shrink-0" aria-hidden="true"></div>
                  <span className="text-dark-800 font-medium leading-relaxed font-sans">Personalized consultation for every client</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-dark-900 rounded-full mt-3 flex-shrink-0" aria-hidden="true"></div>
                  <span className="text-dark-800 font-medium leading-relaxed font-sans">Comfortable, welcoming community space</span>
                </li>
              </ul>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button
                href="/book"
                size="lg"
                variant="primary"
                className="w-full sm:w-auto"
              >
                Book Your Appointment
              </Button>
              <Button
                href="/barbers"
                size="lg"
                variant="outline"
                className="w-full sm:w-auto"
              >
                Meet Our Team
              </Button>
            </div>
          </motion.div>
          
          {/* Right Images Grid */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            {/* Main Image */}
            <div className="relative h-[500px] md:h-[650px] lg:h-[750px] rounded-3xl overflow-hidden shadow-2xl">
              <Image
                src="/Images/70 New Black Men Haircuts And Hairstyles In 2025.jpg"
                alt="Professional barber cutting client's hair at Real Barbershop ZA"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
              <div className="absolute inset-0 bg-black/15" />
            </div>
            
            {/* Floating Stats Card */}
            <div className="absolute -bottom-8 -left-8 bg-dark-900 text-cream-50 p-8 rounded-2xl shadow-2xl max-w-sm">
              <div className="space-y-3">
                <p className="text-2xl font-black font-sans">500+</p>
                <p className="text-sm text-cream-200 font-sans">Happy clients served</p>
              </div>
            </div>
            
            {/* Quality Badge */}
            <div className="absolute top-6 right-6 bg-cream-50 text-dark-900 px-6 py-3 rounded-full shadow-xl">
              <span className="text-base font-semibold font-sans">Premium Quality</span>
            </div>
          </motion.div>
          
        </div>
        
        {/* Bottom Feature Section - Modern Image Grid with Overlay Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-28 pt-20 border-t border-cream-200"
        >
          <div className="grid md:grid-cols-3 gap-20">
            {/* Card 1 */}
            <div className="relative overflow-hidden shadow-xl group h-[32rem] w-full transform transition-all duration-500 hover:scale-105 hover:shadow-2xl border border-gray-200/10">
              <Image
                src="/Images/download (19).jpg"
                alt="Authentic Craft"
                fill
                className="object-cover object-center transition-transform duration-700 group-hover:scale-110"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              <div className="absolute inset-0 bg-black/15" />
              <div className="absolute bottom-6 left-6 max-w-sm">
                <div className="mb-3">
                  <h3 className="text-xl font-black text-cream-50 font-sans drop-shadow-lg text-shadow-lg tracking-wide">Authentic Craft</h3>
                </div>
                <p className="text-cream-100 font-sans leading-snug font-semibold drop-shadow-md backdrop-blur-sm bg-black/20 rounded-lg px-4 py-3">Traditional techniques refined through generations of expertise</p>
              </div>
            </div>
            {/* Card 2 - Video */}
            <div className="relative overflow-hidden shadow-xl group h-[32rem] w-full transform transition-all duration-500 hover:scale-105 hover:shadow-2xl border border-gray-200/10">
              <video
                src="/Video/3506105285296674848 - Trim.mp4"
                className="object-cover object-center w-full h-full absolute inset-0 transition-transform duration-700 group-hover:scale-110"
                autoPlay
                loop
                muted
                playsInline
                aria-label="Barber at work video"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              <div className="absolute inset-0 bg-black/15" />
              <div className="absolute bottom-6 left-6 max-w-sm">
                <div className="mb-3">
                  <h3 className="text-xl font-black text-cream-50 font-sans drop-shadow-lg text-shadow-lg tracking-wide">House Call Premium Haircut</h3>
                </div>
                <p className="text-cream-100 font-sans leading-snug font-semibold drop-shadow-md backdrop-blur-sm bg-black/20 rounded-lg px-4 py-3">Contemporary styling that elevates your confidence and presence</p>
              </div>
            </div>
            {/* Card 3 */}
            <div className="relative overflow-hidden shadow-xl group h-[32rem] w-full transform transition-all duration-500 hover:scale-105 hover:shadow-2xl border border-gray-200/10">
              <Image
                src="/Images/mid-section-view-barber-shaking-hand-with-male-client.jpg"
                alt="Community Focus"
                fill
                className="object-cover object-top transition-transform duration-700 group-hover:scale-110"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              <div className="absolute inset-0 bg-black/15" />
              <div className="absolute bottom-6 left-6 max-w-sm">
                <div className="mb-3">
                  <h3 className="text-xl font-black text-cream-50 font-sans drop-shadow-lg text-shadow-lg tracking-wide">Community Focus</h3>
                </div>
                <p className="text-cream-100 font-sans leading-snug font-semibold drop-shadow-md backdrop-blur-sm bg-black/20 rounded-lg px-4 py-3">More than a service - we&#39;re building lasting relationships</p>
              </div>
            </div>
          </div>
        </motion.div>
        
      </div>
    </section>
  )
}
