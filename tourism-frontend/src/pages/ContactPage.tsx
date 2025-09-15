import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { 
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  MessageCircle,
  Headphones,
  Globe,
  Calendar,
  User
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

export default function ContactPage() {
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    inquiryType: 'general'
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const contactInfo = [
    {
      icon: <Phone className="h-6 w-6" />,
      title: "Phone Support",
      details: ["+1 (555) 123-4567", "+1 (555) 987-6543"],
      description: "Available 24/7 for emergencies",
      color: "text-blue-600"
    },
    {
      icon: <Mail className="h-6 w-6" />,
      title: "Email Support",
      details: ["info@tourismpro.com", "bookings@tourismpro.com"],
      description: "Response within 2 hours",
      color: "text-green-600"
    },
    {
      icon: <MapPin className="h-6 w-6" />,
      title: "Visit Our Office",
      details: ["123 Travel Street", "Tourism District, TD 12345"],
      description: "Monday - Friday: 9AM - 6PM",
      color: "text-purple-600"
    },
    {
      icon: <MessageCircle className="h-6 w-6" />,
      title: "Live Chat",
      details: ["Available on website", "Instant responses"],
      description: "Mon-Sun: 8AM - 10PM",
      color: "text-orange-600"
    }
  ]

  const offices = [
    {
      city: "New York",
      address: "123 Fifth Avenue, NY 10001",
      phone: "+1 (555) 123-4567",
      email: "ny@tourismpro.com",
      image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400&h=300&fit=crop"
    },
    {
      city: "London",
      address: "456 Oxford Street, London W1C 1AP",
      phone: "+44 20 7123 4567",
      email: "london@tourismpro.com",
      image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=400&h=300&fit=crop"
    },
    {
      city: "Tokyo",
      address: "789 Shibuya Crossing, Tokyo 150-0002",
      phone: "+81 3 1234 5678",
      email: "tokyo@tourismpro.com",
      image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400&h=300&fit=crop"
    },
    {
      city: "Dubai",
      address: "101 Sheikh Zayed Road, Dubai",
      phone: "+971 4 123 4567",
      email: "dubai@tourismpro.com",
      image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400&h=300&fit=crop"
    }
  ]

  const inquiryTypes = [
    { value: 'general', label: 'General Inquiry' },
    { value: 'booking', label: 'Booking Support' },
    { value: 'complaint', label: 'Complaint/Issue' },
    { value: 'partnership', label: 'Partnership' },
    { value: 'press', label: 'Press/Media' },
    { value: 'careers', label: 'Careers' }
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000))

    toast({
      title: "Message Sent Successfully!",
      description: "We'll get back to you within 24 hours.",
    })

    // Reset form
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: '',
      inquiryType: 'general'
    })
    setIsSubmitting(false)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Contact Us</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          We're here to help you plan your perfect trip. Get in touch with our travel experts 
          for personalized assistance and support.
        </p>
      </div>

      {/* Contact Methods */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {contactInfo.map((info, index) => (
          <Card key={index} className="text-center hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className={`flex justify-center mb-4 ${info.color}`}>
                {info.icon}
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{info.title}</h3>
              <div className="space-y-1 mb-2">
                {info.details.map((detail, idx) => (
                  <p key={idx} className="text-sm font-medium text-gray-700">{detail}</p>
                ))}
              </div>
              <p className="text-xs text-gray-500">{info.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-12 mb-16">
        {/* Contact Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Send className="h-5 w-5 mr-2" />
              Send us a Message
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Your full name"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="your.email@example.com"
                    className="mt-1"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+1 (555) 123-4567"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="inquiryType">Inquiry Type</Label>
                  <select
                    id="inquiryType"
                    name="inquiryType"
                    value={formData.inquiryType}
                    onChange={handleChange}
                    className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {inquiryTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <Label htmlFor="subject">Subject *</Label>
                <Input
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  placeholder="Brief description of your inquiry"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="message">Message *</Label>
                <Textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  placeholder="Please provide details about your inquiry..."
                  rows={5}
                  className="mt-1"
                />
              </div>

              <Button 
                type="submit" 
                className="w-full" 
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Send Message
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Quick Contact Options */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Headphones className="h-5 w-5 mr-2" />
                Need Immediate Help?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start space-x-3 p-4 bg-blue-50 rounded-lg">
                <Phone className="h-5 w-5 text-blue-600 mt-1" />
                <div>
                  <h4 className="font-semibold text-blue-900">Emergency Support</h4>
                  <p className="text-blue-700 text-sm">24/7 hotline for urgent travel assistance</p>
                  <p className="font-semibold text-blue-900 mt-1">+1 (555) 911-HELP</p>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-4 bg-green-50 rounded-lg">
                <MessageCircle className="h-5 w-5 text-green-600 mt-1" />
                <div>
                  <h4 className="font-semibold text-green-900">Live Chat</h4>
                  <p className="text-green-700 text-sm">Chat with our support team instantly</p>
                  <Button variant="outline" size="sm" className="mt-2">
                    Start Chat
                  </Button>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-4 bg-purple-50 rounded-lg">
                <Calendar className="h-5 w-5 text-purple-600 mt-1" />
                <div>
                  <h4 className="font-semibold text-purple-900">Schedule a Call</h4>
                  <p className="text-purple-700 text-sm">Book a consultation with our travel experts</p>
                  <Button variant="outline" size="sm" className="mt-2">
                    Book Appointment
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                Business Hours
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Monday - Friday</span>
                  <span className="font-medium">9:00 AM - 8:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Saturday</span>
                  <span className="font-medium">10:00 AM - 6:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Sunday</span>
                  <span className="font-medium">12:00 PM - 5:00 PM</span>
                </div>
                <div className="flex justify-between pt-2 border-t">
                  <span>Emergency Support</span>
                  <span className="font-medium text-blue-600">24/7</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Global Offices */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">Our Global Offices</h2>
        <p className="text-center text-gray-600 mb-8 max-w-2xl mx-auto">
          Visit us at any of our offices worldwide or contact your nearest location for personalized service.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {offices.map((office, index) => (
            <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative h-40">
                <img 
                  src={office.image} 
                  alt={office.city}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="absolute bottom-2 left-2 text-white">
                  <h3 className="font-bold">{office.city}</h3>
                </div>
              </div>
              <CardContent className="p-4">
                <div className="space-y-2 text-sm">
                  <div className="flex items-start">
                    <MapPin className="h-4 w-4 text-gray-400 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-600">{office.address}</span>
                  </div>
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-gray-600">{office.phone}</span>
                  </div>
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-gray-600">{office.email}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* FAQ Section */}
      <Card className="mb-16">
        <CardHeader>
          <CardTitle className="text-center">Frequently Asked Questions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">How can I modify my booking?</h4>
                <p className="text-sm text-gray-600">You can modify your booking through your account dashboard or contact our support team for assistance.</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">What is your cancellation policy?</h4>
                <p className="text-sm text-gray-600">Cancellation policies vary by package. Check your booking confirmation or contact us for specific details.</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Do you offer travel insurance?</h4>
                <p className="text-sm text-gray-600">Yes, we partner with leading insurance providers to offer comprehensive travel protection plans.</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">How do I request a custom itinerary?</h4>
                <p className="text-sm text-gray-600">Contact our travel specialists who will work with you to create a personalized travel experience.</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">What payment methods do you accept?</h4>
                <p className="text-sm text-gray-600">We accept all major credit cards, PayPal, bank transfers, and installment payment plans.</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Do you provide 24/7 support during travel?</h4>
                <p className="text-sm text-gray-600">Yes, our emergency support line is available 24/7 for assistance during your travels.</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Call to Action */}
      <div className="text-center bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Ready to Plan Your Next Adventure?</h2>
        <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
          Our travel experts are standing by to help you create the perfect itinerary. 
          Contact us today to start planning your dream vacation.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg">
            <User className="h-4 w-4 mr-2" />
            Speak to an Expert
          </Button>
          <Button variant="outline" size="lg">
            <Globe className="h-4 w-4 mr-2" />
            Browse Tours
          </Button>
        </div>
      </div>
    </div>
  )
}
