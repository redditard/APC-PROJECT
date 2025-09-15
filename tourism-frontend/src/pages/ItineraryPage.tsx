import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
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
  Itinerary, 
  Activity, 
  ItineraryRequest,
  ItineraryGenerationRequest
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
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [showGenerateForm, setShowGenerateForm] = useState(false)
  const [editingItinerary, setEditingItinerary] = useState<Itinerary | null>(null)

  // Form states
  const [formData, setFormData] = useState<ItineraryRequest>({
    tourId: 0,
    dayNumber: 1,
    dayTitle: '',
    activities: [],
    meals: [],
    accommodation: '',
    transportDetails: '',
    notes: ''
  })

  const [generateRequest, setGenerateRequest] = useState<ItineraryGenerationRequest>({
    tourId: 0,
    destination: '',
    duration: 3,
    preferences: [],
    budget: 'MEDIUM',
    interests: [],
    accommodationType: 'HOTEL',
    groupSize: 2,
    specialRequests: ''
  })

  const [newActivity, setNewActivity] = useState<Activity>({
    time: '',
    title: '',
    description: '',
    duration: 60,
    location: '',
    activityType: 'SIGHTSEEING',
    cost: '',
    included: true
  })

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

  const handleCreateItinerary = async () => {
    if (!selectedTourId) return

    try {
      setLoading(true)
      const newItinerary = await itineraryService.createItinerary({
        ...formData,
        tourId: selectedTourId
      })
      
      setItineraries(prev => [...prev, newItinerary])
      setShowCreateForm(false)
      resetForm()
      
      toast({
        title: "Success",
        description: "Itinerary created successfully"
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to create itinerary",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateItinerary = async () => {
    if (!editingItinerary) return

    try {
      setLoading(true)
      const updatedItinerary = await itineraryService.updateItinerary(
        editingItinerary.id,
        formData
      )
      
      setItineraries(prev => 
        prev.map(it => it.id === editingItinerary.id ? updatedItinerary : it)
      )
      setEditingItinerary(null)
      setShowCreateForm(false)
      resetForm()
      
      toast({
        title: "Success", 
        description: "Itinerary updated successfully"
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to update itinerary",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

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

  const handleGenerateItinerary = async () => {
    if (!selectedTourId) return

    try {
      setLoading(true)
      const selectedTour = tours.find(t => t.id === selectedTourId)
      const generatedItineraries = await itineraryService.generateItinerary({
        ...generateRequest,
        tourId: selectedTourId,
        destination: selectedTour?.destination || generateRequest.destination
      })
      
      setItineraries(prev => [...prev, ...generatedItineraries])
      setShowGenerateForm(false)
      resetGenerateForm()
      
      toast({
        title: "Success",
        description: `Generated ${generatedItineraries.length} days of itinerary`
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to generate itinerary",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

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

  const addActivity = () => {
    if (!newActivity.title || !newActivity.time) {
      toast({
        title: "Error",
        description: "Please fill in activity title and time",
        variant: "destructive"
      })
      return
    }

    setFormData(prev => ({
      ...prev,
      activities: [...prev.activities, { ...newActivity }]
    }))

    setNewActivity({
      time: '',
      title: '',
      description: '',
      duration: 60,
      location: '',
      activityType: 'SIGHTSEEING',
      cost: '',
      included: true
    })
  }

  const removeActivity = (index: number) => {
    setFormData(prev => ({
      ...prev,
      activities: prev.activities.filter((_, i) => i !== index)
    }))
  }

  const startEditing = (itinerary: Itinerary) => {
    setEditingItinerary(itinerary)
    setFormData({
      tourId: itinerary.tourId,
      dayNumber: itinerary.dayNumber,
      dayTitle: itinerary.dayTitle,
      activities: itinerary.activities,
      meals: itinerary.meals,
      accommodation: itinerary.accommodation || '',
      transportDetails: itinerary.transportDetails || '',
      notes: itinerary.notes || ''
    })
    setShowCreateForm(true)
  }

  const resetForm = () => {
    setFormData({
      tourId: 0,
      dayNumber: 1,
      dayTitle: '',
      activities: [],
      meals: [],
      accommodation: '',
      transportDetails: '',
      notes: ''
    })
    setEditingItinerary(null)
  }

  const resetGenerateForm = () => {
    setGenerateRequest({
      tourId: 0,
      destination: '',
      duration: 3,
      preferences: [],
      budget: 'MEDIUM',
      interests: [],
      accommodationType: 'HOTEL',
      groupSize: 2,
      specialRequests: ''
    })
  }

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
                    onClick={() => setShowGenerateForm(true)}
                    variant="outline"
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    AI Generate
                  </Button>
                  <Button
                    onClick={() => setShowCreateForm(true)}
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
                    <Button onClick={() => setShowGenerateForm(true)}>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Generate with AI
                    </Button>
                    <Button onClick={() => setShowCreateForm(true)} variant="outline">
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
                                <Badge key={index} className={(mealColors as any)[meal] || 'bg-gray-100 text-gray-800'}>
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

      {/* Create/Edit Form Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">
              {editingItinerary ? 'Edit Itinerary' : 'Create New Itinerary'}
            </h2>
            
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="dayNumber">Day Number</Label>
                  <Input
                    id="dayNumber"
                    type="number"
                    min="1"
                    value={formData.dayNumber}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      dayNumber: parseInt(e.target.value) || 1
                    }))}
                  />
                </div>
                <div>
                  <Label htmlFor="dayTitle">Day Title</Label>
                  <Input
                    id="dayTitle"
                    value={formData.dayTitle}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      dayTitle: e.target.value
                    }))}
                    placeholder="e.g., Arrival in Paris"
                  />
                </div>
              </div>

              {/* Activities Section */}
              <div>
                <h3 className="text-lg font-medium mb-3">Activities</h3>
                
                {/* Add Activity Form */}
                <Card className="mb-4">
                  <CardHeader>
                    <CardTitle className="text-base">Add Activity</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="activityTime">Time</Label>
                        <Input
                          id="activityTime"
                          type="time"
                          value={newActivity.time}
                          onChange={(e) => setNewActivity(prev => ({
                            ...prev,
                            time: e.target.value
                          }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="activityTitle">Title</Label>
                        <Input
                          id="activityTitle"
                          value={newActivity.title}
                          onChange={(e) => setNewActivity(prev => ({
                            ...prev,
                            title: e.target.value
                          }))}
                          placeholder="Activity name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="activityDuration">Duration (minutes)</Label>
                        <Input
                          id="activityDuration"
                          type="number"
                          min="15"
                          value={newActivity.duration}
                          onChange={(e) => setNewActivity(prev => ({
                            ...prev,
                            duration: parseInt(e.target.value) || 60
                          }))}
                        />
                      </div>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="activityLocation">Location</Label>
                        <Input
                          id="activityLocation"
                          value={newActivity.location}
                          onChange={(e) => setNewActivity(prev => ({
                            ...prev,
                            location: e.target.value
                          }))}
                          placeholder="Activity location"
                        />
                      </div>
                      <div>
                        <Label htmlFor="activityType">Type</Label>
                        <select
                          id="activityType"
                          value={newActivity.activityType}
                          onChange={() => {/* TODO: wire activity type change */}}
                          className="w-full p-2 border border-gray-300 rounded-md"
                        >
                          <option value="SIGHTSEEING">Sightseeing</option>
                          <option value="ADVENTURE">Adventure</option>
                          <option value="CULTURAL">Cultural</option>
                          <option value="LEISURE">Leisure</option>
                        </select>
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="activityDescription">Description</Label>
                      <Textarea
                        id="activityDescription"
                        value={newActivity.description}
                        onChange={(e) => setNewActivity(prev => ({
                          ...prev,
                          description: e.target.value
                        }))}
                        placeholder="Activity description"
                        rows={2}
                      />
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div>
                        <Label htmlFor="activityCost">Cost</Label>
                        <Input
                          id="activityCost"
                          value={newActivity.cost}
                          onChange={(e) => setNewActivity(prev => ({
                            ...prev,
                            cost: e.target.value
                          }))}
                          placeholder="e.g., $25 per person"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="activityIncluded"
                          checked={newActivity.included}
                          onChange={(e) => setNewActivity(prev => ({
                            ...prev,
                            included: e.target.checked
                          }))}
                        />
                        <Label htmlFor="activityIncluded">Included in package</Label>
                      </div>
                      <Button
                        type="button"
                        onClick={addActivity}
                        className="ml-auto"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Activity
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Activities List */}
                {formData.activities.length > 0 && (
                  <div className="space-y-2">
                    {formData.activities.map((activity, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded">
                        <div>
                          <span className="font-medium">{activity.time} - {activity.title}</span>
                          {activity.location && (
                            <span className="text-gray-600 ml-2">at {activity.location}</span>
                          )}
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => removeActivity(index)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Other Details */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="meals">Meals (comma separated)</Label>
                  <Input
                    id="meals"
                    value={formData.meals.join(', ')}
                    onChange={() => {/* TODO: wire meals change */}}
                    placeholder="BREAKFAST, LUNCH, DINNER"
                  />
                </div>
                <div>
                  <Label htmlFor="accommodation">Accommodation</Label>
                  <Input
                    id="accommodation"
                    value={formData.accommodation}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      accommodation: e.target.value
                    }))}
                    placeholder="Hotel name or type"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="transportDetails">Transport Details</Label>
                <Input
                  id="transportDetails"
                  value={formData.transportDetails}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    transportDetails: e.target.value
                  }))}
                  placeholder="Transportation arrangements"
                />
              </div>

              <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    notes: e.target.value
                  }))}
                  placeholder="Additional notes for this day"
                  rows={3}
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <Button
                variant="outline"
                onClick={() => {
                  setShowCreateForm(false)
                  resetForm()
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={editingItinerary ? handleUpdateItinerary : handleCreateItinerary}
                disabled={loading}
              >
                {loading ? 'Saving...' : (editingItinerary ? 'Update' : 'Create')}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* AI Generate Form Modal */}
      {showGenerateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <h2 className="text-2xl font-bold mb-4">Generate AI Itinerary</h2>
            
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="generateDuration">Duration (days)</Label>
                  <Input
                    id="generateDuration"
                    type="number"
                    min="1"
                    max="30"
                    value={generateRequest.duration}
                    onChange={(e) => setGenerateRequest(prev => ({
                      ...prev,
                      duration: parseInt(e.target.value) || 3
                    }))}
                  />
                </div>
                <div>
                  <Label htmlFor="generateGroupSize">Group Size</Label>
                  <Input
                    id="generateGroupSize"
                    type="number"
                    min="1"
                    value={generateRequest.groupSize}
                    onChange={(e) => setGenerateRequest(prev => ({
                      ...prev,
                      groupSize: parseInt(e.target.value) || 2
                    }))}
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="generateBudget">Budget</Label>
                  <select
                    id="generateBudget"
                    value={generateRequest.budget}
                    onChange={() => {/* TODO: wire budget change */}}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="LOW">Budget</option>
                    <option value="MEDIUM">Mid-range</option>
                    <option value="HIGH">Luxury</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="generateAccommodation">Accommodation Type</Label>
                  <select
                    id="generateAccommodation"
                    value={generateRequest.accommodationType}
                    onChange={(e) => setGenerateRequest(prev => ({
                      ...prev,
                      accommodationType: e.target.value
                    }))}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="HOTEL">Hotel</option>
                    <option value="RESORT">Resort</option>
                    <option value="HOSTEL">Hostel</option>
                    <option value="APARTMENT">Apartment</option>
                    <option value="GUESTHOUSE">Guesthouse</option>
                  </select>
                </div>
              </div>

              <div>
                <Label htmlFor="generateInterests">Interests (comma separated)</Label>
                <Input
                  id="generateInterests"
                  value={generateRequest.interests?.join(', ') || ''}
                  onChange={(e) => setGenerateRequest(prev => ({
                    ...prev,
                    interests: e.target.value.split(',').map(i => i.trim()).filter(Boolean)
                  }))}
                  placeholder="Culture, Adventure, Food, Shopping, Nature, History"
                />
              </div>

              <div>
                <Label htmlFor="generateSpecialRequests">Special Requests</Label>
                <Textarea
                  id="generateSpecialRequests"
                  value={generateRequest.specialRequests}
                  onChange={(e) => setGenerateRequest(prev => ({
                    ...prev,
                    specialRequests: e.target.value
                  }))}
                  placeholder="Any specific requirements or preferences"
                  rows={3}
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <Button
                variant="outline"
                onClick={() => {
                  setShowGenerateForm(false)
                  resetGenerateForm()
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleGenerateItinerary}
                disabled={loading}
              >
                {loading ? 'Generating...' : 'Generate Itinerary'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
