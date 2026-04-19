import { Retailer, RetailerResponse, RetailerStatsResponse, SearchRetailerResponse, SingleRetailerResponse } from "@/utils/interface/retailerInterface";
import { apiSlice } from "../apiSlice";

export const retailerApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Create retailer
    createRetailer: builder.mutation<SingleRetailerResponse, Partial<Retailer>>({
      query: (data) => ({
        url: '/retailer/create-retailer',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Retailer'],
    }),

    // Get all retailers with pagination and filters
    getAllRetailers: builder.query<RetailerResponse, {
      page?: number;
      limit?: number;
      search?: string;
      status?: string;
      city?: string;
      businessType?: string;
      rating?: string;
      sortBy?: string;
      sortOrder?: string;
    }>({
      query: (params = {}) => {
        const queryParams = new URLSearchParams();
        
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== '') {
            queryParams.append(key, value.toString());
          }
        });

        return {
          url: `/retailer/get-retailers?${queryParams.toString()}`,
          method: 'GET',
        };
      },
      providesTags: ['Retailer'],
    }),

    // Get retailer by ID
    getRetailerById: builder.query<SingleRetailerResponse, string | number>({
      query: (id) => ({
        url: `/retailer/get-retailer/${id}`,
        method: 'GET',
      }),
      providesTags: (result, error, id) => [{ type: 'Retailer', id }],
    }),

    // Update retailer
    updateRetailer: builder.mutation<SingleRetailerResponse, { id: string | number; data: Partial<Retailer> }>({
      query: ({ id, data }) => ({
        url: `/retailer/update-retailer/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Retailer', id }, 'Retailer'],
    }),

    // Delete retailer
    deleteRetailer: builder.mutation<{ success: boolean; message: string }, string | number>({
      query: (id) => ({
        url: `/retailer/delete-retailer/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Retailer'],
    }),

    // Update retailer status
    updateRetailerStatus: builder.mutation<SingleRetailerResponse, { id: string | number; status: string }>({
      query: ({ id, status }) => ({
        url: `/retailer/update-retailer-status/${id}`,
        method: 'PUT',
        body: { status },
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Retailer', id }, 'Retailer'],
    }),

    // Update retailer rating
    updateRetailerRating: builder.mutation<SingleRetailerResponse, { id: string | number; rating: number }>({
      query: ({ id, rating }) => ({
        url: `/retailer/update-retailer-rating/${id}`,
        method: 'PUT',
        body: { rating },
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Retailer', id }, 'Retailer'],
    }),

    // Bulk import retailers
    bulkImportRetailers: builder.mutation<{ 
      success: boolean; 
      message: string; 
      data: { 
        successful: Retailer[]; 
        failed: Array<{ data: Retailer; reason: string }> 
      } 
    }, { retailers: Partial<Retailer>[] }>({
      query: (data) => ({
        url: '/retailer/bulk-import-retailers',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Retailer'],
    }),

    // Get retailer statistics
    getRetailerStats: builder.query<RetailerStatsResponse, void>({
      query: () => ({
        url: '/retailer/stats',
        method: 'GET',
      }),
      providesTags: ['RetailerStats'],
    }),

    // Search retailers (for dropdown)
    searchRetailers: builder.query<SearchRetailerResponse, { q?: string; limit?: number }>({
      query: ({ q = '', limit = 20 }) => ({
        url: `/retailer/search?q=${q}&limit=${limit}`,
        method: 'GET',
      }),
      providesTags: ['RetailerSearch'],
    }),
  }),
});

export const {
  useCreateRetailerMutation,
  useGetAllRetailersQuery,
  useGetRetailerByIdQuery,
  useUpdateRetailerMutation,
  useDeleteRetailerMutation,
  useUpdateRetailerStatusMutation,
  useUpdateRetailerRatingMutation,
  useBulkImportRetailersMutation,
  useGetRetailerStatsQuery,
  useSearchRetailersQuery,
} = retailerApi;