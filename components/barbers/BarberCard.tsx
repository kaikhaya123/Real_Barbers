import Image from "next/image";

type Barber = {
  id: string;
  name: string;
  title?: string;
  experience?: string;
  specialties?: string[];
  bio?: string;
  image?: string;
  available?: boolean;
};

export default function BarberCard({ barber }: { barber: Barber }) {
  const { id, name, title, experience, specialties = [], bio, image, available } = barber as any;

  return (
    <article id={String(id).toLowerCase()} className="w-full bg-white rounded-lg overflow-hidden">
      <div className="flex flex-col sm:flex-row items-stretch shadow-sm">
        <div className="sm:w-1/3 relative h-72 sm:h-auto bg-gray-100">
          <Image
            src={image || "/default-avatar.png"}
            alt={`${name} avatar`}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, 33vw"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

          <div className="absolute right-3 bottom-3 bg-black/70 text-white text-xs px-2 py-1 rounded">INSTAGRAM</div>
        </div>

        <div className="sm:w-2/3 p-10 flex flex-col justify-center gap-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-3xl md:text-4xl font-extrabold text-gray-900 uppercase tracking-tight">{name}</h3>
              <p className="mt-2 text-sm text-gray-500">{title}{experience ? ` • ${experience}` : ''}</p>
            </div>

            <div className="text-right">
              <span className={`px-3 py-1 rounded-full text-sm ${available ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                {available ? 'Available' : 'Unavailable'}
              </span>
            </div>
          </div>

          <div className="mt-2 flex flex-wrap gap-2">
            {specialties.map((s: string) => (
              <span key={s} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">{s}</span>
            ))}
          </div>

          <p className="mt-4 text-base text-gray-700 leading-relaxed max-w-4xl">{bio}</p>

          <div className="mt-6">
            <a href="/book" className="inline-flex items-center gap-2 bg-black text-white px-5 py-3 rounded-md font-semibold shadow hover:bg-zinc-900">Book Now</a>
          </div>
        </div>
      </div>
    </article>
  );
}
