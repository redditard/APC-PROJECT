import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/store/authStore'
import { 
  User, 
  LogOut, 
  MapPin, 
  Calendar,
  Settings
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function Navbar() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link 
            to="/" 
            className="flex items-center space-x-2 text-xl font-bold text-primary"
          >
            <MapPin className="h-6 w-6" />
            <span>TourismPro</span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            {/* Tours removed */}
            <Link 
              to="/packages" 
              className="text-gray-700 hover:text-primary transition-colors"
            >
              Packages
            </Link>
            <Link 
              to="/destinations" 
              className="text-gray-700 hover:text-primary transition-colors"
            >
              Destinations
            </Link>
            <Link 
              to="/about" 
              className="text-gray-700 hover:text-primary transition-colors"
            >
              About
            </Link>
            <Link 
              to="/contact" 
              className="text-gray-700 hover:text-primary transition-colors"
            >
              Contact
            </Link>
            {user && (
              <>
                <Link 
                  to="/dashboard" 
                  className="text-gray-700 hover:text-primary transition-colors"
                >
                  Dashboard
                </Link>
                <Link 
                  to="/bookings" 
                  className="text-gray-700 hover:text-primary transition-colors"
                >
                  My Bookings
                </Link>
                <Link 
                  to="/itinerary" 
                  className="text-gray-700 hover:text-primary transition-colors"
                >
                  Itinerary
                </Link>
              </>
            )}
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <User className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.username}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/profile')}>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/bookings')}>
                    <Calendar className="mr-2 h-4 w-4" />
                    <span>My Bookings</span>
                  </DropdownMenuItem>
                  {user.role === 'ADMIN' && (
                    <DropdownMenuItem onClick={() => navigate('/admin')}>
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Admin Panel</span>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="ghost" asChild>
                  <Link to="/login">Sign In</Link>
                </Button>
                <Button asChild>
                  <Link to="/register">Sign Up</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
