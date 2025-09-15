import React, { useState, useEffect } from 'react'
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  Users, 
  MapPin, 
  Calendar, 
  DollarSign, 
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  Download,
  Settings
} from 'lucide-react'
import { tourService, bookingService, Tour, Booking } from '@/services/api'
import SystemStatus from '@/components/SystemStatus'

interface DashboardStats {
  totalTours: number
  totalBookings: number
  totalRevenue: number
  activeUsers: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalTours: 0,
    totalBookings: 0,
    totalRevenue: 0,
    activeUsers: 0
  })
  const [tours, setTours] = useState<Tour[]>([])
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')

  // New Tour Form State
  const [newTour, setNewTour] = useState({
    name: '',
    description: '',
    destination: '',
    price: 0,
    duration: 1,
    maxParticipants: 10,
    startDate: '',
    endDate: '',
    status: 'ACTIVE' as const
  })

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    setLoading(true)
    try {
      const [toursData, bookingsData] = await Promise.all([
        tourService.getAllTours(),
        bookingService.getAllBookings()
      ])

      setTours(toursData)
      setBookings(bookingsData)

      // Calculate stats
      const totalRevenue = bookingsData
        .filter(b => b.status === 'CONFIRMED')
        .reduce((sum, b) => sum + b.totalAmount, 0)

      setStats({
        totalTours: toursData.length,
        totalBookings: bookingsData.length,
        totalRevenue,
        activeUsers: new Set(bookingsData.map(b => b.touristId)).size
      })
    } catch (error) {
      console.error('Failed to load dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateTour = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await tourService.createTour(newTour)
      await loadDashboardData()
      setNewTour({
        name: '',
        description: '',
        destination: '',
        price: 0,
        duration: 1,
        maxParticipants: 10,
        startDate: '',
        endDate: '',
        status: 'ACTIVE'
      })
      alert('Tour created successfully!')
    } catch (error) {
      console.error('Failed to create tour:', error)
      alert('Failed to create tour')
    }
  }

  const handleDeleteTour = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this tour?')) {
      try {
        await tourService.deleteTour(id)
        await loadDashboardData()
        alert('Tour deleted successfully!')
      } catch (error) {
        console.error('Failed to delete tour:', error)
        alert('Failed to delete tour')
      }
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <Button onClick={loadDashboardData} variant="outline">
          <Settings className="h-4 w-4 mr-2" />
          Refresh Data
        </Button>
      </div>

      {/* System Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Tours</CardTitle>
                <MapPin className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalTours}</div>
                <p className="text-xs text-muted-foreground">Active destinations</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalBookings}</div>
                <p className="text-xs text-muted-foreground">All time bookings</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₹{stats.totalRevenue.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">Total revenue</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.activeUsers}</div>
                <p className="text-xs text-muted-foreground">Unique customers</p>
              </CardContent>
            </Card>
          </div>
        </div>

        <div>
          <SystemStatus />
        </div>
      </div>

      {/* Main Content Tabs */}
      <div className="space-y-4">
        <div className="border-b">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'tours', label: 'Tours' },
              { id: 'packages', label: 'Packages' },
              { id: 'bookings', label: 'Bookings' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Bookings</CardTitle>
                <CardDescription>Latest booking requests</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {bookings.slice(0, 5).map((booking) => (
                    <div key={booking.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <div>
                        <p className="font-medium">{booking.bookingReference}</p>
                        <p className="text-sm text-gray-600">₹{booking.totalAmount}</p>
                      </div>
                      <Badge variant={booking.status === 'CONFIRMED' ? 'default' : 'secondary'}>
                        {booking.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Popular Tours</CardTitle>
                <CardDescription>Most booked destinations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {tours.slice(0, 5).map((tour) => (
                    <div key={tour.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <div>
                        <p className="font-medium">{tour.name}</p>
                        <p className="text-sm text-gray-600">{tour.destination}</p>
                      </div>
                      <Badge variant="outline">₹{tour.price}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          </div>
        )}

        {/* Tours Management Tab */}
        {activeTab === 'tours' && (
          <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Tour Management</h2>
            <div className="flex space-x-2">
              <Input placeholder="Search tours..." className="w-64" />
              <Button variant="outline">
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Create New Tour Form */}
          <Card>
            <CardHeader>
              <CardTitle>Create New Tour</CardTitle>
              <CardDescription>Add a new tour destination</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateTour} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Tour Name</Label>
                  <Input
                    id="name"
                    value={newTour.name}
                    onChange={(e) => setNewTour({ ...newTour, name: e.target.value })}
                    placeholder="Amazing Goa Adventure"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="destination">Destination</Label>
                  <Input
                    id="destination"
                    value={newTour.destination}
                    onChange={(e) => setNewTour({ ...newTour, destination: e.target.value })}
                    placeholder="Goa, India"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price">Price (₹)</Label>
                  <Input
                    id="price"
                    type="number"
                    value={newTour.price}
                    onChange={(e) => setNewTour({ ...newTour, price: Number(e.target.value) })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="duration">Duration (days)</Label>
                  <Input
                    id="duration"
                    type="number"
                    value={newTour.duration}
                    onChange={(e) => setNewTour({ ...newTour, duration: Number(e.target.value) })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="maxParticipants">Max Participants</Label>
                  <Input
                    id="maxParticipants"
                    type="number"
                    value={newTour.maxParticipants}
                    onChange={(e) => setNewTour({ ...newTour, maxParticipants: Number(e.target.value) })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={newTour.startDate}
                    onChange={(e) => setNewTour({ ...newTour, startDate: e.target.value })}
                    required
                  />
                </div>

                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    value={newTour.description}
                    onChange={(e) => setNewTour({ ...newTour, description: e.target.value })}
                    placeholder="Explore the beautiful beaches and vibrant culture of Goa..."
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <Button type="submit" className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Tour
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Tours List */}
          <Card>
            <CardHeader>
              <CardTitle>All Tours</CardTitle>
              <CardDescription>Manage existing tours</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {tours.map((tour) => (
                  <div key={tour.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h3 className="font-semibold">{tour.name}</h3>
                      <p className="text-sm text-gray-600">{tour.destination} • {tour.duration} days</p>
                      <p className="text-sm text-gray-500">{tour.description}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">₹{tour.price}</Badge>
                      <Badge variant={tour.status === 'ACTIVE' ? 'default' : 'secondary'}>
                        {tour.status}
                      </Badge>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleDeleteTour(tour.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          </div>
        )}

        {/* Packages Tab */}
        {activeTab === 'packages' && (
          <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Package Management</CardTitle>
              <CardDescription>Manage tour packages and pricing</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Package management features coming soon...</p>
            </CardContent>
          </Card>
          </div>
        )}

        {/* Bookings Tab */}
        {activeTab === 'bookings' && (
          <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Booking Management</h2>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export Data
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>All Bookings</CardTitle>
              <CardDescription>Manage customer bookings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {bookings.map((booking) => (
                  <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h3 className="font-semibold">{booking.bookingReference}</h3>
                      <p className="text-sm text-gray-600">
                        {booking.packageName} • {booking.numberOfPeople} people
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(booking.bookingDate).toLocaleDateString()} • {booking.contactEmail}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">₹{booking.totalAmount}</Badge>
                      <Badge variant={booking.status === 'CONFIRMED' ? 'default' : 'secondary'}>
                        {booking.status}
                      </Badge>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          </div>
        )}
      </div>
    </div>
  )
}
