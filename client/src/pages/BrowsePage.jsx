import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, ChevronLeft, ChevronRight, X } from 'lucide-react';
import api from '../api/axios';
import { ListingCard } from '../components/listings/ListingCard';
import { ListingFilters } from '../components/listings/ListingFilters';
import { ListingCardSkeleton } from '../components/ui/Skeleton';
import { EmptyState } from '../components/ui/EmptyState';
import { ErrorState } from '../components/ui/ErrorState';
import { Button } from '../components/ui/Button';

export const BrowsePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [categories, setCategories] = useState([]);
  const [listings, setListings] = useState([]);
  const [meta, setMeta] = useState({ total: 0, page: 1, limit: 12, totalPages: 1 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  // Read filter values from URL
  const categoryParam = searchParams.get('category') || '';
  const searchParam = searchParams.get('search') || '';
  const areaParam = searchParams.get('area') || '';
  const minPriceParam = searchParams.get('minPrice') || '';
  const maxPriceParam = searchParams.get('maxPrice') || '';
  const sortParam = searchParams.get('sort') || 'newest';
  const pageParam = parseInt(searchParams.get('page') || '1', 10);

  // Fetch categories once
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get('/categories');
        setCategories(res.data.data || []);
      } catch (err) {
        console.error('Failed to fetch categories:', err);
      }
    };
    fetchCategories();
  }, []);

  // Fetch listings on filter change
  const fetchListings = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const query = new URLSearchParams();
      if (categoryParam) query.set('category', categoryParam);
      if (searchParam) query.set('search', searchParam);
      if (areaParam) query.set('area', areaParam);
      if (minPriceParam) query.set('minPrice', minPriceParam);
      if (maxPriceParam) query.set('maxPrice', maxPriceParam);
      if (sortParam) query.set('sort', sortParam);
      query.set('page', pageParam);
      query.set('limit', 12);

      const res = await api.get(`/listings?${query.toString()}`);
      setListings(res.data.data || []);
      if (res.data.meta) {
        setMeta(res.data.meta);
      }
    } catch (err) {
      console.error('Failed to load listings:', err);
      setError('Failed to fetch items. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, [categoryParam, searchParam, areaParam, minPriceParam, maxPriceParam, sortParam, pageParam]);

  // Update query params helper
  const updateFilter = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    // Reset to page 1 on filter changes (except page change)
    if (key !== 'page') {
      newParams.set('page', '1');
    }
    setSearchParams(newParams);
  };

  const handlePriceChange = (type, val) => {
    if (type === 'min') updateFilter('minPrice', val);
    if (type === 'max') updateFilter('maxPrice', val);
  };

  const handleResetFilters = () => {
    setSearchParams(new URLSearchParams());
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {categoryParam ? `${categoryParam} for Rent` : 'Browse Marketplace'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {meta.total} {meta.total === 1 ? 'item' : 'items'} available for peer-to-peer rental
            {areaParam ? ` in "${areaParam}"` : ''}
            {searchParam ? ` matching "${searchParam}"` : ''}
          </p>
        </div>

        {/* Mobile Filter Toggle Button */}
        <div className="flex items-center gap-2 lg:hidden">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsMobileFiltersOpen(true)}
            className="w-full sm:w-auto"
          >
            <SlidersHorizontal className="w-4 h-4 mr-2 text-brand-600" />
            Filters {categoryParam || areaParam || minPriceParam || maxPriceParam ? '• Active' : ''}
          </Button>
        </div>
      </div>

      {/* Main Content Layout: Sidebar + Grid */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Desktop Sidebar Filters */}
        <div className="hidden lg:block lg:col-span-1">
          <div className="sticky top-24">
            <ListingFilters
              categories={categories}
              selectedCategory={categoryParam}
              onSelectCategory={(cat) => updateFilter('category', cat)}
              minPrice={minPriceParam}
              maxPrice={maxPriceParam}
              onPriceChange={handlePriceChange}
              area={areaParam}
              onAreaChange={(val) => updateFilter('area', val)}
              sort={sortParam}
              onSortChange={(val) => updateFilter('sort', val)}
              onReset={handleResetFilters}
            />
          </div>
        </div>

        {/* Listings Grid Area */}
        <div className="lg:col-span-3 space-y-8">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <ListingCardSkeleton key={i} />
              ))}
            </div>
          ) : error ? (
            <ErrorState message={error} onRetry={fetchListings} />
          ) : listings.length === 0 ? (
            <EmptyState
              title="No items found"
              description="No listings match your current search and filter criteria. Try clearing some filters or searching a different term."
              actionText="Reset Filters"
              onAction={handleResetFilters}
            />
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {listings.map((item) => (
                  <ListingCard key={item.id} listing={item} />
                ))}
              </div>

              {/* Pagination Controls */}
              {meta.totalPages > 1 && (
                <div className="flex items-center justify-between pt-6 border-t border-slate-200">
                  <div className="text-xs text-slate-500">
                    Showing Page <span className="font-semibold text-slate-900">{meta.page}</span> of{' '}
                    <span className="font-semibold text-slate-900">{meta.totalPages}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={meta.page <= 1}
                      onClick={() => updateFilter('page', (meta.page - 1).toString())}
                    >
                      <ChevronLeft className="w-4 h-4 mr-1" />
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={meta.page >= meta.totalPages}
                      onClick={() => updateFilter('page', (meta.page + 1).toString())}
                    >
                      Next
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Mobile Filters Slide-in Modal Drawer */}
      {isMobileFiltersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm"
            onClick={() => setIsMobileFiltersOpen(false)}
          />
          <div className="relative ml-auto w-full max-w-xs bg-white h-full shadow-2xl p-6 overflow-y-auto z-10 flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="font-bold text-slate-900">Filters</span>
                <button
                  onClick={() => setIsMobileFiltersOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <ListingFilters
                categories={categories}
                selectedCategory={categoryParam}
                onSelectCategory={(cat) => updateFilter('category', cat)}
                minPrice={minPriceParam}
                maxPrice={maxPriceParam}
                onPriceChange={handlePriceChange}
                area={areaParam}
                onAreaChange={(val) => updateFilter('area', val)}
                sort={sortParam}
                onSortChange={(val) => updateFilter('sort', val)}
                onReset={handleResetFilters}
              />
            </div>

            <Button
              variant="primary"
              className="w-full mt-6"
              onClick={() => setIsMobileFiltersOpen(false)}
            >
              Show Results
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
