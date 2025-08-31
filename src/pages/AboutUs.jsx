import { FaGem, FaLeaf, FaStar, FaHandsHelping } from "react-icons/fa";

// Export as default
export default function AboutUs() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-navy-900 to-navy-800 text-gray-500 font-ubuntu">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              About <span className="text-gold">Crystal Beauty</span>
            </h1>
            <div className="w-32 h-1 bg-gradient-to-r from-gold to-gold-light mx-auto mb-8"></div>
            <p className="text-xl text-gray-800 max-w-3xl mx-auto">
              Where luxury meets sustainability. We believe in beauty that's timeless, ethical, and empowering.
            </p>
          </div>

          {/* Mission Section */}
          <div className="bg-navy-800 rounded-xl shadow-2xl p-8 md:p-12 mb-16 border border-navy-700">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-6">
                  Our <span className="text-gold">Mission</span>
                </h2>
                <p className="text-gray-700 leading-relaxed mb-6 text-lg">
                  To deliver premium, cruelty-free beauty solutions that empower you to feel confident and radiant every day. 
                  We combine scientific innovation with natural ingredients for exceptional results.
                </p>
                <p className="text-gray-700 leading-relaxed text-lg">
                  From skincare to makeup and exclusive collections, Crystal Beauty is committed to making luxury 
                  beauty accessible while maintaining the highest ethical standards.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="flex flex-col items-center bg-navy-700 rounded-xl p-6 border border-navy-600">
                  <FaGem className="text-blue-800 text-4xl mb-4" />
                  <h3 className="text-blue-600 font-semibold text-center mb-2">Premium Quality</h3>
                  <p className="text-gray-400 text-sm text-center">Luxury formulations with proven results</p>
                </div>
                <div className="flex flex-col items-center bg-navy-700 rounded-xl p-6 border border-navy-600">
                  <FaLeaf className="text-green-400 text-4xl mb-4" />
                  <h3 className="text-green-400 font-semibold text-center mb-2">100% Cruelty-Free</h3>
                  <p className="text-gray-400 text-sm text-center">Ethically sourced and produced</p>
                </div>
                <div className="flex flex-col items-center bg-navy-700 rounded-xl p-6 border border-navy-600">
                  <FaStar className="text-yellow-400 text-4xl mb-4" />
                  <h3 className="text-yellow-300 font-semibold text-center mb-2">Luxury Accessible</h3>
                  <p className="text-gray-400 text-sm text-center">Premium quality at fair prices</p>
                </div>
                <div className="flex flex-col items-center bg-navy-700 rounded-xl p-6 border border-navy-600">
                  <FaHandsHelping className="text-blue-400 text-4xl mb-4" />
                  <h3 className="text-blue-400 font-semibold text-center mb-2">Expert Guidance</h3>
                  <p className="text-gray-400 text-sm text-center">Beauty consultations and support</p>
                </div>
              </div>
            </div>
          </div>

          {/* Story Section */}
          <div className="grid md:grid-cols-2 gap-12 mb-16">
            <div className="bg-navy-800 rounded-xl p-8 border border-navy-700">
              <h2 className="text-3xl font-bold mb-6">Our <span className="text-gold">Story</span></h2>
              <p className="text-gray-700 mb-4">
                Founded in 2015, Crystal Beauty began as a small boutique with a vision to transform the beauty industry. 
                Our founder, Isabella Rose, noticed a gap between luxury beauty products and ethical, sustainable practices.
              </p>
              <p className="text-gray-700">
                Today, we're proud to offer a complete range of premium beauty products that don't compromise on quality or values. 
                Each product is carefully crafted with attention to detail and a commitment to excellence.
              </p>
            </div>
            <div className="bg-navy-800 rounded-xl p-8 border border-navy-700">
              <h2 className="text-3xl font-bold mb-6">Our <span className="text-gold">Values</span></h2>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <div className="bg-gold rounded-full p-2 mr-4">
                    <FaStar className="text-navy-900 text-sm" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">Quality Excellence</h4>
                    <p className="text-gray-700">We never compromise on ingredient quality or formulation</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="bg-gold rounded-full p-2 mr-4">
                    <FaLeaf className="text-navy-900 text-sm" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">Sustainability</h4>
                    <p className="text-gray-700">Environmentally responsible packaging and sourcing</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="bg-gold rounded-full p-2 mr-4">
                    <FaHandsHelping className="text-navy-900 text-sm" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">Community</h4>
                    <p className="text-gray-700">Supporting women-owned businesses and initiatives</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          {/* Thank You Section */}
          <div className="text-center bg-navy-800 rounded-2xl p-10 border border-gold">
            <h3 className="text-3xl font-bold mb-6">Thank You for Your Trust</h3>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
              We're honored to be part of your beauty journey. Our promise is to provide you with luxury that is sustainable, 
              ethical, and always empowering. Together, we're redefining beauty.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}