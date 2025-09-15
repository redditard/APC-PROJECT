import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import LandingPage from '@/pages/LandingPage'
import LoginPage from '@/pages/LoginPage'
import RegisterPage from '@/pages/RegisterPage'
import DashboardPage from '@/pages/DashboardPage'
import PackagesPage from '@/pages/PackagesPage'
import BookingPage from '@/pages/BookingPage'
import DestinationsPage from '@/pages/DestinationsPage'
import AboutPage from '@/pages/AboutPage'
import ContactPage from '@/pages/ContactPage'
import BookingsPage from '@/pages/BookingsPage'
import ItineraryPage from '@/pages/ItineraryPage'
import TourDetailsPage from '@/pages/TourDetailsPage'
import AdminDashboard from '@/pages/AdminDashboard'
import ProfilePage from '@/pages/ProfilePage'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

function App() {
  const { user } = useAuthStore()

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-16">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/dashboard" />} />
          <Route path="/register" element={!user ? <RegisterPage /> : <Navigate to="/dashboard" />} />
          <Route path="/tour/:id" element={<TourDetailsPage />} />
          <Route path="/packages" element={<PackagesPage />} />
          <Route path="/booking" element={<BookingPage />} />
          <Route path="/destinations" element={<DestinationsPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          
          {/* Protected Routes */}
          <Route path="/dashboard" element={user ? <DashboardPage /> : <Navigate to="/login" />} />
          <Route path="/bookings" element={user ? <BookingsPage /> : <Navigate to="/login" />} />
          <Route path="/itinerary" element={user ? <ItineraryPage /> : <Navigate to="/login" />} />
          <Route path="/profile" element={user ? <ProfilePage /> : <Navigate to="/login" />} />
          
          {/* Admin Routes */}
          <Route 
            path="/admin" 
            element={user?.role === 'ADMIN' ? <AdminDashboard /> : <Navigate to="/dashboard" />} 
          />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App
