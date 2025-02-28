import Link from "next/link";

const WelcomePage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold text-center">
        Welcome to AI Tourism Guide
      </h1>
      <p className="text-xl mt-4 text-center">
        Explore cities, discover places, and get personalized recommendations
        from our AI guide.
      </p>
      <Link href="/login">
        <button className="mt-6 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          Start Chat
        </button>
      </Link>
    </div>
  );
};

export default WelcomePage;
