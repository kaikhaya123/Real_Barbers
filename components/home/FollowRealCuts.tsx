'use client'

import Section from '@/components/ui/Section'
import { motion } from 'framer-motion'
import Image from 'next/image'

export default function FollowRealBarbershop() {
  return (
    <Section className="py-20 md:py-28 bg-cream-50">
      <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
        
        {/* LEFT CONTENT */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="space-y-8"
        >
          <span className="text-sm uppercase tracking-widest font-medium text-dark-600">
            Stay connected
          </span>

          <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-dark-900 leading-tight">
            Follow Pro Barbershop
          </h2>

          <p className="text-lg md:text-xl text-dark-700 leading-relaxed max-w-lg">
            Fresh fades. Sharp beards. Real work from the chair.
            See today’s cuts and book faster on WhatsApp.
          </p>

          {/* SOCIAL CTA */}
          <div className="mt-10 flex items-center gap-6">
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
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.96 }}
                className="w-16 h-16 flex items-center justify-center rounded-full bg-dark-900 hover:bg-dark-800 transition shadow-lg"
                aria-label={social.name}
              >
                <Image
                  src={social.icon}
                  alt={social.name}
                  width={28}
                  height={28}
                  className="invert"
                />
              </motion.a>
            ))}
          </div>

          {/* MICRO TRUST */}
          <p className="text-sm text-dark-600 font-medium">
            Stay Updated daily
          </p>
        </motion.div>

        {/* RIGHT VISUAL */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex justify-center items-center min-h-[600px]"
        >
          <div className="relative w-full max-w-sm h-auto">
            <Image
              src="/Images/70 New Black Men Haircuts And Hairstyles In 2025-left.png"
              alt="Pro Barbershop haircut showcase"
              width={400}
              height={600}
              className="object-contain w-full h-auto"
              priority
            />
          </div>
        </motion.div>

      </div>
    </Section>
  )
}
