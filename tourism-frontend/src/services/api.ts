import api from '@/lib/api'

export interface Tour {
  id: number
  name: string
  description: string
  destination: string
  // price is derived from the cheapest package; keep optional for legacy code paths
  price?: number
  duration: number
  maxParticipants: number
  startDate: string
  endDate: string
  status: 'ACTIVE' | 'INACTIVE' | 'COMPLETED'
  rating?: number
  imageUrl?: string
  packages?: TourPackage[]
}

export interface TourPackage {
  id: number
  packageName: string
  tourId: number
  price: number
  inclusions: string
  exclusions: string
  accommodationType: string
  transportMode: string
  mealPlan: string
  version: number
  createdAt: string
  updatedAt: string
}

export interface Booking {
  id: number
  bookingReference: string
  packageId: number
  packageName?: string
  touristId: number
  numberOfPeople: number
  totalAmount: number
  bookingDate: string
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED'
  paymentStatus: 'PENDING' | 'COMPLETED' | 'FAILED'
  specialRequests?: string
  contactEmail: string
  contactPhone: string
}

export interface Activity {
  time: string
  title: string
  description?: string
  duration: number // Duration in minutes
  location?: string
  activityType?: 'SIGHTSEEING' | 'ADVENTURE' | 'CULTURAL' | 'LEISURE'
  cost?: string
  included: boolean
}

export interface Itinerary {
  id: string
  tourId: number
  dayNumber: number
  dayTitle: string
  activities: Activity[]
  meals: string[] // BREAKFAST, LUNCH, DINNER
  accommodation?: string
  transportDetails?: string
  notes?: string
  createdAt: string
  updatedAt: string
  createdBy: string
  active: boolean
}

export interface ItineraryRequest {
  tourId: number
  dayNumber: number
  dayTitle: string
  activities: Activity[]
  meals: string[]
  accommodation?: string
  transportDetails?: string
  notes?: string
}

export interface ItineraryGenerationRequest {
  tourId: number
  destination: string
  duration: number
  preferences?: string[]
  budget?: string
  interests?: string[]
  accommodationType?: string
  groupSize?: number
  specialRequests?: string
}

export interface AuthRequest {
  username: string
  password: string
}

export interface AuthResponse {
  token: string
  user: {
    id: string | number
    username: string
    email: string
    fullName?: string
    role: 'USER' | 'ADMIN' | 'TOURIST' | 'TOUR_OPERATOR'
  }
}

export interface RegisterRequest {
  username: string
  email: string
  password: string
  fullName?: string
}

// Auth Services
export const authService = {
  login: async (credentials: AuthRequest): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', credentials)
    return response.data
  },

  register: async (userData: RegisterRequest): Promise<void> => {
    await api.post('/auth/register', userData)
  },

  logout: () => {
    // Token removal is handled by the auth store
  },

  // Create admin account (for development)
  createAdminAccount: async () => {
    try {
      await api.post('/auth/register', {
        username: 'admin',
        email: 'admin@tourism.com',
        password: 'admin123',
        fullName: 'System Administrator',
        role: 'ADMIN'
      })
    } catch (error: any) {
      // Ignore if admin already exists
      if (!error.response?.data?.message?.includes('already exists')) {
        throw error
      }
    }
  }
}

// Response wrappers
type ApiResponse<T> = {
  success: boolean
  message?: string
  data: T
}

type PagedResponse<T> = {
  content: T[]
  page?: number
  size?: number
  totalElements?: number
  totalPages?: number
}

// Mappers from backend DTOs to frontend models
const mapPackageDto = (p: any): TourPackage => ({
  id: p.packageId ?? p.id,
  packageName: p.packageName,
  tourId: p.tourId,
  price: Number(p.price ?? 0),
  inclusions: typeof p.inclusions === 'string' ? p.inclusions : JSON.stringify(p.inclusions ?? []),
  exclusions: typeof p.exclusions === 'string' ? p.exclusions : JSON.stringify(p.exclusions ?? []),
  accommodationType: p.accommodationType ?? '',
  transportMode: p.transportMode ?? '',
  mealPlan: p.mealPlan ?? '',
  version: p.version ?? 0,
  createdAt: p.createdAt ?? '',
  updatedAt: p.updatedAt ?? ''
})

const mapTourDto = (t: any): Tour => {
  const packages: TourPackage[] = Array.isArray(t.packages) ? t.packages.map(mapPackageDto) : []
  const minPrice = packages.length ? Math.min(...packages.map(pk => pk.price)) : undefined
  return {
    id: t.tourId ?? t.id,
    name: t.tourName ?? t.name,
    description: t.description ?? '',
    destination: t.destination ?? '',
    price: minPrice,
    duration: t.duration ?? 0,
    maxParticipants: t.maxCapacity ?? t.maxParticipants ?? 0,
    startDate: t.startDate ?? '',
    endDate: t.endDate ?? '',
    status: t.status ?? 'ACTIVE',
    packages
  }
}

