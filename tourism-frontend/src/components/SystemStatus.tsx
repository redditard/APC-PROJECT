import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
// import { Badge } from '@/components/ui/badge'
import { healthService } from '@/services/healthService'
import { CheckCircle, XCircle, Loader2, RefreshCw, AlertCircle } from 'lucide-react'

// Simple badge component as fallback
const Badge = ({ children, variant = 'default' }: { children: React.ReactNode, variant?: 'default' | 'destructive' | 'secondary' | 'outline' }) => {
  const baseClasses = "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold"
  const variantClasses = {
    default: "bg-blue-100 text-blue-800",
    destructive: "bg-red-100 text-red-800",
    secondary: "bg-gray-100 text-gray-800",
    outline: "border border-gray-300 text-gray-800"
  }
  return (
    <span className={`${baseClasses} ${variantClasses[variant]}`}>
      {children}
    </span>
  )
}

interface ServiceStatus {
  name: string
  status: 'UP' | 'DOWN'
  url: string
  error?: string
}

interface ConnectionResult {
  status: 'connected' | 'error'
  services: ServiceStatus[]
  message: string
  error?: string
}

export default function SystemStatus() {
  const [status, setStatus] = useState<'loading' | 'connected' | 'error'>('loading')
  const [lastChecked, setLastChecked] = useState<Date | null>(null)
  const [connectionResult, setConnectionResult] = useState<ConnectionResult | null>(null)

  const checkConnection = async () => {
    setStatus('loading')
    setConnectionResult(null)
    
    try {
      const healthResult = await healthService.getSystemHealth()
      
      // Convert health service format to our component format
      const result: ConnectionResult = {
        status: healthResult.status === 'UP' ? 'connected' : 'error',
        services: healthResult.services.map(service => ({
          name: service.service,
          status: service.status,
          url: service.service === 'API Gateway' ? 'http://localhost:8080' :
               service.service === 'Tourism Core' ? 'http://localhost:8081' :
               service.service === 'Eureka Server' ? 'http://localhost:8761' :
               service.service === 'Itinerary Service' ? 'http://localhost:8082' : '',
          error: service.status === 'DOWN' ? service.details : undefined
        })),
        message: healthResult.status === 'UP' ? 'All services operational' : 'Some services are unavailable'
      }
      
      setConnectionResult(result)
      
      // Determine status based on API availability rather than all services
      // If we can hit the API gateway/core service, the app is functional
      const criticalServices = result.services.filter(s => 
        s.name === 'API Gateway' || s.name === 'Tourism Core'
      )
      const criticalServicesUp = criticalServices.filter(s => s.status === 'UP').length
      
      if (criticalServicesUp > 0) {
        setStatus('connected')
      } else {
        setStatus('error')
      }
    } catch (err: any) {
      setStatus('error')
      setConnectionResult({
        status: 'error',
        services: [
          { name: 'API Gateway', status: 'DOWN', url: 'http://localhost:8080' },
          { name: 'Tourism Core', status: 'DOWN', url: 'http://localhost:8081' },
          { name: 'Itinerary Service', status: 'DOWN', url: 'http://localhost:8082' },
          { name: 'Eureka Server', status: 'DOWN', url: 'http://localhost:8761' }
        ],
        message: err.message || 'Failed to connect to backend services',
        error: err.message
      })
    } finally {
      setLastChecked(new Date())
    }
  }

  useEffect(() => {
    checkConnection()
    // Auto-refresh every 30 seconds
    const interval = setInterval(checkConnection, 30000)
    return () => clearInterval(interval)
  }, [])

  const getStatusIcon = () => {
    switch (status) {
      case 'loading':
        return <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
      case 'connected':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />
    }
  }

  const getStatusText = () => {
    if (connectionResult) {
      if (connectionResult.status === 'connected') {
        const upServices = connectionResult.services.filter(s => s.status === 'UP').length
        const totalServices = connectionResult.services.length
        return upServices === totalServices 
          ? 'All services operational' 
          : `${upServices}/${totalServices} services running`
      } else {
        return connectionResult.message || 'Some services are unavailable'
      }
    }
    switch (status) {
      case 'loading':
        return 'Checking backend services...'
      case 'connected':
        return 'All services running'
      case 'error':
        return 'Backend services unavailable'
    }
  }

  const getStatusColor = () => {
    switch (status) {
      case 'loading':
        return 'border-blue-200 bg-blue-50'
      case 'connected':
        return 'border-green-200 bg-green-50'
      case 'error':
        return 'border-red-200 bg-red-50'
    }
  }

  const getServiceIcon = (serviceStatus: string) => {
    return serviceStatus === 'UP' ? 
      <CheckCircle className="h-4 w-4 text-green-500" /> : 
      <XCircle className="h-4 w-4 text-red-500" />
  }

  return (
    <Card className={`${getStatusColor()}`}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center space-x-2 text-lg">
          {getStatusIcon()}
          <span>System Status</span>
        </CardTitle>
        <CardDescription>
          Backend services connectivity
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-sm font-medium">{getStatusText()}</p>
          
          {connectionResult?.services && connectionResult.services.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-700">Service Details:</h4>
              {connectionResult.services.map((service, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-white rounded border">
                  <div className="flex items-center space-x-2">
                    {getServiceIcon(service.status)}
                    <span className="text-sm font-medium">{service.name}</span>
                  </div>
                  <Badge variant={service.status === 'UP' ? 'default' : 'destructive'}>
                    {service.status}
                  </Badge>
                </div>
              ))}
            </div>
          )}
          
          {connectionResult?.error && (
            <div className="p-3 bg-red-100 border border-red-200 rounded">
              <div className="flex items-center space-x-2">
                <AlertCircle className="h-4 w-4 text-red-500" />
                <p className="text-sm text-red-700 font-medium">Error Details:</p>
              </div>
              <p className="text-sm text-red-600 mt-1">{connectionResult.error}</p>
            </div>
          )}
          
          {lastChecked && (
            <p className="text-xs text-gray-500">
              Last checked: {lastChecked.toLocaleTimeString()}
            </p>
          )}
          
          <Button 
            onClick={checkConnection} 
            variant="outline" 
            size="sm"
            disabled={status === 'loading'}
            className="w-full"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${status === 'loading' ? 'animate-spin' : ''}`} />
            Refresh Status
          </Button>

          {status === 'error' && (
            <div className="text-xs text-gray-600 mt-2 p-2 bg-gray-100 rounded">
              <p><strong>Troubleshooting:</strong></p>
              <ul className="list-disc list-inside space-y-1 mt-1">
                <li>Check if the Spring Boot services are running</li>
                <li>Ensure API Gateway is running on port 8080</li>
                <li>Verify Tourism Core Service is running on port 8081</li>
                <li>Check network connectivity to localhost</li>
                <li>If services are running, this might be a CORS or network issue</li>
                <li>Try: <code className="bg-gray-200 px-1 rounded">curl http://localhost:8080/api/v1/tours</code></li>
              </ul>
              <p className="mt-2 text-xs">
                <strong>Note:</strong> The frontend can work even if some services show as DOWN. 
                The API Gateway proxies requests to individual services.
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
