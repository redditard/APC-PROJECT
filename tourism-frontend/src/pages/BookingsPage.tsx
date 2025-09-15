import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  Search, 
  Calendar, 
  Users, 
  Download, 
  Eye,
  X,
  FileText,
  Phone,
  Mail
} from 'lucide-react'
import { bookingService, Booking } from '@/services/api'
import { useAuthStore } from '@/store/authStore'

export default function BookingsPage() {
  const { user } = useAuthStore()
  const navigate = useNavigate()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('ALL')

  useEffect(() => {
    if (user) {
      loadBookings()
    }
  }, [user])

  useEffect(() => {
    filterBookings()
  }, [bookings, searchTerm, statusFilter])

  const loadBookings = async () => {
    setLoading(true)
    try {
      const data = await bookingService.getUserBookings()
      setBookings(data)
    } catch (error) {
      console.error('Failed to load bookings:', error)
    } finally {
      setLoading(false)
    }
  }

  const filterBookings = () => {
    let filtered = bookings.filter(booking => {
      const matchesSearch = booking.packageName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           booking.bookingReference.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = statusFilter === 'ALL' || booking.status === statusFilter
      
      return matchesSearch && matchesStatus
    })

    // Sort by booking date (newest first)
    filtered.sort((a, b) => new Date(b.bookingDate).getTime() - new Date(a.bookingDate).getTime())
    
    setFilteredBookings(filtered)
  }

  const handleCancelBooking = async (id: number) => {
    if (window.confirm('Are you sure you want to cancel this booking? This action cannot be undone.')) {
      try {
        await bookingService.cancelBooking(id, 'Cancelled by user')
        await loadBookings()
        alert('Booking cancelled successfully')
      } catch (error) {
        console.error('Failed to cancel booking:', error)
        alert('Failed to cancel booking')
      }
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return 'default'
      case 'PENDING':
        return 'secondary'
      case 'CANCELLED':
        return 'destructive'
      default:
        return 'outline'
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading your bookings...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Bookings</h1>
        <p className="text-gray-600">Manage and track your travel bookings</p>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search bookings..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Status Filter */}
          <div className="sm:w-48">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="ALL">All Status</option>
              <option value="CONFIRMED">Confirmed</option>
              <option value="PENDING">Pending</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Booking Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">{bookings.length}</div>
            <p className="text-sm text-gray-600">Total Bookings</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">
              {bookings.filter(b => b.status === 'CONFIRMED').length}
            </div>
            <p className="text-sm text-gray-600">Confirmed</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-yellow-600">
              {bookings.filter(b => b.status === 'PENDING').length}
            </div>
            <p className="text-sm text-gray-600">Pending</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-gray-600">
              ₹{bookings.filter(b => b.status === 'CONFIRMED').reduce((sum, b) => sum + b.totalAmount, 0).toLocaleString()}
            </div>
            <p className="text-sm text-gray-600">Total Spent</p>
          </CardContent>
        </Card>
      </div>

      {/* Bookings List */}
      {filteredBookings.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-gray-400 mb-4">
            <FileText className="h-16 w-16 mx-auto" />
          </div>
          <h3 className="text-2xl font-semibold text-gray-900 mb-2">
            {searchTerm || statusFilter !== 'ALL' ? 'No matching bookings' : 'No bookings yet'}
          </h3>
          <p className="text-gray-600 mb-6">
            {searchTerm || statusFilter !== 'ALL' 
              ? 'Try adjusting your search criteria'
              : 'Start planning your next adventure by exploring our tours'
            }
          </p>
          {(!searchTerm && statusFilter === 'ALL') && (
            <Button onClick={() => navigate('/packages')}>
              Explore Tours
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBookings.map((booking) => (
            <Card key={booking.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                  {/* Booking Info */}
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {booking.packageName || 'Tour Package'}
                      </h3>
                      <Badge variant={getStatusColor(booking.status)}>
                        {booking.status}
                      </Badge>
                    </div>
                    
                    <div className="text-sm text-gray-600 space-y-1">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2" />
                        Booked on {new Date(booking.bookingDate).toLocaleDateString()}
                      </div>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-2" />
                        {booking.numberOfPeople} {booking.numberOfPeople === 1 ? 'person' : 'people'}
                      </div>
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 mr-2" />
                        {booking.contactEmail}
                      </div>
                      {booking.contactPhone && (
                        <div className="flex items-center">
                          <Phone className="h-4 w-4 mr-2" />
                          {booking.contactPhone}
                        </div>
                      )}
                    </div>

                    <div className="text-sm text-gray-500">
                      <span className="font-medium">Booking Reference:</span> {booking.bookingReference}
                    </div>

                    {booking.specialRequests && (
                      <div className="text-sm text-gray-600">
                        <span className="font-medium">Special Requests:</span> {booking.specialRequests}
                      </div>
                    )}
                  </div>

                  {/* Amount and Actions */}
                  <div className="lg:text-right space-y-3">
                    <div>
                      <div className="text-2xl font-bold text-blue-600">
                        ₹{booking.totalAmount.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-500">Total Amount</div>
                    </div>

                    <div className="flex flex-wrap gap-2 lg:justify-end">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        Details
                      </Button>
                      
                      {booking.status === 'CONFIRMED' && (
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-2" />
                          Voucher
                        </Button>
                      )}
                      
                      {booking.status === 'PENDING' && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleCancelBooking(booking.id)}
                        >
                          <X className="h-4 w-4 mr-2" />
                          Cancel
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Load More or Pagination could go here */}
      {filteredBookings.length > 10 && (
        <div className="mt-8 text-center">
          <Button variant="outline">
            Load More Bookings
          </Button>
        </div>
      )}
    </div>
  )
}
