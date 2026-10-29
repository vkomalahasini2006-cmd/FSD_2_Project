import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ArrowRight, ShieldCheck, CalendarCheck, Sparkles, MapPin } from 'lucide-react';
import api from '../api/axios';
import { ListingCard } from '../components/listings/ListingCard';
import { ListingCardSkeleton } from '../components/ui/Skeleton';
import { EmptyState } from '../components/ui/EmptyState';
import { ErrorState } from '../components/ui/ErrorState';
import { Button } from '../components/ui/Button';
import { getCategoryIcon } from '../utils/categoryIcons';

export const HomePage = () => {
  const [categories, setCategories] = useState([]);
  const [featuredListings, setFeaturedListings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedArea, setSelectedArea] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [catRes, listRes] = await Promise.all([
          api.get('/categories'),
          api.get('/listings?limit=8')
        ]);
        setCategories(catRes.data.data || []);
        setFeaturedListings(listRes.data.data || []);
      } catch (err) {
        console.error('Failed to load home page data:', err);
        setError('Unable to load featured items. Please check if the server is running.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleHeroSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchTerm.trim()) params.set('search', searchTerm.trim());
    if (selectedArea) params.set('area', selectedArea);
    navigate(`/browse?${params.toString()}`);
  };

  return (
    <div className="space-y-16 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-brand-50/70 via-white to-transparent pt-12 pb-16 sm:pt-20 sm:pb-24 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-100/80 text-brand-700 text-xs font-semibold mb-6 animate-in fade-in slide-in-from-top-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Peer-to-peer rental marketplace in AP & Telangana</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 tracking-tight max-w-4xl mx-auto leading-[1.15]">
            Rent anything you need,{' '}
            <span className="text-brand-600 underline decoration-brand-300 underline-offset-8">
              right from your neighbors
            </span>
          </h1>

          <p className="mt-5 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Why buy when you can rent? High-end cameras, power tools, party speakers, gaming consoles, and trekking gear in Vijayawada, Hyderabad & Guntur.
          </p>

          {/* Large Hero Search Box */}
          <div className="mt-10 max-w-3xl mx-auto">
            <form
              onSubmit={handleHeroSearch}
              className="bg-white p-2.5 sm:p-3 rounded-2xl sm:rounded-full shadow-floating border border-slate-200 flex flex-col sm:flex-row items-center gap-2"
            >
              <div className="flex-1 w-full flex items-center px-4 gap-3 py-2 sm:py-0 border-b sm:border-b-0 sm:border-r border-slate-100">
                <Search className="w-5 h-5 text-slate-400 flex-shrink-0" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="What are you looking to rent today?"
                  className="w-full text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none bg-transparent"
                />
              </div>

              <div className="w-full sm:w-auto flex items-center px-4 gap-2 py-2 sm:py-0">
                <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0" />
                <select
                  value={selectedArea}
                  onChange={(e) => setSelectedArea(e.target.value)}
                  className="w-full sm:w-44 text-xs font-medium text-slate-700 bg-transparent focus:outline-none cursor-pointer"
                >
                  <option value="">All Locations</option>
                  <option value="Vijayawada">Vijayawada</option>
                  <option value="Hyderabad">Hyderabad</option>
                  <option value="Guntur">Guntur</option>
                  <option value="Benz Circle">Benz Circle</option>
                  <option value="Gachibowli">Gachibowli</option>
                  <option value="Madhapur">Madhapur</option>
                  <option value="Brodipet">Brodipet</option>
                </select>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="md"
                className="w-full sm:w-auto rounded-xl sm:rounded-full px-7 py-3 font-semibold shadow-md"
              >
                Find Rentals
              </Button>
            </form>

            {/* Quick Keyword Suggestions */}
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-500">
              <span className="font-medium text-slate-400">Popular:</span>
              <button
                type="button"
                onClick={() => navigate('/browse?search=Sony')}
                className="hover:text-brand-600 bg-white px-2.5 py-1 rounded-full border border-slate-200 transition-colors"
              >
                Sony A7 IV
              </button>
              <button
                type="button"
                onClick={() => navigate('/browse?search=PS5')}
                className="hover:text-brand-600 bg-white px-2.5 py-1 rounded-full border border-slate-200 transition-colors"
              >
                PS5 Console
              </button>
              <button
                type="button"
                onClick={() => navigate('/browse?search=MacBook')}
                className="hover:text-brand-600 bg-white px-2.5 py-1 rounded-full border border-slate-200 transition-colors"
              >
                MacBook Pro
              </button>
              <button
                type="button"
                onClick={() => navigate('/browse?search=Drill')}
                className="hover:text-brand-600 bg-white px-2.5 py-1 rounded-full border border-slate-200 transition-colors"
              >
                Bosch Drill
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Category Icon Row */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Explore by Category</h2>
            <p className="text-xs text-slate-500 mt-0.5">Find verified equipment in top rental categories</p>
          </div>
          <Link
            to="/browse"
            className="text-xs font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1 group"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 sm:gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/browse?category=${encodeURIComponent(cat.name)}`}
              className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white border border-slate-200/80 hover:border-brand-300 hover:shadow-card hover:-translate-y-1 transition-all group text-center"
            >
              <div className="w-12 h-12 rounded-xl bg-slate-50 text-slate-600 group-hover:bg-brand-50 group-hover:text-brand-600 flex items-center justify-center transition-colors mb-2.5">
                {getCategoryIcon(cat.icon || cat.name, 'w-6 h-6')}
              </div>
              <span className="text-xs font-semibold text-slate-800 group-hover:text-brand-600 transition-colors">
                {cat.name}
              </span>
              {cat._count?.listings !== undefined && (
                <span className="text-[10px] text-slate-400 mt-0.5">
                  {cat._count.listings} items
                </span>
              )}
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Listings Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Featured Rentals</h2>
            <p className="text-xs text-slate-500 mt-0.5">Top-rated items ready for instant peer rental</p>
          </div>
          <Link
            to="/browse"
            className="text-xs font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1 group"
          >
            <span>See more items</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <ListingCardSkeleton key={i} />
            ))}
          </div>
        ) : error ? (
          <ErrorState message={error} onRetry={() => window.location.reload()} />
        ) : featuredListings.length === 0 ? (
          <EmptyState
            title="No featured listings found"
            description="Run the database seed script to load 20 realistic listings across categories."
            actionText="Browse All"
            onAction={() => navigate('/browse')}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {featuredListings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        )}
      </section>

      {/* How RentKart Works (3 Steps) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-slate-900 text-white p-8 sm:p-14 overflow-hidden relative shadow-floating">
          <div className="max-w-2xl mb-10">
            <span className="text-brand-400 text-xs font-bold tracking-wider uppercase">
              Simple & Transparent
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1 text-white">
              How RentKart Works
            </h2>
            <p className="text-slate-400 text-sm mt-2">
              Rent high quality items directly from verified individuals in 3 effortless steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
            <div className="flex flex-col gap-3 bg-slate-800/60 border border-slate-700/60 p-6 rounded-2xl">
              <div className="w-10 h-10 rounded-xl bg-brand-600/20 text-brand-400 font-bold flex items-center justify-center text-base border border-brand-500/30">
                1
              </div>
              <h3 className="text-base font-bold text-white">Discover & Pick</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Browse verified local listings in Vijayawada, Guntur, and Hyderabad with clear photos and transparent daily rates.
              </p>
            </div>

            <div className="flex flex-col gap-3 bg-slate-800/60 border border-slate-700/60 p-6 rounded-2xl">
              <div className="w-10 h-10 rounded-xl bg-brand-600/20 text-brand-400 font-bold flex items-center justify-center text-base border border-brand-500/30">
                2
              </div>
              <h3 className="text-base font-bold text-white">Deposit & Confirm</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Choose your rental dates and review the fully refundable security deposit. Enjoy transparent pricing with zero surprise charges.
              </p>
            </div>

            <div className="flex flex-col gap-3 bg-slate-800/60 border border-slate-700/60 p-6 rounded-2xl">
              <div className="w-10 h-10 rounded-xl bg-brand-600/20 text-brand-400 font-bold flex items-center justify-center text-base border border-brand-500/30">
                3
              </div>
              <h3 className="text-base font-bold text-white">Pickup, Use & Return</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Pickup from the verified owner or select doorstep delivery. Complete your project, shoot your video, and return safely.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Owner Call to Action */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-brand-200 bg-gradient-to-r from-brand-600 to-indigo-700 p-8 sm:p-12 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-card">
          <div className="max-w-xl text-center sm:text-left">
            <h3 className="text-2xl font-extrabold tracking-tight">Turn your idle assets into monthly income</h3>
            <p className="text-brand-100 text-sm mt-2">
              Cameras, bikes, laptops, and outdoor equipment sitting on your shelf? List them on RentKart in under 2 minutes and earn safely.
            </p>
          </div>
          <Link to="/register" className="flex-shrink-0">
            <Button variant="secondary" size="lg" className="bg-white text-brand-700 hover:bg-brand-50 shadow-md">
              Start Listing Today
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};
