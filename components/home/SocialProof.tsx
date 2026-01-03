'use client'

import { Star, Quote } from 'lucide-react'
import Section from '@/components/ui/Section'
import Card from '@/components/ui/Card'
import { useEffect, useState } from "react";

type StatCounterProps = {
  value: number;
  suffix?: string;
  label: string;
  decimals?: number;
};

function StatCounter({ value, suffix = "", label, decimals = 0 }: StatCounterProps) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 1200; // ms
    const increment = value / (duration / 16);
    let raf: number;

    function animate() {
      start += increment;
      if (start < value) {
        setCount(Number(start.toFixed(decimals)));
        raf = requestAnimationFrame(animate);
      } else {
        setCount(value);
      }
    }
    animate();
    return () => cancelAnimationFrame(raf);
  }, [value, decimals]);

  return (
    <div>
      <div className="text-4xl font-bold text-accent-600 mb-2">
        {count}
        {suffix}
      </div>
      <div className="text-sm text-gray-600">{label}</div>
    </div>
  );
}

export default function SocialProof() {
  const testimonials = [
    {
      name: 'Mandla K.',
      rating: 5,
      text: 'Best barbershop in Durban! Thabo always delivers a perfect fade. The online booking is super convenient.',
      location: 'Durban Central',
    },
    {
      name: 'Jason M.',
      rating: 5,
      text: 'Finally, a shop that respects my time. I book online, show up, and get straight to my cut. No more waiting around.',
      location: 'Berea',
    },
    {
      name: 'Sibusiso N.',
      rating: 5,
      text: 'Professional service every time. The walk-in queue system is brilliant. I can see exactly when to arrive.',
      location: 'Morningside',
    },
  ]

  return (
    <Section background="primary">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-heading font-bold text-dark-900 mb-4">
          Trusted by Durban
        </h2>
        <p className="text-lg text-dark-600 max-w-2xl mx-auto">
          Real reviews from real clients
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {testimonials.map((testimonial, index) => (
          <Card key={index}>
            <div className="flex items-center mb-4">
              {[...Array(testimonial.rating)].map((_, i) => (
                <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
              ))}
            </div>

            <Quote className="h-8 w-8 text-accent-200 mb-3" />

            <p className="text-gray-700 mb-4 italic">
              &quot;{testimonial.text}&quot;
            </p>

            <div className="pt-4 border-t border-gray-200">
              <p className="font-semibold text-primary-900">{testimonial.name}</p>
              <p className="text-sm text-gray-600">{testimonial.location}</p>
            </div>
          </Card>
        ))}
    </div> {/* end testimonials grid */}

    {/* Stats Bar */}
    <div className="mt-16 bg-white rounded-xl shadow-lg p-8 max-w-6xl mx-auto">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
        <StatCounter value={98} suffix="%" label="Client Satisfaction" />
        <StatCounter value={1000} suffix="+" label="Monthly Clients" />
        <StatCounter value={4.9} suffix="★" label="Average Rating" decimals={1} />
        <StatCounter value={12} suffix="+" label="Years Trusted" />
      </div>
    </div>
    </Section>
  )
}