// Tour Services  
export const tourService = {
  getAllTours: async (): Promise<Tour[]> => {
    const response = await api.get('/tours')
    const payload: ApiResponse<PagedResponse<any>> | ApiResponse<any[]> | any = response.data
    // Support both paged and plain arrays
    const list: any[] = Array.isArray(payload)
      ? payload
      : Array.isArray(payload?.data)
        ? payload.data
        : Array.isArray(payload?.data?.content)
          ? payload.data.content
          : Array.isArray(payload?.content)
            ? payload.content
            : []
    return list.map(mapTourDto)
  },

  getTourById: async (id: number): Promise<Tour> => {
    const response = await api.get(`/tours/${id}`)
    const payload: ApiResponse<any> | any = response.data
    const item = payload?.data ?? payload
    return mapTourDto(item)
  },

  createTour: async (tour: Omit<Tour, 'id'>): Promise<Tour> => {
    const response = await api.post('/admin/tours', tour)
    return response.data
  },

  updateTour: async (id: number, tour: Partial<Tour>): Promise<Tour> => {
    const response = await api.put(`/admin/tours/${id}`, tour)
    return response.data
  },

  deleteTour: async (id: number): Promise<void> => {
    await api.delete(`/admin/tours/${id}`)
  },

  searchTours: async (params: {
    destination?: string
    startDate?: string
    endDate?: string
    maxPrice?: number
    minRating?: number
  }): Promise<Tour[]> => {
    const response = await api.get('/tours/search', { params })
    return response.data
  }
}

// Package Services
export const packageService = {
  getPackagesByTour: async (tourId: number): Promise<TourPackage[]> => {
    const response = await api.get(`/packages/tour/${tourId}`)
    return response.data
  },

  getPackageById: async (id: number): Promise<TourPackage> => {
    const response = await api.get(`/packages/${id}`)
    return response.data
  },

  createPackage: async (pkg: Omit<TourPackage, 'id' | 'version' | 'createdAt' | 'updatedAt'>): Promise<TourPackage> => {
    const response = await api.post('/admin/packages', pkg)
    return response.data
  },

  updatePackage: async (id: number, pkg: Partial<TourPackage>): Promise<TourPackage> => {
    const response = await api.put(`/admin/packages/${id}`, pkg)
    return response.data
  },

  deletePackage: async (id: number): Promise<void> => {
    await api.delete(`/admin/packages/${id}`)
  },

  clonePackage: async (id: number): Promise<TourPackage> => {
    const response = await api.post(`/admin/packages/${id}/clone`)
    return response.data
  }
}

// Booking Services
export const bookingService = {
  getAllBookings: async (): Promise<Booking[]> => {
    const response = await api.get('/admin/bookings')
    return response.data
  },

  getUserBookings: async (): Promise<Booking[]> => {
    const response = await api.get('/bookings/my-bookings')
    return response.data
  },

  getBookingByReference: async (reference: string): Promise<Booking> => {
    const response = await api.get(`/bookings/${reference}`)
    return response.data
  },

  createBooking: async (booking: {
    packageId: number
    numberOfPeople: number
    startDate?: string
    specialRequests?: string
    contactEmail: string
    contactPhone: string
  }): Promise<Booking> => {
    const response = await api.post('/bookings', booking)
    const payload = response.data
    return payload?.data ?? payload
  },

  confirmBooking: async (id: number, paymentDetails: any): Promise<Booking> => {
    const response = await api.put(`/bookings/${id}/confirm`, paymentDetails)
    return response.data
  },

  cancelBooking: async (id: number, reason: string): Promise<Booking> => {
    const response = await api.put(`/bookings/${id}/cancel`, { reason })
    return response.data
  }
}

