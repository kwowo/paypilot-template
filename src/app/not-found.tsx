import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">
            Page Not Found
          </h2>
          <p className="text-gray-600">
            The page you&apos;re looking for doesn&apos;t exist.
          </p>
        </div>
        
        <div className="space-y-4">
          <Link
            href="/"
            className="inline-block bg-gray-900 text-white px-6 py-3 rounded-md hover:bg-gray-800 font-medium"
          >
            Go Home
          </Link>
          <div>
            <Link
              href="/products"
              className="text-gray-600 hover:text-gray-900 font-medium"
            >
              Browse Products
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}