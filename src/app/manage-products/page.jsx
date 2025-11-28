'use client';
import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import useAuth from '@/hooks/useAuth';

export default function ManageProducts() {
    const router = useRouter();
    const { user, loading: authLoading } = useAuth();
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [editingProduct, setEditingProduct] = useState(null);
    const [deleteConfirm, setDeleteConfirm] = useState(null);

    // refs for dialog elements
    const editModalRef = useRef(null);
    const deleteModalRef = useRef(null);

    // Redirect if not logged in
    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login');
        }
    }, [user, authLoading, router]);

    useEffect(() => {
        if (user) {
            fetchProducts();
        }
    }, [user]);

    useEffect(() => {
        // Filter products based on search term
        if (searchTerm) {
            const q = searchTerm.toLowerCase();
            const filtered = products.filter(
                (product) =>
                    product.productName?.toLowerCase().includes(q) ||
                    product.brand?.toLowerCase().includes(q) ||
                    product.category?.toLowerCase().includes(q)
            );
            setFilteredProducts(filtered);
        } else {
            setFilteredProducts(products);
        }
    }, [searchTerm, products]);

    const fetchProducts = async () => {
        if (!user) return;

        setLoading(true);
        try {
            const res = await fetch('/api/items?sort=newest');
            const data = await res.json();
            if (data.success) {
                // Filter products by user email
                const userProducts = data.data.filter(p => p.userEmail === user.email);
                setProducts(userProducts || []);
                setFilteredProducts(userProducts || []);
            } else {
                console.error('Failed to fetch products:', data.error);
            }
        } catch (error) {
            console.error('Failed to fetch products:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        try {
            const res = await fetch(`/api/items/${id}`, {
                method: 'DELETE',
            });
            const data = await res.json();

            if (data.success) {
                // Remove from state
                setProducts((prev) => prev.filter((p) => p._id !== id));
                setDeleteConfirm(null);
                // close modal
                deleteModalRef.current?.close();
            } else {
                alert('Failed to delete: ' + data.error);
            }
        } catch (error) {
            console.error('Delete error:', error);
            alert('Failed to delete product');
        }
    };

    // Helper: upload image file to server. Assumes you have an /api/upload endpoint
    const uploadImageFile = async (file) => {
        try {
            const formData = new FormData();
            formData.append('image', file);
            const res = await fetch(`https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMAGEBB_API_KEY}`, {
                method: 'POST',
                body: formData,
            });
            const data = await res.json();
            if (data.success && data.data?.url) return data.data.url;
            console.error('Upload failed', data);
            return null;
        } catch (err) {
            console.error('Upload error', err);
            return null;
        }
    };

    const handleEdit = async (e) => {
        e.preventDefault();
        if (!editingProduct) return;

        try {
            setLoading(true);

            // If user selected a new file, upload it first
            let imageUrl = editingProduct.image; // existing
            if (editingProduct.newImageFile) {
                const uploaded = await uploadImageFile(editingProduct.newImageFile);
                if (uploaded) imageUrl = uploaded;
            }

            // If user provided a direct image URL in the field, prefer that (unless a new file was uploaded)
            if (!editingProduct.newImageFile && editingProduct.imageInputUrl) {
                imageUrl = editingProduct.imageInputUrl;
            }

            const res = await fetch(`/api/items/${editingProduct._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    productName: editingProduct.productName,
                    brand: editingProduct.brand,
                    category: editingProduct.category,
                    price: parseFloat(editingProduct.price),
                    stock: parseInt(editingProduct.stock, 10),
                    description: editingProduct.description,
                    image: imageUrl,
                }),
            });
            const data = await res.json();

            if (data.success) {
                // Refresh products
                await fetchProducts();
                setEditingProduct(null);
                // Close modal
                editModalRef.current?.close();
            } else {
                alert('Failed to update: ' + data.error);
            }
        } catch (error) {
            console.error('Update error:', error);
            alert('Failed to update product');
        } finally {
            setLoading(false);
        }
    };

    const onSelectImageFile = (file) => {
        if (!file) return;
        // create preview
        const reader = new FileReader();
        reader.onload = (ev) => {
            setEditingProduct((prev) => ({ ...prev, newImageFile: file, imagePreview: ev.target.result }));
        };
        reader.readAsDataURL(file);
    };

    if (authLoading || loading) {
        return (
            <div className="min-h-screen flex justify-center items-center">
                <span className="loading loading-spinner loading-lg text-primary" />
            </div>
        );
    }

    // Don't render if not authenticated
    if (!user) {
        return null;
    }

    return (
        <div className="min-h-screen bg-base-100 p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                    <div>
                        <h1 className="text-4xl font-extrabold text-base-content mb-2">📱 My Phone List</h1>
                        <p className="text-base-content/60">Manage your product inventory</p>
                    </div>
                    <Link href="/add-product" className="btn btn-primary gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path
                                fillRule="evenodd"
                                d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                                clipRule="evenodd"
                            />
                        </svg>
                        Add New Product
                    </Link>
                </div>

                {/* Search Bar */}
                <div className="mb-6">
                    <div className="form-control">
                        <div className="input-group">
                            <input
                                type="text"
                                placeholder="Search by name, brand, or category..."
                                className="input input-bordered mr-1"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <button className="btn btn-square btn-primary" onClick={() => { }}>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Stats */}
                <div className="stats stats-vertical sm:stats-horizontal shadow mb-6 w-full">
                    <div className="stat">
                        <div className="stat-title">Total Products</div>
                        <div className="stat-value text-primary">{products.length}</div>
                    </div>
                    <div className="stat">
                        <div className="stat-title">Showing</div>
                        <div className="stat-value text-secondary">{filteredProducts.length}</div>
                    </div>
                    <div className="stat">
                        <div className="stat-title">Total Value</div>
                        <div className="stat-value text-accent">
                            $
                            {products
                                .reduce((sum, p) => sum + (Number(p.price) || 0), 0)
                                .toFixed(2)}
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="card bg-base-100 shadow-xl border border-base-300">
                    <div className="card-body p-0">
                        <div className="overflow-x-auto">
                            <table className="table table-zebra">
                                <thead className="bg-base-200">
                                    <tr>
                                        <th className="text-base">#</th>
                                        <th className="text-base">Product Name</th>
                                        <th className="text-base">Brand</th>
                                        <th className="text-base">Category</th>
                                        <th className="text-base">Price</th>
                                        <th className="text-base">Stock</th>
                                        <th className="text-base text-center">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredProducts.length === 0 ? (
                                        <tr>
                                            <td colSpan="7" className="text-center py-12">
                                                <div className="flex flex-col items-center gap-2">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-base-content/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                                    </svg>
                                                    <p className="text-lg text-base-content/50">No products found</p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredProducts.map((product, index) => (
                                            <tr key={product._id} className="hover">
                                                <td className="font-semibold">{index + 1}</td>
                                                <td>
                                                    <div className="flex items-center gap-3">
                                                        <div className="avatar">
                                                            <div className="mask mask-squircle w-12 h-12 bg-base-200">
                                                                <img src={product.image || 'https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp'} alt={product.productName} />
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <div className="font-bold">{product.productName}</div>
                                                            <div className="text-sm opacity-50 truncate max-w-xs">{product.description}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>
                                                    <span className="badge badge-ghost">{product.brand}</span>
                                                </td>
                                                <td>
                                                    <span className="badge badge-secondary badge-outline">{product.category || 'N/A'}</span>
                                                </td>
                                                <td className="font-bold text-primary">${product.price}</td>
                                                <td>
                                                    <span className={`badge ${product.stock > 10 ? 'badge-success' : product.stock > 0 ? 'badge-warning' : 'badge-error'}`}>
                                                        {product.stock}
                                                    </span>
                                                </td>
                                                <td>
                                                    <div className="flex gap-2 justify-center">
                                                        <Link href={`/products/${product._id}`} className="btn btn-sm btn-ghost btn-outline" title="View Details">
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                                                                <path d="M12 5c-7.633 0-11 6.5-11 7s3.367 7 11 7 11-6.5 11-7-3.367-7-11-7zm0 11a4 4 0 110-8 4 4 0 010 8z" />
                                                            </svg>
                                                        </Link>

                                                        <button
                                                            className="btn btn-sm btn-info btn-outline"
                                                            onClick={() => {
                                                                // clone product into editingProduct to avoid mutating original object
                                                                setEditingProduct({ ...product, imagePreview: product.image, imageInputUrl: product.image });
                                                                editModalRef.current?.showModal();
                                                            }}
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                                            </svg>
                                                        </button>
                                                        <button
                                                            className="btn btn-sm btn-error btn-outline"
                                                            onClick={() => {
                                                                setDeleteConfirm(product);
                                                                deleteModalRef.current?.showModal();
                                                            }}
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                                <path
                                                                    fillRule="evenodd"
                                                                    d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                                                                    clipRule="evenodd"
                                                                />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {/* Edit Modal */}
            <dialog id="edit_modal" ref={editModalRef} className="modal">
                <div className="modal-box max-w-2xl">
                    <h3 className="font-bold text-2xl mb-4">Edit Product</h3>
                    {editingProduct && (
                        <form onSubmit={handleEdit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text">Product Name</span>
                                    </label>
                                    <input
                                        type="text"
                                        className="input input-bordered"
                                        value={editingProduct.productName || ''}
                                        onChange={(e) => setEditingProduct({ ...editingProduct, productName: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text">Brand</span>
                                    </label>
                                    <input
                                        type="text"
                                        className="input input-bordered"
                                        value={editingProduct.brand || ''}
                                        onChange={(e) => setEditingProduct({ ...editingProduct, brand: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text">Category</span>
                                    </label>
                                    <select
                                        className="select select-bordered"
                                        value={editingProduct.category || ''}
                                        onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                                    >
                                        <option value="">Select Category</option>
                                        <option>Phone</option>
                                        <option>Tablet</option>
                                        <option>Laptop</option>
                                        <option>Accessories</option>
                                        <option>Watch</option>
                                    </select>
                                </div>

                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text">Price</span>
                                    </label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        className="input input-bordered"
                                        value={editingProduct.price ?? ''}
                                        onChange={(e) => setEditingProduct({ ...editingProduct, price: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text">Stock</span>
                                    </label>
                                    <input
                                        type="number"
                                        className="input input-bordered"
                                        value={editingProduct.stock ?? ''}
                                        onChange={(e) => setEditingProduct({ ...editingProduct, stock: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Description</span>
                                </label>
                                <textarea
                                    className="textarea textarea-bordered h-24"
                                    value={editingProduct.description || ''}
                                    onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                                />
                            </div>

                            {/* Image controls: preview, url input, file upload */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                                <div>
                                    <label className="label"><span className="label-text">Current / Preview</span></label>
                                    <div className="w-48 h-48 bg-base-200 rounded-lg overflow-hidden flex items-center justify-center">
                                        {editingProduct.imagePreview ? (
                                            // preview (base64 or url)
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img src={editingProduct.imagePreview} alt="preview" className="object-contain w-full h-full" />
                                        ) : (
                                            <p className="text-sm text-center px-2">No image</p>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <label className="label"><span className="label-text">Image URL (or paste new URL)</span></label>
                                    <input
                                        type="text"
                                        className="input input-bordered w-full"
                                        value={editingProduct.imageInputUrl || ''}
                                        onChange={(e) => setEditingProduct({ ...editingProduct, imageInputUrl: e.target.value })}
                                        placeholder="https://example.com/image.jpg"
                                    />

                                    <label className="label mt-2"><span className="label-text">Or upload a new image</span></label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="file-input file-input-bordered w-full"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            onSelectImageFile(file);
                                        }}
                                    />
                                    <p className="text-xs opacity-60 mt-2">If you upload a file it will be sent to <code>/api/upload</code> — make sure your backend supports this.</p>
                                </div>
                            </div>

                            <div className="modal-action">
                                <button type="button" className="btn" onClick={() => { setEditingProduct(null); editModalRef.current?.close(); }}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    )}
                </div>
                <form method="dialog" className="modal-backdrop">
                    <button>close</button>
                </form>
            </dialog>

            {/* Delete Confirmation Modal */}
            <dialog id="delete_modal" ref={deleteModalRef} className="modal">
                <div className="modal-box">
                    <h3 className="font-bold text-2xl mb-4">Confirm Deletion</h3>
                    {deleteConfirm && (
                        <>
                            <p className="py-4">
                                Are you sure you want to delete <strong>{deleteConfirm.productName}</strong>? This action cannot be undone.
                            </p>
                            <div className="modal-action">
                                <button className="btn" onClick={() => { setDeleteConfirm(null); deleteModalRef.current?.close(); }}>
                                    Cancel
                                </button>
                                <button className="btn btn-error" onClick={() => handleDelete(deleteConfirm._id)}>
                                    Delete
                                </button>
                            </div>
                        </>
                    )}
                </div>
                <form method="dialog" className="modal-backdrop">
                    <button>close</button>
                </form>
            </dialog>
        </div>
    );
}
