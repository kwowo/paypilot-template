export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          About Our T-Shirt Store
        </h1>
        <p className="mt-6 text-lg leading-8 text-gray-600">
          We&apos;re passionate about creating high-quality, comfortable t-shirts that you&apos;ll love to wear every day.
        </p>
      </div>

      <div className="mt-16 grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Our Story</h2>
          <p className="mt-4 text-gray-600">
            Founded in 2024, our t-shirt store began with a simple mission: to create the most comfortable,
            high-quality t-shirts using sustainable materials and ethical manufacturing practices. We believe
            that great clothing should feel good, look good, and do good for the planet.
          </p>
          <p className="mt-4 text-gray-600">
            Every t-shirt in our collection is made from carefully selected organic cotton, ensuring
            both comfort and environmental responsibility. Our designs are timeless, versatile, and
            built to last.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900">Our Values</h2>
          <ul className="mt-4 space-y-3 text-gray-600">
            <li className="flex items-start">
              <span className="mr-2 text-black">•</span>
              <span><strong>Quality:</strong> We use only the finest materials and craftsmanship</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 text-black">•</span>
              <span><strong>Sustainability:</strong> Eco-friendly production and packaging</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 text-black">•</span>
              <span><strong>Ethics:</strong> Fair trade and ethical manufacturing practices</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 text-black">•</span>
              <span><strong>Comfort:</strong> Designed for all-day comfort and durability</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="mt-16 rounded-lg bg-gray-50 p-8">
        <h2 className="text-2xl font-bold text-gray-900">Why Choose Our T-Shirts?</h2>
        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <h3 className="font-semibold text-gray-900">Premium Materials</h3>
            <p className="mt-1 text-gray-600">
              100% organic cotton sourced from certified sustainable farms.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Perfect Fit</h3>
            <p className="mt-1 text-gray-600">
              Pre-shrunk and carefully sized for consistent, comfortable fit.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Durable Design</h3>
            <p className="mt-1 text-gray-600">
              Reinforced seams and high-quality construction for long-lasting wear.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Easy Care</h3>
            <p className="mt-1 text-gray-600">
              Machine washable and designed to maintain shape and color.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}