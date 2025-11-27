'use client';
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import useAuth from '@/hooks/useAuth';

export default function ProductDetails() {
    const { id } = useParams();
    const router = useRouter();
    const { user } = useAuth();
    const [product, setProduct] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Review form state
    const [reviewForm, setReviewForm] = useState({
        rating: 5,
        comment: ''
    });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (!id) return;

        const fetchData = async () => {
            try {
                // Fetch product
                const productRes = await fetch(`/api/items/${id}`);
                const productData = await productRes.json();

                if (productData.success) {
                    setProduct(productData.data);

                    // Fetch reviews
                    const reviewsRes = await fetch(`/api/reviews?productId=${id}`);
                    const reviewsData = await reviewsRes.json();

                    if (reviewsData.success) {
                        setReviews(reviewsData.data);
                    }
                } else {
                    setError(productData.error || 'Failed to load product');
                }
            } catch (err) {
                console.error('Error fetching data:', err);
                setError('An unexpected error occurred');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const response = await fetch('/api/reviews', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    productId: id,
                    userName: user?.displayName || user?.email || 'Anonymous',
                    userEmail: user?.email,
                    ...reviewForm
                }),
            });

            const data = await response.json();

            if (data.success) {
                // Add new review to the list (real-time update)
                setReviews([data.data, ...reviews]);
                // Reset form
                setReviewForm({ rating: 5, comment: '' });
            } else {
                alert('Failed to submit review: ' + data.error);
            }
        } catch (error) {
            console.error('Review submission error:', error);
            alert('Failed to submit review');
        } finally {
            setSubmitting(false);
        }
    };

    const renderStars = (rating, interactive = false, onRate = null) => {
        return (
            <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        type={interactive ? "button" : undefined}
                        onClick={() => interactive && onRate && onRate(star)}
                        className={`text-2xl ${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : ''} ${star <= rating ? 'text-warning' : 'text-base-300'
                            }`}
                        disabled={!interactive}
                    >
                        ★
                    </button>
                ))}
            </div>
        );
    };

    const calculateAverageRating = () => {
        if (reviews.length === 0) return 0;
        const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
        return (sum / reviews.length).toFixed(1);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex justify-center items-center bg-base-100">
                <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex flex-col justify-center items-center gap-4 bg-base-100">
                <h2 className="text-3xl font-bold text-error">Oops!</h2>
                <p className="text-lg text-base-content/70">{error}</p>
                <button className="btn btn-outline btn-primary" onClick={() => router.back()}>Go Back</button>
            </div>
        );
    }

    if (!product) return null;

    return (
        <div className="min-h-screen bg-base-100 py-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Breadcrumbs */}
                <div className="text-sm breadcrumbs mb-8 text-base-content/60">
                    <ul>
                        <li><Link href="/">Home</Link></li>
                        <li><Link href="/products">Products</Link></li>
                        {product.category && <li><Link href={`/products?category=${product.category}`}>{product.category}</Link></li>}
                        <li className="font-semibold text-primary truncate max-w-xs">{product.productName}</li>
                    </ul>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 mb-16">
                    {/* Left Column: Image */}
                    <div className="relative group">
                        <div className="aspect-square bg-base-200/50 rounded-3xl overflow-hidden flex items-center justify-center p-8 shadow-inner">
                            <img
                                src="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp"
                                alt={product.productName}
                                className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110"
                            />
                        </div>
                        {product.stock > 0 && product.stock < 10 && (
                            <div className="absolute top-6 right-6 badge badge-warning gap-2 p-3 font-bold shadow-lg">
                                Low Stock
                            </div>
                        )}
                    </div>

                    {/* Right Column: Details */}
                    <div className="flex flex-col justify-center">
                        <div className="badge badge-secondary badge-outline mb-4 text-xs font-bold tracking-widest uppercase">
                            {product.brand}
                        </div>

                        <h1 className="text-4xl sm:text-5xl font-extrabold text-base-content mb-4 leading-tight">
                            {product.productName}
                        </h1>

                        {/* Rating Summary */}
                        <div className="flex items-center gap-3 mb-6">
                            {renderStars(Math.round(calculateAverageRating()))}
                            <span className="text-lg font-semibold">{calculateAverageRating()}</span>
                            <span className="text-base-content/50">({reviews.length} reviews)</span>
                        </div>

                        <div className="flex items-center gap-4 mb-6">
                            <span className="text-4xl font-bold text-primary">${product.price}</span>
                            <span className="text-xl text-base-content/40 line-through">${(product.price * 1.2).toFixed(2)}</span>
                            <div className="badge badge-success badge-lg text-white font-bold">-20%</div>
                        </div>

                        <p className="text-lg text-base-content/70 leading-relaxed mb-8 border-l-4 border-primary pl-4">
                            {product.description || 'Experience premium quality and performance with this amazing device. Designed to meet all your needs with style and efficiency.'}
                        </p>

                        {/* Stock Status */}
                        <div className="flex items-center gap-3 mb-8">
                            <div className={`w-3 h-3 rounded-full ${product.stock > 0 ? 'bg-success' : 'bg-error'} ring-4 ring-opacity-20 ${product.stock > 0 ? 'ring-success' : 'ring-error'}`}></div>
                            <span className="font-medium text-base-content/80">
                                {product.stock > 0 ? `In Stock (${product.stock} available)` : 'Currently Unavailable'}
                            </span>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col sm:flex-row gap-4 mt-auto">
                            <button className="btn btn-primary btn-lg flex-1 shadow-xl shadow-primary/20 hover:shadow-primary/40 transition-all">
                                Add to Cart
                            </button>
                            <button className="btn btn-outline btn-lg flex-1">
                                Add to Wishlist
                            </button>
                        </div>

                        {/* Features Grid */}
                        <div className="grid grid-cols-2 gap-4 mt-10 pt-8 border-t border-base-200">
                            <div className="flex items-center gap-3">
                                <span className="text-2xl">🚚</span>
                                <div className="text-sm">
                                    <p className="font-bold">Free Shipping</p>
                                    <p className="text-base-content/50">On orders over $100</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-2xl">🛡️</span>
                                <div className="text-sm">
                                    <p className="font-bold">2 Year Warranty</p>
                                    <p className="text-base-content/50">Full coverage</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Reviews Section */}
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-3xl font-bold mb-8">Customer Reviews</h2>

                    {/* Review Form */}
                    <div className="card bg-base-200 shadow-xl mb-8">
                        <div className="card-body">
                            <h3 className="card-title text-xl mb-4">Write a Review</h3>

                            {!user ? (
                                <div className="alert alert-info">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                    <div>
                                        <h3 className="font-bold">Login Required</h3>
                                        <div className="text-sm">Please log in to write a review for this product.</div>
                                    </div>
                                    <Link href="/login" className="btn btn-sm btn-primary">Login</Link>
                                </div>
                            ) : (
                                <form onSubmit={handleReviewSubmit} className="space-y-4">
                                    <div className="alert alert-success">
                                        <span>Reviewing as: <strong>{user.displayName || user.email}</strong></span>
                                    </div>

                                    <div className="form-control">
                                        <label className="label">
                                            <span className="label-text font-medium">Rating</span>
                                        </label>
                                        {renderStars(reviewForm.rating, true, (rating) => setReviewForm({ ...reviewForm, rating }))}
                                    </div>

                                    <div className="form-control">
                                        <label className="label">
                                            <span className="label-text font-medium">Your Review</span>
                                        </label>
                                        <textarea
                                            className="textarea textarea-bordered h-24"
                                            placeholder="Share your experience with this product..."
                                            value={reviewForm.comment}
                                            onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                                            required
                                        ></textarea>
                                    </div>

                                    <button
                                        type="submit"
                                        className="btn btn-primary w-full"
                                        disabled={submitting}
                                    >
                                        {submitting ? <span className="loading loading-spinner"></span> : 'Submit Review'}
                                    </button>
                                </form>
                            )}

                        </div>
                    </div>

                    {/* Reviews List */}
                    <div className="space-y-4">
                        {reviews.length === 0 ? (
                            <div className="text-center py-12 text-base-content/50">
                                <p className="text-lg">No reviews yet. Be the first to review this product!</p>
                            </div>
                        ) : (
                            reviews.map((review) => (
                                <div key={review._id} className="card bg-base-100 shadow-md">
                                    <div className="card-body">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <p className="font-bold text-lg">{review.userName}</p>
                                                <p className="text-sm text-base-content/50">
                                                    {new Date(review.createdAt).toLocaleDateString('en-US', {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric'
                                                    })}
                                                </p>
                                            </div>
                                            {renderStars(review.rating)}
                                        </div>
                                        <p className="mt-3 text-base-content/80">{review.comment}</p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
