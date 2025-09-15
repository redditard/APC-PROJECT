import { useState, useEffect } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  MapPin, 
  Clock, 
  Star, 
  Heart, 
  Share2,
  CheckCircle,
  ArrowLeft,
  Phone,
  Mail
} from 'lucide-react'
import { tourService, bookingService, Tour } from '@/services/api'
import { useAuthStore } from '@/store/authStore'

export default function TourDetailsPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useAuthStore()
  const [tour, setTour] = useState<Tour | null>(null)
  const [loading, setLoading] = useState(true)
  const [bookingLoading, setBookingLoading] = useState(false)
  const [showBookingForm, setShowBookingForm] = useState(false)
  const [selectedPackageId, setSelectedPackageId] = useState<number | null>(null)
  
  // Booking form state
  const [bookingData, setBookingData] = useState({
    numberOfPeople: 1,
    contactEmail: user?.email || '',
    contactPhone: '',
    specialRequests: '',
    bookingDate: ''
  })

  useEffect(() => {
    if (id) {
      loadTourDetails(parseInt(id))
    }
  }, [id])

  useEffect(() => {
    // Pick preselected package from query string if present
    const params = new URLSearchParams(location.search)
    const pkg = params.get('package')
    if (pkg) setSelectedPackageId(Number(pkg))
  }, [location.search])

  const loadTourDetails = async (tourId: number) => {
    setLoading(true)
    try {
      const data = await tourService.getTourById(tourId)
      setTour(data)
    } catch (error) {
      console.error('Failed to load tour details:', error)
  navigate('/packages')
    } finally {
      setLoading(false)
    }
  }

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) {
      navigate('/login')
      return
    }

    if (!tour) return
    // Prefer chosen package if available; fall back to cheapest package
    const availablePkgs = tour.packages || []
    const pkgId = selectedPackageId || (availablePkgs.length ? [...availablePkgs].sort((a,b)=>a.price-b.price)[0].id : undefined)
    if (!pkgId) {
      alert('Please select a package to continue with booking.')
      return
    }

    setBookingLoading(true)
    try {
      const booking = {
        packageId: pkgId,
        numberOfPeople: bookingData.numberOfPeople,
        contactEmail: bookingData.contactEmail,
        contactPhone: bookingData.contactPhone,
        specialRequests: bookingData.specialRequests || undefined
      }

      await bookingService.createBooking(booking)
      alert('Booking created successfully! You will receive a confirmation email soon.')
      navigate('/bookings')
    } catch (error) {
      console.error('Failed to create booking:', error)
      alert('Failed to create booking. Please try again.')
    } finally {
      setBookingLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading tour details...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!tour) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-20">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Tour Not Found</h2>
          <p className="text-gray-600 mb-6">The tour you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => navigate('/packages')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Tours
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6">
  <Button variant="outline" onClick={() => navigate('/packages')} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Tours
        </Button>
        
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">{tour.name}</h1>
            <div className="flex items-center gap-4 text-gray-600">
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-1" />
                {tour.destination}
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                {tour.duration} days
              </div>
              <div className="flex items-center">
                <Star className="h-4 w-4 mr-1 fill-yellow-400 text-yellow-400" />
                4.5 (24 reviews)
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Heart className="h-4 w-4 mr-2" />
              Save
            </Button>
            <Button variant="outline" size="sm">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Image Gallery */}
          <div className="relative">
            <div className="aspect-[16/9] bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center">
              <MapPin className="h-16 w-16 text-white" />
            </div>
            <div className="absolute bottom-4 left-4">
              <Badge variant="secondary" className="bg-white/90">
                Photo Gallery (4 photos)
              </Badge>
            </div>
          </div>

          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle>About This Tour</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 leading-relaxed">
                {tour.description}
              </p>
            </CardContent>
          </Card>

          {/* Inclusions */}
          <Card>
            <CardHeader>
              <CardTitle>What's Included</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  'Professional tour guide',
                  'Transportation',
                  'Accommodation',
                  'Meals as specified',
                  'Entry fees to attractions',
                  '24/7 support'
                ].map((inclusion, index) => (
                  <div key={index} className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                    <span>{inclusion}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Itinerary */}
          <Card>
            <CardHeader>
              <CardTitle>Itinerary</CardTitle>
              <CardDescription>Day-by-day breakdown of your tour</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Array.from({ length: tour.duration }, (_, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                      {i + 1}
                    </div>
                    <div>
                      <h4 className="font-semibold">Day {i + 1}</h4>
                      <p className="text-gray-600 text-sm">
                        Explore the beautiful attractions and immerse yourself in the local culture.
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Booking Sidebar */}
        <div className="space-y-6">
          <Card className="sticky top-8">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Book This Tour</span>
                <Badge variant={tour.status === 'ACTIVE' ? 'default' : 'secondary'}>
                  {tour.status}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center py-4 border-b space-y-2">
                <div className="text-sm text-gray-600">Choose a package</div>
                <select
                  className="w-full p-2 border rounded"
                  value={selectedPackageId ?? ''}
                  onChange={(e)=> setSelectedPackageId(e.target.value ? Number(e.target.value) : null)}
                >
                  <option value="">{(tour.packages?.length ?? 0) > 0 ? 'Select package' : 'No packages available'}</option>
                  {tour.packages?.map(p => (
                    <option key={p.id} value={p.id}>{p.packageName} — ₹{p.price.toLocaleString()}</option>
                  ))}
                </select>
                {selectedPackageId && (
                  <div className="text-sm text-gray-600">
                    Selected price: ₹{tour.packages?.find(p=>p.id===selectedPackageId)?.price.toLocaleString()}
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Duration:</span>
                  <span className="font-medium">{tour.duration} days</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Max participants:</span>
                  <span className="font-medium">{tour.maxParticipants} people</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Available from:</span>
                  <span className="font-medium">{new Date(tour.startDate).toLocaleDateString()}</span>
                </div>
              </div>

              {user ? (
                <>
                  {!showBookingForm ? (
                    <Button 
                      className="w-full" 
                      onClick={() => setShowBookingForm(true)}
                      disabled={tour.status !== 'ACTIVE'}
                    >
                      Book Now
                    </Button>
                  ) : (
                    <form onSubmit={handleBooking} className="space-y-4">
                      <div>
                        <Label htmlFor="numberOfPeople">Number of People</Label>
                        <Input
                          id="numberOfPeople"
                          type="number"
                          min="1"
                          max={tour.maxParticipants}
                          value={bookingData.numberOfPeople}
                          onChange={(e) => setBookingData({ 
                            ...bookingData, 
                            numberOfPeople: parseInt(e.target.value) 
                          })}
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="bookingDate">Preferred Start Date</Label>
                        <Input
                          id="bookingDate"
                          type="date"
                          value={bookingData.bookingDate}
                          onChange={(e) => setBookingData({ 
                            ...bookingData, 
                            bookingDate: e.target.value 
                          })}
                          min={new Date().toISOString().split('T')[0]}
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="contactEmail">Email</Label>
                        <Input
                          id="contactEmail"
                          type="email"
                          value={bookingData.contactEmail}
                          onChange={(e) => setBookingData({ 
                            ...bookingData, 
                            contactEmail: e.target.value 
                          })}
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="contactPhone">Phone Number</Label>
                        <Input
                          id="contactPhone"
                          type="tel"
                          value={bookingData.contactPhone}
                          onChange={(e) => setBookingData({ 
                            ...bookingData, 
                            contactPhone: e.target.value 
                          })}
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="specialRequests">Special Requests (Optional)</Label>
                        <Input
                          id="specialRequests"
                          value={bookingData.specialRequests}
                          onChange={(e) => setBookingData({ 
                            ...bookingData, 
                            specialRequests: e.target.value 
                          })}
                          placeholder="Any special requirements..."
                        />
                      </div>

                      <div className="pt-4 border-t">
                        <div className="flex justify-between items-center mb-4">
                          <span className="font-medium">Total Amount:</span>
                          <span className="text-xl font-bold text-blue-600">
                            {(() => {
                              const price = tour.packages?.find(p => p.id === selectedPackageId)?.price
                              return price
                                ? `₹${(price * bookingData.numberOfPeople).toLocaleString()}`
                                : 'Select a package for price'
                            })()}
                          </span>
                        </div>
                        
                        <div className="space-y-2">
                          <Button 
                            type="submit" 
                            className="w-full"
                            disabled={bookingLoading}
                          >
                            {bookingLoading ? 'Processing...' : 'Confirm Booking'}
                          </Button>
                          <Button 
                            type="button" 
                            variant="outline" 
                            className="w-full"
                            onClick={() => setShowBookingForm(false)}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </form>
                  )}
                </>
              ) : (
                <div className="space-y-3">
                  <Button className="w-full" onClick={() => navigate('/login')}>
                    Login to Book
                  </Button>
                  <p className="text-sm text-center text-gray-600">
                    Don't have an account?{' '}
                    <button 
                      onClick={() => navigate('/register')}
                      className="text-blue-600 hover:underline"
                    >
                      Sign up here
                    </button>
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle>Need Help?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center">
                <Phone className="h-4 w-4 mr-3 text-gray-600" />
                <span className="text-sm">+91 98765 43210</span>
              </div>
              <div className="flex items-center">
                <Mail className="h-4 w-4 mr-3 text-gray-600" />
                <span className="text-sm">support@tourismnow.com</span>
              </div>
              <Button variant="outline" size="sm" className="w-full mt-4">
                Contact Support
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
