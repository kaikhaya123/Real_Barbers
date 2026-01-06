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
    <article id={String(id).toLowerCase()} className="bg-white shadow-sm rounded-lg p-4 flex flex-col sm:flex-row gap-4 items-center">
      <Image
        src={image || "/default-avatar.png"}
        alt={`${name} avatar`}
        width={96}
        height={96}
        className="w-24 h-24 rounded-full object-cover flex-shrink-0"
      />

      <div className="flex-1">
        <h3 className="text-lg font-semibold text-gray-900">{name}</h3>
        <p className="text-sm text-gray-500">{title}{experience ? ` • ${experience}` : ''}</p>

        <div className="mt-2 flex flex-wrap gap-2">
          {specialties.map((s: string) => (
            <span key={s} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">{s}</span>
          ))}
        </div>

        <p className="mt-3 text-sm text-gray-600">{bio}</p>
      </div>

      <div className="flex flex-col items-end gap-2">
        <span className={`px-2 py-1 rounded-full text-xs ${available ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
          {available ? 'Available' : 'Unavailable'}
        </span>

        <a href="/book" className="text-sm bg-black text-white px-3 py-1 rounded-md hover:opacity-95">Book</a>
      </div>
    </article>
  );
}
