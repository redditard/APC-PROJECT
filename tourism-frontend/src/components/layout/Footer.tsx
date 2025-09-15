import { MapPin, Phone, Mail, Facebook, Twitter, Instagram } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-xl font-bold">
              <MapPin className="h-6 w-6 text-blue-400" />
              <span>TourismPro</span>
            </div>
            <p className="text-gray-300 text-sm">
              Your trusted partner for unforgettable travel experiences. 
              Discover the world with our expertly crafted tours and 
              personalized itineraries.
            </p>
            <div className="flex space-x-4">
              <Facebook className="h-5 w-5 text-gray-400 hover:text-blue-400 cursor-pointer" />
              <Twitter className="h-5 w-5 text-gray-400 hover:text-blue-400 cursor-pointer" />
              <Instagram className="h-5 w-5 text-gray-400 hover:text-blue-400 cursor-pointer" />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/packages" className="text-gray-300 hover:text-white transition-colors">
                  Packages
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-gray-300 hover:text-white transition-colors">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/bookings" className="text-gray-300 hover:text-white transition-colors">
                  My Bookings
                </Link>
              </li>
            </ul>
          </div>

          {/* Popular Destinations */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Popular Destinations</h3>
            <ul className="space-y-2 text-gray-300">
              <li>Paris, France</li>
              <li>Tokyo, Japan</li>
              <li>New York, USA</li>
              <li>London, England</li>
              <li>Dubai, UAE</li>
              <li>Barcelona, Spain</li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-blue-400" />
                <span className="text-gray-300">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-blue-400" />
                <span className="text-gray-300">info@tourismpro.com</span>
              </div>
              <div className="flex items-start space-x-2">
                <MapPin className="h-4 w-4 text-blue-400 mt-1" />
                <span className="text-gray-300 text-sm">
                  123 Travel Street<br />
                  Adventure City, AC 12345
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-300 text-sm">
            © 2024 TourismPro. All rights reserved. | Privacy Policy | Terms of Service
          </p>
        </div>
      </div>
    </footer>
  )
}
