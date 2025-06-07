export default function Loading() {
  return (
    <div className="w-full h-64 flex flex-col items-center justify-center gap-4">
      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-red-600"></div>
      <p className="text-gray-600">Loading product details...</p>
    </div>
  )
}
