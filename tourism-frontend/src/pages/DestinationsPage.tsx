import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  Search, 
  MapPin, 
  Star,
  Camera,
  Users,
  Calendar,
  ArrowRight,
  Heart,
  Filter,
  Globe
} from 'lucide-react'

interface Destination {
  id: number
  name: string
  country: string
  continent: string
  description: string
  image: string
  gallery: string[]
  highlights: string[]
  bestTime: string
  difficulty: 'Easy' | 'Moderate' | 'Challenging'
  duration: string
  startingPrice: number
  rating: number
  reviewCount: number
  popularActivities: string[]
  featured: boolean
}

export default function DestinationsPage() {
  const [destinations, setDestinations] = useState<Destination[]>([])
  const [filteredDestinations, setFilteredDestinations] = useState<Destination[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedContinent, setSelectedContinent] = useState('')
  const [selectedDifficulty, setSelectedDifficulty] = useState('')
  const [sortBy, setSortBy] = useState('popularity')

  const continents = ['All', 'Europe', 'Asia', 'North America', 'South America', 'Africa', 'Oceania']
  const difficulties = ['All', 'Easy', 'Moderate', 'Challenging']

  useEffect(() => {
    // Demo destinations data
    const demoDestinations: Destination[] = [
      {
        id: 1,
        name: "Paris",
        country: "France",
        continent: "Europe",
        description: "The City of Light captivates with its iconic landmarks, world-class museums, and romantic atmosphere.",
        image: "https://images.unsplash.com/photo-1502602898536-47ad22581b52?w=600&h=400&fit=crop",
        gallery: [
          "https://images.unsplash.com/photo-1502602898536-47ad22581b52?w=400&h=300&fit=crop",
          "https://images.unsplash.com/photo-1509439581779-6298f75bf6e5?w=400&h=300&fit=crop",
          "https://images.unsplash.com/photo-1500835556837-99ac94a94552?w=400&h=300&fit=crop"
        ],
        highlights: ["Eiffel Tower", "Louvre Museum", "Notre-Dame Cathedral", "Seine River Cruise"],
        bestTime: "April - October",
        difficulty: "Easy",
        duration: "5-7 days",
        startingPrice: 1299,
        rating: 4.8,
        reviewCount: 2847,
        popularActivities: ["City Tours", "Museum Visits", "Food Tours", "River Cruises"],
        featured: true
      },
      {
        id: 2,
        name: "Tokyo",
        country: "Japan",
        continent: "Asia",
        description: "A fascinating blend of ultra-modern technology and traditional culture in Japan's bustling capital.",
        image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600&h=400&fit=crop",
        gallery: [
          "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400&h=300&fit=crop",
          "https://images.unsplash.com/photo-1513407030348-c983a97b98d8?w=400&h=300&fit=crop",
          "https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=400&h=300&fit=crop"
        ],
        highlights: ["Senso-ji Temple", "Tokyo Skytree", "Shibuya Crossing", "Tsukiji Fish Market"],
        bestTime: "March - May, September - November",
        difficulty: "Moderate",
        duration: "7-10 days",
        startingPrice: 1599,
        rating: 4.9,
        reviewCount: 1923,
        popularActivities: ["Temple Visits", "Street Food", "Shopping", "Cultural Experiences"],
        featured: true
      },
      {
        id: 3,
        name: "Santorini",
        country: "Greece",
        continent: "Europe",
        description: "Stunning whitewashed buildings perched on volcanic cliffs overlooking the azure Aegean Sea.",
        image: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=600&h=400&fit=crop",
        gallery: [
          "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=400&h=300&fit=crop",
          "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=400&h=300&fit=crop",
          "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop"
        ],
        highlights: ["Oia Sunset", "Red Beach", "Ancient Akrotiri", "Wine Tasting"],
        bestTime: "April - October",
        difficulty: "Easy",
        duration: "4-6 days",
        startingPrice: 899,
        rating: 4.7,
        reviewCount: 1456,
        popularActivities: ["Beach Relaxation", "Wine Tours", "Photography", "Sunset Viewing"],
        featured: false
      },
      {
        id: 4,
        name: "Machu Picchu",
        country: "Peru",
        continent: "South America",
        description: "Ancient Incan citadel high in the Andes Mountains, one of the New Seven Wonders of the World.",
        image: "https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=600&h=400&fit=crop",
        gallery: [
          "https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=400&h=300&fit=crop",
          "https://images.unsplash.com/photo-1526392060635-9d6019884377?w=400&h=300&fit=crop",
          "https://images.unsplash.com/photo-1531065208531-4036c0dba3ca?w=400&h=300&fit=crop"
        ],
        highlights: ["Machu Picchu Citadel", "Huayna Picchu Hike", "Sacred Valley", "Inca Trail"],
        bestTime: "May - September",
        difficulty: "Challenging",
        duration: "8-12 days",
        startingPrice: 2299,
        rating: 4.9,
        reviewCount: 987,
        popularActivities: ["Hiking", "Archaeological Tours", "Cultural Immersion", "Adventure Sports"],
        featured: true
      },
      {
        id: 5,
        name: "Bali",
        country: "Indonesia",
        continent: "Asia",
        description: "Tropical paradise with stunning beaches, ancient temples, lush rice terraces, and vibrant culture.",
        image: "https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=600&h=400&fit=crop",
        gallery: [
          "https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=400&h=300&fit=crop",
          "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=400&h=300&fit=crop",
          "https://images.unsplash.com/photo-1555400080-8fc2d3e0494a?w=400&h=300&fit=crop"
        ],
        highlights: ["Uluwatu Temple", "Tegallalang Rice Terraces", "Mount Batur", "Seminyak Beach"],
        bestTime: "April - October",
        difficulty: "Easy",
        duration: "6-10 days",
        startingPrice: 1099,
        rating: 4.6,
        reviewCount: 2156,
        popularActivities: ["Beach Activities", "Temple Visits", "Spa Treatments", "Cultural Tours"],
        featured: false
      },
      {
        id: 6,
        name: "Iceland",
        country: "Iceland",
        continent: "Europe",
        description: "Land of fire and ice with otherworldly landscapes, geysers, waterfalls, and Northern Lights.",
        image: "https://images.unsplash.com/photo-1531220847861-69e336daffa0?w=600&h=400&fit=crop",
        gallery: [
          "https://images.unsplash.com/photo-1531220847861-69e336daffa0?w=400&h=300&fit=crop",
          "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=400&h=300&fit=crop",
          "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop"
        ],
        highlights: ["Golden Circle", "Blue Lagoon", "Northern Lights", "Glacier Lagoon"],
        bestTime: "June - August (summer), October - March (Northern Lights)",
        difficulty: "Moderate",
        duration: "7-10 days",
        startingPrice: 1799,
        rating: 4.8,
        reviewCount: 1234,
        popularActivities: ["Northern Lights", "Glacier Tours", "Hot Springs", "Photography"],
        featured: true
      }
    ]
    setDestinations(demoDestinations)
    setFilteredDestinations(demoDestinations)
  }, [])

  useEffect(() => {
    filterDestinations()
  }, [destinations, searchTerm, selectedContinent, selectedDifficulty, sortBy])

  const filterDestinations = () => {
    let filtered = destinations.filter(dest => {
      const matchesSearch = dest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           dest.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           dest.description.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesContinent = !selectedContinent || selectedContinent === 'All' || dest.continent === selectedContinent
      const matchesDifficulty = !selectedDifficulty || selectedDifficulty === 'All' || dest.difficulty === selectedDifficulty
      
      return matchesSearch && matchesContinent && matchesDifficulty
    })

    // Sort destinations
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'popularity':
          return b.reviewCount - a.reviewCount
        case 'rating':
          return b.rating - a.rating
        case 'price-asc':
          return a.startingPrice - b.startingPrice
        case 'price-desc':
          return b.startingPrice - a.startingPrice
        case 'name':
          return a.name.localeCompare(b.name)
        default:
          return 0
      }
    })

    setFilteredDestinations(filtered)
  }

  const clearFilters = () => {
    setSearchTerm('')
    setSelectedContinent('')
    setSelectedDifficulty('')
    setSortBy('popularity')
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy':
        return 'bg-green-100 text-green-800'
      case 'Moderate':
        return 'bg-yellow-100 text-yellow-800'
      case 'Challenging':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Explore Destinations</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Discover breathtaking destinations around the world. From vibrant cities to serene landscapes, 
          find your next adventure with our curated collection of travel experiences.
        </p>
      </div>

      {/* Featured Destinations Banner */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Destinations</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {destinations.filter(dest => dest.featured).slice(0, 3).map((dest) => (
            <Card key={dest.id} className="group overflow-hidden hover:shadow-xl transition-all duration-300">
              <div className="relative h-64">
                <img 
                  src={dest.image} 
                  alt={dest.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="text-xl font-bold">{dest.name}</h3>
                  <p className="text-sm opacity-90">{dest.country}</p>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="absolute top-4 right-4 text-white hover:text-red-500"
                >
                  <Heart className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Search and Filters */}
      <div className="mb-8 space-y-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search Bar */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search destinations, countries, activities..."
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
              <option value="popularity">Most Popular</option>
              <option value="rating">Highest Rated</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name">Name A-Z</option>
            </select>
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Continent</label>
            <select
              value={selectedContinent}
              onChange={(e) => setSelectedContinent(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md text-sm"
            >
              {continents.map((continent) => (
                <option key={continent} value={continent === 'All' ? '' : continent}>
                  {continent}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty</label>
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md text-sm"
            >
              {difficulties.map((difficulty) => (
                <option key={difficulty} value={difficulty === 'All' ? '' : difficulty}>
                  {difficulty}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <Button variant="outline" onClick={clearFilters} className="w-full">
              <Filter className="h-4 w-4 mr-2" />
              Clear Filters
            </Button>
          </div>
        </div>
      </div>

      {/* Results Summary */}
      <div className="mb-6">
        <p className="text-gray-600">
          Showing {filteredDestinations.length} destination{filteredDestinations.length !== 1 ? 's' : ''}
          {searchTerm && ` for "${searchTerm}"`}
        </p>
      </div>

      {/* Destinations Grid */}
      {filteredDestinations.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <Globe className="h-16 w-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-medium text-gray-900 mb-2">No destinations found</h3>
          <p className="text-gray-600 mb-6">Try adjusting your search criteria</p>
          <Button onClick={clearFilters} variant="outline">
            Clear All Filters
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {filteredDestinations.map((destination) => (
            <Card key={destination.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 group">
              <div className="relative">
                <img 
                  src={destination.image} 
                  alt={destination.name}
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4">
                  <Badge className={getDifficultyColor(destination.difficulty)}>
                    {destination.difficulty}
                  </Badge>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="absolute top-4 right-4 text-white hover:text-red-500 bg-black/20 hover:bg-black/30"
                >
                  <Heart className="h-4 w-4" />
                </Button>
                <div className="absolute bottom-4 left-4 text-white">
                  <div className="flex items-center mb-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                    <span className="font-medium">{destination.rating}</span>
                    <span className="text-sm opacity-75 ml-1">({destination.reviewCount})</span>
                  </div>
                </div>
              </div>

              <CardContent className="p-6">
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-bold text-gray-900">{destination.name}</h3>
                    <div className="flex items-center text-gray-500">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span className="text-sm">{destination.country}</span>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm line-clamp-2">{destination.description}</p>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>Best time: {destination.bestTime}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Users className="h-4 w-4 mr-2" />
                    <span>Duration: {destination.duration}</span>
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="font-medium text-gray-900 mb-2">Highlights</h4>
                  <div className="flex flex-wrap gap-1">
                    {destination.highlights.slice(0, 3).map((highlight, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {highlight}
                      </Badge>
                    ))}
                    {destination.highlights.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{destination.highlights.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <span className="text-2xl font-bold text-blue-600">₹{destination.startingPrice.toLocaleString()}</span>
                      <span className="text-sm text-gray-500 ml-1">starting from</span>
                    </div>
                    <Button variant="outline" size="sm">
                      <Camera className="h-4 w-4 mr-1" />
                      Gallery
                    </Button>
                  </div>
                  
                  <div className="space-y-2">
                    <Button className="w-full group">
                      Explore Tours
                      <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Call to Action */}
      <div className="mt-16 text-center bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Can't Find Your Dream Destination?</h2>
        <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
          Our travel experts can help you discover hidden gems and create custom itineraries 
          for destinations not listed here. Tell us where you want to go!
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg">
            Request Custom Destination
          </Button>
          <Button variant="outline" size="lg">
            Speak to Travel Expert
          </Button>
        </div>
      </div>
    </div>
  )
}
