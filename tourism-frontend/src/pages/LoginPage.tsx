import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuthStore } from '@/store/authStore'
import { useToast } from '@/hooks/use-toast'
import api from '@/lib/api'
import { mockAuthService } from '@/services/mockAuth'
import { MapPin, Eye, EyeOff } from 'lucide-react'

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  
  const { login } = useAuthStore()
  const { toast } = useToast()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // First try the real backend
      let authResponse
      try {
        console.log('Attempting backend login with:', { username, password })
        const response = await api.post('/auth/login', {
          username,
          password
        })
        authResponse = response.data.data
        console.log('Backend login successful:', authResponse)
      } catch (backendError: any) {
        // If backend fails, use mock service
        console.log('Backend unavailable, using mock service')
        console.log('Backend error:', backendError.message || backendError)
        authResponse = await mockAuthService.login(username, password)
        console.log('Mock login successful:', authResponse)
      }

      login(authResponse.token, authResponse.user)
      
      toast({
        title: "Welcome back!",
        description: `Hello ${authResponse.user.firstName || authResponse.user.username}!`,
      })
      
      navigate('/dashboard')
    } catch (error: any) {
      console.error('Login error:', error)
      toast({
        title: "Login failed",
        description: error.message || "Invalid credentials. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleResetMockUsers = () => {
    mockAuthService.resetMockUsers()
    toast({
      title: "Mock users reset",
      description: "Default mock users have been recreated. Try logging in again.",
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center">
            <div className="flex items-center space-x-2 text-2xl font-bold text-blue-600">
              <MapPin className="h-8 w-8" />
              <span>TourismPro</span>
            </div>
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Welcome back
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Sign in to your account to continue your journey
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Sign In</CardTitle>
            <CardDescription>
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="mt-1"
                  placeholder="Enter your username"
                />
              </div>

              <div>
                <Label htmlFor="password">Password</Label>
                <div className="relative mt-1">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <Link 
              to="/register" 
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Sign up here
            </Link>
          </p>
        </div>

        <div className="mt-8 text-center">
          <p className="text-xs text-gray-500 mb-2">
            Demo credentials:
          </p>
          <div className="text-xs text-gray-600 space-y-1">
            <div>
              👑 Admin: <span className="font-mono bg-gray-100 px-1 rounded">admin</span> / 
              <span className="font-mono bg-gray-100 px-1 rounded">admin123</span>
            </div>
            <div>
              🧳 Tourist: <span className="font-mono bg-gray-100 px-1 rounded">tourist</span> / 
              <span className="font-mono bg-gray-100 px-1 rounded">password</span>
            </div>
            <div>
              🎯 Operator: <span className="font-mono bg-gray-100 px-1 rounded">operator</span> / 
              <span className="font-mono bg-gray-100 px-1 rounded">operator123</span>
            </div>
          </div>
          
          <div className="mt-4">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleResetMockUsers}
              className="text-xs"
            >
              🔄 Reset Mock Users
            </Button>
            <p className="text-xs text-gray-400 mt-1">
              Click if login still fails
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
