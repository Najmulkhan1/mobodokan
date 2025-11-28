"use client"

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Phone, MapPin, Send, Loader2 } from 'lucide-react'

// Main component, must be the default export
export default function App() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' })
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle') // 'idle' | 'sending' | 'success' | 'error'

  /**
   * Client-side form validation.
   */
  function validate() {
    const e = {}
    if (!form.name.trim()) e.name = 'Please enter your name.'
    if (!form.email.trim()) e.email = 'Please enter your email.'
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = 'Please enter a valid email.'
    if (!form.message.trim()) e.message = 'Please enter a message.'
    // Subject validation check moved here to ensure it uses the correct 'e' object
    if (form.subject && form.subject.length > 120) e.subject = 'Subject must be 120 characters or less.'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  /**
   * Handles form submission. Note: The fetch call is mocked as the actual API endpoint isn't provided.
   */
  async function handleSubmit(e) {
    e.preventDefault()
    if (!validate()) return

    setStatus('sending')

    try {
      // --- MOCK API CALL FOR DEMONSTRATION ---
      // In a real application, replace this mock with your actual fetch call.
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network latency

      // Check for successful status (mocked success 90% of the time)
      const mockSuccess = Math.random() > 0.1;

      if (mockSuccess) {
        setStatus('success')
        setForm({ name: '', email: '', phone: '', subject: '', message: '' })
        setErrors({})
      } else {
         throw new Error('Simulated server error');
      }

    } catch (err) {
      console.error("Submission failed:", err)
      setStatus('error')
    }
  }
  
  // Custom Input Component for cleaner JSX
  const InputField = ({ label, name, type = 'text', placeholder, optional = false }) => (
    <label className="flex flex-col">
        <span className="text-sm font-medium">{label} {optional && <span className="text-xs text-slate-500 dark:text-slate-400">(optional)</span>}</span>
        <input
            type={type}
            value={form[name]}
            onChange={(e) => setForm((f) => ({ ...f, [name]: e.target.value }))}
            className={`mt-2 px-3 py-2 rounded-lg border focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ${errors[name] ? 'border-rose-500 focus:border-rose-500' : 'border-slate-200 dark:border-slate-700'} bg-transparent dark:text-slate-100`}
            placeholder={placeholder}
        />
        {errors[name] && <span className="text-rose-500 text-xs mt-1">{errors[name]}</span>}
    </label>
  )

  return (
    <main className="min-h-screen py-16 bg-gradient-to-b from-slate-50 dark:from-slate-950 to-white dark:to-slate-900 font-[Inter] text-slate-900 dark:text-slate-100">
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        <motion.header
          initial={{ y: 8, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <h1 className="text-4xl sm:text-5xl font-extrabold text-center text-indigo-700 dark:text-indigo-400">
            Get in Touch
          </h1>
          <p className="mt-4 text-lg text-center text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Questions about repairs, parts, or reviews? Send us a message and we’ll reply within 1–2 business days.
          </p>
          <div className="mt-6 flex justify-center items-center gap-6 text-sm text-slate-600 dark:text-slate-400">
            <a href="tel:+880123456789" className="inline-flex items-center gap-2 hover:text-indigo-600 dark:hover:text-indigo-400 transition">
              <Phone size={16} /> <span>+880 1XX-XXX-XXXX</span>
            </a>
            <a href="mailto:support@mobodokan.example" className="inline-flex items-center gap-2 hover:text-indigo-600 dark:hover:text-indigo-400 transition">
              <Mail size={16} /> <span>support@mobodokan.example</span>
            </a>
          </div>
        </motion.header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact info / Sidebar */}
          <motion.aside
            initial={{ x: -10, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-1 p-8 rounded-3xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-xl dark:shadow-2xl shadow-indigo-100/50"
          >
            <h3 className="font-bold text-2xl mb-6 text-indigo-700 dark:text-indigo-400">Our Details</h3>
            <div className="space-y-6 text-base text-slate-700 dark:text-slate-300">
              {/* Location */}
              <div className="flex items-start gap-4">
                <MapPin className="mt-1 text-indigo-500 flex-shrink-0" size={24} />
                <div>
                  <div className="font-semibold text-lg">Head Office</div>
                  <div className="text-sm">Street 123, Block A, Dhaka, Bangladesh</div>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start gap-4">
                <Phone className="mt-1 text-indigo-500 flex-shrink-0" size={24} />
                <div>
                  <div className="font-semibold text-lg">Call Us</div>
                  <a href="tel:+880123456789" className="text-sm hover:text-indigo-600 dark:hover:text-indigo-400">+880 1XX-XXX-XXXX (Mon-Fri, 9am - 5pm)</a>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-4">
                <Mail className="mt-1 text-indigo-500 flex-shrink-0" size={24} />
                <div>
                  <div className="font-semibold text-lg">Email Support</div>
                  <a href="mailto:support@mobodokan.example" className="text-sm hover:text-indigo-600 dark:hover:text-indigo-400">support@mobodokan.example</a>
                </div>
              </div>
            </div>

            <div className="pt-8 mt-8 border-t border-slate-200 dark:border-slate-700">
              <a href="/faq" className="text-sm text-indigo-600 dark:text-indigo-400 font-medium hover:underline flex items-center gap-1">
                Visit our FAQ for quick answers →
              </a>
            </div>
          </motion.aside>

          {/* Form */}
          <motion.form
            onSubmit={handleSubmit}
            initial={{ x: 10, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="lg:col-span-2 p-8 rounded-3xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-xl dark:shadow-2xl"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <InputField label="Name" name="name" placeholder="Your name" />
              <InputField label="Email" name="email" type="email" placeholder="you@example.com" />
              <InputField label="Phone" name="phone" placeholder="Optional phone number" optional={true} />
              
              <label className="flex flex-col">
                <span className="text-sm font-medium">Subject <span className="text-xs text-slate-500 dark:text-slate-400">(optional)</span></span>
                <input
                    value={form.subject}
                    onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))}
                    className={`mt-2 px-3 py-2 rounded-lg border focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ${errors.subject ? 'border-rose-500 focus:border-rose-500' : 'border-slate-200 dark:border-slate-700'} bg-transparent dark:text-slate-100`}
                    placeholder="Short subject"
                />
                {errors.subject && <span className="text-rose-500 text-xs mt-1">{errors.subject}</span>}
              </label>
            </div>

            <label className="flex flex-col mt-6">
              <span className="text-sm font-medium">Message</span>
              <textarea
                value={form.message}
                onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                rows={6}
                className={`mt-2 px-3 py-2 rounded-lg border focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ${errors.message ? 'border-rose-500 focus:border-rose-500' : 'border-slate-200 dark:border-slate-700'} bg-transparent dark:text-slate-100`}
                placeholder="How can we help you?"
              />
              {errors.message && <span className="text-rose-500 text-xs mt-1">{errors.message}</span>}
            </label>

            <div className="mt-8 flex items-center gap-4 flex-wrap">
              <button
                type="submit"
                disabled={status === 'sending'}
                className="inline-flex items-center justify-center min-w-[150px] gap-2 bg-indigo-600 text-white font-semibold tracking-wide px-6 py-3 rounded-xl shadow-lg shadow-indigo-500/50 hover:bg-indigo-700 transition duration-300 disabled:opacity-60 disabled:cursor-not-allowed transform hover:scale-[1.01] active:scale-[0.99]"
              >
                {status === 'sending' ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <Send size={20} />
                )}
                <span>{status === 'sending' ? 'Sending...' : 'Send Message'}</span>
              </button>

              {status === 'success' && (
                <div className="text-base text-green-500 font-medium flex items-center gap-1.5">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    Thanks! We received your message.
                </div>
              )}
              {status === 'error' && (
                <div className="text-base text-rose-500 font-medium flex items-center gap-1.5">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    Something went wrong. Please try again.
                </div>
              )}
            </div>

            <div className="mt-8 text-xs text-slate-500 dark:text-slate-400">
              By sending a message you agree to our <a href="/privacy" className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium">privacy policy</a>.
            </div>
          </motion.form>
        </div>
      </div>
    </main>
  )
}