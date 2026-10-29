import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  MapPin,
  Shield,
  ShieldCheck,
  Calendar,
  Lock,
  Truck,
  ArrowLeft,
  CheckCircle2,
  Info
} from 'lucide-react';
import api from '../api/axios';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Skeleton } from '../components/ui/Skeleton';
import { ErrorState } from '../components/ui/ErrorState';

export const ListingDetailPage = () => {
  const { id } = useParams();
  const [listing, setListing] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchListing = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await api.get(`/listings/${id}`);
        setListing(res.data.data?.listing || null);
      } catch (err) {
        console.error('Failed to fetch listing detail:', err);
        setError('This listing could not be found or has been removed.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchListing();
  }, [id]);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <Skeleton className="h-6 w-32" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="aspect-[16/10] w-full rounded-3xl" />
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-24 w-full" />
          </div>
          <div className="lg:col-span-1">
            <Skeleton className="h-96 w-full rounded-3xl" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16">
        <ErrorState
          title="Listing unavailable"
          message={error || 'Unable to display listing details.'}
          onRetry={() => window.location.reload()}
        />
        <div className="text-center mt-6">
          <Link to="/browse">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to Browse
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const images = listing.images && listing.images.length > 0 ? listing.images : [];
  const currentImage = images[activeImageIndex] || 'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?auto=format&fit=crop&w=1200&q=80';
  const ownerJoinedYear = listing.owner?.createdAt
    ? new Date(listing.owner.createdAt).getFullYear()
    : '2025';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Back Button & Category Breadcrumb */}
      <div className="flex items-center gap-2 mb-6 text-xs text-slate-500 font-medium">
        <Link to="/browse" className="hover:text-brand-600 flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" />
          Browse
        </Link>
        <span>/</span>
        <Link
          to={`/browse?category=${encodeURIComponent(listing.category?.name || '')}`}
          className="hover:text-brand-600"
        >
          {listing.category?.name}
        </Link>
        <span>/</span>
        <span className="text-slate-800 truncate max-w-xs">{listing.title}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left Column (8 cols): Photo Gallery, Overview, Description, Owner Card */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-8">
          
          {/* Photo Gallery */}
          <div className="space-y-3">
            {/* Main Preview Image */}
            <div className="relative aspect-[16/10] sm:aspect-[16/10] w-full overflow-hidden rounded-3xl bg-slate-100 border border-slate-200/80 shadow-card">
              <img
                src={currentImage}
                alt={listing.title}
                className="h-full w-full object-cover object-center transition-all duration-300"
              />
              <span className="absolute top-4 left-4 bg-white/95 backdrop-blur-md text-slate-900 text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
                {listing.category?.name}
              </span>
            </div>

            {/* Thumbnail Carousel (if > 1 image) */}
            {images.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-2">
                {images.map((imgUrl, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveImageIndex(index)}
                    className={`relative w-20 h-16 sm:w-24 sm:h-20 flex-shrink-0 rounded-xl overflow-hidden border-2 transition-all ${
                      activeImageIndex === index
                        ? 'border-brand-600 ring-2 ring-brand-100'
                        : 'border-slate-200 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={imgUrl}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Title & Key Attributes */}
          <div className="space-y-3 pb-6 border-b border-slate-200">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="indigo">{listing.category?.name}</Badge>
              <div className="flex items-center gap-1 text-xs font-medium text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full">
                <MapPin className="w-3.5 h-3.5 text-brand-600" />
                <span>{listing.area}</span>
              </div>
              <div className="flex items-center gap-1 text-xs font-medium text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full">
                <Truck className="w-3.5 h-3.5 text-emerald-600" />
                <span>{listing.pickupPreference}</span>
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
              {listing.title}
            </h1>
          </div>

          {/* Description */}
          <div className="space-y-4 pb-6 border-b border-slate-200">
            <h2 className="text-lg font-bold text-slate-900">About this item</h2>
            <div className="text-sm sm:text-base text-slate-600 leading-relaxed whitespace-pre-line">
              {listing.description}
            </div>
          </div>

          {/* Owner Info Card */}
          {/* CRITICAL SECURITY REQUIREMENT: Do not expose phone or address. Show disabled Contact button */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-subtle space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Item Hosted By
            </h3>
            
            <div className="flex items-start sm:items-center justify-between flex-col sm:flex-row gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-brand-100 text-brand-700 font-bold text-lg flex items-center justify-center flex-shrink-0 shadow-sm">
                  {listing.owner?.name ? listing.owner.name[0].toUpperCase() : 'O'}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-slate-900 text-base">
                      {listing.owner?.name || 'Verified Owner'}
                    </span>
                    <ShieldCheck className="w-4 h-4 text-brand-600" title="Verified Owner" />
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Community member since {ownerJoinedYear} • Fast responder
                  </p>
                </div>
              </div>

              {/* Disabled contact button per prompt instruction */}
              <Button
                variant="outline"
                size="sm"
                disabled
                className="opacity-70 cursor-not-allowed text-xs text-slate-500 bg-slate-50 border-slate-200"
                title="Direct owner contact opens upon rental booking confirmation"
              >
                <Lock className="w-3.5 h-3.5 mr-1.5 text-slate-400" />
                Contact available after booking
              </Button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-4 border-t border-slate-100 text-xs text-slate-600">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                <span>Verified Email</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                <span>ID Checked</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                <span>Secure Deposit</span>
              </div>
            </div>
          </div>

          {/* Trust & Safety Assurance */}
          <div className="rounded-2xl bg-indigo-50/60 border border-indigo-100 p-5 flex items-start gap-3.5 text-indigo-950">
            <Shield className="w-5 h-5 text-brand-600 flex-shrink-0 mt-0.5" />
            <div className="text-xs leading-relaxed">
              <span className="font-semibold block mb-0.5">RentKart Peer Protection</span>
              Every rental item is verified for accuracy. Security deposits are held in escrow and returned immediately upon damage-free return.
            </div>
          </div>
        </div>

        {/* Right Column (5 cols): Sticky Booking Card */}
        <div className="lg:col-span-5 xl:col-span-4">
          <div className="sticky top-24 rounded-3xl border border-slate-200 bg-white p-6 shadow-floating space-y-6">
            
            {/* Price Header */}
            <div className="flex items-baseline justify-between pb-4 border-b border-slate-100">
              <div>
                <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
                  ₹{Number(listing.pricePerDay).toLocaleString('en-IN')}
                </span>
                <span className="text-xs text-slate-500 ml-1 font-medium">/ day</span>
              </div>
              <Badge variant="emerald">Available Now</Badge>
            </div>

            {/* Refundable Deposit Display */}
            <div className="rounded-2xl bg-slate-50 border border-slate-200/80 p-3.5 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-slate-700 font-medium">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Refundable Deposit</span>
              </div>
              <span className="font-bold text-slate-900">
                ₹{Number(listing.depositAmount).toLocaleString('en-IN')}
              </span>
            </div>

            {/* Date Input Placeholder */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Rental Period
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Select pickup & return dates"
                  disabled
                  className="w-full text-xs font-medium rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-3 text-slate-500 cursor-not-allowed pl-10"
                />
                <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              </div>
            </div>

            {/* Estimated Price Breakdown (Example Calculation) */}
            <div className="space-y-2.5 pt-2 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Rental rate (1 day)</span>
                <span>₹{Number(listing.pricePerDay).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Refundable security deposit</span>
                <span>₹{Number(listing.depositAmount).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Platform peer insurance fee</span>
                <span className="text-emerald-600 font-medium">Free</span>
              </div>
              <div className="pt-3 border-t border-slate-100 flex justify-between font-bold text-sm text-slate-900">
                <span>Total amount at checkout</span>
                <span>₹{(Number(listing.pricePerDay) + Number(listing.depositAmount)).toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Disabled Request to Book Button per MVP instructions */}
            <div className="space-y-2">
              <Button
                variant="primary"
                size="lg"
                disabled
                className="w-full font-bold shadow-md opacity-60 cursor-not-allowed"
              >
                Request to Book
              </Button>
              <p className="text-[11px] text-center text-slate-400">
                Booking transactions will unlock in the next release.
              </p>
            </div>

            {/* Guarantee note */}
            <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500 pt-2">
              <Info className="w-3.5 h-3.5 text-slate-400" />
              <span>You won't be charged yet</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
