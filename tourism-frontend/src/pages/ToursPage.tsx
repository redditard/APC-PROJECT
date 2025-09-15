import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  Search, 
  Star, 
  MapPin, 
  Users,
  Heart,
  Clock
} from 'lucide-react'
import { tourService, Tour } from '@/services/api'

export default function ToursPage() {
  const [tours, setTours] = useState<Tour[]>([])
  const [filteredTours, setFilteredTours] = useState<Tour[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('name')
  const [filters, setFilters] = useState({
    priceRange: [0, 100000],
    duration: '',
    destination: ''
  })
  const navigate = useNavigate()

  useEffect(() => {
    loadTours()
  }, [])

  useEffect(() => {
    filterAndSortTours()
  }, [tours, searchTerm, sortBy, filters])

  const loadTours = async () => {
    setLoading(true)
    try {
      const data = await tourService.getAllTours()
      setTours(data)
    } catch (error) {
      console.error('Failed to load tours:', error)
    } finally {
      setLoading(false)
    }
  }

  const filterAndSortTours = () => {
    let filtered = tours.filter(tour => {
      const matchesSearch = tour.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           tour.destination.toLowerCase().includes(searchTerm.toLowerCase())
  const price = tour.price ?? 0
  const matchesPrice = price >= filters.priceRange[0] && price <= filters.priceRange[1]
      const matchesDuration = !filters.duration || tour.duration.toString() === filters.duration
      const matchesDestination = !filters.destination || 
                                 tour.destination.toLowerCase().includes(filters.destination.toLowerCase())
      
      return matchesSearch && matchesPrice && matchesDuration && matchesDestination
    })

    // Sort tours
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-asc':
          return (a.price ?? Number.MAX_SAFE_INTEGER) - (b.price ?? Number.MAX_SAFE_INTEGER)
        case 'price-desc':
          return (b.price ?? 0) - (a.price ?? 0)
        case 'duration':
          return a.duration - b.duration
        case 'name':
        default:
          return a.name.localeCompare(b.name)
      }
    })

    setFilteredTours(filtered)
  }

  const handleBookNow = (tour: Tour) => {
    const cheapest = (tour.packages || []).slice().sort((a,b) => a.price - b.price)[0]
    const qs = cheapest ? `?package=${cheapest.id}` : ''
    navigate(`/tour/${tour.id}${qs}`)
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading amazing tours...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Discover Amazing Tours</h1>
        <p className="text-gray-600 text-lg">Explore breathtaking destinations and create unforgettable memories</p>
      </div>

      {/* Search and Filters */}
      <div className="mb-8 space-y-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search Bar */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search tours, destinations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Sort Dropdown */}
          <div className="lg:w-48">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="name">Sort by Name</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="duration">Duration</option>
            </select>
          </div>
        </div>

        {/* Quick Filters */}
        <div className="flex flex-wrap gap-2">
          <Button 
            variant={filters.duration === '' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setFilters({ ...filters, duration: '' })}
          >
            All Durations
          </Button>
          <Button 
            variant={filters.duration === '3' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setFilters({ ...filters, duration: '3' })}
          >
            3 Days
          </Button>
          <Button 
            variant={filters.duration === '7' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setFilters({ ...filters, duration: '7' })}
          >
            1 Week
          </Button>
          <Button 
            variant={filters.duration === '14' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setFilters({ ...filters, duration: '14' })}
          >
            2 Weeks
          </Button>
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-6">
        <p className="text-gray-600">
          Showing {filteredTours.length} of {tours.length} tours
        </p>
      </div>

      {/* Tours Grid */}
      {filteredTours.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-gray-400 mb-4">
            <Search className="h-16 w-16 mx-auto" />
          </div>
          <h3 className="text-2xl font-semibold text-gray-900 mb-2">No tours found</h3>
          <p className="text-gray-600 mb-6">Try adjusting your search criteria or browse all tours</p>
          <Button onClick={() => {
            setSearchTerm('')
            setFilters({ priceRange: [0, 100000], duration: '', destination: '' })
          }}>
            Clear Filters
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredTours.map((tour) => (
            <Card key={tour.id} className="group hover:shadow-xl transition-all duration-300 cursor-pointer">
              <CardHeader className="p-0">
                <div className="relative overflow-hidden rounded-t-lg bg-gradient-to-br from-blue-400 to-blue-600 h-48">
                  {/* Placeholder for tour image */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-400/80 to-blue-600/80 flex items-center justify-center">
                    <MapPin className="h-12 w-12 text-white" />
                  </div>
                  <div className="absolute top-3 right-3">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-white hover:bg-white/20">
                      <Heart className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="absolute bottom-3 left-3">
                    <Badge variant="secondary" className="bg-white/90 text-gray-900">
                      <Clock className="h-3 w-3 mr-1" />
                      {tour.duration} days
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-4 space-y-3">
                <div>
                  <h3 className="font-semibold text-lg group-hover:text-blue-600 transition-colors line-clamp-1">
                    {tour.name}
                  </h3>
                  <div className="flex items-center text-sm text-gray-600 mt-1">
                    <MapPin className="h-3 w-3 mr-1" />
                    {tour.destination}
                  </div>
                </div>

                <p className="text-sm text-gray-600 line-clamp-2">
                  {tour.description}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">4.5</span>
                    <span className="text-sm text-gray-500">(12)</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Users className="h-3 w-3 mr-1" />
                    Max {tour.maxParticipants}
                  </div>
                </div>

                <div className="pt-3 border-t">
                  <div className="flex items-center justify-between">
                    <div>
                      {typeof tour.price === 'number' ? (
                        <>
                          <span className="text-2xl font-bold text-blue-600">₹{tour.price.toLocaleString()}</span>
                          <span className="text-sm text-gray-500 ml-1">from</span>
                        </>
                      ) : (
                        <span className="text-sm text-gray-500">Price varies by package</span>
                      )}
                    </div>
                    <Badge variant={tour.status === 'ACTIVE' ? 'default' : 'secondary'}>
                      {tour.status}
                    </Badge>
                  </div>
                </div>

                {/* Quick package preview */}
                {tour.packages && tour.packages.length > 0 && (
                  <div className="mt-2">
                    <div className="text-xs text-gray-600 mb-1">Popular packages:</div>
                    <div className="flex flex-wrap gap-2">
                      {tour.packages.slice(0, 2).map((p) => (
                        <Badge key={p.id} variant="outline" className="text-xs">
                          {p.packageName} · ₹{p.price.toLocaleString()}
                        </Badge>
                      ))}
                      {tour.packages.length > 2 && (
                        <Badge variant="secondary" className="text-xs">+{tour.packages.length - 2} more</Badge>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex gap-2 pt-3">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => navigate(`/tour/${tour.id}`)}
                  >
                    View Details
                  </Button>
                  <Button 
                    size="sm" 
                    className="flex-1"
                    onClick={() => handleBookNow(tour)}
                    disabled={tour.status !== 'ACTIVE'}
                  >
                    Book Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Load More or Pagination could go here */}
      {filteredTours.length > 0 && (
        <div className="mt-12 text-center">
          <Button variant="outline" size="lg">
            Load More Tours
          </Button>
        </div>
      )}
    </div>
  )
}
