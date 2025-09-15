# Tourism Management System - UI Development Prompt

## Project Context
I'm building a Tourism Management System with Spring Boot backend that includes:
- **Tour Management**: CRUD operations for tours and packages
- **Booking System**: Tourist bookings with availability checking
- **JWT Authentication**: Tourist/Admin roles
- **Microservices**: Itinerary service + Core tourism service
- **MongoDB**: Booking history tracking

## UI Requirements

### Design System
Create a modern, beautiful tourism website using **React + TypeScript + Tailwind CSS + shadcn/ui** with these design principles:

**Visual Style:**
- Modern travel/tourism aesthetic with stunning visuals
- Clean, minimalist design with plenty of white space
- Beautiful gradients and subtle animations
- Professional color scheme (blues, greens, warm accents)
- High-quality travel imagery placeholders
- Card-based layouts for tours and packages
- Responsive design (mobile-first)

**shadcn/ui Components to Use:**
- Button, Card, Badge, Dialog, Sheet, Tabs
- Form, Input, Select, Textarea, Checkbox
- Table, Pagination, Avatar, Separator
- Alert, Toast notifications, Loading spinners
- Calendar for date picking, DateRangePicker
- Command palette for search

### Core Pages & Features

#### 1. Public Pages (No Authentication Required)
```
🏠 Landing Page:
- Hero section with stunning travel imagery
- Featured tours carousel
- Search bar (destination, dates)
- Popular destinations grid
- Customer testimonials
- Footer with links

🔍 Tours Browse Page:
- Filter sidebar (destination, price, duration, rating)
- Tours grid with beautiful cards showing:
  * High-quality images
  * Tour name, destination, duration
  * Starting price, rating stars
  * "View Details" and "Book Now" buttons
- Pagination
- Sort options (price, rating, duration)

📋 Tour Details Page:
- Image gallery/carousel
- Tour information (description, itinerary, inclusions)
- Package options cards with pricing
- Availability calendar
- Customer reviews section
- Booking form (redirects to login if not authenticated)
```

#### 2. Authentication Pages
```
🔐 Login Page:
- Beautiful centered form with travel background
- Email/password fields
- "Remember me" checkbox
- Social login buttons (placeholder)
- "Don't have account? Register" link

📝 Register Page:
- Multi-step registration form
- Personal details → Account setup → Preferences
- Form validation with beautiful error states
- Progress indicator
```

#### 3. Tourist Dashboard (Protected)
```
🎯 Dashboard Home:
- Welcome message with user's name
- Quick stats cards (upcoming trips, total bookings)
- Recent bookings list
- Recommended tours based on history
- Quick actions (new booking, view profile)

📅 My Bookings:
- Bookings list with status badges
- Filter/search functionality
- Booking cards showing:
  * Tour image and name
  * Dates, status, amount paid
  * "View Details", "Cancel", "Download Voucher" actions
- Booking timeline modal (using MongoDB history data)

👤 Profile Management:
- Personal information form
- Booking preferences
- Password change
- Account settings
```

#### 4. Admin Dashboard (Protected - Admin Role)
```
📊 Admin Overview:
- Key metrics dashboard with charts
- Revenue analytics
- Popular tours/destinations
- Recent bookings table
- Quick actions panel

🏛️ Tour Management:
- Tours data table with search/filter
- Create/Edit tour modal forms
- Bulk actions (activate/deactivate)
- Tour analytics (bookings, revenue)

📦 Package Management:
- Packages data table linked to tours
- Version history for packages (Hibernate lifecycle)
- Clone package functionality
- Pricing management

📋 Booking Management:
- All bookings with advanced filters
- Booking status management
- Customer details view
- Export booking reports
- MongoDB history integration for detailed tracking

👥 User Management:
- Users table with role management
- User activity logs
- Account status controls
```

### Technical Implementation Requirements

#### State Management
```typescript
// Use React Context + useReducer for global state
interface AppState {
  user: User | null;
  tours: Tour[];
  bookings: Booking[];
  filters: FilterState;
  loading: boolean;
}

// API integration with React Query/TanStack Query
const useTours = () => useQuery(['tours'], fetchTours);
const useBookings = () => useQuery(['bookings'], fetchUserBookings);
```

#### API Integration
```typescript
// API service layer
class TourismAPIService {
  // Authentication
  static login(credentials: LoginRequest): Promise<JwtResponse>
  static register(userData: RegisterRequest): Promise<User>
  
  // Tours & Packages
  static getTours(filters?: TourFilters): Promise<Tour[]>
  static getTourById(id: number): Promise<TourDetails>
  static getPackagesByTour(tourId: number): Promise<Package[]>
  
  // Bookings
  static createBooking(booking: BookingRequest): Promise<BookingResponse>
  static getUserBookings(): Promise<Booking[]>
  static getBookingHistory(reference: string): Promise<BookingHistory>
  
  // Admin endpoints
  static createTour(tour: TourCreateRequest): Promise<Tour>
  static updatePackage(id: number, package: PackageUpdateRequest): Promise<Package>
}
```

