import React from 'react';

const Hero = () => {
    return (
        <div className="hero min-h-[85vh] bg-base-100 py-12">
            <div className="hero-content flex-col lg:flex-row-reverse p-0 lg:p-8">
                
                {/* 1. PRODUCT VISUAL & DEAL BADGE */}
                <div className="lg:w-1/2 w-full flex justify-center relative p-8">
                    {/* Floating Sale Tag */}
                    <div className="absolute top-0 right-0 lg:-top-6 lg:-right-6 badge badge-lg badge-secondary text-lg p-4 font-bold shadow-xl rotate-3">
                        Save $200!
                    </div>
                    
                    <img
                        // Using a more product-specific stock image (placeholder)
                        src="https://i.ibb.co/M521b1JY/Chat-GPT-Image-Nov-27-2025-10-30-06-PM.png"
                        className="max-w-xs sm:max-w-md w-full rounded-2xl shadow-2xl transition-transform duration-500 hover:scale-[1.03] object-contain"
                        alt="Featured Mobile Phone"
                    />
                </div>

                {/* 2. VALUE PROPOSITION & CTA */}
                <div className="lg:w-1/2 w-full text-center lg:text-left p-8">
                    <p className="text-xl font-semibold text-primary mb-3">
                        Featured Phone of the Month
                    </p>
                    <h1 className="text-5xl lg:text-6xl font-extrabold mb-4 leading-tight">
                        The Next Generation is Here.
                    </h1>
                    
                    <p className="mb-6 text-lg text-base-content/70 max-w-lg mx-auto lg:mx-0">
                        Experience the revolutionary <span className="font-bold">Mobodokan X1 Ultra</span>. 
                        Unrivaled speed, breathtaking camera, and a battery that lasts.
                    </p>

                    <div className="flex items-center justify-center lg:justify-start gap-4 mb-8">
                        <div className="text-3xl font-bold text-error">$999</div>
                        <div className="text-lg line-through text-base-content/50">$1199</div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                        <button className="btn btn-primary btn-lg px-10 shadow-lg shadow-primary/50">
                            Buy Now
                        </button>
                        <button className="btn btn-outline btn-info btn-lg px-8">
                            Learn More
                        </button>
                    </div>

                    {/* Quick Features List */}
                    <div className="mt-8 pt-4 border-t border-base-200 grid grid-cols-2 gap-4 max-w-xs mx-auto lg:mx-0">
                        <span className="flex items-center gap-2 text-sm text-success">
                            <span className="font-extrabold text-lg leading-none">✓</span> Free Shipping
                        </span>
                        <span className="flex items-center gap-2 text-sm text-info">
                             <span className="font-extrabold text-lg leading-none">✓</span> 2-Year Warranty
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Hero;