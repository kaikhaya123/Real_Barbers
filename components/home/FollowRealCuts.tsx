'use client'

import Section from '@/components/ui/Section'
import { motion } from 'framer-motion'
import Image from 'next/image'

export default function FollowRealBarbershop() {
  return (
    <Section className="py-20">
      <div className="grid lg:grid-cols-2 gap-14 items-center">
        
        {/* LEFT CONTENT */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-sm uppercase tracking-wide text-gray-500">
            Stay connected
          </span>

          <h2 className="mt-3 text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
            FOLLOW PRO BARBERSHOP
          </h2>

          <p className="mt-5 max-w-lg text-gray-600 text-lg leading-relaxed">
            Fresh fades. Sharp beards. Real work from the chair.
            See today’s cuts and book faster on WhatsApp.
          </p>

          {/* SOCIAL CTA */}
          <div className="mt-8 flex items-center gap-5">
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
                className="w-14 h-14 flex items-center justify-center rounded-full bg-black hover:bg-gray-800 transition shadow-lg"
                aria-label={social.name}
              >
                <Image
                  src={social.icon}
                  alt={social.name}
                  width={26}
                  height={26}
                  className="invert"
                />
              </motion.a>
            ))}
          </div>

          {/* MICRO TRUST */}
          <p className="mt-6 text-sm text-gray-500">
            Updated daily. Real clients. No stock photos.
          </p>
        </motion.div>

        {/* RIGHT VISUAL */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex justify-center lg:justify-end"
        >
          <div className="relative w-[260px] h-[520px]">
            
            {/* PHONE FRAME */}
            <div className="absolute inset-0 rounded-[36px] bg-black shadow-2xl border-8 border-black overflow-hidden">
              
              {/* NOTCH */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-black rounded-b-2xl z-10" />

              {/* SCREEN */}
              <Image
                src="/Images/real-haircut-mockup.jpg"
                alt="REAL Barbershop haircut showcase"
                fill
                className="object-cover"
                priority
              />
            </div>

            {/* GLOW */}
            <div className="absolute inset-0 rounded-[36px] bg-black blur-2xl opacity-20 -z-10" />
          </div>
        </motion.div>

      </div>
    </Section>
  )
}
