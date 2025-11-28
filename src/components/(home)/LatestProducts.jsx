"use client"

import React, { useEffect, useState } from 'react'
import Image from 'next/image'

// NOTE: The entire useEffect logic remains exactly the same as it is already optimized.

export default function LatestProducts({ apiUrl = '/api/items?sort=newest', limit = 6 }) {
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [activeProductIndex, setActiveProductIndex] = useState(0); // For the gallery interaction

    // ... (useEffect hook and state definitions are unchanged) ...
    useEffect(() => {
        let mounted = true
        const controller = new AbortController()

        async function fetchLatest() {
            setLoading(true)
            setError(null)
            try {
                const separator = apiUrl.includes('?') ? '&' : '?';
                const res = await fetch(`${apiUrl}${separator}limit=${encodeURIComponent(limit)}`, { signal: controller.signal })

                if (!res.ok) throw new Error(`Fetch error: ${res.status}`)
                const data = await res.json()

                if (!mounted) return

                const productsArray = data.success ? data.data : data;

                if (!Array.isArray(productsArray)) throw new Error('API did not return an array')
                setProducts(productsArray)
            } catch (err) {
                if (err.name === 'AbortError') return
                console.error(err)
                setError(err.message || 'Unknown error')
            } finally {
                if (mounted) setLoading(false)
            }
        }

        fetchLatest()

        return () => {
            mounted = false
            controller.abort()
        }
    }, [apiUrl, limit])


    const handleDetailsClick = (productName) => {
        console.log(`View Details clicked for: ${productName}`);
        // Navigate to product page
    };

    // Derived state for the currently active (showcased) product
    const featuredProduct = products[activeProductIndex];

    return (
        <section className="max-w-7xl mx-auto px-6 py-16">
            
            {/* Header */}
            <div className="text-center mb-12">
                <h2 className="text-5xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight leading-tight">
                    The Latest Collection
                </h2>
                <p className="mt-4 text-xl text-slate-700 dark:text-slate-400 max-w-2xl mx-auto">
                    Discover our hand-picked selection of new arrivals, designed to elevate your everyday.
                </p>
            </div>
            
            {/* State indicators */}
            {loading && (<div className="py-12 text-center text-slate-600 dark:text-slate-300 text-lg">Loading the exclusive collection…</div>)}
            {error && (<div className="py-8 text-center text-rose-500 text-lg">Error loading products: **{error}**</div>)}
            {!loading && !error && products.length === 0 && (<div className="py-8 text-center text-slate-600 dark:text-slate-400 text-lg">No exciting new products to show yet.</div>)}

            
            {/* Main Showcase & Gallery Layout */}
            {!loading && !error && products.length > 0 && (
                <div className="flex flex-col lg:flex-row gap-10">

                    {/* Left Side: Featured Product Showcase */}
                    {featuredProduct && (
                        <div className="lg:w-2/3 bg-white dark:bg-slate-800 rounded-3xl shadow-2xl p-6 relative flex flex-col items-center justify-center">
                            <div className="relative w-full h-96 bg-slate-100 dark:bg-slate-700 lg:h-[500px] mb-6 overflow-hidden rounded-xl">
                                {featuredProduct.image ? (
                                    <Image 
                                        src={featuredProduct.image} 
                                        alt={featuredProduct.name} 
                                        fill 
                                        className="object-contain rounded-xl transition-transform duration-500 ease-in-out hover:scale-105"
                                        sizes="(max-width: 1024px) 100vw, 66vw"
                                    />
                                ) : (
                                    <div className="h-full w-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-500 text-2xl font-semibold">New Item!</div>
                                )}
                                <span className="absolute top-4 left-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-md font-bold px-4 py-2 rounded-full shadow-lg">Featured</span>
                            </div>
                            
                            <div className="text-center">
                                <h3 className="text-4xl font-extrabold text-slate-900 dark:text-slate-100 mb-2 leading-tight">{featuredProduct.productName}</h3>
                                <p className="text-lg text-slate-600 dark:text-slate-300 line-clamp-3 max-w-md mx-auto mb-4">
                                    {featuredProduct.description || 'Experience innovation and style with our top new arrival.'}
                                </p>
                                <div className="text-5xl font-extrabold text-indigo-600 dark:text-indigo-400 mb-6">
                                    {typeof featuredProduct.price === 'number' ? `$ ${featuredProduct.price.toLocaleString()}` : featuredProduct.price}
                                </div>
                                <a 
                                    href={`/product/${featuredProduct.slug || featuredProduct._id}`} 
                                    className="inline-flex items-center justify-center px-10 py-4 border border-transparent text-xl font-semibold rounded-full shadow-xl text-white bg-indigo-600 hover:bg-indigo-700 transition duration-300 transform hover:scale-105"
                                    onClick={() => handleDetailsClick(featuredProduct.productName)}
                                >
                                    View Product Details →
                                </a>
                            </div>
                        </div>
                    )}

                    {/* Right Side: Product Gallery (Smaller cards for selection) */}
                    <div className="lg:w-1/3 flex flex-col space-y-6">
                        <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4 px-2 lg:px-0">More From the Collection</h3>
                        {products.map((p, index) => (
                            <div 
                                key={p._id || p.id || p.slug} 
                                className={`flex items-center space-x-4 p-4 rounded-xl cursor-pointer 
                                            transition duration-300 transform 
                                            ${index === activeProductIndex 
                                                ? 'bg-indigo-50 dark:bg-slate-700 shadow-md ring-2 ring-indigo-500 scale-[1.02]' 
                                                : 'bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/50 shadow-sm'
                                            }`}
                                onClick={() => setActiveProductIndex(index)}
                            >
                                <div className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-600">
                                    {p.image ? (
                                        <Image 
                                            src={p.image} 
                                            alt={p.name} 
                                            fill 
                                            className="object-contain"
                                            sizes="96px"
                                        />
                                    ) : (
                                        <div className="h-full w-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-xs text-slate-500">Img</div>
                                    )}
                                </div>
                                <div className="flex-grow">
                                    <h4 className="font-semibold text-lg text-slate-900 dark:text-slate-100 truncate text-wrap">{p.productName}</h4>
                                    <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-1">{p.short || ''}</p>
                                    <p className="text-md font-bold text-indigo-600 dark:text-indigo-400 mt-1">
                                        {typeof p.price === 'number' ? `৳ ${p.price.toLocaleString()}` : p.price}
                                    </p>
                                </div>
                            </div>
                        ))}
                         <a 
                            href="/shop" 
                            className="mt-8 mx-auto w-full lg:w-auto text-center px-6 py-3 border border-indigo-600 dark:border-indigo-400 text-indigo-600 dark:text-indigo-400 text-md font-semibold rounded-full hover:bg-indigo-50 dark:hover:bg-slate-700 transition duration-300"
                        >
                            View All Products →
                        </a>
                    </div>
                </div>
            )}
        </section>
    )
}