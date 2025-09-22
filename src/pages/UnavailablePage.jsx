export default function UnavailablePage() {
  return (
    <div className="flex items-center justify-center h-[60vh] text-center">
      <div>
        <h1 className="text-2xl font-bold text-gray-700 mb-4">
          🚧 This page is currently unavailable
        </h1>
        <p className="text-gray-500">
          We’re working on updates. Please check back later.
        </p>
      </div>
    </div>
  );
}
