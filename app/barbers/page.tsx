import Hero from "../../components/barbers/Hero";
import BarberCard from "../../components/barbers/BarberCard";
import { BARBERS } from "../../lib/constants";

export default function BarbersPage() {
  return (
    <main>
      <Hero />

      {/* Debug block to surface BARBERS content during diagnosis */}
      <div className="container mx-auto px-6 mt-6">
        <div className="bg-yellow-50 border border-yellow-200 p-4 rounded text-sm text-yellow-800">
          <strong>Debug:</strong> BARBERS count: {BARBERS ? BARBERS.length : 0}
          <pre className="mt-2 text-xs whitespace-pre-wrap">{JSON.stringify(BARBERS, null, 2)}</pre>
        </div>
      </div>

      <section id="barbers" className="container mx-auto px-6 py-16">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          <h2 className="col-span-1 text-4xl md:text-5xl font-black tracking-tight text-dark-900">MEET OUR BARBERS</h2>
          <p className="col-span-2 text-gray-600 text-sm md:text-base leading-relaxed">Meet the barbers: an international group of highly skilled and professional barbers, each bringing their unique expertise and flair to the art of grooming. With diverse backgrounds and years of experience, our barbers are united by a shared passion for precision, style, and exceptional service.</p>
        </div>

        <div className="mt-8 space-y-8">
          {BARBERS.map((b: any) => (
            <BarberCard key={b.id} barber={b} />
          ))}
        </div>
      </section>
    </main>
  );
}
