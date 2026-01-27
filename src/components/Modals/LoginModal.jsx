import { useState } from 'react'
import { FaTimes, FaUser, FaLock, FaEnvelope, FaGoogle, FaGithub } from 'react-icons/fa'
import { useAuth } from '../../context/AuthContext'
import { useUI } from '../../context/UIContext'
import { supabase } from '../../services/supabase'

const LoginModal = () => {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  
  const { signIn, signUp } = useAuth()
  const { closeLoginModal } = useUI()

  const validateForm = () => {
    if (!email || !password) {
      setError('Please fill in all fields')
      return false
    }
    
    if (!isLogin) {
      if (!username) {
        setError('Username is required')
        return false
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match')
        return false
      }
      if (password.length < 6) {
        setError('Password must be at least 6 characters')
        return false
      }
      if (!username.match(/^[a-zA-Z0-9_]+$/)) {
        setError('Username can only contain letters, numbers, and underscores')
        return false
      }
    }
    
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    
    if (!validateForm()) return
    
    setLoading(true)
    
    try {
      if (isLogin) {
        const { error } = await signIn(email, password)
        if (error) throw error
        closeLoginModal()
      } else {
        const { error } = await signUp(email, password, username)
        if (error) throw error
        setIsLogin(true)
        setError('Account created! Please check your email to confirm.')
      }
    } catch (err) {
      setError(err.message || 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleSocialLogin = async (provider) => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      })
      if (error) throw error
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md border border-gray-700">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h2>
            <button
              onClick={closeLoginModal}
              className="text-gray-400 hover:text-white p-1"
            >
              <FaTimes size={20} />
            </button>
          </div>

          {error && (
            <div className={`mb-4 p-3 rounded-lg ${error.includes('created') ? 'bg-green-900 bg-opacity-20 text-green-400' : 'bg-red-900 bg-opacity-20 text-red-400'}`}>
              {error}
            </div>
          )}

          <div className="flex space-x-2 mb-6">
            <button
              onClick={() => handleSocialLogin('google')}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-medium flex items-center justify-center space-x-2 transition-colors"
            >
              <FaGoogle />
              <span>Google</span>
            </button>
            <button
              onClick={() => handleSocialLogin('github')}
              className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-lg font-medium flex items-center justify-center space-x-2 transition-colors"
            >
              <FaGithub />
              <span>GitHub</span>
            </button>
          </div>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-gray-800 text-gray-400">Or continue with</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaUser className="text-gray-500" />
                  </div>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value.toLowerCase())}
                    className="input-field pl-10 w-full"
                    placeholder="Choose a unique username"
                    maxLength={20}
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaEnvelope className="text-gray-500" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field pl-10 w-full"
                  placeholder="your@email.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="text-gray-500" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field pl-10 w-full"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="text-gray-500" />
                  </div>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="input-field pl-10 w-full"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setIsLogin(!isLogin)
                setError('')
              }}
              className="text-blue-400 hover:text-blue-300 font-medium"
            >
              {isLogin 
                ? "Don't have an account? Sign up" 
                : 'Already have an account? Sign in'}
            </button>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-700">
            <p className="text-xs text-gray-400 text-center">
              By continuing, you agree to our Terms of Service and Privacy Policy.
              Accounts allow you to save favorites and submit new venues.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginModal