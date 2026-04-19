import { apiSlice } from "../apiSlice";
import { Driver } from "@/utils/interface/driverInterface";

export const driverApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        // Get all drivers with pagination and filters
        getAllDrivers: builder.query({
            query: (params) => ({
                url: "/driver/get-drivers",
                params: {
                    page: params?.page || 1,
                    limit: params?.limit || 10,
                    search: params?.search || "",
                    status: params?.status || "",
                    city: params?.city || "",
                    vehicleType: params?.vehicleType || "",
                    employmentType: params?.employmentType || "",
                    rating: params?.rating || "",
                    sortBy: params?.sortBy || "createdAt",
                    sortOrder: params?.sortOrder || "DESC",
                },
            }),
            providesTags: ["Drivers"],
        }),

        // Search drivers (for dropdown)
        searchDrivers: builder.query({
            query: (params) => ({
                url: "/driver/search",
                params: {
                    q: params?.q || "",
                    limit: params?.limit || 20,
                },
            }),
            providesTags: ["Drivers"],
        }),

        // Get driver by ID
        getDriverById: builder.query({
            query: (id) => `/driver/get-driver/${id}`,
            providesTags: (_result, _error, id) => [{ type: "Drivers", id }],
        }),

        // Get driver statistics
        getDriverStats: builder.query({
            query: () => "/driver/stats",
            providesTags: ["DriverStats"],
        }),

        // Get driver trips
        getDriverTrips: builder.query({
            query: (id) => `/driver/get-driver-trips/${id}`,
            providesTags: (_result, _error, id) => [{ type: "DriverTrips", id }],
        }),

        // Create new driver
        createDriver: builder.mutation({
            query: (data) => ({
                url: "/driver/create-driver",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Drivers", "DriverStats"],
        }),

        // Update driver
        updateDriver: builder.mutation({
            query: ({ id, data }) => ({
                url: `/driver/update-driver/${id}`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: (_result, _error, { id }) => [
                { type: "Drivers", id },
                "Drivers",
                "DriverStats",
            ],
        }),

        // Delete driver
        deleteDriver: builder.mutation({
            query: (id) => ({
                url: `/driver/delete-driver/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Drivers", "DriverStats"],
        }),

        // Update driver status
        updateDriverStatus: builder.mutation({
            query: ({ id, status }) => ({
                url: `/driver/update-driver-status/${id}`,
                method: "PUT",
                body: { status },
            }),
            invalidatesTags: (_result, _error, { id }) => [
                { type: "Drivers", id },
                "Drivers",
                "DriverStats",
            ],
        }),

        // Update driver rating
        updateDriverRating: builder.mutation({
            query: ({ id, rating }) => ({
                url: `/driver/update-driver-rating/${id}`,
                method: "PUT",
                body: { rating },
            }),
            invalidatesTags: (_result, _error, { id }) => [
                { type: "Drivers", id },
                "Drivers",
                "DriverStats",
            ],
        }),

        // Update driver earnings
        updateDriverEarnings: builder.mutation({
            query: ({ id, tripAmount, tripDate }) => ({
                url: `/driver/update-driver-earnings/${id}`,
                method: "PUT",
                body: { tripAmount, tripDate },
            }),
            invalidatesTags: (_result, _error, { id }) => [
                { type: "Drivers", id },
                { type: "DriverTrips", id },
                "Drivers",
                "DriverStats",
            ],
        }),

        // Bulk import drivers
        bulkImportDrivers: builder.mutation({
            query: ({ drivers }) => ({
                url: "/driver/bulk-import-drivers",
                method: "POST",
                body: { drivers },
            }),
            invalidatesTags: ["Drivers", "DriverStats"],
        }),
    }),
});

export const {
    useGetAllDriversQuery,
    useSearchDriversQuery,
    useGetDriverByIdQuery,
    useGetDriverStatsQuery,
    useGetDriverTripsQuery,
    useCreateDriverMutation,
    useUpdateDriverMutation,
    useDeleteDriverMutation,
    useUpdateDriverStatusMutation,
    useUpdateDriverRatingMutation,
    useUpdateDriverEarningsMutation,
    useBulkImportDriversMutation,
} = driverApi;

