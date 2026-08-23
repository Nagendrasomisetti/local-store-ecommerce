import React, { useState, useEffect } from 'react';
import {
  ChevronLeft,
  UploadCloud,
  Check,
  ChevronDown,
  Image as ImageIcon,
  Sparkles,
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { ProductCategory, ProductStockStatus, ProductStatus } from '../types';

export const AddProductScreen: React.FC = () => {
  const {
    editingProduct,
    setEditingProduct,
    addProduct,
    updateProduct,
    goBack,
    navigateTo,
  } = useShop();

  const isEditing = Boolean(editingProduct);

  const [name, setName] = useState('');
  const [category, setCategory] = useState<ProductCategory>('Chicken');
  const [shortDescription, setShortDescription] = useState('');
  const [price, setPrice] = useState('320');
  const [priceUnit, setPriceUnit] = useState('kg');
  const [stockStatus, setStockStatus] = useState<ProductStockStatus>('In Stock');
  const [status, setStatus] = useState<ProductStatus>('Active');
  const [image, setImage] = useState(
    'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=400&auto=format&fit=crop&q=80'
  );

  useEffect(() => {
    if (editingProduct) {
      setName(editingProduct.name);
      setCategory(editingProduct.category);
      setShortDescription(editingProduct.shortDescription || '');
      setPrice(String(editingProduct.price));
      setPriceUnit(editingProduct.priceUnit || 'kg');
      setStockStatus(editingProduct.stockStatus);
      setStatus(editingProduct.status);
      setImage(editingProduct.image);
    } else {
      setName('');
      setCategory('Chicken');
      setShortDescription('');
      setPrice('320');
      setPriceUnit('kg');
      setStockStatus('In Stock');
      setStatus('Active');
      setImage('https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=400&auto=format&fit=crop&q=80');
    }
  }, [editingProduct]);

  const presetImages = [
    {
      title: 'Chicken Breast',
      url: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=400&auto=format&fit=crop&q=80',
    },
    {
      title: 'Boneless Cubes',
      url: 'https://images.unsplash.com/photo-1587593810167-a84920ea0781?w=400&auto=format&fit=crop&q=80',
    },
    {
      title: 'Curry Cut',
      url: 'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?w=400&auto=format&fit=crop&q=80',
    },
    {
      title: 'Biryani Cut',
      url: 'https://images.unsplash.com/photo-1548869206-93b036288d7e?w=400&auto=format&fit=crop&q=80',
    },
    {
      title: 'Fresh Farm Eggs',
      url: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=400&auto=format&fit=crop&q=80',
    },
  ];

  const handleImageFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        if (uploadEvent.target?.result) {
          setImage(uploadEvent.target.result as string);
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (isEditing && editingProduct) {
      updateProduct(editingProduct.id, {
        name,
        category,
        shortDescription,
        price: Number(price) || 0,
        priceUnit,
        stockStatus,
        status,
        image,
      });
      setEditingProduct(null);
    } else {
      addProduct({
        name,
        category,
        shortDescription,
        price: Number(price) || 0,
        priceUnit,
        stockStatus,
        status,
        image,
      });
    }
  };

  return (
    <div className="min-h-full bg-[#F6F5FC] flex flex-col font-sans pb-4">
      {/* Top Header */}
      <header className="bg-white px-4 py-3 flex items-center gap-3 border-b border-gray-100 sticky top-0 z-20 shadow-2xs">
        <button
          type="button"
          onClick={() => {
            setEditingProduct(null);
            goBack();
          }}
          className="p-1 text-gray-700 hover:text-gray-900 rounded-lg hover:bg-gray-100 cursor-pointer"
          aria-label="Back"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <div>
          <h1 className="text-base font-black text-gray-900 tracking-tight">
            {isEditing ? 'Edit Product' : 'Add Product'}
          </h1>
          <p className="text-[11px] text-gray-400 font-medium">
            {isEditing
              ? 'Update product pricing and inventory settings'
              : 'Fill in the details below to add a new product'}
          </p>
        </div>
      </header>

      {/* Form Area */}
      <main className="p-4 space-y-3.5 flex-1">
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {/* Section 1: Basic Information */}
          <section className="bg-white rounded-2xl p-4 shadow-2xs border border-gray-100 space-y-3">
            <h3 className="text-xs font-black text-gray-900 border-b border-gray-50 pb-2">
              Basic Information
            </h3>

            {/* Product Name */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Product Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Boneless Chicken Breast"
                required
                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-medium text-gray-900 focus:outline-none focus:border-[#6C38CC] focus:ring-1 focus:ring-[#6C38CC]"
              />
            </div>

            {/* Category Dropdown */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Category <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as ProductCategory)}
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-medium text-gray-900 appearance-none focus:outline-none focus:border-[#6C38CC] pr-8"
                >
                  <option value="Chicken">Chicken</option>
                  <option value="Mutton">Mutton</option>
                  <option value="Eggs">Eggs</option>
                  <option value="Fish">Fish & Seafood</option>
                </select>
                <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-2.5 pointer-events-none" />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={shortDescription}
                onChange={(e) => setShortDescription(e.target.value)}
                placeholder="Brief description of the product, quality, cut type, etc."
                rows={2}
                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-medium text-gray-900 focus:outline-none focus:border-[#6C38CC]"
              />
            </div>
          </section>

          {/* Section 2: Pricing & Stock */}
          <section className="bg-white rounded-2xl p-4 shadow-2xs border border-gray-100 space-y-3">
            <h3 className="text-xs font-black text-gray-900 border-b border-gray-50 pb-2">
              Pricing & Stock
            </h3>

            <div className="grid grid-cols-2 gap-3">
              {/* Price */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Price (₹) <span className="text-red-500">*</span>
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-3 text-xs font-bold text-gray-400">₹</span>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="320"
                    required
                    className="w-full pl-7 pr-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-900 focus:outline-none focus:border-[#6C38CC]"
                  />
                </div>
              </div>

              {/* Unit */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Unit <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    value={priceUnit}
                    onChange={(e) => setPriceUnit(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-medium text-gray-900 appearance-none focus:outline-none focus:border-[#6C38CC] pr-8"
                  >
                    <option value="kg">Per kg</option>
                    <option value="500 g">Per 500 g</option>
                    <option value="piece">Per piece</option>
                    <option value="dozen">Per dozen</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-2.5 pointer-events-none" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {/* Stock Status */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Stock Status <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    value={stockStatus}
                    onChange={(e) => setStockStatus(e.target.value as ProductStockStatus)}
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-medium text-gray-900 appearance-none focus:outline-none focus:border-[#6C38CC] pr-8"
                  >
                    <option value="In Stock">In Stock</option>
                    <option value="Low Stock">Low Stock</option>
                    <option value="Out of Stock">Out of Stock</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-2.5 pointer-events-none" />
                </div>
              </div>

              {/* Visibility / Status */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Visibility
                </label>
                <div className="relative">
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as ProductStatus)}
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-medium text-gray-900 appearance-none focus:outline-none focus:border-[#6C38CC] pr-8"
                  >
                    <option value="Active">Active (Visible)</option>
                    <option value="Inactive">Inactive (Hidden)</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-2.5 pointer-events-none" />
                </div>
              </div>
            </div>
          </section>

          {/* Section 3: Product Image */}
          <section className="bg-white rounded-2xl p-4 shadow-2xs border border-gray-100 space-y-3">
            <div className="flex items-center justify-between border-b border-gray-50 pb-2">
              <h3 className="text-xs font-black text-gray-900">Product Image</h3>
              <span className="text-[10px] text-gray-400 font-medium">PNG, JPG up to 5MB</span>
            </div>

            {/* Selected Image Preview & Upload Box */}
            <div className="flex items-center gap-3">
              <div className="w-20 h-20 rounded-2xl bg-gray-100 overflow-hidden border-2 border-purple-200 shrink-0">
                <img src={image} alt="Preview" className="w-full h-full object-cover" />
              </div>

              <label className="flex-1 flex flex-col items-center justify-center p-3 border-2 border-dashed border-purple-200 rounded-2xl hover:bg-purple-50/50 cursor-pointer transition-colors text-center">
                <UploadCloud className="w-6 h-6 text-[#6C38CC] mb-1" />
                <span className="text-xs font-bold text-[#6C38CC]">Upload Custom Photo</span>
                <span className="text-[10px] text-gray-400">Click to browse file</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageFile}
                  className="hidden"
                />
              </label>
            </div>

            {/* Quick Preset Selector */}
            <div className="pt-2">
              <p className="text-[11px] font-bold text-gray-700 mb-2 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-[#6C38CC]" />
                <span>Or select from presets:</span>
              </p>
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                {presetImages.map((preset) => (
                  <button
                    key={preset.title}
                    type="button"
                    onClick={() => setImage(preset.url)}
                    className={`p-1 rounded-xl border-2 shrink-0 transition-all ${
                      image === preset.url
                        ? 'border-[#6C38CC] bg-purple-50 ring-2 ring-purple-100'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <img
                      src={preset.url}
                      alt={preset.title}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <span className="text-[9px] font-bold text-gray-700 block text-center truncate max-w-[54px] mt-0.5">
                      {preset.title.split(' ')[0]}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* Bottom Actions */}
          <div className="flex items-center gap-2 pt-2">
            <button
              type="button"
              onClick={() => {
                setEditingProduct(null);
                navigateTo('products');
              }}
              className="flex-1 py-3 px-4 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl text-xs font-bold transition-all cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="flex-[1.5] py-3 px-4 bg-[#582C93] hover:bg-[#4A154B] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-2xs transition-all cursor-pointer active:scale-[0.98]"
            >
              <Check className="w-4 h-4" />
              <span>{isEditing ? 'Update Product' : 'Save Product'}</span>
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};
