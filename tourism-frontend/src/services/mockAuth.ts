// Mock authentication service for testing when backend is down

interface MockRegisterRequest {
  username: string
  email: string
  password: string
  firstName: string
  lastName: string
  phone?: string
  role: string
}

interface MockAuthResponse {
  token: string
  user: {
    id: number
    username: string
    email: string
    firstName: string
    lastName: string
    role: string
  }
}

class MockAuthService {
  // Simulate network delay
  private delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  // Mock user storage in localStorage
  private getUsers(): any[] {
    const users = localStorage.getItem('mockUsers')
    console.log('Mock Auth - localStorage mockUsers:', users)
    
    if (users) {
      const parsedUsers = JSON.parse(users)
      console.log('Mock Auth - Parsed users from localStorage:', parsedUsers)
      return parsedUsers
    }
    
    console.log('Mock Auth - No users in localStorage, creating defaults...')
    
    // Initialize with default admin and test users if no users exist
    const defaultUsers = [
      {
        id: 1,
        username: 'admin',
        email: 'admin@tourism.com',
        firstName: 'Admin',
        lastName: 'User',
        phone: '+1234567890',
        role: 'ADMIN',
        createdAt: new Date().toISOString()
      },
      {
        id: 2,
        username: 'tourist',
        email: 'tourist@example.com',
        firstName: 'Tourist',
        lastName: 'User',
        phone: '+1234567891',
        role: 'TOURIST',
        createdAt: new Date().toISOString()
      },
      {
        id: 3,
        username: 'operator',
        email: 'operator@tourism.com',
        firstName: 'Tour',
        lastName: 'Operator',
        phone: '+1234567892',
        role: 'TOUR_OPERATOR',
        createdAt: new Date().toISOString()
      }
    ]
    
    console.log('Mock Auth - Created default users:', defaultUsers)
    this.saveUsers(defaultUsers)
    return defaultUsers
  }

  private saveUsers(users: any[]) {
    localStorage.setItem('mockUsers', JSON.stringify(users))
  }

  private async generateToken(user: any): Promise<string> {
    // Generate a real HS256 JWT so backend accepts mock logins during local development.
    // Use a fallback secret that matches the backend dev secret; override in the browser by setting
    // window.__MOCK_JWT_SECRET__ if needed.
    const secret = (window as any).__MOCK_JWT_SECRET__ || 'tourismSecretKeyThatIsVeryLongAndSecureForJWTTokenGenerationAndValidation2024'
    const header = { alg: 'HS256', typ: 'JWT' }
    const now = Math.floor(Date.now() / 1000)
    const payload = {
      sub: user.username,
      userId: user.id,
      email: user.email,
      role: user.role,
      iat: now,
      exp: now + 60 * 60 * 24 // 24 hours
    }

    const base64url = (obj: any) =>
      btoa(JSON.stringify(obj))
        .replace(/=/g, '')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')

    const encodedHeader = base64url(header)
    const encodedPayload = base64url(payload)
    const data = `${encodedHeader}.${encodedPayload}`

    // Sign using Web Crypto API (HMAC-SHA256)
    const enc = new TextEncoder()
    const key = await crypto.subtle.importKey(
      'raw',
      enc.encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    )
    const signatureBuf = await crypto.subtle.sign('HMAC', key, enc.encode(data))
    const signatureBytes = new Uint8Array(signatureBuf)
    let binary = ''
    for (let i = 0; i < signatureBytes.byteLength; i++) {
      binary += String.fromCharCode(signatureBytes[i])
    }
    const signatureBase64 = btoa(binary).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_')
    return `${data}.${signatureBase64}`
  }

  async register(data: MockRegisterRequest): Promise<MockAuthResponse> {
    await this.delay(1000) // Simulate network delay

    const users = this.getUsers()
    
    // Check if user already exists
    const existingUser = users.find(u => u.username === data.username || u.email === data.email)
    if (existingUser) {
      throw new Error('User already exists with this username or email')
    }

    // Create new user
    const newUser = {
      id: Date.now(), // Simple ID generation
      username: data.username,
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone || '',
      role: data.role,
      createdAt: new Date().toISOString()
    }

    users.push(newUser)
    this.saveUsers(users)

    const token = await this.generateToken(newUser)

    return {
      token,
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        role: newUser.role
      }
    }
  }

  async login(username: string, _password: string): Promise<MockAuthResponse> {
    await this.delay(800) // Simulate network delay

    const users = this.getUsers()
    console.log('Mock Auth - Available users:', users.map(u => ({ username: u.username, email: u.email, role: u.role })))
    console.log('Mock Auth - Looking for username:', username)
    
    const user = users.find(u => u.username === username || u.email === username)
    
    if (!user) {
      console.error('Mock Auth - User not found. Available usernames:', users.map(u => u.username))
      throw new Error('User not found')
    }

    console.log('Mock Auth - Found user:', { username: user.username, role: user.role })
    
    // For demo purposes, accept any password (indicated by _ prefix)
    const token = await this.generateToken(user)

    return {
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role
      }
    }
  }

  // Check if backend is available
  async isBackendAvailable(): Promise<boolean> {
    try {
      const response = await fetch('http://localhost:8080/api/auth/health', {
        method: 'GET',
        timeout: 3000
      } as any)
      return response.ok
    } catch {
      return false
    }
  }

  // Force reset mock users (for debugging)
  resetMockUsers(): void {
    console.log('Mock Auth - Resetting mock users...')
    localStorage.removeItem('mockUsers')
    this.getUsers() // This will recreate the default users
    console.log('Mock Auth - Reset complete')
  }
}

export const mockAuthService = new MockAuthService()
