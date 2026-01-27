// Simple analytics service for tracking user interactions
// For production, consider using Google Analytics, Plausible, or similar

class AnalyticsService {
  constructor() {
    this.events = []
    this.isEnabled = process.env.NODE_ENV === 'production'
    this.sessionId = this.generateSessionId()
    this.startTime = Date.now()
  }

  generateSessionId() {
    return 'session_' + Math.random().toString(36).substr(2, 9)
  }

  track(eventName, properties = {}) {
    if (!this.isEnabled) return

    const event = {
      event: eventName,
      properties: {
        ...properties,
        session_id: this.sessionId,
        timestamp: new Date().toISOString(),
        user_agent: navigator.userAgent,
        screen_resolution: `${window.screen.width}x${window.screen.height}`,
        language: navigator.language,
        url: window.location.href
      }
    }

    this.events.push(event)
    this.sendToServer(event)
    
    // Also log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Analytics] ${eventName}:`, properties)
    }
  }

  async sendToServer(event) {
    try {
      // Send to your analytics endpoint
      // For now, we'll just log it
      console.log('Analytics event:', event)
      
      // Example with Supabase:
      // await supabase.from('analytics_events').insert(event)
    } catch (error) {
      console.error('Failed to send analytics:', error)
    }
  }

  // Page views
  trackPageView(pageName) {
    this.track('page_view', { page: pageName })
  }

  // User actions
  trackMapInteraction(action, properties = {}) {
    this.track('map_interaction', { action, ...properties })
  }

  trackPOIClick(poiId, poiName) {
    this.track('poi_click', { poi_id: poiId, poi_name: poiName })
  }

  trackSearch(query, resultsCount) {
    this.track('search', { query, results_count: resultsCount })
  }

  trackFilterChange(activeFilters) {
    this.track('filter_change', { active_filters: activeFilters })
  }

  trackDirectionsRequest(from, to, mode) {
    this.track('directions_request', { from, to, mode })
  }

  // Auth events
  trackSignUp(method) {
    this.track('sign_up', { method })
  }

  trackSignIn(method) {
    this.track('sign_in', { method })
  }

  trackSignOut() {
    const sessionDuration = Date.now() - this.startTime
    this.track('sign_out', { session_duration: sessionDuration })
  }

  // POI submission
  trackPOISubmission(poiData) {
    this.track('poi_submission', poiData)
  }

  trackPOIApproval(poiId, action) {
    this.track('poi_approval', { poi_id: poiId, action })
  }

  // Error tracking
  trackError(error, context = {}) {
    this.track('error', {
      error_message: error.message,
      error_stack: error.stack,
      ...context
    })
  }

  // Performance metrics
  trackPerformance(metricName, value) {
    this.track('performance', { metric: metricName, value })
  }

  // Get session summary
  getSessionSummary() {
    const duration = Date.now() - this.startTime
    const eventCount = this.events.length
    
    return {
      session_id: this.sessionId,
      duration,
      event_count: eventCount,
      start_time: new Date(this.startTime).toISOString(),
      end_time: new Date().toISOString()
    }
  }

  // Flush all events to server
  async flush() {
    if (this.events.length === 0) return
    
    try {
      // Send batch of events
      const summary = this.getSessionSummary()
      const batch = {
        session_summary: summary,
        events: [...this.events]
      }
      
      // Reset
      this.events = []
      this.sessionId = this.generateSessionId()
      this.startTime = Date.now()
      
      return batch
    } catch (error) {
      console.error('Failed to flush analytics:', error)
    }
  }
}

// Create singleton instance
const analytics = new AnalyticsService()

// Auto-flush when page is unloaded
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    analytics.flush()
  })
  
  // Track page view on initial load
  analytics.trackPageView('home')
}

export default analytics