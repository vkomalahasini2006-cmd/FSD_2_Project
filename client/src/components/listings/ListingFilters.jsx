import React from 'react';
import { RotateCcw, SlidersHorizontal, MapPin, IndianRupee } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

export const ListingFilters = ({
  categories = [],
  selectedCategory,
  onSelectCategory,
  minPrice,
  maxPrice,
  onPriceChange,
  area,
  onAreaChange,
  sort,
  onSortChange,
  onReset
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-subtle space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2 text-slate-900 font-semibold text-sm">
          <SlidersHorizontal className="w-4 h-4 text-brand-600" />
          <span>Filters</span>
        </div>
        <button
          onClick={onReset}
          className="text-xs font-medium text-slate-500 hover:text-brand-600 flex items-center gap-1 transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
          Reset
        </button>
      </div>

      {/* Sort By */}
      <div className="space-y-2">
        <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
          Sort By
        </label>
        <select
          value={sort}
          onChange={(e) => onSortChange(e.target.value)}
          className="w-full text-xs font-medium rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-100 focus:border-brand-500"
        >
          <option value="newest">Newest First</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
        </select>
      </div>

      {/* Categories */}
      <div className="space-y-2.5">
        <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
          Category
        </label>
        <div className="flex flex-col gap-1 max-h-56 overflow-y-auto pr-1">
          <button
            onClick={() => onSelectCategory('')}
            className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center justify-between ${
              !selectedCategory
                ? 'bg-brand-50 text-brand-700 font-semibold'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <span>All Categories</span>
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.name)}
              className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center justify-between ${
                selectedCategory?.toLowerCase() === cat.name.toLowerCase()
                  ? 'bg-brand-50 text-brand-700 font-semibold'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <span>{cat.name}</span>
              {cat._count?.listings !== undefined && (
                <span className="text-[11px] text-slate-400">
                  {cat._count.listings}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="space-y-2.5">
        <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
          Price Range (₹ / day)
        </label>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <span className="text-[11px] text-slate-400 block mb-1">Min (₹)</span>
            <input
              type="number"
              min="0"
              placeholder="0"
              value={minPrice}
              onChange={(e) => onPriceChange('min', e.target.value)}
              className="w-full text-xs rounded-lg border border-slate-200 px-2.5 py-1.5 text-slate-800 placeholder:text-slate-300 focus:outline-none focus:border-brand-500"
            />
          </div>
          <div>
            <span className="text-[11px] text-slate-400 block mb-1">Max (₹)</span>
            <input
              type="number"
              min="0"
              placeholder="5000"
              value={maxPrice}
              onChange={(e) => onPriceChange('max', e.target.value)}
              className="w-full text-xs rounded-lg border border-slate-200 px-2.5 py-1.5 text-slate-800 placeholder:text-slate-300 focus:outline-none focus:border-brand-500"
            />
          </div>
        </div>
      </div>

      {/* Area / Neighborhood */}
      <div className="space-y-2">
        <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
          Area / Neighborhood
        </label>
        <div className="relative">
          <input
            type="text"
            placeholder="e.g. Benz Circle, Gachibowli..."
            value={area}
            onChange={(e) => onAreaChange(e.target.value)}
            className="w-full text-xs rounded-xl border border-slate-200 pl-8 pr-3 py-2 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-brand-500"
          />
          <MapPin className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
        </div>
      </div>
    </div>
  );
};
