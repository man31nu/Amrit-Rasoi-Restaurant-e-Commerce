import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { signup, clearError } from '../store/authSlice'
import toast from 'react-hot-toast'
import { Eye, EyeOff, UserPlus, Utensils } from 'lucide-react'

export default function SignupPage() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { loading, error } = useAppSelector(s => s.auth)

  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const [showPw, setShowPw] = useState(false)

  useEffect(() => {
    if (error) {
      toast.error(error)
      dispatch(clearError())
    }
  }, [error, dispatch])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (form.password !== form.confirm) {
      toast.error('Passwords do not match')
      return
    }
    if (form.password.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }
    const result = await dispatch(signup({ name: form.name, email: form.email, password: form.password }))
    if (signup.fulfilled.match(result)) {
      toast.success(`Account created! Welcome, ${result.payload.name}! 🍽️`)
      navigate('/')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden px-4 py-12">
      {/* Ambient blobs */}
      <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full opacity-20 blur-3xl"
           style={{ background: 'radial-gradient(circle, #f97316, transparent)' }} />
      <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full opacity-15 blur-3xl"
           style={{ background: 'radial-gradient(circle, #ef4444, transparent)' }} />

      <div className="w-full max-w-md animate-fadeUp">
        {/* Logo */}
        <div className="flex flex-col items-center mb-10">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 animate-pulse-glow"
               style={{ background: 'var(--brand-gradient)' }}>
            <Utensils size={30} color="white" />
          </div>
          <h1 className="text-3xl font-bold gradient-text">AmritRasoi</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
            Join thousands of food lovers
          </p>
        </div>

        {/* Card */}
        <div className="glass-card p-8">
          <h2 className="text-2xl font-bold mb-1">Create your account</h2>
          <p className="text-sm mb-8" style={{ color: 'var(--text-secondary)' }}>
            Start ordering premium food today
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
            <div>
              <label htmlFor="name" className="form-label">Full Name</label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                placeholder="John Doe"
                value={form.name}
                onChange={handleChange}
                className="form-input"
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="form-label">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                className="form-input"
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="form-label">Password</label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPw ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  placeholder="Min. 6 characters"
                  value={form.password}
                  onChange={handleChange}
                  className="form-input pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(p => !p)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 transition-colors"
                  style={{ color: 'var(--text-secondary)' }}
                  aria-label="Toggle password visibility"
                >
                  {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirm" className="form-label">Confirm Password</label>
              <input
                id="confirm"
                name="confirm"
                type={showPw ? 'text' : 'password'}
                autoComplete="new-password"
                required
                placeholder="Re-enter password"
                value={form.confirm}
                onChange={handleChange}
                className="form-input"
              />
            </div>

            {/* Strength indicator */}
            {form.password && (
              <div className="space-y-1">
                <div className="flex gap-1">
                  {[1,2,3,4].map(n => (
                    <div key={n} className="flex-1 h-1 rounded-full transition-all duration-300" style={{
                      background: form.password.length >= n * 3
                        ? n <= 1 ? '#ef4444' : n === 2 ? '#f97316' : n === 3 ? '#eab308' : '#22c55e'
                        : 'var(--glass-border)'
                    }} />
                  ))}
                </div>
                <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                  {form.password.length < 3 ? 'Too short' : form.password.length < 6 ? 'Weak' : form.password.length < 9 ? 'Fair' : form.password.length < 12 ? 'Good' : 'Strong'}
                </p>
              </div>
            )}

            {/* Submit */}
            <button
              id="signup-submit"
              type="submit"
              disabled={loading}
              className="btn-primary w-full mt-2"
            >
              {loading
                ? <span className="spinner" />
                : <><UserPlus size={18} /> Create Account</>
              }
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px" style={{ background: 'var(--glass-border)' }} />
            <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>OR</span>
            <div className="flex-1 h-px" style={{ background: 'var(--glass-border)' }} />
          </div>

          <p className="text-center text-sm" style={{ color: 'var(--text-secondary)' }}>
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-semibold transition-colors hover:underline"
              style={{ color: 'var(--accent)' }}
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