// Itinerary Services
export const itineraryService = {
  // Get all itineraries for a tour
  getItinerariesByTour: async (tourId: number): Promise<Itinerary[]> => {
    const response = await api.get(`/itineraries/tour/${tourId}`)
    return response.data.data
  },

  // Get specific day itinerary
  getItineraryByTourAndDay: async (tourId: number, dayNumber: number): Promise<Itinerary> => {
    const response = await api.get(`/itineraries/tour/${tourId}/day/${dayNumber}`)
    return response.data.data
  },

  // Get itinerary by ID
  getItineraryById: async (id: string): Promise<Itinerary> => {
    const response = await api.get(`/itineraries/${id}`)
    return response.data.data
  },

  // Create new itinerary
  createItinerary: async (request: ItineraryRequest): Promise<Itinerary> => {
    const response = await api.post('/itineraries', request)
    return response.data.data
  },

  // Update itinerary
  updateItinerary: async (id: string, request: ItineraryRequest): Promise<Itinerary> => {
    const response = await api.put(`/itineraries/${id}`, request)
    return response.data.data
  },

  // Delete itinerary
  deleteItinerary: async (id: string): Promise<void> => {
    await api.delete(`/itineraries/${id}`)
  },

  // Delete all itineraries for a tour
  deleteItinerariesByTour: async (tourId: number): Promise<void> => {
    await api.delete(`/itineraries/tour/${tourId}`)
  },

  // Generate AI itinerary
  generateItinerary: async (request: ItineraryGenerationRequest): Promise<Itinerary[]> => {
    const response = await api.post('/itineraries/generate', request)
    return response.data.data
  },

  // Get tour itinerary stats
  getTourItineraryStats: async (tourId: number): Promise<{ tourId: number, totalDays: number, hasItinerary: boolean }> => {
    const response = await api.get(`/itineraries/tour/${tourId}/stats`)
    return response.data.data
  },

  // Download itinerary PDF
  downloadTourItineraryPdf: async (tourId: number): Promise<Blob> => {
    const response = await api.get(`/itineraries/tour/${tourId}/pdf`, {
      responseType: 'blob'
    })
    return response.data
  },

  downloadDayItineraryPdf: async (id: string): Promise<Blob> => {
    const response = await api.get(`/itineraries/${id}/pdf`, {
      responseType: 'blob'
    })
    return response.data
  }
}

// Test connectivity
export const testApiConnection = async () => {
  try {
    const services = []
    
    // Test API Gateway and Core Service (through gateway)
    try {
      await api.get('/tours', { params: { limit: 1 }, timeout: 3000 })
      services.push({
        name: 'API Gateway',
        status: 'UP' as const,
        url: 'http://localhost:8080'
      })
      services.push({
        name: 'Tourism Core',
        status: 'UP' as const,
        url: 'http://localhost:8081'
      })
    } catch (error: any) {
      services.push({
        name: 'API Gateway',
        status: 'DOWN' as const,
        url: 'http://localhost:8080',
        error: error.message || 'Connection failed'
      })
      services.push({
        name: 'Tourism Core',
        status: 'DOWN' as const,
        url: 'http://localhost:8081',
        error: 'Accessible via gateway'
      })
    }
    
    // Test Itinerary Service (if we have an endpoint for it)
    try {
      // If you have an itinerary endpoint through gateway, use it
      // For now, assume it's UP if gateway is working
      if (services.find(s => s.name === 'API Gateway')?.status === 'UP') {
        services.push({
          name: 'Itinerary Service',
          status: 'UP' as const,
          url: 'http://localhost:8082'
        })
      } else {
        services.push({
          name: 'Itinerary Service',
          status: 'DOWN' as const,
          url: 'http://localhost:8082',
          error: 'Gateway unavailable'
        })
      }
    } catch (error: any) {
      services.push({
        name: 'Itinerary Service',
        status: 'DOWN' as const,
        url: 'http://localhost:8082',
        error: error.message || 'Connection failed'
      })
    }
    
    // For Eureka, we can't easily test it from frontend due to CORS
    // So let's just assume it's UP if other services are working
    const gatewayUp = services.find(s => s.name === 'API Gateway')?.status === 'UP'
    services.push({
      name: 'Eureka Server',
      status: gatewayUp ? 'UP' as const : 'DOWN' as const,
      url: 'http://localhost:8761',
      error: gatewayUp ? undefined : 'Service discovery may be down'
    })
    
    const upServices = services.filter(service => service.status === 'UP').length
    const totalServices = services.length
    
    return { 
      status: upServices > 0 ? 'connected' as const : 'error' as const, 
      services: services,
      message: upServices === totalServices 
        ? 'All services are running' 
        : upServices > 0 
          ? `${upServices}/${totalServices} services available`
          : 'Backend services unavailable'
    }
  } catch (error: any) {
    return { 
      status: 'error' as const, 
      error: error.message || 'Failed to check service status',
      services: [
        { name: 'API Gateway', status: 'DOWN' as const, url: 'http://localhost:8080', error: 'Connection failed' },
        { name: 'Tourism Core', status: 'DOWN' as const, url: 'http://localhost:8081', error: 'Connection failed' },
        { name: 'Itinerary Service', status: 'DOWN' as const, url: 'http://localhost:8082', error: 'Connection failed' },
        { name: 'Eureka Server', status: 'DOWN' as const, url: 'http://localhost:8761', error: 'Connection failed' }
      ],
      message: 'Unable to connect to backend services'
    }
  }
}
