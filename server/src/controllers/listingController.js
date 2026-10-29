import * as listingService from '../services/listingService.js';
import { uploadService } from '../services/uploadService.js';
import { ApiResponse, AppError } from '../utils/apiResponse.js';

export const getListings = async (req, res, next) => {
  try {
    const { listings, meta } = await listingService.getListings(req.query);
    return ApiResponse.success(res, {
      statusCode: 200,
      message: 'Listings fetched successfully',
      data: listings,
      meta
    });
  } catch (error) {
    next(error);
  }
};

export const getListingById = async (req, res, next) => {
  try {
    const listing = await listingService.getListingById(req.params.id, req.user?.id);
    return ApiResponse.success(res, {
      statusCode: 200,
      message: 'Listing retrieved successfully',
      data: { listing }
    });
  } catch (error) {
    next(error);
  }
};

export const getMyListings = async (req, res, next) => {
  try {
    const listings = await listingService.getMyListings(req.user.id);
    return ApiResponse.success(res, {
      statusCode: 200,
      message: 'Owner listings fetched successfully',
      data: listings
    });
  } catch (error) {
    next(error);
  }
};

export const createListing = async (req, res, next) => {
  try {
    let imageUrls = [];

    // Process files if uploaded via multipart/form-data
    if (req.files && req.files.length > 0) {
      imageUrls = await uploadService.uploadMultiple(req.files);
    } else if (req.body.images) {
      imageUrls = Array.isArray(req.body.images) ? req.body.images : [req.body.images];
    }

    if (imageUrls.length === 0) {
      throw new AppError('Please provide at least one photo for your listing.', 400, 'IMAGES_REQUIRED');
    }

    const newListing = await listingService.createListing(req.user.id, req.body, imageUrls);

    return ApiResponse.success(res, {
      statusCode: 201,
      message: 'Listing created successfully',
      data: { listing: newListing }
    });
  } catch (error) {
    next(error);
  }
};

export const updateListing = async (req, res, next) => {
  try {
    let newImageUrls = null;

    if (req.files && req.files.length > 0) {
      newImageUrls = await uploadService.uploadMultiple(req.files);
    } else if (req.body.images) {
      newImageUrls = Array.isArray(req.body.images) ? req.body.images : [req.body.images];
    }

    const updated = await listingService.updateListing(
      req.params.id,
      req.user.id,
      req.body,
      newImageUrls
    );

    return ApiResponse.success(res, {
      statusCode: 200,
      message: 'Listing updated successfully',
      data: { listing: updated }
    });
  } catch (error) {
    next(error);
  }
};

export const deleteListing = async (req, res, next) => {
  try {
    const result = await listingService.deleteListing(req.params.id, req.user.id);
    return ApiResponse.success(res, {
      statusCode: 200,
      message: result.message
    });
  } catch (error) {
    next(error);
  }
};
