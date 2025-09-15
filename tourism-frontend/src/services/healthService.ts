// Simple health service to test backend connectivity
import axios from 'axios'

// Create a simple axios instance for health checks
const healthApi = axios.create({
  baseURL: 'http://localhost:8080/api/v1',
  timeout: 5000
})

interface HealthStatus {
  service: string
  status: 'UP' | 'DOWN'
  timestamp: string
  details?: string
}

interface HealthResponse {
  status: 'UP' | 'DOWN'
  services: HealthStatus[]
  timestamp: string
}

export const healthService = {
  // Test basic API connectivity
  async checkApiHealth(): Promise<HealthStatus> {
    try {
      const startTime = Date.now()
      await healthApi.get('/tours', { params: { limit: 1 } })
      const responseTime = Date.now() - startTime
      
      return {
        service: 'API Gateway',
        status: 'UP',
        timestamp: new Date().toISOString(),
        details: `Response time: ${responseTime}ms`
      }
    } catch (error: any) {
      return {
        service: 'API Gateway',
        status: 'DOWN',
        timestamp: new Date().toISOString(),
        details: error.message || 'Connection failed'
      }
    }
  },

  // Check if we can fetch tours (tests core service through gateway)
  async checkCoreService(): Promise<HealthStatus> {
    try {
      const startTime = Date.now()
      const response = await healthApi.get('/tours')
      const responseTime = Date.now() - startTime
      
      return {
        service: 'Tourism Core',
        status: 'UP',
        timestamp: new Date().toISOString(),
        details: `${response.data?.length || 0} tours available, ${responseTime}ms`
      }
    } catch (error: any) {
      return {
        service: 'Tourism Core',
        status: 'DOWN',
        timestamp: new Date().toISOString(),
        details: error.message || 'Service unavailable'
      }
    }
  },

  // Simple ping test that doesn't require specific endpoints
  async pingService(serviceName: string, endpoint: string): Promise<HealthStatus> {
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 3000)
      
      const startTime = Date.now()
      await fetch(endpoint, {
        method: 'HEAD', // Use HEAD to avoid CORS issues
        signal: controller.signal,
        mode: 'no-cors'
      })
      clearTimeout(timeoutId)
      
      const responseTime = Date.now() - startTime
      
      return {
        service: serviceName,
        status: 'UP',
        timestamp: new Date().toISOString(),
        details: `Response time: ${responseTime}ms`
      }
    } catch (error: any) {
      return {
        service: serviceName,
        status: 'DOWN',
        timestamp: new Date().toISOString(),
        details: error.name === 'AbortError' ? 'Timeout' : 'Connection failed'
      }
    }
  },

  // Comprehensive health check
  async getSystemHealth(): Promise<HealthResponse> {
    try {
      const checks = await Promise.all([
        this.checkApiHealth(),
        this.checkCoreService(),
        this.pingService('Eureka Server', 'http://localhost:8761'),
        this.pingService('Itinerary Service', 'http://localhost:8082')
      ])

      const downServices = checks.filter(check => check.status === 'DOWN')
      const overallStatus = downServices.length === 0 ? 'UP' : 'DOWN'

      return {
        status: overallStatus,
        services: checks,
        timestamp: new Date().toISOString()
      }
    } catch (error) {
      return {
        status: 'DOWN',
        services: [
          {
            service: 'System Check',
            status: 'DOWN',
            timestamp: new Date().toISOString(),
            details: 'Health check failed'
          }
        ],
        timestamp: new Date().toISOString()
      }
    }
  }
}
