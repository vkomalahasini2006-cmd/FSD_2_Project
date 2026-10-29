import React from 'react';
import { Link } from 'react-router-dom';
import { Search, Home, ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/Button';

export const NotFoundPage = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 py-16">
      <div className="w-16 h-16 rounded-3xl bg-indigo-50 border border-brand-100 flex items-center justify-center text-brand-600 mb-6 shadow-sm">
        <Search className="w-8 h-8" />
      </div>
      <span className="text-sm font-bold text-brand-600 tracking-wider uppercase mb-1">
        404 Error
      </span>
      <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
        Page Not Found
      </h1>
      <p className="text-sm text-slate-500 max-w-md mb-8 leading-relaxed">
        The rental page or item you were looking for doesn't exist or might have been relocated.
      </p>
      <div className="flex items-center gap-3">
        <Link to="/">
          <Button variant="primary">
            <Home className="w-4 h-4 mr-2" />
            Return Home
          </Button>
        </Link>
        <Link to="/browse">
          <Button variant="outline">
            Browse Marketplace
          </Button>
        </Link>
      </div>
    </div>
  );
};
