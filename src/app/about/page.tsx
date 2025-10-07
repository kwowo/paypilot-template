export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">About TeeShop</h1>
          <p className="text-xl text-gray-600">
            Your destination for premium, comfortable t-shirts
          </p>
        </div>

        {/* Story Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Our Story</h2>
          <div className="prose prose-lg max-w-none text-gray-600">
            <p className="mb-6">
              Founded in 2024, TeeShop began with a simple mission: to create the most 
              comfortable, high-quality t-shirts that people love to wear every day. 
              We believe that a great t-shirt should be soft, durable, and versatile 
              enough to take you from morning coffee to evening adventures.
            </p>
            <p className="mb-6">
              What started as a small idea has grown into a brand that serves thousands 
              of customers worldwide. We&apos;re passionate about quality, sustainability, 
              and creating products that make you feel confident and comfortable.
            </p>
          </div>
        </section>

        {/* Values Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🌿</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Sustainability</h3>
              <p className="text-gray-600">
                We use organic cotton and eco-friendly manufacturing processes 
                to minimize our environmental impact.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⭐</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Quality</h3>
              <p className="text-gray-600">
                Every t-shirt is crafted with attention to detail and made to last, 
                so you can enjoy them for years to come.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">❤️</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Community</h3>
              <p className="text-gray-600">
                We&apos;re committed to giving back to our community and supporting 
                causes that matter to our customers.
              </p>
            </div>
          </div>
        </section>

        {/* Quality Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Why Choose TeeShop?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Premium Materials</h3>
              <p className="text-gray-600 mb-6">
                We source only the finest 100% organic cotton that&apos;s soft, breathable, 
                and gets even better with every wash.
              </p>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Perfect Fit</h3>
              <p className="text-gray-600">
                Our t-shirts are designed with the perfect balance of comfort and style, 
                offering a flattering fit for every body type.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Ethical Production</h3>
              <p className="text-gray-600 mb-6">
                We work with certified manufacturers who share our commitment to fair 
                labor practices and environmental responsibility.
              </p>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Customer First</h3>
              <p className="text-gray-600">
                Your satisfaction is our priority. We offer hassle-free returns and 
                responsive customer service to ensure you love your purchase.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="bg-gray-50 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Get in Touch</h2>
          <p className="text-gray-600 mb-6">
            Have questions or feedback? We&apos;d love to hear from you!
          </p>
          <div className="space-y-2 text-gray-600">
            <p>Email: hello@teeshop.com</p>
            <p>Phone: 1-800-TEE-SHOP</p>
            <p>Address: 123 Fashion Street, Style City, SC 12345</p>
          </div>
        </section>
      </div>
    </div>
  );
}