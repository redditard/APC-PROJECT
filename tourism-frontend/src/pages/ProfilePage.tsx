import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  User, 
  Settings, 
  Lock, 
  Bell,
  Save,
  Eye,
  EyeOff
} from 'lucide-react'
import { useAuthStore } from '@/store/authStore'

export default function ProfilePage() {
  const { user } = useAuthStore()
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('personal')
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  
  // Personal Information State
  const [personalInfo, setPersonalInfo] = useState({
    firstName: user?.username.split(' ')[0] || '',
    lastName: user?.username.split(' ')[1] || '',
    email: user?.email || '',
    phone: '',
    dateOfBirth: '',
    address: '',
    city: '',
    country: 'India'
  })

  // Password Change State
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  // Preferences State
  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    smsNotifications: false,
    marketingEmails: true,
    newsletter: true,
    currency: 'INR',
    language: 'en',
    timeZone: 'Asia/Kolkata'
  })

  const handlePersonalInfoSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      // TODO: Implement API call to update personal information
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API call
      alert('Personal information updated successfully!')
    } catch (error) {
      console.error('Failed to update personal information:', error)
      alert('Failed to update personal information')
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('New password and confirm password do not match')
      return
    }

    if (passwordData.newPassword.length < 6) {
      alert('Password must be at least 6 characters long')
      return
    }

    setLoading(true)
    try {
      // TODO: Implement API call to change password
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API call
      alert('Password changed successfully!')
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
    } catch (error) {
      console.error('Failed to change password:', error)
      alert('Failed to change password')
    } finally {
      setLoading(false)
    }
  }

  const handlePreferencesSave = async () => {
    setLoading(true)
    try {
      // TODO: Implement API call to update preferences
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API call
      alert('Preferences updated successfully!')
    } catch (error) {
      console.error('Failed to update preferences:', error)
      alert('Failed to update preferences')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Profile Settings</h1>
        <p className="text-gray-600">Manage your account information and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="p-4">
              <div className="space-y-2">
                <button
                  onClick={() => setActiveTab('personal')}
                  className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                    activeTab === 'personal' 
                      ? 'bg-blue-100 text-blue-700 font-medium' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <User className="h-4 w-4 inline mr-2" />
                  Personal Info
                </button>
                
                <button
                  onClick={() => setActiveTab('security')}
                  className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                    activeTab === 'security' 
                      ? 'bg-blue-100 text-blue-700 font-medium' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Lock className="h-4 w-4 inline mr-2" />
                  Security
                </button>
                
                <button
                  onClick={() => setActiveTab('preferences')}
                  className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                    activeTab === 'preferences' 
                      ? 'bg-blue-100 text-blue-700 font-medium' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Settings className="h-4 w-4 inline mr-2" />
                  Preferences
                </button>
                
                <button
                  onClick={() => setActiveTab('notifications')}
                  className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                    activeTab === 'notifications' 
                      ? 'bg-blue-100 text-blue-700 font-medium' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Bell className="h-4 w-4 inline mr-2" />
                  Notifications
                </button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Personal Information Tab */}
          {activeTab === 'personal' && (
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>
                  Update your personal details and contact information
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePersonalInfoSave} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        value={personalInfo.firstName}
                        onChange={(e) => setPersonalInfo({ 
                          ...personalInfo, 
                          firstName: e.target.value 
                        })}
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        value={personalInfo.lastName}
                        onChange={(e) => setPersonalInfo({ 
                          ...personalInfo, 
                          lastName: e.target.value 
                        })}
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={personalInfo.email}
                        onChange={(e) => setPersonalInfo({ 
                          ...personalInfo, 
                          email: e.target.value 
                        })}
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={personalInfo.phone}
                        onChange={(e) => setPersonalInfo({ 
                          ...personalInfo, 
                          phone: e.target.value 
                        })}
                      />
                    </div>

                    <div>
                      <Label htmlFor="dateOfBirth">Date of Birth</Label>
                      <Input
                        id="dateOfBirth"
                        type="date"
                        value={personalInfo.dateOfBirth}
                        onChange={(e) => setPersonalInfo({ 
                          ...personalInfo, 
                          dateOfBirth: e.target.value 
                        })}
                      />
                    </div>

                    <div>
                      <Label htmlFor="country">Country</Label>
                      <Input
                        id="country"
                        value={personalInfo.country}
                        onChange={(e) => setPersonalInfo({ 
                          ...personalInfo, 
                          country: e.target.value 
                        })}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      value={personalInfo.address}
                      onChange={(e) => setPersonalInfo({ 
                        ...personalInfo, 
                        address: e.target.value 
                      })}
                      placeholder="Street address"
                    />
                  </div>

                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      value={personalInfo.city}
                      onChange={(e) => setPersonalInfo({ 
                        ...personalInfo, 
                        city: e.target.value 
                      })}
                    />
                  </div>

                  <Button type="submit" disabled={loading} className="w-full md:w-auto">
                    <Save className="h-4 w-4 mr-2" />
                    {loading ? 'Saving...' : 'Save Changes'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>
                  Manage your password and security preferences
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePasswordChange} className="space-y-4">
                  <div>
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <div className="relative">
                      <Input
                        id="currentPassword"
                        type={showCurrentPassword ? 'text' : 'password'}
                        value={passwordData.currentPassword}
                        onChange={(e) => setPasswordData({ 
                          ...passwordData, 
                          currentPassword: e.target.value 
                        })}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="newPassword">New Password</Label>
                    <div className="relative">
                      <Input
                        id="newPassword"
                        type={showNewPassword ? 'text' : 'password'}
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData({ 
                          ...passwordData, 
                          newPassword: e.target.value 
                        })}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData({ 
                        ...passwordData, 
                        confirmPassword: e.target.value 
                      })}
                      required
                    />
                  </div>

                  <Button type="submit" disabled={loading} className="w-full md:w-auto">
                    <Lock className="h-4 w-4 mr-2" />
                    {loading ? 'Changing...' : 'Change Password'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Preferences Tab */}
          {activeTab === 'preferences' && (
            <Card>
              <CardHeader>
                <CardTitle>Preferences</CardTitle>
                <CardDescription>
                  Customize your experience and default settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-medium mb-3">Language & Region</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="language">Language</Label>
                      <select
                        id="language"
                        value={preferences.language}
                        onChange={(e) => setPreferences({ 
                          ...preferences, 
                          language: e.target.value 
                        })}
                        className="w-full p-2 border border-gray-300 rounded-md"
                      >
                        <option value="en">English</option>
                        <option value="hi">Hindi</option>
                        <option value="es">Spanish</option>
                      </select>
                    </div>

                    <div>
                      <Label htmlFor="currency">Currency</Label>
                      <select
                        id="currency"
                        value={preferences.currency}
                        onChange={(e) => setPreferences({ 
                          ...preferences, 
                          currency: e.target.value 
                        })}
                        className="w-full p-2 border border-gray-300 rounded-md"
                      >
                        <option value="INR">Indian Rupee (₹)</option>
                        <option value="USD">US Dollar ($)</option>
                        <option value="EUR">Euro (€)</option>
                      </select>
                    </div>

                    <div>
                      <Label htmlFor="timeZone">Time Zone</Label>
                      <select
                        id="timeZone"
                        value={preferences.timeZone}
                        onChange={(e) => setPreferences({ 
                          ...preferences, 
                          timeZone: e.target.value 
                        })}
                        className="w-full p-2 border border-gray-300 rounded-md"
                      >
                        <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                        <option value="America/New_York">America/New_York (EST)</option>
                        <option value="Europe/London">Europe/London (GMT)</option>
                      </select>
                    </div>
                  </div>
                </div>

                <Button onClick={handlePreferencesSave} disabled={loading} className="w-full md:w-auto">
                  <Save className="h-4 w-4 mr-2" />
                  {loading ? 'Saving...' : 'Save Preferences'}
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <Card>
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription>
                  Choose how you want to receive notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  {[
                    { key: 'emailNotifications', label: 'Email Notifications', desc: 'Receive booking confirmations and updates via email' },
                    { key: 'smsNotifications', label: 'SMS Notifications', desc: 'Receive text messages for urgent updates' },
                    { key: 'marketingEmails', label: 'Marketing Emails', desc: 'Receive promotional offers and travel deals' },
                    { key: 'newsletter', label: 'Newsletter', desc: 'Monthly newsletter with travel tips and destination guides' }
                  ].map((item) => (
                    <div key={item.key} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium">{item.label}</h4>
                        <p className="text-sm text-gray-600">{item.desc}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={preferences[item.key as keyof typeof preferences] as boolean}
                          onChange={(e) => setPreferences({ 
                            ...preferences, 
                            [item.key]: e.target.checked 
                          })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  ))}
                </div>

                <Button onClick={handlePreferencesSave} disabled={loading} className="w-full md:w-auto">
                  <Save className="h-4 w-4 mr-2" />
                  {loading ? 'Saving...' : 'Save Notification Settings'}
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
