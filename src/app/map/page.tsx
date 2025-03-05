"use client";
import { useRouter } from "next/navigation";

const MapPage = () => {
  const router = useRouter();

  const handleCitySelection = (city: string) => {
    router.push(`/chat?city=${city}`);
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-teal-100 to-purple-200">
      {/* Background Pattern for Extra Depth */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.3)_10%,_transparent_50%)]"></div>
      <div className="absolute top-[-20%] left-[10%] w-[400px] h-[400px] bg-blue-300 opacity-20 blur-3xl rounded-full animate-pulse"></div>
      <div className="absolute bottom-[-20%] right-[10%] w-[500px] h-[500px] bg-purple-300 opacity-20 blur-3xl rounded-full animate-pulse"></div>

      {/* Main Content Wrapper */}
      <div className="relative z-10 px-6 py-10 max-w-lg w-full bg-white/30 backdrop-blur-xl rounded-3xl border border-white/20 shadow-xl">
        <h1 className="text-4xl font-extrabold text-gray-800 text-center drop-shadow-lg">
          Select a City
        </h1>
        <div className="mt-6 space-x-4 flex justify-center">
          <button
            onClick={() => handleCitySelection("Durres")}
            className="px-6 py-3 text-lg font-semibold text-white bg-gradient-to-r from-blue-500 to-teal-600 rounded-lg shadow-lg transition-all transform hover:scale-110 hover:rotate-1 active:scale-95 active:rotate-0 before:absolute before:inset-0 before:bg-blue-400 before:blur-lg before:opacity-30 hover:before:opacity-50"
          >
            Durres
          </button>
          <button
            onClick={() => handleCitySelection("Himare")}
            className="px-6 py-3 text-lg font-semibold text-white bg-gradient-to-r from-blue-500 to-teal-600 rounded-lg shadow-lg transition-all transform hover:scale-110 hover:rotate-1 active:scale-95 active:rotate-0 before:absolute before:inset-0 before:bg-blue-400 before:blur-lg before:opacity-30 hover:before:opacity-50"
          >
            Himare
          </button>
          <button
            onClick={() => handleCitySelection("Tirana")}
            className="px-6 py-3 text-lg font-semibold text-white bg-gradient-to-r from-blue-500 to-teal-600 rounded-lg shadow-lg transition-all transform hover:scale-110 hover:rotate-1 active:scale-95 active:rotate-0 before:absolute before:inset-0 before:bg-blue-400 before:blur-lg before:opacity-30 hover:before:opacity-50"
          >
            Tirana
          </button>
          <button
            onClick={() => handleCitySelection("Saranda")}
            className="px-6 py-3 text-lg font-semibold text-white bg-gradient-to-r from-blue-500 to-teal-600 rounded-lg shadow-lg transition-all transform hover:scale-110 hover:rotate-1 active:scale-95 active:rotate-0 before:absolute before:inset-0 before:bg-blue-400 before:blur-lg before:opacity-30 hover:before:opacity-50"
          >
            Saranda
          </button>
        </div>
      </div>
    </div>
  );
};

export default MapPage;
