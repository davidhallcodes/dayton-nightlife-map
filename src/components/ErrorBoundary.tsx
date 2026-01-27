import { Component, ErrorInfo, ReactNode } from 'react'
import { FaExclamationTriangle, FaRedo, FaHome } from 'react-icons/fa'
import ReactGA from 'react-ga4'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    }
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null
    }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo
    })

    // Log error to Google Analytics
    ReactGA.event({
      category: 'error',
      action: 'error_boundary_caught',
      label: error.message,
      value: 0,
    })

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('ErrorBoundary caught an error:', error, errorInfo)
    }
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    })
  }

  handleGoHome = () => {
    window.location.href = '/'
  }

  handleReload = () => {
    window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-gray-800 rounded-2xl shadow-2xl border border-gray-700 p-8 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-red-900 bg-opacity-20 rounded-full mb-6">
              <FaExclamationTriangle className="text-red-400 text-4xl" />
            </div>
            
            <h1 className="text-2xl font-bold text-white mb-3">
              Something went wrong
            </h1>
            
            <p className="text-gray-400 mb-6">
              We apologize for the inconvenience. An error has occurred in the application.
            </p>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="mb-6 text-left">
                <details className="bg-gray-900 rounded-lg p-4">
                  <summary className="text-red-400 font-medium cursor-pointer mb-2">
                    Error Details (Development Only)
                  </summary>
                  <pre className="text-xs text-gray-300 whitespace-pre-wrap mt-2">
                    {this.state.error.toString()}
                  </pre>
                  {this.state.errorInfo && (
                    <pre className="text-xs text-gray-400 whitespace-pre-wrap mt-2">
                      {this.state.errorInfo.componentStack}
                    </pre>
                  )}
                </details>
              </div>
            )}

            <div className="space-y-3">
              <button
                onClick={this.handleReset}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-semibold flex items-center justify-center space-x-2 transition-colors"
              >
                <FaRedo />
                <span>Try Again</span>
              </button>
              
              <button
                onClick={this.handleReload}
                className="w-full bg-gray-700 hover:bg-gray-600 text-white py-3 px-4 rounded-lg font-medium flex items-center justify-center space-x-2 transition-colors"
              >
                <FaRedo />
                <span>Reload Page</span>
              </button>
              
              <button
                onClick={this.handleGoHome}
                className="w-full bg-gray-800 hover:bg-gray-700 text-white py-3 px-4 rounded-lg font-medium flex items-center justify-center space-x-2 transition-colors border border-gray-700"
              >
                <FaHome />
                <span>Go to Homepage</span>
              </button>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-700">
              <p className="text-sm text-gray-500">
                If the problem persists, please contact support.
              </p>
              <button
                onClick={() => window.location.href = 'mailto:support@example.com'}
                className="text-blue-400 hover:text-blue-300 text-sm mt-2"
              >
                Contact Support
              </button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary