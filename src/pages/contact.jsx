import { FaEnvelope, FaPhoneAlt, FaMapMarkerAlt, FaInstagram, FaFacebookF, FaTwitter } from "react-icons/fa";

// Export as default
export default function ContactUs() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-navy-900 to-navy-800 text-gray-500 font-ubuntu">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Contact <span className="text-gold">Us</span>
            </h1>
            <div className="w-32 h-1 bg-gradient-to-r from-gold to-gold-light mx-auto mb-8"></div>
            <p className="text-xl text-gray-800 max-w-3xl mx-auto">
              Have questions or need support? Our beauty experts are here to help you with anything you need.
            </p>
          </div>

          {/* Main Content */}
          <div className="grid lg:grid-cols-3 gap-10 mb-16">
            {/* Contact Info */}
            <div className="lg:col-span-1 bg-navy-800 rounded-xl shadow-xl p-8 border border-navy-700">
              <h2 className="text-3xl font-bold mb-8">Get in Touch</h2>
              
              <div className="space-y-6 mb-10">
                <div className="flex items-start">
                  <div className="bg-gold rounded-full p-3 mr-4">
                    <FaEnvelope className="text-navy-900 text-xl" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white mb-1">Email Us</h3>
                    <p className="text-gray-500">support@crystalbeauty.com</p>
                    <p className="text-gray-500">orders@crystalbeauty.com</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-gold rounded-full p-3 mr-4">
                    <FaPhoneAlt className="text-navy-900 text-xl" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white mb-1">Call Us</h3>
                    <p className="text-gray-500">+1 (800) 555-1234</p>
                    <p className="text-gray-500">+1 (800) 555-BEAUTY</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-gold rounded-full p-3 mr-4">
                    <FaMapMarkerAlt className="text-navy-900 text-xl" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white mb-1">Visit Us</h3>
                    <p className="text-gray-500">123 Glamour Lane</p>
                    <p className="text-gray-500">Beauty City, BC 90210</p>
                  </div>
                </div>
              </div>
              
              <div className="pt-8 border-t border-navy-700">
                <h3 className="font-semibold text-gray-800 mb-4">Follow Us</h3>
                <div className="flex space-x-4">
                  <a href="#" className="bg-navy-700 hover:bg-gold transition-colors w-10 h-10 rounded-full flex items-center justify-center">
                    <FaInstagram className="text-blue-500 text-xl" />
                  </a>
                  <a href="#" className="bg-navy-700 hover:bg-gold transition-colors w-10 h-10 rounded-full flex items-center justify-center">
                    <FaFacebookF className="text-blue-500 textxl" />
                  </a>
                  <a href="#" className="bg-navy-700 hover:bg-gold transition-colors w-10 h-10 rounded-full flex items-center justify-center">
                    <FaTwitter className="text-blue-500 text-xl" />
                  </a>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2 bg-navy-800 rounded-xl shadow-xl p-8 border border-navy-700">
              <h2 className="text-3xl font-bold mb-8">Send Us a Message</h2>
              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-gray-500 mb-2">Your Name</label>
                    <input
                      type="text"
                      id="name"
                      className="w-full bg-navy-700 border border-navy-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gold"
                      placeholder="Enter your name"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-gray-500 mb-2">Your Email</label>
                    <input
                      type="email"
                      id="email"
                      className="w-full bg-navy-700 border border-navy-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gold"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="subject" className="block text-gray-500 mb-2">Subject</label>
                  <input
                    type="text"
                    id="subject"
                    className="w-full bg-navy-700 border border-navy-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gold"
                    placeholder="What is this regarding?"
                  />
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-gray-500 mb-2">Your Message</label>
                  <textarea
                    id="message"
                    rows="5"
                    className="w-full bg-navy-700 border border-navy-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gold"
                    placeholder="How can we help you?"
                  ></textarea>
                </div>
                
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-gold to-gold-light text-gray-800 font-bold py-4 rounded-lg hover:opacity-90 transition duration-300 cursor-pointer hover:text-blue-600"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="bg-navy-800 rounded-2xl p-10 border border-navy-700">
            <h2 className="text-3xl font-bold text-center mb-10">Frequently Asked Questions</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-4 text-gold">Shipping & Returns</h3>
                <p className="text-gray-500 mb-6">We offer free shipping on orders over $50. Returns are accepted within 30 days of purchase.</p>
                
                <h3 className="text-xl font-semibold mb-4 text-gold">Product Questions</h3>
                <p className="text-gray-500">Our products are cruelty-free, vegan, and formulated without parabens or sulfates.</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-4 text-gold">Account & Orders</h3>
                <p className="text-gray-500 mb-6">You can track your order through your account dashboard or using the tracking link sent to your email.</p>
                
                <h3 className="text-xl font-semibold mb-4 text-gold">Consultations</h3>
                <p className="text-gray-500">Book a virtual consultation with our beauty experts for personalized product recommendations.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}