import { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { load } from '@cashfreepayments/cashfree-js'

const domainNames = {
  'web-development': 'Web Development',
  'app-development': 'App Development',
  'ai-ml': 'AI / Machine Learning',
  'data-science': 'Data Science',
  'cybersecurity': 'Cybersecurity',
  'cloud-computing': 'Cloud Computing'
}

const passoutYears = ['2024', '2025', '2026', '2027', '2028']

// ================== CONFIGURATION ==================
// Your backend API URL (for production, set this in Vercel env vars)
const API_URL = import.meta.env.VITE_API_URL || ''

const AMOUNT = 1999

function Apply() {
  const { domain } = useParams()
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    passoutYear: '',
    college: '',
    skills: '',
    whyInternship: '',
    resume: null
  })

  const [applicationId, setApplicationId] = useState(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    setError('')
  }

  const handleFileChange = (e) => {
    const { name, files } = e.target
    if (files[0]) {
      setFormData(prev => ({ ...prev, [name]: files[0] }))
      setError('')
    }
  }

  const validateStep1 = () => {
    const { name, email, phone, passoutYear, college, whyInternship } = formData
    if (!name || !email || !phone || !passoutYear || !college || !whyInternship) {
      setError('Please fill all required fields')
      return false
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address')
      return false
    }
    if (!/^\d{10}$/.test(phone)) {
      setError('Please enter a valid 10-digit phone number')
      return false
    }
    return true
  }

  const validateStep2 = () => {
    if (!formData.resume) {
      setError('Please upload your resume')
      return false
    }
    if (formData.resume.type !== 'application/pdf') {
      setError('Resume must be a PDF file')
      return false
    }
    return true
  }

  const handleNext = () => {
    if (step === 1 && validateStep1()) {
      setStep(2)
    } else if (step === 2 && validateStep2()) {
      setStep(3)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (step === 3) {
      handlePayment()
    }
  }

  const handlePayment = async () => {
    setLoading(true)
    setError('')

    try {
      // 1. Create order
      const orderResponse = await fetch(`${API_URL}/api/payment/create-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            amount: AMOUNT
        })
      });
      
      const orderData = await orderResponse.json();
      
      if (!orderResponse.ok) {
        throw new Error(orderData.message || 'Could not initiate payment');
      }

      // 2. Load SDK
      const cashfree = await load({ mode: "sandbox" });

      // 3. Open Checkout
      cashfree.checkout({
          paymentSessionId: orderData.payment_session_id,
          redirectTarget: "_modal",
      }).then(async (result) => {
          if (result.error) {
              setError(result.error.message);
              setLoading(false);
          } else if (result.redirect) {
              console.log("Payment will be redirected");
          } else {
             // 4. Verification
             verifyAndSubmit(orderData.order_id, orderData.payment_session_id);
          }
      });
    } catch (err) {
      setError(err.message || 'Failed to process payment. Please try again.')
      setLoading(false)
    }
  }

  const verifyAndSubmit = async (orderId, paymentSessionId) => {
      try {
          const verifyResponse = await fetch(`${API_URL}/api/payment/verify`, {
             method: 'POST',
             headers: { 'Content-Type': 'application/json' },
             body: JSON.stringify({ orderId })
          });
          const verifyData = await verifyResponse.json();
          
          if(verifyResponse.ok && verifyData.verified) {
             submitApplication(orderId, paymentSessionId);
          } else {
             setError('Payment verification failed or pending. If amount was deducted, please contact support.');
             setLoading(false);
          }
      } catch (err) {
          setError('Error verifying payment. ' + err.message);
          setLoading(false);
      }
  };

  const submitApplication = async (orderId, paymentSessionId) => {
    try {
      const submitData = new FormData()
      submitData.append('name', formData.name)
      submitData.append('email', formData.email)
      submitData.append('phone', formData.phone)
      submitData.append('passoutYear', formData.passoutYear)
      submitData.append('college', formData.college)
      submitData.append('domain', domainNames[domain] || domain)
      submitData.append('skills', formData.skills)
      submitData.append('whyInternship', formData.whyInternship)
      submitData.append('resume', formData.resume)
      submitData.append('cashfreeOrderId', orderId)
      submitData.append('paymentSessionId', paymentSessionId)

      const response = await fetch(`${API_URL}/api/apply`, {
        method: 'POST',
        body: submitData
      })

      const data = await response.json()

      if (response.ok) {
        setApplicationId(data.applicationId)
        navigate('/success')
      } else {
        setError(data.message || 'Something went wrong')
        setLoading(false)
      }
    } catch (err) {
      setError('Failed to submit application. Please try again.')
      console.error(err)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <Link to="/" className="inline-flex items-center gap-2 text-slate-600 hover:text-indigo-600 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="font-medium">Back to Home</span>
          </Link>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Domain Badge */}
        <div className="mb-6">
          <span className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 px-4 py-1.5 rounded-full text-sm font-medium">
            <span className="w-2 h-2 bg-indigo-500 rounded-full" />
            {domainNames[domain] || domain}
          </span>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {[
            { num: 1, label: 'Details' },
            { num: 2, label: 'Resume' },
            { num: 3, label: 'Payment' }
          ].map((s) => (
            <div key={s.num} className="flex items-center">
              <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${step >= s.num
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 text-slate-500'
                }`}>
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${step >= s.num ? 'bg-white/20' : 'bg-slate-200'
                  }`}>
                  {s.num}
                </span>
                <span className="hidden sm:inline">{s.label}</span>
              </div>
              {s.num < 3 && (
                <div className={`w-8 h-0.5 ${step > s.num ? 'bg-indigo-600' : 'bg-slate-200'}`} />
              )}
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
          {/* Step 1: Personal Details */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900 mb-1">Personal Details</h2>
                <p className="text-sm text-slate-500">Tell us about yourself</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your.email@gmail.com"
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Contact Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="9876543210"
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Passout Year <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="passoutYear"
                    value={formData.passoutYear}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all bg-white"
                    required
                  >
                    <option value="">Select Year</option>
                    {passoutYears.map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    College Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="college"
                    value={formData.college}
                    onChange={handleChange}
                    placeholder="Your college name"
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Skills (Optional)
                  </label>
                  <input
                    type="text"
                    name="skills"
                    value={formData.skills}
                    onChange={handleChange}
                    placeholder="React, Python, SQL, etc."
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Why do you want this internship? <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="whyInternship"
                    value={formData.whyInternship}
                    onChange={handleChange}
                    placeholder="Tell us about your interest in this domain..."
                    rows={4}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all resize-none"
                    required
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Resume Upload */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900 mb-1">Upload Resume</h2>
                <p className="text-sm text-slate-500">Upload your resume in PDF format</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Resume (PDF) <span className="text-red-500">*</span>
                </label>
                <div className="border-2 border-dashed border-slate-300 rounded-2xl p-12 text-center hover:border-indigo-400 hover:bg-indigo-50/50 transition-all cursor-pointer">
                  <input
                    type="file"
                    name="resume"
                    accept=".pdf"
                    onChange={handleFileChange}
                    className="hidden"
                    id="resume-upload"
                  />
                  <label htmlFor="resume-upload" className="cursor-pointer">
                    {formData.resume ? (
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center">
                          <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">{formData.resume.name}</p>
                          <p className="text-sm text-slate-500">Click to change file</p>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="w-20 h-20 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                          <svg className="w-10 h-10 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2-2H7a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V8a2 2 0 00-2-2h-2M9 4v4a2 2 0 002 2h4a2 2 0 002-2V4H9z" />
                          </svg>
                        </div>
                        <p className="text-slate-700 font-medium mb-1">Click to upload resume</p>
                        <p className="text-sm text-slate-500">PDF format, max 10MB</p>
                      </>
                    )}
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Payment */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900 mb-1">Complete Payment</h2>
                <p className="text-sm text-slate-500">Secure payment via Cashfree</p>
              </div>

              <div className="bg-gradient-to-br from-indigo-50 to-violet-50 rounded-2xl p-6 border border-indigo-100">
                <div className="flex flex-col items-center gap-4 text-center">
                  <div className="w-16 h-16 bg-white rounded-2xl border border-indigo-100 flex items-center justify-center shadow-sm">
                    <svg className="w-8 h-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">Application Fee</h3>
                    <p className="text-3xl font-bold text-indigo-600 my-2">₹{AMOUNT}</p>
                    <p className="text-sm text-slate-500">
                      You will be redirected to Cashfree to complete your payment securely.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex gap-4 mt-8">
            {step > 1 && (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="flex-1 px-6 py-3.5 border border-slate-300 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 transition-colors"
              >
                Back
              </button>
            )}
            {step < 3 ? (
              <button
                type="button"
                onClick={handleNext}
                className="flex-1 px-6 py-3.5 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/25"
              >
                Continue
              </button>
            ) : (
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-6 py-3.5 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Submitting...
                  </>
                ) : (
                  <>
                    {step === 3 ? `Pay ₹${AMOUNT} Now` : 'Submit Application'}
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </>
                )}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}

export default Apply