import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, ShieldCheck, HeartHandshake, Sparkles } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="mt-auto border-t border-slate-200 bg-white">
      {/* Trust Highlights */}
      <div className="border-b border-slate-100 bg-slate-50/60 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
            <div className="flex items-center gap-4 justify-center md:justify-start">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-brand-600 flex items-center justify-center flex-shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-900">Verified Peer Community</h4>
                <p className="text-xs text-slate-500 mt-0.5">Verified emails and secure OTP-backed authentication.</p>
              </div>
            </div>

            <div className="flex items-center gap-4 justify-center md:justify-start">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-900">Refundable Deposits</h4>
                <p className="text-xs text-slate-500 mt-0.5">Clear upfront deposit transparency with zero surprises.</p>
              </div>
            </div>

            <div className="flex items-center gap-4 justify-center md:justify-start">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-900">Sustainable Sharing</h4>
                <p className="text-xs text-slate-500 mt-0.5">Earn from your idle gear and rent instead of buying new.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-white">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <span className="text-lg font-bold text-slate-900">
                Rent<span className="text-brand-600">Kart</span>
              </span>
            </Link>
            <p className="text-xs text-slate-500 leading-relaxed max-w-xs">
              The premier peer-to-peer marketplace to rent quality gear, tools, cameras, and outfits directly from trusted locals.
            </p>
          </div>

          <div>
            <h5 className="text-xs font-semibold text-slate-900 uppercase tracking-wider mb-3">
              Explore Categories
            </h5>
            <ul className="space-y-2 text-xs text-slate-500">
              <li><Link to="/browse?category=Cameras" className="hover:text-brand-600 transition-colors">Cameras & Lenses</Link></li>
              <li><Link to="/browse?category=Bikes" className="hover:text-brand-600 transition-colors">Bikes & Scooters</Link></li>
              <li><Link to="/browse?category=Tools" className="hover:text-brand-600 transition-colors">Power Tools</Link></li>
              <li><Link to="/browse?category=Gaming" className="hover:text-brand-600 transition-colors">Gaming Consoles</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="text-xs font-semibold text-slate-900 uppercase tracking-wider mb-3">
              Host on RentKart
            </h5>
            <ul className="space-y-2 text-xs text-slate-500">
              <li><Link to="/register" className="hover:text-brand-600 transition-colors">Become an Owner</Link></li>
              <li><Link to="/add-listing" className="hover:text-brand-600 transition-colors">List an Item</Link></li>
              <li><span className="text-slate-400">Owner Protection Guarantee</span></li>
              <li><span className="text-slate-400">Pricing Calculator</span></li>
            </ul>
          </div>

          <div>
            <h5 className="text-xs font-semibold text-slate-900 uppercase tracking-wider mb-3">
              Locations
            </h5>
            <ul className="space-y-2 text-xs text-slate-500">
              <li><Link to="/browse?area=Vijayawada" className="hover:text-brand-600 transition-colors">Vijayawada</Link></li>
              <li><Link to="/browse?area=Hyderabad" className="hover:text-brand-600 transition-colors">Hyderabad</Link></li>
              <li><Link to="/browse?area=Guntur" className="hover:text-brand-600 transition-colors">Guntur</Link></li>
              <li><Link to="/browse" className="hover:text-brand-600 transition-colors">View All Hubs</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-100 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>&copy; {new Date().getFullYear()} RentKart Marketplace Inc. Built for peer-to-peer sharing.</p>
          <div className="flex gap-4">
            <span className="hover:text-slate-600 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-600 cursor-pointer">Terms of Service</span>
            <span className="hover:text-slate-600 cursor-pointer">Trust & Safety</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
