'use client'

import Section from '@/components/ui/Section'
import { motion } from 'framer-motion'
import Image from 'next/image'

export default function FollowRealCuts() {
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (custom: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: custom * 0.2, duration: 0.6 },
    }),
  }

  return (
    <Section className="mb-16">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        custom={0}
        className="grid md:grid-cols-2 gap-12 items-center"
      >
        {/* Left: Text + Social Icons */}
        <div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Follow the real cuts</h2>
          <p className="text-base text-gray-600 mb-8 leading-relaxed">
            Daily fades, clean beards, real style from the chair.
          </p>
          
          {/* Social Icons */}
          <div className="flex items-center gap-6">
            {[
              { name: 'Instagram', url: 'https://instagram.com/probarber', icon: '/Images/instagram.png' },
              { name: 'TikTok', url: 'https://tiktok.com/@probarber', icon: '/Images/tiktok.png' },
              { name: 'WhatsApp', url: 'https://wa.me/27712345678', icon: '/Images/whatsapp.png' },
            ].map((social, idx) => (
              <motion.a
                key={idx}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                className="flex items-center justify-center w-16 h-16 bg-gray-900 text-white rounded-full hover:bg-gray-800 transition-all shadow-lg cursor-pointer"
                title={social.name}
              >
                <Image
                  src={social.icon}
                  alt={social.name}
                  width={32}
                  height={32}
                  className="w-8 h-8 object-contain invert"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none'
                  }}
                />
              </motion.a>
            ))}
          </div>
        </div>

        {/* Right: iPhone Mockup */}
        <div className="relative flex justify-center md:justify-end">
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="relative mx-auto w-64 h-96"
          >
            {/* iPhone Frame */}
            <div className="relative w-full h-full bg-gray-900 rounded-3xl shadow-2xl border-8 border-gray-900 overflow-hidden">
              {/* Notch */}
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-7 bg-gray-900 rounded-b-2xl z-10"></div>
              
              {/* Screen Content - Haircut Image */}
              <div className="relative w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center overflow-hidden">
                <Image
                  src="public/Images/70 New Black Men Haircuts And Hairstyles In 2025-left.png"
                  alt="iPhone Mockup - Real Cuts"
                  fill
                  className="object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none'
                  }}
                />
                
                {/* Fallback Placeholder */}
                <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
                  <div className="text-center text-white">
                    <p className="text-2xl font-bold mb-2">✂️</p>
                    <p className="text-sm">Real Cuts</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Soft Shadow */}
            <div className="absolute inset-0 rounded-3xl shadow-2xl -z-10"></div>
          </motion.div>
        </div>
      </motion.div>
    </Section>
  )
}
