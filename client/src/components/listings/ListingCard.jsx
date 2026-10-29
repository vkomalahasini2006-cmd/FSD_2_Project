import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Shield } from 'lucide-react';

export const ListingCard = ({ listing }) => {
  const primaryImage =
    listing.images && listing.images.length > 0
      ? listing.images[0]
      : 'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?auto=format&fit=crop&w=800&q=80';

  return (
    <Link
      to={`/listings/${listing.id}`}
      className="group flex flex-col rounded-2xl bg-white border border-slate-200/80 shadow-subtle hover:shadow-floating hover:border-slate-300 transition-all duration-300 overflow-hidden"
    >
      {/* Image Container with Airbnb-style hover zoom */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
        <img
          src={primaryImage}
          alt={listing.title}
          loading="lazy"
          className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
        />

        {/* Category Pill */}
        {listing.category?.name && (
          <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-md text-slate-800 text-[11px] font-semibold px-2.5 py-1 rounded-full shadow-sm">
            {listing.category.name}
          </span>
        )}

        {/* Pickup Preference Tag */}
        {listing.pickupPreference && (
          <span className="absolute bottom-3 left-3 bg-slate-900/80 backdrop-blur-sm text-white text-[10px] font-medium px-2 py-0.5 rounded-md">
            {listing.pickupPreference}
          </span>
        )}
      </div>

      {/* Card Body */}
      <div className="p-4 flex flex-col flex-1 justify-between gap-3">
        <div>
          {/* Location / Area */}
          <div className="flex items-center gap-1 text-slate-500 text-xs font-medium mb-1">
            <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
            <span className="truncate">{listing.area}</span>
          </div>

          {/* Title */}
          <h3 className="text-sm font-semibold text-slate-900 group-hover:text-brand-600 transition-colors line-clamp-2 leading-snug">
            {listing.title}
          </h3>
        </div>

        {/* Pricing & Deposit */}
        <div className="pt-2 border-t border-slate-100 flex items-baseline justify-between">
          <div className="flex items-baseline gap-1">
            <span className="text-base font-bold text-slate-900">
              ₹{Number(listing.pricePerDay).toLocaleString('en-IN')}
            </span>
            <span className="text-xs text-slate-500 font-normal">/ day</span>
          </div>

          <div className="flex items-center gap-1 text-[11px] text-slate-500 bg-slate-50 px-2 py-0.5 rounded-full border border-slate-100">
            <Shield className="w-3 h-3 text-emerald-600" />
            <span>₹{Number(listing.depositAmount).toLocaleString('en-IN')} dep</span>
          </div>
        </div>
      </div>
    </Link>
  );
};
