export default function Home() {
  return (
    <main className="min-h-screen bg-gray-100 flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-6">
        Welcome to My Website
      </h1>
      <p className="text-lg md:text-xl text-gray-600 max-w-xl mb-8">
        This is a simple homepage built using Next.js and Tailwind CSS.
      </p>
      <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg text-lg transition">
        Get Started
      </button>
    </main>
  );
}
