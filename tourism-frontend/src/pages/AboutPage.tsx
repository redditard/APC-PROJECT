import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Globe,
  Users,
  Award,
  Heart,
  Star,
  CheckCircle,
  Shield,
  Phone,
  Camera
} from 'lucide-react'

export default function AboutPage() {
  const stats = [
    {
      icon: <Globe className="h-8 w-8" />,
      number: "150+",
      label: "Destinations Worldwide",
      description: "Covering all continents"
    },
    {
      icon: <Users className="h-8 w-8" />,
      number: "50,000+",
      label: "Happy Travelers",
      description: "Since our founding"
    },
    {
      icon: <Award className="h-8 w-8" />,
      number: "25+",
      label: "Years of Experience",
      description: "In travel industry"
    },
    {
      icon: <Star className="h-8 w-8" />,
      number: "4.9/5",
      label: "Customer Rating",
      description: "Based on 10,000+ reviews"
    }
  ]

  const values = [
    {
      icon: <Heart className="h-6 w-6" />,
      title: "Passion for Travel",
      description: "We believe travel transforms lives and connects cultures. Our passion drives everything we do."
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Safety First",
      description: "Your safety and security are our top priorities. We maintain the highest safety standards."
    },
    {
      icon: <CheckCircle className="h-6 w-6" />,
      title: "Quality Service",
      description: "We're committed to delivering exceptional experiences that exceed your expectations."
    },
    {
      icon: <Globe className="h-6 w-6" />,
      title: "Sustainable Tourism",
      description: "We promote responsible travel that benefits local communities and preserves the environment."
    }
  ]

  const team = [
    {
      name: "Sarah Johnson",
      role: "Founder & CEO",
      experience: "25 years in travel industry",
      specialization: "Adventure Tourism",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=300&h=300&fit=crop&crop=face",
      bio: "Sarah founded TourismPro with a vision to make authentic travel experiences accessible to everyone."
    },
    {
      name: "Michael Chen",
      role: "Head of Operations",
      experience: "15 years in hospitality",
      specialization: "Luxury Travel",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face",
      bio: "Michael ensures seamless operations and maintains our high service standards globally."
    },
    {
      name: "Emma Rodriguez",
      role: "Cultural Experience Director",
      experience: "20 years as travel guide",
      specialization: "Cultural Immersion",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face",
      bio: "Emma designs authentic cultural experiences that connect travelers with local communities."
    },
    {
      name: "David Kumar",
      role: "Technology Director",
      experience: "12 years in travel tech",
      specialization: "Digital Innovation",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face",
      bio: "David leads our technology initiatives to enhance the travel booking and planning experience."
    }
  ]

  const milestones = [
    {
      year: "1999",
      title: "Company Founded",
      description: "Started as a small travel agency with a big dream to revolutionize travel experiences."
    },
    {
      year: "2005",
      title: "International Expansion",
      description: "Expanded operations to cover destinations across Asia and Europe."
    },
    {
      year: "2010",
      title: "Digital Transformation",
      description: "Launched our first online booking platform, making travel planning more accessible."
    },
    {
      year: "2015",
      title: "Sustainable Tourism Initiative",
      description: "Introduced eco-friendly travel packages and partnerships with local communities."
    },
    {
      year: "2020",
      title: "Virtual Travel Experiences",
      description: "Pioneered virtual tours during the pandemic, keeping travel dreams alive."
    },
    {
      year: "2024",
      title: "AI-Powered Planning",
      description: "Launched AI-driven itinerary planning for personalized travel experiences."
    }
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            About TourismPro
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            For over 25 years, we've been crafting extraordinary travel experiences that create lasting memories. 
            We believe that travel has the power to transform lives, broaden perspectives, and connect people 
            across cultures.
          </p>
        </div>
        
        <div className="relative h-96 rounded-2xl overflow-hidden mb-8">
          <img 
            src="https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1200&h=400&fit=crop" 
            alt="Beautiful landscape representing our travel experiences"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
            <div className="text-white text-center">
              <h2 className="text-3xl font-bold mb-4">Creating Memories Since 1999</h2>
              <p className="text-lg">Your journey begins with us</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        {stats.map((stat, index) => (
          <Card key={index} className="text-center hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="flex justify-center text-blue-600 mb-4">
                {stat.icon}
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">{stat.number}</div>
              <div className="font-semibold text-gray-700 mb-1">{stat.label}</div>
              <div className="text-sm text-gray-500">{stat.description}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Mission & Vision */}
      <div className="grid md:grid-cols-2 gap-8 mb-16">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100">
          <CardHeader>
            <CardTitle className="flex items-center text-2xl">
              <Globe className="h-6 w-6 mr-3 text-blue-600" />
              Our Mission
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 leading-relaxed">
              To make authentic, sustainable, and enriching travel experiences accessible to everyone. 
              We strive to connect travelers with the world's most beautiful destinations while 
              supporting local communities and preserving cultural heritage.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100">
          <CardHeader>
            <CardTitle className="flex items-center text-2xl">
              <Star className="h-6 w-6 mr-3 text-green-600" />
              Our Vision
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 leading-relaxed">
              To be the world's most trusted travel partner, known for creating transformative 
              experiences that foster global understanding, cultural appreciation, and 
              environmental stewardship through responsible tourism.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Values Section */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Our Core Values</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((value, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex justify-center text-blue-600 mb-4">
                  {value.icon}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{value.title}</h3>
                <p className="text-sm text-gray-600">{value.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Team Section */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">Meet Our Team</h2>
        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          Our experienced team of travel professionals is passionate about creating exceptional experiences for every traveler.
        </p>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {team.map((member, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="relative mb-4">
                  <img 
                    src={member.image} 
                    alt={member.name}
                    className="w-24 h-24 rounded-full mx-auto object-cover"
                  />
                  <Badge className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                    {member.specialization}
                  </Badge>
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{member.name}</h3>
                <p className="text-blue-600 font-medium mb-2">{member.role}</p>
                <p className="text-sm text-gray-500 mb-3">{member.experience}</p>
                <p className="text-sm text-gray-600">{member.bio}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Timeline Section */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Our Journey</h2>
        <div className="relative">
          <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-blue-200"></div>
          <div className="space-y-8">
            {milestones.map((milestone, index) => (
              <div key={index} className={`flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                <div className={`w-1/2 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8 text-left'}`}>
                  <Card className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="text-blue-600 font-bold text-lg mb-2">{milestone.year}</div>
                      <h3 className="font-semibold text-gray-900 mb-2">{milestone.title}</h3>
                      <p className="text-gray-600 text-sm">{milestone.description}</p>
                    </CardContent>
                  </Card>
                </div>
                <div className="relative">
                  <div className="w-4 h-4 bg-blue-600 rounded-full border-4 border-white shadow-lg"></div>
                </div>
                <div className="w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Certifications & Awards */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Awards & Recognition</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <Card className="text-center p-6">
            <Award className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
            <p className="font-semibold text-sm">Best Travel Agency 2023</p>
            <p className="text-xs text-gray-500">Travel Industry Awards</p>
          </Card>
          <Card className="text-center p-6">
            <Star className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
            <p className="font-semibold text-sm">Excellence in Service</p>
            <p className="text-xs text-gray-500">Customer Choice Awards</p>
          </Card>
          <Card className="text-center p-6">
            <Shield className="h-8 w-8 text-green-500 mx-auto mb-2" />
            <p className="font-semibold text-sm">Sustainable Tourism</p>
            <p className="text-xs text-gray-500">Green Travel Certification</p>
          </Card>
          <Card className="text-center p-6">
            <Users className="h-8 w-8 text-blue-500 mx-auto mb-2" />
            <p className="font-semibold text-sm">Top Employer</p>
            <p className="text-xs text-gray-500">Travel Industry</p>
          </Card>
        </div>
      </div>

      {/* Call to Action */}
      <div className="text-center bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Ready to Start Your Journey?</h2>
        <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
          Join thousands of satisfied travelers who have discovered the world with TourismPro. 
          Let us help you create memories that will last a lifetime.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg">
            <Camera className="h-4 w-4 mr-2" />
            Explore Tours
          </Button>
          <Button variant="outline" size="lg">
            <Phone className="h-4 w-4 mr-2" />
            Contact Us
          </Button>
        </div>
      </div>
    </div>
  )
}
