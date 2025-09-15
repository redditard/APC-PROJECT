import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '../components/ui/separator'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../components/ui/dialog'
import { CalendarDays, MapPin, Star, CheckCircle, Shield, CreditCard, Phone, Mail } from 'lucide-react'
import { bookingService, tourService, Tour, TourPackage } from '@/services/api'
import { useAuthStore } from '@/store/authStore'

export default function BookingPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useAuthStore()

  const [tour, setTour] = useState<Tour | null>(null)
  const [selectedPackage, setSelectedPackage] = useState<TourPackage | null>(null)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  // Form
  const [form, setForm] = useState({
    numberOfPeople: 1,
    startDate: '',
    contactEmail: user?.email || '',
    contactPhone: '',
    specialRequests: ''
  })

  // Parse query: tourId and optional package
  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const tid = params.get('tourId')
    const pid = params.get('packageId')
    // Prefer pre-passed state for immediate UX
    const navState = (location.state as any) || {}
    if (navState.package) {
      setSelectedPackage(navState.package as TourPackage)
    }
    if (!tid) return
    ;(async () => {
      try {
        const t = await tourService.getTourById(Number(tid))
        setTour(t)
        const all = t.packages || []
        if (pid) {
          const p = all.find(p => p.id === Number(pid)) || null
          setSelectedPackage(p)
        } else if (all.length) {
          setSelectedPackage([...all].sort((a,b)=>a.price-b.price)[0])
        }
      } catch (e) {
        // Keep graceful fallback to any package passed via navigation state
        setLoadError('Could not load tour details. You can still select a package if provided or go back to packages.')
      }
    })()
  }, [location.search, navigate])

  // Build a unified list of selectable packages: prefer tour packages; else use a package passed via Link state
  const availablePackages: TourPackage[] = useMemo(() => {
    if (tour?.packages && tour.packages.length) return tour.packages
    const navState = (location.state as any) || {}
    const fromState = navState.package as TourPackage | undefined
    let fromStorage: TourPackage | undefined
    try {
      const raw = sessionStorage.getItem('booking:pkg')
      if (raw) fromStorage = JSON.parse(raw)
    } catch {}
    return fromState ? [fromState] : fromStorage ? [fromStorage] : []
  }, [tour, location.state])

  // If we have no selectedPackage yet but have available ones, auto-pick the cheapest for convenience
  useEffect(() => {
    if (!selectedPackage && availablePackages.length) {
      const cheapest = [...availablePackages].sort((a,b)=>a.price-b.price)[0]
      setSelectedPackage(cheapest)
    }
  }, [availablePackages, selectedPackage])

  const total = useMemo(() => {
    const price = selectedPackage?.price
    return price ? price * form.numberOfPeople : 0
  }, [selectedPackage, form.numberOfPeople])

  const canSubmit = !!(user && selectedPackage && form.startDate && form.contactEmail && form.contactPhone)

  const submit = async () => {
    if (!selectedPackage || !form.startDate || !form.contactEmail || !form.contactPhone) {
      alert('Please fill all required fields before confirming booking.')
      return
    }
    setSubmitting(true)
    try {
      await bookingService.createBooking({
        packageId: selectedPackage.id,
        numberOfPeople: form.numberOfPeople,
        // Include startDate if backend expects it
        // @ts-ignore - keep compatibility if the service type doesn't include it
        startDate: form.startDate,
        contactEmail: form.contactEmail,
        contactPhone: form.contactPhone,
        specialRequests: form.specialRequests || undefined
      })
      setShowSuccess(true)
    } catch (e) {
      const err: any = e
      // If the request failed due to authentication, guide the user to login
      if (err?.isAuthError || err?.response?.status === 401) {
        // Show a friendly message and navigate to login so user can authenticate
        const msg = err?.response?.data?.message || 'You must sign in to complete a booking.'
        // Use the browser confirm so user can decide to go to login now
        if (window.confirm(msg + '\n\nWould you like to sign in now?')) {
          navigate('/login')
        }
        return
      }

      const msg = err?.response?.data?.message || err?.message || 'Failed to create booking. Please try again.'
      alert(msg)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <Button variant="outline" onClick={() => navigate('/packages')} className="mb-4">
          Back to Packages
        </Button>
        <h1 className="text-3xl font-bold text-gray-900">Complete Your Booking</h1>
        <p className="text-gray-600">Secure checkout with transparent pricing</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Summary */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Trip Details</CardTitle>
              <CardDescription>Select a package and enter your details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Tour info */}
              {tour ? (
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-lg font-semibold">{tour.name}</div>
                    <div className="text-sm text-gray-600 flex items-center gap-3">
                      <span className="flex items-center"><MapPin className="h-4 w-4 mr-1" />{tour.destination}</span>
                      <span className="flex items-center"><CalendarDays className="h-4 w-4 mr-1" />{tour.duration} days</span>
                      <span className="flex items-center"><Star className="h-4 w-4 mr-1 fill-yellow-400 text-yellow-400" />4.5</span>
                    </div>
                  </div>
                  <Badge variant="secondary">{tour.status}</Badge>
                </div>
              ) : (
                <div className="text-gray-600">
                  {loadError ? (
                    <span className="text-red-600">{loadError}</span>
                  ) : (
                    'Loading tour details…'
                  )}
                </div>
              )}

              {/* Package selector */}
              <div className="space-y-2">
                <Label>Choose Package</Label>
                <select
                  className="w-full p-2 border rounded"
                  value={selectedPackage?.id ?? ''}
                  onChange={(e)=>{
                    const id = Number(e.target.value)
                    const p = availablePackages.find(p => p.id === id) || null
                    setSelectedPackage(p)
                  }}
                  disabled={availablePackages.length === 0}
                >
                  <option value="">{availablePackages.length ? 'Select package' : 'No packages available'}</option>
                  {availablePackages.map(p => (
                    <option key={p.id} value={p.id}>{p.packageName} — ₹{p.price.toLocaleString()}</option>
                  ))}
                </select>
              </div>

              {/* Contact & preferences */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startDate">Preferred Start Date</Label>
                  <Input id="startDate" type="date" value={form.startDate} min={new Date().toISOString().split('T')[0]}
                    onChange={(e)=> setForm({...form, startDate: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="people">Number of People</Label>
                  <Input id="people" type="number" min={1} value={form.numberOfPeople}
                    onChange={(e)=> setForm({...form, numberOfPeople: parseInt(e.target.value || '1', 10)})}
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" value={form.contactEmail}
                    onChange={(e)=> setForm({...form, contactEmail: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" type="tel" value={form.contactPhone}
                    onChange={(e)=> setForm({...form, contactPhone: e.target.value})}
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="requests">Special Requests</Label>
                  <Input id="requests" placeholder="Any special requirements…" value={form.specialRequests}
                    onChange={(e)=> setForm({...form, specialRequests: e.target.value})}
                  />
                </div>
              </div>

              <Separator />

              {/* Assurance */}
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center gap-2"><Shield className="h-4 w-4" /> Secure payments</div>
                <div className="flex items-center gap-2"><CreditCard className="h-4 w-4" /> Transparent pricing</div>
                <div className="flex items-center gap-2"><CheckCircle className="h-4 w-4" /> Free cancellation (48h)</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Price & CTA */}
        <div className="space-y-6">
          <Card className="sticky top-8">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Package</span>
                <span>{selectedPackage ? `${selectedPackage.packageName}` : '—'}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>People</span>
                <span>{form.numberOfPeople}</span>
              </div>
              <Separator />
              <div className="flex justify-between items-center">
                <span className="font-medium">Total</span>
                <span className="text-2xl font-bold text-blue-600">{selectedPackage ? `₹${total.toLocaleString()}` : '—'}</span>
              </div>
              {user ? (
                <Button className="w-full" disabled={!canSubmit || submitting} onClick={submit}>
                  {submitting ? 'Processing…' : 'Confirm Booking'}
                </Button>
              ) : (
                <div className="space-y-2">
                  <Button className="w-full" onClick={() => navigate('/login')}>Login to Continue</Button>
                  <p className="text-xs text-center text-gray-600">Don’t have an account? <button className="text-blue-600" onClick={()=>navigate('/register')}>Sign up</button></p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Need help?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-gray-700">
              <div className="flex items-center gap-2"><Phone className="h-4 w-4" /> +91 98765 43210</div>
              <div className="flex items-center gap-2"><Mail className="h-4 w-4" /> support@tourismnow.com</div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Success Dialog */}
      <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Booking Confirmed!</DialogTitle>
            <DialogDescription>
              Your booking has been created successfully. You can track it in the My Bookings page.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end">
            <Button onClick={() => { setShowSuccess(false); navigate('/bookings') }}>Go to My Bookings</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
