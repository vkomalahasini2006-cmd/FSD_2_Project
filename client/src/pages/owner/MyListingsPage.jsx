import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  PlusCircle,
  Edit2,
  Trash2,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Package
} from 'lucide-react';
import api from '../../api/axios';
import { useToast } from '../../context/ToastContext';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { Skeleton } from '../../components/ui/Skeleton';
import { EmptyState } from '../../components/ui/EmptyState';
import { ErrorState } from '../../components/ui/ErrorState';

export const MyListingsPage = () => {
  const toast = useToast();
  const [listings, setListings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Edit Modal State
  const [editingListing, setEditingListing] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  // Delete Modal State
  const [deletingListing, setDeletingListing] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchMyListings = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await api.get('/listings/mine');
      setListings(res.data.data || []);
    } catch (err) {
      console.error('Failed to fetch owner listings:', err);
      setError('Failed to load your listings. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMyListings();
  }, []);

  // Handle Edit Click
  const openEditModal = (listing) => {
    setEditingListing({
      ...listing,
      pricePerDay: listing.pricePerDay.toString(),
      depositAmount: listing.depositAmount.toString()
    });
    setIsEditModalOpen(true);
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    if (!editingListing) return;

    setIsUpdating(true);
    try {
      const payload = {
        title: editingListing.title,
        description: editingListing.description,
        pricePerDay: Number(editingListing.pricePerDay),
        depositAmount: Number(editingListing.depositAmount),
        area: editingListing.area,
        pickupPreference: editingListing.pickupPreference,
        isActive: editingListing.isActive
      };

      const res = await api.put(`/listings/${editingListing.id}`, payload);
      toast.success('Listing updated successfully!');
      setIsEditModalOpen(false);
      setEditingListing(null);

      // Refresh list
      setListings((prev) =>
        prev.map((item) =>
          item.id === editingListing.id ? { ...item, ...res.data.data?.listing } : item
        )
      );
    } catch (err) {
      console.error('Update error:', err);
      toast.error(err.response?.data?.error?.message || 'Failed to update listing.');
    } finally {
      setIsUpdating(false);
    }
  };

  // Handle Delete Click
  const openDeleteModal = (listing) => {
    setDeletingListing(listing);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingListing) return;

    setIsDeleting(true);
    try {
      await api.delete(`/listings/${deletingListing.id}`);
      toast.success('Listing removed successfully.');
      setIsDeleteModalOpen(false);
      setListings((prev) => prev.filter((item) => item.id !== deletingListing.id));
      setDeletingListing(null);
    } catch (err) {
      console.error('Delete error:', err);
      toast.error(err.response?.data?.error?.message || 'Failed to delete listing.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            My Rental Listings
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage your peer items, update rental rates, or toggle item availability.
          </p>
        </div>

        <Link to="/add-listing">
          <Button variant="primary" size="md" className="font-semibold shadow-md">
            <PlusCircle className="w-4 h-4 mr-2" />
            Post New Item
          </Button>
        </Link>
      </div>

      {/* Main Content Area */}
      <div className="mt-8">
        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-24 w-full rounded-2xl" />
            ))}
          </div>
        ) : error ? (
          <ErrorState message={error} onRetry={fetchMyListings} />
        ) : listings.length === 0 ? (
          <EmptyState
            icon={Package}
            title="You don't have any items listed yet"
            description="Start earning passive income by listing your cameras, power tools, gaming consoles, or vehicles."
            actionText="Post Your First Item"
            onAction={() => (window.location.href = '/add-listing')}
          />
        ) : (
          /* Listings Table / Cards View */
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-subtle">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600">
                <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-500 border-b border-slate-200">
                  <tr>
                    <th scope="col" className="px-6 py-4">Item Details</th>
                    <th scope="col" className="px-6 py-4">Category</th>
                    <th scope="col" className="px-6 py-4">Price / Day</th>
                    <th scope="col" className="px-6 py-4">Security Deposit</th>
                    <th scope="col" className="px-6 py-4">Status</th>
                    <th scope="col" className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {listings.map((item) => {
                    const thumb =
                      item.images && item.images.length > 0
                        ? item.images[0]
                        : 'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?auto=format&fit=crop&w=400&q=80';

                    return (
                      <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                        {/* Title & Thumbnail */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3.5">
                            <img
                              src={thumb}
                              alt={item.title}
                              className="w-14 h-12 rounded-xl object-cover border border-slate-200 flex-shrink-0"
                            />
                            <div className="max-w-xs">
                              <Link
                                to={`/listings/${item.id}`}
                                className="font-semibold text-slate-900 hover:text-brand-600 transition-colors line-clamp-1"
                              >
                                {item.title}
                              </Link>
                              <p className="text-xs text-slate-400 mt-0.5">{item.area}</p>
                            </div>
                          </div>
                        </td>

                        {/* Category */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-xs font-medium text-slate-700 bg-slate-100 px-2.5 py-1 rounded-full">
                            {item.category?.name || 'Item'}
                          </span>
                        </td>

                        {/* Price */}
                        <td className="px-6 py-4 whitespace-nowrap font-bold text-slate-900">
                          ₹{Number(item.pricePerDay).toLocaleString('en-IN')}
                        </td>

                        {/* Deposit */}
                        <td className="px-6 py-4 whitespace-nowrap font-medium text-slate-600">
                          ₹{Number(item.depositAmount).toLocaleString('en-IN')}
                        </td>

                        {/* Status (Active / Inactive) */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          {item.isActive ? (
                            <Badge variant="emerald">Active</Badge>
                          ) : (
                            <Badge variant="slate">Inactive</Badge>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Link
                              to={`/listings/${item.id}`}
                              className="p-1.5 text-slate-400 hover:text-brand-600 hover:bg-slate-100 rounded-lg transition-colors"
                              title="View Public Listing"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </Link>

                            <button
                              onClick={() => openEditModal(item)}
                              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                              title="Edit Listing"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>

                            <button
                              onClick={() => openDeleteModal(item)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                              title="Delete Listing"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Edit Listing Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Rental Listing"
        maxWidth="max-w-xl"
      >
        {editingListing && (
          <form onSubmit={handleUpdateSubmit} className="space-y-4">
            <Input
              label="Listing Title"
              value={editingListing.title}
              onChange={(e) =>
                setEditingListing({ ...editingListing, title: e.target.value })
              }
              required
            />

            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Daily Price (₹)"
                type="number"
                min="1"
                value={editingListing.pricePerDay}
                onChange={(e) =>
                  setEditingListing({ ...editingListing, pricePerDay: e.target.value })
                }
                required
              />

              <Input
                label="Refundable Deposit (₹)"
                type="number"
                min="0"
                value={editingListing.depositAmount}
                onChange={(e) =>
                  setEditingListing({ ...editingListing, depositAmount: e.target.value })
                }
                required
              />
            </div>

            <Input
              label="Public Area / Neighborhood"
              value={editingListing.area}
              onChange={(e) =>
                setEditingListing({ ...editingListing, area: e.target.value })
              }
              required
            />

            <div className="space-y-1.5 text-left">
              <label className="block text-sm font-medium text-slate-700">
                Description
              </label>
              <textarea
                rows={3}
                value={editingListing.description}
                onChange={(e) =>
                  setEditingListing({ ...editingListing, description: e.target.value })
                }
                className="w-full rounded-xl border border-slate-300 p-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-100 focus:border-brand-500"
                required
              />
            </div>

            <div className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                id="editIsActive"
                checked={editingListing.isActive}
                onChange={(e) =>
                  setEditingListing({ ...editingListing, isActive: e.target.checked })
                }
                className="rounded border-slate-300 text-brand-600 focus:ring-brand-500 h-4 w-4"
              />
              <label htmlFor="editIsActive" className="text-sm font-medium text-slate-700">
                Listing is Active and open for rentals
              </label>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <Button
                variant="ghost"
                type="button"
                onClick={() => setIsEditModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                type="submit"
                isLoading={isUpdating}
                className="font-semibold shadow-md"
              >
                Save Changes
              </Button>
            </div>
          </form>
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirm Deletion"
        maxWidth="max-w-md"
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-3 rounded-xl bg-rose-50 border border-rose-100 text-rose-800 text-sm">
            <AlertTriangle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
            <div>
              Are you sure you want to permanently delete{' '}
              <strong className="font-semibold">"{deletingListing?.title}"</strong>? This action cannot be undone.
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <Button
              variant="ghost"
              type="button"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              type="button"
              isLoading={isDeleting}
              onClick={handleDeleteConfirm}
              className="font-semibold"
            >
              Delete Permanently
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
