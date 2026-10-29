import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  UploadCloud,
  X,
  IndianRupee,
  ShieldCheck,
  Lock,
  ArrowLeft,
  CheckCircle2,
  Info
} from 'lucide-react';
import api from '../../api/axios';
import { useToast } from '../../context/ToastContext';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';

export const AddListingPage = () => {
  const toast = useToast();
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    categoryId: '',
    pricePerDay: '',
    depositAmount: '',
    pickupPreference: 'Self Pickup',
    area: '',
    privateAddress: '',
    description: ''
  });

  const [images, setImages] = useState([]); // File objects
  const [imagePreviews, setImagePreviews] = useState([]);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Fetch categories
  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await api.get('/categories');
        setCategories(res.data.data || []);
      } catch (err) {
        console.error('Failed to load categories:', err);
      }
    };
    fetchCats();
  }, []);

  // Handle image selection
  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    if (images.length + files.length > 4) {
      toast.error('You can upload a maximum of 4 photos per listing.');
      return;
    }

    const newImages = [...images, ...files];
    setImages(newImages);

    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews([...imagePreviews, ...newPreviews]);
  };

  const removeImage = (index) => {
    URL.revokeObjectURL(imagePreviews[index]);
    setImages(images.filter((_, i) => i !== index));
    setImagePreviews(imagePreviews.filter((_, i) => i !== index));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim() || formData.title.trim().length < 3) {
      newErrors.title = 'Title must be at least 3 characters long';
    }
    if (!formData.categoryId) {
      newErrors.categoryId = 'Please select a category';
    }
    if (!formData.pricePerDay || Number(formData.pricePerDay) <= 0) {
      newErrors.pricePerDay = 'Enter a valid daily rental rate greater than 0';
    }
    if (formData.depositAmount === '' || Number(formData.depositAmount) < 0) {
      newErrors.depositAmount = 'Enter a valid security deposit (can be 0)';
    }
    if (!formData.area.trim()) {
      newErrors.area = 'Neighborhood or area is required (e.g. Benz Circle, Vijayawada)';
    }
    if (!formData.privateAddress.trim() || formData.privateAddress.trim().length < 5) {
      newErrors.privateAddress = 'Full private address is required for verification';
    }
    if (!formData.description.trim() || formData.description.trim().length < 10) {
      newErrors.description = 'Please provide at least 10 characters describing the item';
    }
    if (images.length === 0) {
      newErrors.images = 'Please upload at least 1 photo of your item (up to 4)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    setErrors({});
    try {
      const data = new FormData();
      data.append('title', formData.title.trim());
      data.append('categoryId', formData.categoryId);
      data.append('pricePerDay', formData.pricePerDay);
      data.append('depositAmount', formData.depositAmount);
      data.append('pickupPreference', formData.pickupPreference);
      data.append('area', formData.area.trim());
      data.append('privateAddress', formData.privateAddress.trim());
      data.append('description', formData.description.trim());

      images.forEach((img) => {
        data.append('images', img);
      });

      const res = await api.post('/listings', data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      toast.success('Your listing is live and ready for renters!');
      navigate('/my-listings');
    } catch (err) {
      console.error('Error creating listing:', err);
      const resData = err.response?.data;
      if (resData?.error?.details && Array.isArray(resData.error.details)) {
        const fieldErrors = {};
        resData.error.details.forEach((d) => {
          fieldErrors[d.field] = d.message;
        });
        setErrors(fieldErrors);
      }
      toast.error(resData?.error?.message || 'Failed to create listing. Please check required fields.');
    } finally {
      setIsLoading(false);
    }
  };

  const categoryOptions = categories.map((cat) => ({
    value: cat.id,
    label: cat.name
  }));

  const pickupOptions = [
    { value: 'Self Pickup', label: 'Self Pickup by Renter' },
    { value: 'Doorstep Delivery', label: 'Doorstep Delivery Available' },
    { value: 'Meet at Public Spot', label: 'Meet at Public Landmark' }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Top Navigation */}
      <div className="mb-6">
        <Link
          to="/my-listings"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-brand-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to My Listings
        </Link>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-10 shadow-floating">
        
        {/* Form Header */}
        <div className="pb-6 border-b border-slate-200 mb-8">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            List an Item for Peer Rental
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Provide accurate details, crisp photos, and sensible pricing to get verified renters quickly.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Section 1: Item Overview */}
          <div className="space-y-4">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              1. Item Information
            </h2>

            <Input
              label="Listing Title"
              placeholder="e.g. Sony Alpha A7 IV Mirrorless Camera with 24-70mm Lens"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              error={errors.title}
              helperText="Be specific with model name, version, and key bundled accessories."
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select
                label="Category"
                options={categoryOptions}
                placeholder="Select category"
                value={formData.categoryId}
                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                error={errors.categoryId}
              />

              <Select
                label="Pickup Preference"
                options={pickupOptions}
                value={formData.pickupPreference}
                onChange={(e) => setFormData({ ...formData, pickupPreference: e.target.value })}
              />
            </div>

            <div className="space-y-1.5 text-left">
              <label className="block text-sm font-medium text-slate-700">
                Detailed Description
              </label>
              <textarea
                rows={4}
                placeholder="Describe condition, specifications, what's included (batteries, cables, bag), and usage guidelines..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className={`w-full rounded-xl border bg-white p-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-offset-0 ${
                  errors.description
                    ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-200'
                    : 'border-slate-300 hover:border-slate-400 focus:border-brand-500 focus:ring-brand-100'
                }`}
              />
              {errors.description && (
                <p className="text-xs font-medium text-rose-600">{errors.description}</p>
              )}
            </div>
          </div>

          {/* Section 2: Pricing & Deposit */}
          <div className="space-y-4 pt-6 border-t border-slate-200">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              2. Rental Pricing & Security Deposit
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Daily Rental Rate (₹ / Day)"
                type="number"
                min="1"
                placeholder="800"
                value={formData.pricePerDay}
                onChange={(e) => setFormData({ ...formData, pricePerDay: e.target.value })}
                error={errors.pricePerDay}
                helperText="Believable market rate per calendar day."
              />

              <Input
                label="Refundable Security Deposit (₹)"
                type="number"
                min="0"
                placeholder="4000"
                value={formData.depositAmount}
                onChange={(e) => setFormData({ ...formData, depositAmount: e.target.value })}
                error={errors.depositAmount}
                helperText="Refunded to renter once item is returned in sound condition."
              />
            </div>
          </div>

          {/* Section 3: Location & Confidential Address */}
          <div className="space-y-4 pt-6 border-t border-slate-200">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                3. Location & Privacy
              </h2>
              <div className="flex items-center gap-1.5 text-xs text-brand-700 bg-brand-50 px-2.5 py-1 rounded-full border border-brand-100">
                <Lock className="w-3.5 h-3.5" />
                <span>Address is kept private</span>
              </div>
            </div>

            <Input
              label="Public Area / Neighborhood"
              placeholder="e.g. Benz Circle, Vijayawada or Gachibowli, Hyderabad"
              value={formData.area}
              onChange={(e) => setFormData({ ...formData, area: e.target.value })}
              error={errors.area}
              helperText="This neighborhood is displayed publicly so nearby renters can locate your item."
            />

            <Input
              label="Full Private Address (Never shown publicly)"
              placeholder="e.g. Flat 301, Sri Ram Residency, 2nd Cross, Near PVP Mall"
              value={formData.privateAddress}
              onChange={(e) => setFormData({ ...formData, privateAddress: e.target.value })}
              error={errors.privateAddress}
              helperText="Used only for identity verification and shared strictly after a booking is confirmed."
            />
          </div>

          {/* Section 4: Photos (Up to 4 images) */}
          <div className="space-y-4 pt-6 border-t border-slate-200">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                4. Photos (Up to 4 Images)
              </h2>
              <span className="text-xs text-slate-500 font-medium">{images.length}/4 selected</span>
            </div>

            {/* Dropzone */}
            {images.length < 4 && (
              <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-300 hover:border-brand-500 rounded-2xl cursor-pointer bg-slate-50/50 hover:bg-brand-50/30 transition-all group">
                <UploadCloud className="w-8 h-8 text-slate-400 group-hover:text-brand-600 mb-2 transition-colors" />
                <span className="text-sm font-semibold text-slate-700 group-hover:text-brand-600">
                  Click to upload photos or drag and drop
                </span>
                <span className="text-xs text-slate-400 mt-1">
                  JPEG, PNG, or WebP up to 5MB each
                </span>
                <input
                  type="file"
                  multiple
                  accept="image/jpeg,image/png,image/webp,image/jpg"
                  onChange={handleImageSelect}
                  className="hidden"
                />
              </label>
            )}

            {errors.images && (
              <p className="text-xs font-medium text-rose-600">{errors.images}</p>
            )}

            {/* Previews Grid */}
            {imagePreviews.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
                {imagePreviews.map((previewUrl, idx) => (
                  <div
                    key={idx}
                    className="relative aspect-[4/3] rounded-xl overflow-hidden border border-slate-200 shadow-sm group"
                  >
                    <img
                      src={previewUrl}
                      alt={`Preview ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="absolute top-2 right-2 p-1 rounded-full bg-slate-900/70 text-white hover:bg-rose-600 transition-colors shadow-sm"
                      title="Remove image"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    {idx === 0 && (
                      <span className="absolute bottom-2 left-2 bg-brand-600/90 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded">
                        Cover Photo
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit Action */}
          <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-end gap-3">
            <Link to="/my-listings" className="w-full sm:w-auto">
              <Button variant="ghost" className="w-full sm:w-auto">
                Cancel
              </Button>
            </Link>
            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isLoading}
              className="w-full sm:w-auto font-bold shadow-md"
            >
              Publish Listing
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
