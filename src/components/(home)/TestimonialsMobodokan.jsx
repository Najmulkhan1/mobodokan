"use client"

import React, { useEffect, useState, useRef } from 'react'



import { motion } from 'framer-motion'
import { Star } from 'lucide-react'

export default function TestimonialsMobodokan({ autoRotate = true, rotateInterval = 6000 }) {
    const [testimonials, setTestimonials] = useState([])
    const [loading, setLoading] = useState(true)
    const [index, setIndex] = useState(0)
    const timerRef = useRef(null)

    useEffect(() => {
        async function fetchReviews() {
            try {
                const res = await fetch('/api/reviews')
                const data = await res.json()
                if (data.success && Array.isArray(data.data) && data.data.length > 0) {
                    const formatted = data.data.map(r => ({
                        id: r._id,
                        name: r.userName || 'Anonymous',
                        role: 'Verified Customer',
                        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(r.userName || 'User')}&background=random`,
                        rating: r.rating,
                        quote: r.comment
                    }))
                    setTestimonials(formatted)
                } else {
                    setTestimonials([])
                }
            } catch (err) {
                console.error('Failed to fetch testimonials', err)
            } finally {
                setLoading(false)
            }
        }
        fetchReviews()
    }, [])

    useEffect(() => {
        if (!autoRotate || testimonials.length === 0) return
        timerRef.current = setInterval(() => {
            setIndex((i) => (i + 1) % testimonials.length)
        }, rotateInterval)
        return () => clearInterval(timerRef.current)
    }, [autoRotate, rotateInterval, testimonials.length])

    function goPrev() {
        if (testimonials.length === 0) return
        setIndex((i) => (i - 1 + testimonials.length) % testimonials.length)
        if (autoRotate) resetTimer()
    }

    function goNext() {
        if (testimonials.length === 0) return
        setIndex((i) => (i + 1) % testimonials.length)
        if (autoRotate) resetTimer()
    }

    function resetTimer() {
        if (timerRef.current) clearInterval(timerRef.current)
        timerRef.current = setInterval(() => {
            setIndex((i) => (i + 1) % testimonials.length)
        }, rotateInterval)
    }

    if (loading) {
        return <div className="py-20 text-center text-slate-500">Loading testimonials...</div>
    }

    if (testimonials.length === 0) {
        return (
            <section className="max-w-6xl mx-auto px-6 py-12 text-center">
                <h2 className="text-3xl font-extrabold mb-4">What our customers say</h2>
                <p className="text-slate-500">No reviews yet. Be the first to review a product!</p>
            </section>
        )
    }

    const active = testimonials[index]

    return (
        <section className="max-w-6xl mx-auto px-6 py-12">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-extrabold">What our customers say</h2>
                <p className="mt-2 text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">Real feedback from people who bought parts, used our repair guides, or got device support.</p>
            </div>

            <div className="relative bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm p-6 md:p-10">
                <div className="flex flex-col md:flex-row items-center gap-6">
                    <div className="w-28 h-28 rounded-full overflow-hidden bg-slate-100 dark:bg-slate-700 flex-shrink-0 relative">
                        <img src={active.avatar} alt={active.name} className="w-28 h-28 object-cover" />
                    </div>

                    <div className="flex-1">
                        <motion.blockquote
                            key={active.id}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4 }}
                            className="text-lg md:text-xl text-slate-900 dark:text-slate-100 leading-relaxed"
                        >
                            “{active.quote}”
                        </motion.blockquote>

                        <div className="mt-4 flex items-center justify-between gap-4">
                            <div>
                                <div className="font-semibold text-slate-900 dark:text-slate-100">{active.name}</div>
                                <div className="text-sm text-slate-500 dark:text-slate-400">{active.role}</div>
                            </div>

                            <div className="flex items-center gap-1">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <Star key={i} size={16} className={i < active.rating ? 'text-yellow-500' : 'text-slate-300 dark:text-slate-600'} />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Controls */}
                <div className="absolute left-4 top-1/2 -translate-y-1/2">
                    <button onClick={goPrev} aria-label="Previous testimonial" className="p-2 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm hover:brightness-95">
                        ‹
                    </button>
                </div>

                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                    <button onClick={goNext} aria-label="Next testimonial" className="p-2 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm hover:brightness-95">
                        ›
                    </button>
                </div>

                {/* Dots */}
                <div className="mt-6 flex items-center justify-center gap-2">
                    {testimonials.map((t, i) => (
                        <button
                            key={t.id}
                            onClick={() => { setIndex(i); if (autoRotate) resetTimer() }}
                            aria-label={`Show testimonial ${i + 1}`}
                            className={`w-2 h-2 rounded-full ${i === index ? 'bg-indigo-600 dark:bg-indigo-400' : 'bg-slate-300 dark:bg-slate-600'}`}
                        />
                    ))}
                </div>
            </div>
        </section>
    )
}
