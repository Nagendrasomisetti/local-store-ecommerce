import React, { useState } from 'react';
import {
  Menu,
  Search,
  SlidersHorizontal,
  Plus,
  Edit,
  Trash2,
  MoreVertical,
  CheckCircle2,
  PauseCircle,
  ShoppingBag,
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { Product } from '../types';

export const ProductsScreen: React.FC = () => {
  const {
    products,
    setEditingProduct,
    toggleProductStatus,
    deleteProduct,
    navigateTo,
    counts,
  } = useShop();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeMenuProdId, setActiveMenuProdId] = useState<string | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);

  const filteredProducts = products.filter((prod) => {
    if (searchQuery.trim()) {
      return (
        prod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (prod.shortDescription && prod.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    return true;
  });

  const handleEditProduct = (prod: Product) => {
    setEditingProduct(prod);
    navigateTo('add_product');
  };

  const handleAddNewProduct = () => {
    setEditingProduct(null);
    navigateTo('add_product');
  };

  return (
    <div className="min-h-full bg-[#F7F5FD] flex flex-col font-sans select-none pb-4">
      {/* Top Header */}
      <header className="px-4 py-3 flex items-center justify-between sticky top-0 z-20 bg-[#F7F5FD]/95 backdrop-blur-xs border-b border-purple-100/50 shadow-2xs">
        <button
          type="button"
          onClick={() => navigateTo('dashboard')}
          className="p-1 text-gray-900 hover:text-gray-700 rounded-lg cursor-pointer"
          aria-label="Menu"
        >
          <Menu className="w-6 h-6 stroke-[2]" />
        </button>

        <h1 className="text-xl font-bold text-gray-900 tracking-tight">Products</h1>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => {}}
            className="p-1.5 text-gray-900 hover:text-gray-700 rounded-lg cursor-pointer"
            aria-label="Filter"
          >
            <SlidersHorizontal className="w-5 h-5 stroke-[2]" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-4 space-y-3.5 flex-1">
        {/* 3 Metric Cards */}
        <div className="grid grid-cols-3 gap-2.5">
          {/* Total Products */}
          <div className="bg-white rounded-2xl p-3 shadow-2xs border border-gray-100 flex flex-col justify-between">
            <div className="w-7 h-7 rounded-lg bg-purple-50 flex items-center justify-center mb-1">
              <ShoppingBag className="w-4 h-4 text-[#6C38CC]" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-500">Total Products</p>
              <p className="text-xl font-black text-gray-900 mt-0.5">{counts.totalProducts}</p>
            </div>
          </div>

          {/* Active */}
          <div className="bg-white rounded-2xl p-3 shadow-2xs border border-gray-100 flex flex-col justify-between">
            <div className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center mb-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-500">Active</p>
              <p className="text-xl font-black text-gray-900 mt-0.5">{counts.activeProducts}</p>
            </div>
          </div>

          {/* Inactive */}
          <div className="bg-white rounded-2xl p-3 shadow-2xs border border-gray-100 flex flex-col justify-between">
            <div className="w-7 h-7 rounded-lg bg-orange-50 flex items-center justify-center mb-1">
              <PauseCircle className="w-4 h-4 text-orange-600" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-500">Inactive</p>
              <p className="text-xl font-black text-gray-900 mt-0.5">{counts.inactiveProducts}</p>
            </div>
          </div>
        </div>

        {/* Search and Add Button */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="w-full pl-9 pr-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-medium text-gray-900 focus:outline-none focus:border-[#6C38CC] shadow-2xs"
            />
          </div>

          <button
            type="button"
            onClick={handleAddNewProduct}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-white border border-[#6C38CC] text-[#6C38CC] hover:bg-purple-50 rounded-xl text-xs font-bold shadow-2xs cursor-pointer active:scale-[0.98] transition-all shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Add Product</span>
          </button>
        </div>

        {/* Products List */}
        <div className="space-y-3">
          {filteredProducts.map((prod) => (
            <div
              key={prod.id}
              id={`product-card-${prod.id}`}
              className="bg-white rounded-2xl p-3 shadow-2xs border border-gray-100 hover:border-purple-200 transition-all flex items-center gap-3 relative"
            >
              {/* Product Thumbnail */}
              <div className="w-16 h-16 rounded-xl bg-gray-100 overflow-hidden shrink-0 border border-gray-200">
                <img
                  src={prod.image}
                  alt={prod.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Product Info */}
              <div className="flex-1 min-w-0 space-y-0.5">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black text-gray-900 truncate">{prod.name}</h4>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      prod.status === 'Active'
                        ? 'bg-emerald-50 text-emerald-600'
                        : 'bg-orange-50 text-orange-600'
                    }`}
                  >
                    {prod.status}
                  </span>
                </div>

                <p className="text-[11px] text-gray-500 truncate font-medium">
                  {prod.shortDescription || 'Fresh meat cut'}
                </p>

                <div className="flex items-center gap-2 pt-0.5">
                  <span className="text-xs font-black text-[#582C93]">
                    ₹{prod.price} <span className="text-[10px] text-gray-400 font-normal">/ {prod.priceUnit || 'kg'}</span>
                  </span>
                </div>

                <div className="flex items-center gap-1 text-[10px]">
                  <span className="text-gray-400 font-medium">Stock:</span>
                  <span
                    className={`font-bold ${
                      prod.stockStatus === 'In Stock'
                        ? 'text-emerald-600'
                        : prod.stockStatus === 'Low Stock'
                        ? 'text-orange-600'
                        : 'text-red-600'
                    }`}
                  >
                    {prod.stockStatus}
                  </span>
                </div>
              </div>

              {/* Actions Right */}
              <div className="flex flex-col items-end justify-between h-16 pl-1">
                <div className="relative">
                  <button
                    type="button"
                    onClick={() =>
                      setActiveMenuProdId(activeMenuProdId === prod.id ? null : prod.id)
                    }
                    className="text-gray-400 hover:text-gray-600 p-0.5 cursor-pointer"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </button>

                  {activeMenuProdId === prod.id && (
                    <div className="absolute right-0 mt-1 w-32 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-20 text-xs">
                      <button
                        type="button"
                        onClick={() => {
                          setActiveMenuProdId(null);
                          toggleProductStatus(prod.id);
                        }}
                        className="w-full text-left px-3 py-1.5 hover:bg-purple-50 text-gray-700 font-medium"
                      >
                        Set {prod.status === 'Active' ? 'Inactive' : 'Active'}
                      </button>
                    </div>
                  )}
                </div>

                {/* Edit & Delete Action Icons */}
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handleEditProduct(prod)}
                    className="p-1.5 text-[#6C38CC] hover:bg-purple-50 rounded-lg border border-purple-100 cursor-pointer transition-colors"
                    title="Edit Product"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeletingProduct(prod)}
                    className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg border border-red-100 cursor-pointer transition-colors"
                    title="Delete Product"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Delete Confirmation Modal */}
      {deletingProduct && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-xl space-y-4 text-center">
            <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900">Delete Product?</h3>
              <p className="text-xs text-gray-500 mt-1">
                Are you sure you want to remove "{deletingProduct.name}" from your catalog?
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeletingProduct(null)}
                className="py-2.5 bg-gray-100 text-gray-700 font-bold text-xs rounded-xl"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  deleteProduct(deletingProduct.id);
                  setDeletingProduct(null);
                }}
                className="py-2.5 bg-red-600 text-white font-bold text-xs rounded-xl"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
