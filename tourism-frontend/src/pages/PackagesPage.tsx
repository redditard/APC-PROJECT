import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  Search, 
  Filter,
  Star, 
  Users,
  Utensils,
  Bed,
  Car,
  Plane,
  CheckCircle,
  ArrowRight,
  Heart,
  Share2
} from 'lucide-react'
import { TourPackage, tourService } from '@/services/api'

export default function PackagesPage() {
  const [packages, setPackages] = useState<TourPackage[]>([])
  const [filteredPackages, setFilteredPackages] = useState<TourPackage[]>([])
  const [loading, setLoading] = useState(true)
  const [usingDemo, setUsingDemo] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('price-asc')
  const [filters, setFilters] = useState({
    priceRange: [0, 100000],
    accommodationType: '',
    mealPlan: '',
    transportMode: ''
  })

  useEffect(() => {
    loadPackages()
  }, [])

  useEffect(() => {
    filterAndSortPackages()
  }, [packages, searchTerm, sortBy, filters])

  const loadPackages = async () => {
    setLoading(true)
    try {
      // Load all tours and flatten their packages to show real, bookable options
      const tours = await tourService.getAllTours()
      const pkgs: TourPackage[] = tours.flatMap(t => (t.packages ?? []).map(p => ({ ...p, tourId: p.tourId ?? t.id })))
      if (pkgs.length > 0) {
        setPackages(pkgs)
        setUsingDemo(false)
      } else {
        // Fallback to demo data when backend has no packages
        const demo: TourPackage[] = [
          {
            id: 1,
            packageName: "Deluxe Paris Experience",
            tourId: 1,
            price: 2499,
            inclusions: "5-star hotel, all meals, guided tours, airport transfers",
            exclusions: "International flights, personal expenses, tips",
            accommodationType: "5-Star Hotel",
            transportMode: "Private Car",
            mealPlan: "All Meals",
            version: 1,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          },
          {
            id: 2,
            packageName: "Budget Paris Adventure",
            tourId: 1,
            price: 1299,
            inclusions: "3-star hotel, breakfast, group tours, metro pass",
            exclusions: "Lunch, dinner, entrance fees, personal expenses",
            accommodationType: "3-Star Hotel",
            transportMode: "Public Transport",
            mealPlan: "Breakfast Only",
            version: 1,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          },
          {
            id: 3,
            packageName: "Premium Tokyo Journey",
            tourId: 2,
            price: 3299,
            inclusions: "Luxury ryokan, premium dining, private guide, JR Pass",
            exclusions: "International flights, alcohol, shopping",
            accommodationType: "Luxury Ryokan",
            transportMode: "Private Guide",
            mealPlan: "All Meals",
            version: 1,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          },
          {
            id: 4,
            packageName: "Standard Tokyo Explorer",
            tourId: 2,
            price: 1899,
            inclusions: "4-star hotel, breakfast, group tours, train passes",
            exclusions: "Lunch, dinner, shopping, personal expenses",
            accommodationType: "4-Star Hotel",
            transportMode: "Public Transport",
            mealPlan: "Breakfast Only",
            version: 1,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          },
          {
            id: 5,
            packageName: "Mediterranean Luxury Cruise",
            tourId: 3,
            price: 4999,
            inclusions: "Luxury suite, all meals, excursions, spa access",
            exclusions: "Flights, shore excursions, wifi, specialty dining",
            accommodationType: "Luxury Suite",
            transportMode: "Cruise Ship",
            mealPlan: "All Inclusive",
            version: 1,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          },
          {
            id: 6,
            packageName: "Mediterranean Standard Cruise",
            tourId: 3,
            price: 2199,
            inclusions: "Interior cabin, buffet meals, basic activities",
            exclusions: "Specialty restaurants, excursions, wifi, drinks",
            accommodationType: "Interior Cabin",
            transportMode: "Cruise Ship",
            mealPlan: "Buffet Only",
            version: 1,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        ]
        setPackages(demo)
        setUsingDemo(true)
      }
    } catch (error) {
      console.error('Failed to load packages from backend:', error)
      // Fallback to demo data on error
      const demo: TourPackage[] = [
        {
          id: 1,
          packageName: "Deluxe Paris Experience",
          tourId: 1,
          price: 2499,
          inclusions: "5-star hotel, all meals, guided tours, airport transfers",
          exclusions: "International flights, personal expenses, tips",
          accommodationType: "5-Star Hotel",
          transportMode: "Private Car",
          mealPlan: "All Meals",
          version: 1,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: 2,
          packageName: "Budget Paris Adventure",
          tourId: 1,
          price: 1299,
          inclusions: "3-star hotel, breakfast, group tours, metro pass",
          exclusions: "Lunch, dinner, entrance fees, personal expenses",
          accommodationType: "3-Star Hotel",
          transportMode: "Public Transport",
          mealPlan: "Breakfast Only",
          version: 1,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: 3,
          packageName: "Premium Tokyo Journey",
          tourId: 2,
          price: 3299,
          inclusions: "Luxury ryokan, premium dining, private guide, JR Pass",
          exclusions: "International flights, alcohol, shopping",
          accommodationType: "Luxury Ryokan",
          transportMode: "Private Guide",
          mealPlan: "All Meals",
          version: 1,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: 4,
          packageName: "Standard Tokyo Explorer",
          tourId: 2,
          price: 1899,
          inclusions: "4-star hotel, breakfast, group tours, train passes",
          exclusions: "Lunch, dinner, shopping, personal expenses",
          accommodationType: "4-Star Hotel",
          transportMode: "Public Transport",
          mealPlan: "Breakfast Only",
          version: 1,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: 5,
          packageName: "Mediterranean Luxury Cruise",
          tourId: 3,
          price: 4999,
          inclusions: "Luxury suite, all meals, excursions, spa access",
          exclusions: "Flights, shore excursions, wifi, specialty dining",
          accommodationType: "Luxury Suite",
          transportMode: "Cruise Ship",
          mealPlan: "All Inclusive",
          version: 1,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: 6,
          packageName: "Mediterranean Standard Cruise",
          tourId: 3,
          price: 2199,
          inclusions: "Interior cabin, buffet meals, basic activities",
          exclusions: "Specialty restaurants, excursions, wifi, drinks",
          accommodationType: "Interior Cabin",
          transportMode: "Cruise Ship",
          mealPlan: "Buffet Only",
          version: 1,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ]
      setPackages(demo)
      setUsingDemo(true)
    } finally {
      setLoading(false)
    }
  }

  const filterAndSortPackages = () => {
    let filtered = packages.filter(pkg => {
      const matchesSearch = pkg.packageName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           pkg.accommodationType.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           pkg.mealPlan.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesPrice = pkg.price >= filters.priceRange[0] && pkg.price <= filters.priceRange[1]
      const matchesAccommodation = !filters.accommodationType || pkg.accommodationType.includes(filters.accommodationType)
      const matchesMealPlan = !filters.mealPlan || pkg.mealPlan.includes(filters.mealPlan)
      const matchesTransport = !filters.transportMode || pkg.transportMode.includes(filters.transportMode)
      
      return matchesSearch && matchesPrice && matchesAccommodation && matchesMealPlan && matchesTransport
    })

    // Sort packages
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-asc':
          return a.price - b.price
        case 'price-desc':
          return b.price - a.price
        case 'name':
          return a.packageName.localeCompare(b.packageName)
        default:
          return 0
      }
    })

    setFilteredPackages(filtered)
  }

  const clearFilters = () => {
    setSearchTerm('')
    setFilters({
      priceRange: [0, 100000],
      accommodationType: '',
      mealPlan: '',
      transportMode: ''
    })
    setSortBy('price-asc')
  }

  const getPackageIcon = (accommodationType: string) => {
    if (accommodationType.includes('Hotel')) return <Bed className="h-4 w-4" />
    if (accommodationType.includes('Cruise')) return <Plane className="h-4 w-4" />
    if (accommodationType.includes('Ryokan')) return <Bed className="h-4 w-4" />
    return <Bed className="h-4 w-4" />
  }

  const getMealPlanColor = (mealPlan: string) => {
    if (mealPlan.includes('All')) return 'bg-green-100 text-green-800'
    if (mealPlan.includes('Breakfast')) return 'bg-yellow-100 text-yellow-800'
    if (mealPlan.includes('Buffet')) return 'bg-blue-100 text-blue-800'
    return 'bg-gray-100 text-gray-800'
  }

  const getTransportIcon = (transportMode: string) => {
    if (transportMode.includes('Private')) return <Car className="h-4 w-4" />
    if (transportMode.includes('Public')) return <Users className="h-4 w-4" />
    if (transportMode.includes('Cruise')) return <Plane className="h-4 w-4" />
    return <Car className="h-4 w-4" />
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="mt-2 text-gray-600">Loading packages...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Tour Packages & Deals</h1>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Choose from our carefully curated tour packages designed to give you the perfect travel experience at every budget
        </p>
      </div>

      {/* Search and Filters */}
      <div className="mb-8 space-y-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search Bar */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search packages, accommodation, meals..."
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
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name">Package Name</option>
            </select>
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Accommodation</label>
            <select
              value={filters.accommodationType}
              onChange={(e) => setFilters({ ...filters, accommodationType: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-md text-sm"
            >
              <option value="">All Types</option>
              <option value="3-Star">3-Star Hotel</option>
              <option value="4-Star">4-Star Hotel</option>
              <option value="5-Star">5-Star Hotel</option>
              <option value="Luxury">Luxury</option>
              <option value="Cruise">Cruise Ship</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Meal Plan</label>
            <select
              value={filters.mealPlan}
              onChange={(e) => setFilters({ ...filters, mealPlan: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-md text-sm"
            >
              <option value="">All Plans</option>
              <option value="Breakfast">Breakfast Only</option>
              <option value="Half Board">Half Board</option>
              <option value="All Meals">All Meals</option>
              <option value="All Inclusive">All Inclusive</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Transport</label>
            <select
              value={filters.transportMode}
              onChange={(e) => setFilters({ ...filters, transportMode: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-md text-sm"
            >
              <option value="">All Types</option>
              <option value="Private">Private Transport</option>
              <option value="Public">Public Transport</option>
              <option value="Cruise">Cruise Ship</option>
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
          Showing {filteredPackages.length} package{filteredPackages.length !== 1 ? 's' : ''}
          {searchTerm && ` for "${searchTerm}"`}
        </p>
        {usingDemo && (
          <p className="text-xs mt-1 text-yellow-700 bg-yellow-50 inline-block px-2 py-1 rounded">
            Showing demo packages (backend data unavailable).
          </p>
        )}
      </div>

      {/* Packages Grid */}
      {filteredPackages.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <Search className="h-16 w-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-medium text-gray-900 mb-2">No packages found</h3>
          <p className="text-gray-600 mb-6">Try adjusting your search criteria or browse all packages</p>
          <Button onClick={clearFilters} variant="outline">
            Clear All Filters
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredPackages.map((pkg) => (
            <Card key={pkg.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-200">
              <CardHeader className="space-y-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-2">{pkg.packageName}</CardTitle>
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                      {getPackageIcon(pkg.accommodationType)}
                      <span>{pkg.accommodationType}</span>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm">
                      <Heart className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge className={getMealPlanColor(pkg.mealPlan)}>
                      <Utensils className="h-3 w-3 mr-1" />
                      {pkg.mealPlan}
                    </Badge>
                    <Badge variant="outline">
                      {getTransportIcon(pkg.transportMode)}
                      <span className="ml-1">{pkg.transportMode}</span>
                    </Badge>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Inclusions */}
                <div>
                  <h4 className="font-medium text-green-700 mb-2 flex items-center">
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Included
                  </h4>
                  <p className="text-sm text-gray-600">{pkg.inclusions}</p>
                </div>

                {/* Exclusions */}
                <div>
                  <h4 className="font-medium text-red-700 mb-2">Not Included</h4>
                  <p className="text-sm text-gray-600">{pkg.exclusions}</p>
                </div>

                {/* Price and Action */}
                <div className="pt-4 border-t">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <span className="text-2xl font-bold text-blue-600">₹{pkg.price.toLocaleString()}</span>
                      <span className="text-sm text-gray-500 ml-1">per person</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">4.5</span>
                      <span className="text-sm text-gray-500">(24)</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Button className="w-full" asChild>
                      <Link to={`/tour/${pkg.tourId}`}>
                        View Details
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Link>
                    </Button>
                    <Button variant="outline" className="w-full" asChild>
                      <Link
                        to={`/booking?tourId=${pkg.tourId}&packageId=${pkg.id}`}
                        state={{ package: pkg }}
                        onClick={() => {
                          try { sessionStorage.setItem('booking:pkg', JSON.stringify(pkg)) } catch {}
                        }}
                      >
                        Book Now
                      </Link>
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
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Can't find the perfect package?</h2>
        <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
          Let us create a custom package tailored to your preferences and budget. Our travel experts are here to help!
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg">
            Create Custom Package
          </Button>
          <Button variant="outline" size="lg">
            Contact Travel Expert
          </Button>
        </div>
      </div>
    </div>
  )
}
