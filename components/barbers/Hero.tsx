export default function HeroBarbers() {
  return (
    <header className="relative bg-gray-900 text-white">
      <div
        className="h-72 sm:h-96 bg-cover bg-center"
        style={{ backgroundImage: "url('/Images/working-tools-barber-master(1).jpg')" }}
      >
        <div className="h-full w-full bg-black/50 flex items-center">
          <div className="container mx-auto px-6 sm:px-8 lg:px-16">
            <div className="max-w-2xl">
              <h1 className="text-3xl sm:text-5xl font-extrabold leading-tight">Pro Barber Shop ZA — Professional Cuts</h1>
              <p className="mt-4 text-gray-200">Modern styles, friendly service. Meet our team of expert barbers ready to craft your next look.</p>
              <div className="mt-6 flex items-center gap-4">
                <a href="/book" className="inline-flex items-center gap-2 bg-white text-black px-4 py-2 rounded-md font-semibold shadow hover:bg-yellow-500">Book Now</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
