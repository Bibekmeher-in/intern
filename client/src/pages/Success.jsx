import { Link } from 'react-router-dom'

function Success() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-violet-50 flex items-center justify-center">
      <div className="max-w-lg mx-auto px-4 text-center">
        {/* Success Animation */}
        <div className="mb-8">
          <div className="w-28 h-28 mx-auto bg-gradient-to-br from-indigo-100 to-violet-100 rounded-full flex items-center justify-center animate-scale-in shadow-lg shadow-indigo-600/10">
            <svg
              className="w-14 h-14 text-indigo-600 animate-checkmark"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              style={{ strokeDasharray: 100, strokeDashoffset: 100 }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>

        {/* Message */}
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          Registration Successful!
        </h1>
        
        <p className="text-slate-600 mb-8 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
          Your application has been submitted successfully. Our team will verify your payment and contact you within 24-48 hours.
        </p>

        {/* Application Info Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-8 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          <div className="flex items-center justify-center gap-2 text-slate-500 mb-4">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-medium">What's Next?</span>
          </div>
          <ul className="text-left space-y-3">
            {[
              'Check your email for confirmation',
              'Our team will verify your payment',
              'You\'ll receive an internship offer email'
            ].map((item, index) => (
              <li key={index} className="flex items-start gap-3">
                <div className="w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-medium text-indigo-600">{index + 1}</span>
                </div>
                <span className="text-slate-600">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Home Button */}
        <Link
          to="/"
          className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/25 animate-fade-in-up"
          style={{ animationDelay: '0.5s' }}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          Back to Home
        </Link>
      </div>
    </div>
  )
}

export default Success