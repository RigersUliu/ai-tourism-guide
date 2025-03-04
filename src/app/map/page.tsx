"use client";
import { useRouter } from "next/navigation";

const MapPage = () => {
  const router = useRouter();

  const handleCitySelection = (city: string) => {
    router.push(`/chat?city=${city}`);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold">Select a City</h1>
      <div className="mt-6 space-x-4">
        <button
          onClick={() => handleCitySelection("Durres")}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Durres
        </button>
        <button
          onClick={() => handleCitySelection("Himare")}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Himare
        </button>
      </div>
    </div>
  );
};

export default MapPage;
