'use client';
import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // State for filters
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [sort, setSort] = useState('newest');

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (category) params.append('category', category);
      if (sort) params.append('sort', sort);

      const res = await fetch(`/api/items?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setProducts(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  }, [search, category, sort]);

  // Initial fetch and refetch on filter change
  // Note: For search, we might want to debounce or use a button, 
  // but for now let's fetch when the user hits 'Enter' or clicks search, 
  // or we can just add it to the dependency array if we want live search (debounced).
  // Here I'll use a simple effect that runs when category or sort changes, 
  // and I'll add a manual trigger for search to avoid too many requests while typing.

  useEffect(() => {
    fetchProducts();
  }, [category, sort]); // Fetch when category or sort changes

  const handleSearch = (e) => {
    e.preventDefault();
    fetchProducts();
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold text-center mb-10">Our Products</h1>

      {/* Search and Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4 mb-8 justify-between items-center bg-base-200 p-4 rounded-xl">

        {/* Search */}
        <form onSubmit={handleSearch} className="join w-full md:w-auto">
          <input
            type="text"
            placeholder="Search products..."
            className="input input-bordered join-item w-full md:w-64"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button type="submit" className="btn btn-primary join-item">Search</button>
        </form>

        {/* Filters */}
        <div className="flex gap-4 w-full md:w-auto">
          <select
            className="select select-bordered w-full md:w-auto"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            <option value="Phone">Phone</option>
            <option value="Tablet">Tablet</option>
            <option value="Laptop">Laptop</option>
            <option value="Accessories">Accessories</option>
            <option value="Watch">Watch</option>
          </select>

          <select
            className="select select-bordered w-full md:w-auto"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="newest">Newest</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="min-h-[50vh] flex justify-center items-center">
          <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center text-xl min-h-[50vh] flex flex-col justify-center items-center">
          <p>No products found.</p>
          <button
            className="btn btn-link"
            onClick={() => {
              setSearch('');
              setCategory('');
              setSort('newest');
              // fetchProducts will be triggered by useEffect when state updates
            }}
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product._id} className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow duration-300">
              <figure className="px-10 pt-10">
                <img
                  src="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp" // Placeholder image
                  alt={product.productName}
                  className="rounded-xl h-48 object-cover"
                />
              </figure>
              <div className="card-body items-center text-center">
                <div className="badge badge-secondary mb-2">{product.category || 'General'}</div>
                <h2 className="card-title">{product.productName}</h2>
                <p className="text-sm text-gray-500">{product.brand}</p>
                <p className="font-bold text-lg text-primary">${product.price}</p>
                <div className="card-actions flex gap-2">
                  <Link href={`/products/${product._id}`} className="btn btn-primary">
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