#### Component Structure
```
src/
├── components/
│   ├── ui/ (shadcn/ui components)
│   ├── common/ (Header, Footer, Layout)
│   ├── tours/ (TourCard, TourDetails, TourFilters)
│   ├── bookings/ (BookingForm, BookingCard, BookingTimeline)
│   ├── admin/ (AdminSidebar, DataTable, AdminCharts)
│   └── auth/ (LoginForm, RegisterForm, ProtectedRoute)
├── pages/
├── hooks/ (custom hooks for API calls)
├── services/ (API layer)
├── types/ (TypeScript interfaces)
└── utils/ (helpers, formatters)
```

### Key Features to Implement

#### Beautiful UI Elements
```typescript
// Tour cards with hover effects
<Card className="group hover:shadow-xl transition-all duration-300">
  <div className="overflow-hidden rounded-t-lg">
    <img className="group-hover:scale-105 transition-transform" />
  </div>
  <CardContent>
    <Badge variant="secondary">{duration} days</Badge>
    <h3 className="font-semibold text-lg">{tourName}</h3>
    <div className="flex items-center gap-1">
      <StarIcon className="fill-yellow-400" />
      <span>{rating}</span>
    </div>
    <p className="text-2xl font-bold text-primary">₹{price}</p>
  </CardContent>
</Card>

// Booking timeline component
<div className="space-y-4">
  {timeline.map(event => (
    <div className="flex gap-4 items-center">
      <div className="w-3 h-3 bg-primary rounded-full" />
      <div>
        <p className="font-medium">{event.status}</p>
        <p className="text-sm text-muted-foreground">{event.timestamp}</p>
      </div>
    </div>
  ))}
</div>
```

#### Interactive Features
- **Search**: Instant search with debouncing
- **Filters**: Multi-select filters with clear indicators
- **Calendar**: Beautiful date range picker for bookings
- **Image Gallery**: Smooth image carousels for tours
- **Notifications**: Toast notifications for all actions
- **Loading States**: Skeleton loaders and spinners
- **Error Handling**: Beautiful error pages and inline errors

#### Mobile Responsiveness
- Mobile-first design approach
- Touch-friendly interfaces
- Responsive navigation (hamburger menu)
- Optimized forms for mobile
- Swipe gestures for image galleries

### Sample Request Prompts

**For Landing Page:**
```
Create a stunning landing page for a Tourism Management System using React + TypeScript + Tailwind + shadcn/ui. Include:
- Hero section with gradient background and travel imagery
- Featured tours carousel using embla-carousel
- Search form with destination autocomplete and date range picker
- Popular destinations grid with hover effects
- Modern typography and micro-animations
- Make it mobile-responsive and visually impressive
```

**For Tour Browse Page:**
```
Create a tours listing page with advanced filtering using React + shadcn/ui:
- Left sidebar with filters (destination, price range, duration, rating)
- Tours grid with beautiful cards showing images, pricing, ratings
- Search bar with instant results
- Sort dropdown (price, rating, popularity)
- Pagination component
- Loading skeletons
- Empty state when no tours found
- Make each tour card clickable and add hover animations
```

**For Admin Dashboard:**
```
Create a comprehensive admin dashboard using React + shadcn/ui:
- Sidebar navigation with icons (tours, packages, bookings, users)
- Dashboard overview with metric cards and charts (use recharts)
- Data tables with search, filter, and sort capabilities
- Modal forms for creating/editing tours and packages
- Action buttons with confirmation dialogs
- Success/error toast notifications
- Modern admin UI with proper spacing and typography
```

### Development Tips
1. **Start with**: "Create a [specific page] for Tourism Management System using React, TypeScript, Tailwind CSS, and shadcn/ui components"
2. **Request incrementally**: One page/component at a time
3. **Ask for responsive design**: Always mention mobile-first approach
4. **Include accessibility**: Request proper ARIA labels and keyboard navigation
5. **Request animations**: Ask for smooth transitions and micro-interactions
6. **API integration**: Request proper loading states and error handling

### Success Criteria
- ✅ Beautiful, modern tourism website design
- ✅ Fully responsive across all devices
- ✅ Smooth animations and transitions
- ✅ Proper authentication flow
- ✅ Role-based UI (Tourist vs Admin views)
- ✅ Complete booking flow with payment
- ✅ MongoDB booking history display
- ✅ Admin dashboard with analytics
- ✅ Error handling and loading states
- ✅ Accessible and user-friendly interface