"use client"

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import useAuth from '@/hooks/useAuth';

const AddMobileProduct = () => {
  const router = useRouter();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    productName: '',
    brand: '',
    category: '',
    price: '',
    stock: '',
    description: '',
  });

  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      const payload = {
        productName: formData.productName,
        brand: formData.brand,
        category: formData.category,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock, 10),
        description: formData.description,
        userEmail: user?.email || 'anonymous',
        userName: user?.displayName || user?.email || 'Anonymous User',
        createdAt: new Date(),
      };

      const response = await fetch('/api/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('✅ Product added successfully.');
        setFormData({
          productName: '',
          brand: '',
          category: '',
          price: '',
          stock: '',
          description: '',
        });
        router.push('/my-phone-list');
      } else {
        setMessage(`❌ Failed to add product: ${data.error || 'Server error'}`);
      }
    } catch (error) {
      setMessage(`❌ An unexpected error occurred. ${error.message}`);
      console.error('Submission Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='max-w-4xl mx-auto p-4 sm:p-6 lg:p-10'>
      <h1 className='text-4xl font-extrabold text-center mb-10 text-base-content'>📦 Add New Mobile Product</h1>

      {message && (
        <div className={`alert ${message.startsWith('✅') ? 'alert-success' : 'alert-error'} mb-4 shadow-lg`}>
          <div>
            <span>{message}</span>
          </div>
        </div>
      )}

      <div className='card bg-base-100 shadow-xl border border-base-300'>
        <div className='card-body p-6 sm:p-8'>
          <form className='space-y-6' onSubmit={handleSubmit}>

            <h2 className='text-2xl font-semibold border-b pb-2 mb-4 text-primary'>Basic Details</h2>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <div className="form-control">
                <label className="label" htmlFor="productName">
                  <span className="label-text font-medium">Product Name</span>
                </label>
                <input
                  type="text"
                  name="productName"
                  id="productName"
                  placeholder="e.g., Mobodokan X1 Ultra"
                  className='input input-bordered w-full'
                  required
                  value={formData.productName}
                  onChange={handleChange}
                />
              </div>

              <div className="form-control">
                <label className="label" htmlFor="brand">
                  <span className="label-text font-medium">Brand</span>
                </label>
                <select
                  id="brand"
                  name="brand"
                  className="select select-bordered w-full"
                  required
                  value={formData.brand}
                  onChange={handleChange}
                >
                  <option disabled value="">Select Brand</option>
                  <option>Apple</option>
                  <option>Samsung</option>
                  <option>Xiaomi</option>
                  <option>Google</option>
                  <option>Other</option>
                </select>
              </div>

              <div className="form-control">
                <label className="label" htmlFor="category">
                  <span className="label-text font-medium">Category</span>
                </label>
                <select
                  id="category"
                  name="category"
                  className="select select-bordered w-full"
                  required
                  value={formData.category}
                  onChange={handleChange}
                >
                  <option disabled value="">Select Category</option>
                  <option>Phone</option>
                  <option>Tablet</option>
                  <option>Laptop</option>
                  <option>Accessories</option>
                  <option>Watch</option>
                </select>
              </div>

              <div className="form-control">
                <label className="label" htmlFor="price">
                  <span className="label-text font-medium">Price (USD)</span>
                </label>
                <input
                  type="number"
                  name="price"
                  id="price"
                  placeholder="999.00"
                  step="0.01"
                  min="0"
                  className='input input-bordered w-full'
                  required
                  value={formData.price}
                  onChange={handleChange}
                />
              </div>

              <div className="form-control">
                <label className="label" htmlFor="stock">
                  <span className="label-text font-medium">Quantity in Stock</span>
                </label>
                <input
                  type="number"
                  name="stock"
                  id="stock"
                  placeholder="50"
                  min="0"
                  className='input input-bordered w-full'
                  required
                  value={formData.stock}
                  onChange={handleChange}
                />
              </div>
            </div>

            <h2 className='text-2xl font-semibold border-b pb-2 pt-4 mb-4 text-primary'>Description & Media</h2>

            <div className="form-control">
              <label className="label" htmlFor="description">
                <span className="label-text font-medium">Product Description</span>
              </label>
              <textarea
                name="description"
                id="description"
                placeholder="A detailed description of the mobile phone's features..."
                className='textarea textarea-bordered h-32'
                required
                value={formData.description}
                onChange={handleChange}
              ></textarea>
            </div>

            <div className="pt-6">
              <button
                type="submit"
                className="btn btn-primary btn-lg w-full text-white tracking-wider font-bold shadow-xl shadow-primary/30 transition-transform duration-200 hover:scale-[1.01]"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="loading loading-spinner"></span>
                ) : (
                  'Add Product to Inventory'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddMobileProduct;