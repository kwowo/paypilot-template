export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">About Us</h1>
        
        <div className="prose prose-lg">
          <p className="text-xl text-gray-600 mb-6">
            Welcome to our T-shirt store - your destination for premium quality, comfortable, and stylish t-shirts.
          </p>
          
          <h2 className="text-2xl font-semibold mb-4">Our Story</h2>
          <p className="mb-6">
            Founded with a passion for quality and comfort, we believe that a great t-shirt is more than just clothing - 
            it's a statement of who you are. Whether you're looking for a classic design or something more contemporary, 
            we have the perfect t-shirt for every occasion.
          </p>
          
          <h2 className="text-2xl font-semibold mb-4">Quality Promise</h2>
          <p className="mb-6">
            Every t-shirt in our collection is carefully selected for its quality, comfort, and durability. We use only 
            the finest materials and work with trusted manufacturers to ensure that every piece meets our high standards.
          </p>
          
          <h2 className="text-2xl font-semibold mb-4">Our Collection</h2>
          <ul className="list-disc list-inside mb-6 space-y-2">
            <li>Men's premium cotton t-shirts</li>
            <li>Women's comfortable and stylish designs</li>
            <li>Unisex versatile options</li>
            <li>Various sizes from XS to XXL</li>
            <li>Multiple color options for every style</li>
          </ul>
          
          <h2 className="text-2xl font-semibold mb-4">Why Choose Us?</h2>
          <ul className="list-disc list-inside mb-6 space-y-2">
            <li>Premium quality materials</li>
            <li>Comfortable fits for all body types</li>
            <li>Affordable pricing</li>
            <li>Fast and reliable shipping</li>
            <li>Easy returns and exchanges</li>
            <li>Excellent customer service</li>
          </ul>
          
          <p className="text-lg">
            Thank you for choosing us for your t-shirt needs. We're committed to providing you with the best 
            shopping experience and helping you find the perfect t-shirt that you'll love to wear.
          </p>
        </div>
      </div>
    </div>
  );
}