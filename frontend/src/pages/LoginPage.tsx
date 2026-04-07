import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { login, clearError } from '../store/authSlice'
import toast from 'react-hot-toast'
import { Eye, EyeOff, LogIn, Utensils } from 'lucide-react'

export default function LoginPage() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { loading, error } = useAppSelector(s => s.auth)

  const [form, setForm] = useState({ email: '', password: '' })
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
    const result = await dispatch(login(form))
    if (login.fulfilled.match(result)) {
      toast.success(`Welcome back, ${result.payload.name}! 🎉`)
      navigate('/')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden px-4">
      {/* Ambient background blobs */}
      <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full opacity-20 blur-3xl"
           style={{ background: 'radial-gradient(circle, #f97316, transparent)' }} />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full opacity-15 blur-3xl"
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
            Premium food, delivered with love
          </p>
        </div>

        {/* Card */}
        <div className="glass-card p-8">
          <h2 className="text-2xl font-bold mb-1">Welcome back</h2>
          <p className="text-sm mb-8" style={{ color: 'var(--text-secondary)' }}>
            Sign in to your account to continue
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
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
                  autoComplete="current-password"
                  required
                  placeholder="••••••••"
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

            {/* Submit */}
            <button
              id="login-submit"
              type="submit"
              disabled={loading}
              className="btn-primary w-full mt-2"
            >
              {loading
                ? <span className="spinner" />
                : <><LogIn size={18} /> Sign In</>
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
            Don't have an account?{' '}
            <Link
              to="/signup"
              className="font-semibold transition-colors hover:underline"
              style={{ color: 'var(--accent)' }}
            >
              Create one free
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
