import { FaHeart, FaGithub } from 'react-icons/fa'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="fixed bottom-0 left-0 right-0 z-30 bg-gray-900 bg-opacity-80 backdrop-blur-sm border-t border-gray-800 py-3 px-4">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between">
        <div className="text-gray-400 text-sm mb-2 md:mb-0">
          <span className="hidden sm:inline">
            Dayton Nightlife Map &copy; {currentYear} • 
          </span>
          <span className="sm:ml-1">
            Made with <FaHeart className="inline text-red-400 mx-1" /> in Dayton, OH
          </span>
        </div>
        
        <div className="flex items-center space-x-6">
          <a
            href="/privacy"
            className="text-gray-400 hover:text-white text-sm transition-colors"
          >
            Privacy Policy
          </a>
          
          <a
            href="/terms"
            className="text-gray-400 hover:text-white text-sm transition-colors"
          >
            Terms of Service
          </a>
          
          <a
            href="https://github.com/yourusername/dayton-nightlife-map"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-white text-sm transition-colors flex items-center"
          >
            <FaGithub className="mr-1" />
            <span>Open Source</span>
          </a>
          
          <a
            href="/contact"
            className="text-gray-400 hover:text-white text-sm transition-colors"
          >
            Contact
          </a>
        </div>
      </div>
      
      <div className="text-center mt-2">
        <div className="text-xs text-gray-500">
          This project is open source. Contributions welcome! Data from OpenStreetMap & user submissions.
        </div>
        <div className="text-xs text-gray-600 mt-1">
          Version 1.0.0 • Not affiliated with Yelp, Google, or TripAdvisor
        </div>
      </div>
    </footer>
  )
}

export default Footer