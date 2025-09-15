import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Users, 
  Calendar, 
  Shield, 
  Star,
  ArrowRight,
  Plane,
  Camera,
  Globe
} from 'lucide-react'
import { motion } from 'framer-motion'

export default function LandingPage() {
  const featuredTours = [
    {
      id: 1,
      title: "Paris City Explorer",
      description: "Discover the City of Light with our comprehensive 7-day tour",
      price: 1299,
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1502602898536-47ad22581b52?w=400&h=300&fit=crop",
      duration: "7 days"
    },
    {
      id: 2,
      title: "Tokyo Adventure",
      description: "Experience the perfect blend of tradition and modernity",
      price: 1599,
      rating: 4.9,
      image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400&h=300&fit=crop",
      duration: "10 days"
    },
    {
      id: 3,
      title: "Mediterranean Cruise",
      description: "Sail through the beautiful Mediterranean coastline",
      price: 2199,
      rating: 4.7,
      image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop",
      duration: "12 days"
    }
  ]

  const features = [
    {
      icon: <Globe className="h-8 w-8" />,
      title: "Global Destinations",
      description: "Explore over 100+ destinations worldwide with our expert guides"
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Expert Guides", 
      description: "Local professional guides with years of experience"
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Safe & Secure",
      description: "Your safety is our priority with comprehensive insurance coverage"
    },
    {
      icon: <Calendar className="h-8 w-8" />,
      title: "Flexible Booking",
      description: "Easy booking with flexible cancellation policies"
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-4xl lg:text-6xl font-bold mb-6">
              Discover Your Next
              <br />
              <span className="text-blue-200">Adventure</span>
            </h1>
            <p className="text-xl lg:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
              Create unforgettable memories with our expertly crafted tours and 
              personalized travel experiences around the world.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild className="bg-white text-blue-600 hover:bg-blue-50">
                <Link to="/packages">
                  Explore Tours
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="border-white text-white hover:bg-white hover:text-blue-600">
                <Link to="/register">
                  Start Planning
                  <Plane className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Why Choose TourismPro?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We provide exceptional travel experiences with attention to every detail
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
              >
                <Card className="text-center h-full hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="mx-auto mb-4 p-3 bg-blue-100 text-blue-600 rounded-full w-fit">
                      {feature.icon}
                    </div>
                    <CardTitle>{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Tours Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Featured Tours
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover our most popular destinations and experiences
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredTours.map((tour, index) => (
              <motion.div
                key={tour.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
              >
                <Card className="overflow-hidden hover:shadow-xl transition-shadow">
                  <div className="relative">
                    <img 
                      src={tour.image} 
                      alt={tour.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1">
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-sm font-medium">{tour.rating}</span>
                      </div>
                    </div>
                  </div>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      {tour.title}
                      <span className="text-sm font-normal text-gray-500">{tour.duration}</span>
                    </CardTitle>
                    <CardDescription>{tour.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-2xl font-bold text-blue-600">${tour.price}</span>
                        <span className="text-gray-500"> per person</span>
                      </div>
                      <Button asChild>
                        <Link to="/packages">
                          View Details
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button size="lg" asChild>
              <Link to="/packages">
                View All Tours
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Camera className="h-16 w-16 mx-auto mb-6 text-blue-200" />
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Ready to Start Your Journey?
            </h2>
            <p className="text-xl mb-8 text-blue-100 max-w-2xl mx-auto">
              Join thousands of travelers who have discovered amazing destinations with TourismPro.
              Your adventure awaits!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild className="bg-white text-blue-600 hover:bg-blue-50">
                <Link to="/register">
                  Get Started Today
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="border-white text-white hover:bg-white hover:text-blue-600">
                <Link to="/packages">
                  Browse Tours
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
