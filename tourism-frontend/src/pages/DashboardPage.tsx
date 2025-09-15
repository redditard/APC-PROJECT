import { useAuthStore } from '@/store/authStore'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'
import SystemStatus from '@/components/SystemStatus'
import { 
  Calendar, 
  MapPin, 
  Plane,
  Camera,
  Star,
  Clock
} from 'lucide-react'

export default function DashboardPage() {
  const { user } = useAuthStore()

  const stats = [
    {
      title: "Tours Booked",
      value: "3",
      description: "This year",
      icon: <Plane className="h-5 w-5" />,
      color: "text-blue-600"
    },
    {
      title: "Countries Visited",
      value: "12",
      description: "All time",
      icon: <MapPin className="h-5 w-5" />,
      color: "text-green-600"
    },
    {
      title: "Travel Memories",
      value: "156",
      description: "Photos uploaded",
      icon: <Camera className="h-5 w-5" />,
      color: "text-purple-600"
    },
    {
      title: "Average Rating",
      value: "4.8",
      description: "Tour ratings",
      icon: <Star className="h-5 w-5" />,
      color: "text-yellow-600"
    }
  ]

  const recentBookings = [
    {
      id: 1,
      title: "Paris City Explorer",
      date: "2024-03-15",
      status: "Confirmed",
      price: 1299
    },
    {
      id: 2,
      title: "Tokyo Adventure",
      date: "2024-04-22",
      status: "Pending",
      price: 1599
    }
  ]

  const upcomingTours = [
    {
      id: 1,
      title: "Mediterranean Cruise",
      startDate: "2024-05-10",
      duration: "12 days",
      destination: "Greece & Italy"
    }
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {user?.username}! 🌍
        </h1>
        <p className="text-gray-600 mt-2">
          Ready for your next adventure? Here's what's happening with your travels.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-xs text-gray-500">{stat.description}</p>
                </div>
                <div className={`${stat.color}`}>
                  {stat.icon}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Bookings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5" />
              <span>Recent Bookings</span>
            </CardTitle>
            <CardDescription>
              Your latest tour reservations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentBookings.map((booking) => (
                <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">{booking.title}</h4>
                    <p className="text-sm text-gray-500">
                      Date: {new Date(booking.date).toLocaleDateString()}
                    </p>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      booking.status === 'Confirmed' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {booking.status}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">${booking.price}</p>
                  </div>
                </div>
              ))}
              <Button asChild className="w-full mt-4">
                <Link to="/bookings">View All Bookings</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Tours */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="h-5 w-5" />
              <span>Upcoming Tours</span>
            </CardTitle>
            <CardDescription>
              Tours you have scheduled
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingTours.map((tour) => (
                <div key={tour.id} className="p-4 border rounded-lg">
                  <h4 className="font-medium">{tour.title}</h4>
                  <p className="text-sm text-gray-500 mt-1">
                    📍 {tour.destination}
                  </p>
                  <p className="text-sm text-gray-500">
                    🗓️ {new Date(tour.startDate).toLocaleDateString()} • {tour.duration}
                  </p>
                </div>
              ))}
              <Button asChild variant="outline" className="w-full mt-4">
                <Link to="/packages">Explore Packages</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* System Status */}
        <SystemStatus />
      </div>

      {/* Quick Actions */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Jump to common tasks and features
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button asChild variant="outline" className="h-20 flex-col">
              <Link to="/packages">
                <Plane className="h-6 w-6 mb-2" />
                Browse Tours
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-20 flex-col">
              <Link to="/itinerary">
                <MapPin className="h-6 w-6 mb-2" />
                Plan Itinerary
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-20 flex-col">
              <Link to="/bookings">
                <Calendar className="h-6 w-6 mb-2" />
                Manage Bookings
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
