import { renderHook, act } from '@testing-library/react'
import { AuthProvider, useAuth } from '../../context/AuthContext'

// Mock Supabase
jest.mock('../../services/supabase', () => ({
  supabase: {
    auth: {
      getSession: jest.fn().mockResolvedValue({
        data: { session: null },
        error: null
      }),
      signUp: jest.fn(),
      signInWithPassword: jest.fn(),
      signOut: jest.fn(),
      onAuthStateChange: jest.fn().mockReturnValue({
        data: { subscription: { unsubscribe: jest.fn() } }
      })
    },
    from: jest.fn().mockReturnValue({
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          single: jest.fn().mockResolvedValue({
            data: null,
            error: null
          })
        })
      }),
      insert: jest.fn().mockReturnValue({
        error: null
      })
    })
  }
}))

describe('useAuth', () => {
  const wrapper = ({ children }) => (
    <AuthProvider>{children}</AuthProvider>
  )

  it('provides auth context', () => {
    const { result } = renderHook(() => useAuth(), { wrapper })
    
    expect(result.current).toHaveProperty('user')
    expect(result.current).toHaveProperty('profile')
    expect(result.current).toHaveProperty('signUp')
    expect(result.current).toHaveProperty('signIn')
    expect(result.current).toHaveProperty('signOut')
  })
})