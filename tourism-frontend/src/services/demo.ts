// Demo script to test registration functionality
export const testRegistration = async () => {
  const testUser = {
    firstName: 'Jane',
    lastName: 'Smith',
    username: 'janesmith',
    email: 'jane@example.com',
    password: 'securepass123',
    phone: '+1-555-0123',
    role: 'TOURIST'
  }

  console.log('Testing registration with mock service...')
  
  try {
    const { mockAuthService } = await import('./mockAuth')
    const result = await mockAuthService.register(testUser)
    
    console.log('✅ Registration successful!', {
      user: result.user,
      token: result.token.substring(0, 20) + '...'
    })
    
    return result
  } catch (error) {
    console.error('❌ Registration failed:', error)
    throw error
  }
}

// Test login with registered user
export const testLogin = async (username: string) => {
  console.log('Testing login with mock service...')
  
  try {
    const { mockAuthService } = await import('./mockAuth')
    const result = await mockAuthService.login(username, 'anypassword')
    
    console.log('✅ Login successful!', {
      user: result.user,
      token: result.token.substring(0, 20) + '...'
    })
    
    return result
  } catch (error) {
    console.error('❌ Login failed:', error)
    throw error
  }
}

// Demo function to show complete flow
export const demoRegistrationFlow = async () => {
  console.log('🚀 Starting registration demo...')
  
  // Test registration
  const registrationResult = await testRegistration()
  
  // Test login with the same user
  await new Promise(resolve => setTimeout(resolve, 1000)) // Wait 1 second
  const loginResult = await testLogin(registrationResult.user.username)
  
  console.log('🎉 Demo complete! Registration and login working perfectly.')
  
  return { registrationResult, loginResult }
}

// Utility to clear test data
export const clearTestData = () => {
  localStorage.removeItem('mockUsers')
  console.log('🧹 Test data cleared')
}

// Make functions available globally for console testing
if (typeof window !== 'undefined') {
  (window as any).tourismDemo = {
    testRegistration,
    testLogin,
    demoRegistrationFlow,
    clearTestData
  }
}
