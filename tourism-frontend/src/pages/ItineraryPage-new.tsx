import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
// import { Textarea } from '@/components/ui/textarea'
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Download, 
  Plus, 
  Edit, 
  Trash2, 
  Search,
  Utensils,
  Bed,
  Car,
  Eye,
  AlertCircle,
  Sparkles
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { 
  itineraryService, 
  tourService, 
  Tour, 
  Itinerary
} from '@/services/api'
import { useAuthStore } from '@/store/authStore'

// Activity type colors for badges
const activityTypeColors: Record<string, string> = {
  'SIGHTSEEING': 'bg-blue-100 text-blue-800',
  'ADVENTURE': 'bg-red-100 text-red-800',
  'CULTURAL': 'bg-purple-100 text-purple-800',
  'LEISURE': 'bg-green-100 text-green-800'
}

// Meal type colors
const mealColors: Record<string, string> = {
  'BREAKFAST': 'bg-yellow-100 text-yellow-800',
  'LUNCH': 'bg-orange-100 text-orange-800',
  'DINNER': 'bg-red-100 text-red-800'
}

export default function ItineraryPage() {
  const { user } = useAuthStore()
  const { toast } = useToast()
  const navigate = useNavigate()

  const [tours, setTours] = useState<Tour[]>([])
  const [selectedTourId, setSelectedTourId] = useState<number | null>(null)
  const [itineraries, setItineraries] = useState<Itinerary[]>([])
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  // Removed create/generate form state while those UIs are unimplemented

  useEffect(() => {
    loadTours()
  }, [])

  useEffect(() => {
    if (selectedTourId) {
      loadItineraries(selectedTourId)
    }
  }, [selectedTourId])

  const loadTours = async () => {
    try {
      const toursData = await tourService.getAllTours()
      setTours(toursData)
      if (toursData.length > 0 && !selectedTourId) {
        setSelectedTourId(toursData[0].id)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load tours",
        variant: "destructive"
      })
    }
  }

  const loadItineraries = async (tourId: number) => {
    try {
      setLoading(true)
      const itinerariesData = await itineraryService.getItinerariesByTour(tourId)
      setItineraries(itinerariesData)
    } catch (error) {
      toast({
        title: "Error", 
        description: "Failed to load itineraries",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  // Create/Update handlers removed until create/edit UI is implemented

  const handleDeleteItinerary = async (id: string) => {
    if (!confirm('Are you sure you want to delete this itinerary?')) return

    try {
      setLoading(true)
      await itineraryService.deleteItinerary(id)
      setItineraries(prev => prev.filter(it => it.id !== id))
      
      toast({
        title: "Success",
        description: "Itinerary deleted successfully"
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to delete itinerary",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  // AI generate handler removed until generation UI is implemented

  const handleDownloadPdf = async () => {
    if (!selectedTourId) return

    try {
      const blob = await itineraryService.downloadTourItineraryPdf(selectedTourId)
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `tour-${selectedTourId}-itinerary.pdf`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
      
      toast({
        title: "Success",
        description: "Itinerary PDF downloaded"
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to download PDF",
        variant: "destructive"
      })
    }
  }

  // Activity add/remove handlers removed until edit UI is implemented

  const startEditing = (itinerary: Itinerary) => {
    // Placeholder until edit UI exists
    toast({
      title: 'Edit not implemented',
      description: `Editing for Day ${itinerary.dayNumber} is not available yet.`
    })
  }

  // reset helpers removed with form state

  const filteredItineraries = itineraries.filter(itinerary =>
    itinerary.dayTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
    itinerary.activities.some(activity =>
      activity.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
  )

  const canManageItineraries = user?.role === 'ADMIN' || user?.role === 'TOUR_OPERATOR'

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Tour Itineraries</h1>
        <p className="text-gray-600">View and manage detailed day-by-day tour itineraries</p>
      </div>

      {/* Tour Selection */}
      <div className="mb-6">
        <Label htmlFor="tour-select">Select Tour</Label>
        <div className="flex gap-4 mt-2">
          <select
            id="tour-select"
            value={selectedTourId || ''}
            onChange={(e) => setSelectedTourId(Number(e.target.value))}
            className="flex-1 p-2 border border-gray-300 rounded-md"
          >
            <option value="">Select a tour...</option>
            {tours.map(tour => (
              <option key={tour.id} value={tour.id}>
                {tour.name} - {tour.destination}
              </option>
            ))}
          </select>
          
          {selectedTourId && (
            <Button 
              onClick={() => navigate(`/tour/${selectedTourId}`)}
              variant="outline"
            >
              <Eye className="w-4 h-4 mr-2" />
              View Tour
            </Button>
          )}
        </div>
      </div>

      {selectedTourId && (
        <>
          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-gray-500" />
              <Input
                placeholder="Search itineraries..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64"
              />
            </div>
            
            <div className="flex gap-2 ml-auto">
              {canManageItineraries && (
                <>
                  <Button
                    onClick={() =>
                      toast({
                        title: 'Coming soon',
                        description: 'AI itinerary generation UI is not implemented yet.'
                      })
                    }
                    variant="outline"
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    AI Generate
                  </Button>
                  <Button
                    onClick={() =>
                      toast({
                        title: 'Coming soon',
                        description: 'Manual day creation UI is not implemented yet.'
                      })
                    }
                    variant="outline"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Day
                  </Button>
                </>
              )}
              
              {itineraries.length > 0 && (
                <Button
                  onClick={handleDownloadPdf}
                  variant="outline"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download PDF
                </Button>
              )}
            </div>
          </div>

          {/* Itineraries List */}
          {loading && (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <p className="mt-2 text-gray-600">Loading itineraries...</p>
            </div>
          )}

          {!loading && filteredItineraries.length === 0 && (
            <Card className="text-center py-12">
              <CardContent>
                <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Itineraries Found</h3>
                <p className="text-gray-600 mb-4">
                  {itineraries.length === 0 
                    ? "No itineraries have been created for this tour yet."
                    : "No itineraries match your search criteria."
                  }
                </p>
                {canManageItineraries && itineraries.length === 0 && (
                  <div className="flex gap-2 justify-center">
                    <Button onClick={() =>
                      toast({
                        title: 'Coming soon',
                        description: 'AI itinerary generation UI is not implemented yet.'
                      })
                    }>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Generate with AI
                    </Button>
                    <Button onClick={() =>
                      toast({
                        title: 'Coming soon',
                        description: 'Manual day creation UI is not implemented yet.'
                      })
                    } variant="outline">
                      <Plus className="w-4 h-4 mr-2" />
                      Create Manually
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {!loading && filteredItineraries.length > 0 && (
            <div className="space-y-6">
              {filteredItineraries
                .sort((a, b) => a.dayNumber - b.dayNumber)
                .map((itinerary) => (
                  <Card key={itinerary.id} className="overflow-hidden">
                    <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="flex items-center gap-2">
                            <Badge variant="outline">Day {itinerary.dayNumber}</Badge>
                            {itinerary.dayTitle}
                          </CardTitle>
                          <CardDescription className="mt-1">
                            {itinerary.activities.length} activities planned
                          </CardDescription>
                        </div>
                        
                        {canManageItineraries && (
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => startEditing(itinerary)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDeleteItinerary(itinerary.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </CardHeader>

                    <CardContent className="p-6">
                      {/* Activities */}
                      {itinerary.activities.length > 0 && (
                        <div className="mb-6">
                          <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            Activities
                          </h4>
                          <div className="space-y-3">
                            {itinerary.activities.map((activity, index) => (
                              <div key={index} className="border rounded-lg p-4 bg-gray-50">
                                <div className="flex justify-between items-start mb-2">
                                  <div className="flex items-center gap-3">
                                    <Badge variant="outline">{activity.time}</Badge>
                                    <h5 className="font-medium">{activity.title}</h5>
                                    {activity.activityType && (
                                      <Badge className={activityTypeColors[activity.activityType] || 'bg-gray-100 text-gray-800'}>
                                        {activity.activityType}
                                      </Badge>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <Clock className="w-4 h-4" />
                                    {activity.duration}min
                                  </div>
                                </div>
                                
                                {activity.description && (
                                  <p className="text-gray-600 mb-2">{activity.description}</p>
                                )}
                                
                                <div className="flex items-center gap-4 text-sm text-gray-600">
                                  {activity.location && (
                                    <div className="flex items-center gap-1">
                                      <MapPin className="w-4 h-4" />
                                      {activity.location}
                                    </div>
                                  )}
                                  {activity.cost && (
                                    <div>Cost: {activity.cost}</div>
                                  )}
                                  <Badge variant={activity.included ? "default" : "secondary"}>
                                    {activity.included ? "Included" : "Optional"}
                                  </Badge>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Additional Information */}
                      <div className="grid md:grid-cols-3 gap-6">
                        {itinerary.meals.length > 0 && (
                          <div>
                            <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                              <Utensils className="w-4 h-4" />
                              Meals
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {itinerary.meals.map((meal, index) => (
                                <Badge key={index} className={mealColors[meal] || 'bg-gray-100 text-gray-800'}>
                                  {meal}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        {itinerary.accommodation && (
                          <div>
                            <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                              <Bed className="w-4 h-4" />
                              Accommodation
                            </h4>
                            <p className="text-gray-600">{itinerary.accommodation}</p>
                          </div>
                        )}

                        {itinerary.transportDetails && (
                          <div>
                            <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                              <Car className="w-4 h-4" />
                              Transport
                            </h4>
                            <p className="text-gray-600">{itinerary.transportDetails}</p>
                          </div>
                        )}
                      </div>

                      {itinerary.notes && (
                        <div className="mt-6 pt-6 border-t">
                          <h4 className="font-medium text-gray-900 mb-2">Notes</h4>
                          <p className="text-gray-600">{itinerary.notes}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}
