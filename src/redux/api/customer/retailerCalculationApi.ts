import { apiSlice } from "../apiSlice";

export interface IRetailerCalculation {
  id: number;
  retailerId: number;
  calculationDate: string;
  biboron: string | null;
  joma: number;
  khoroc: number;
  obosisto: number;
  quantity: number;
  rate: number;
  discount: number;
  createdBy: number | null;
  updatedBy: number | null;
  createdAt: string;
  updatedAt: string;
  formattedDate?: string;
  jomaFormatted?: string;
  khorocFormatted?: string;
  obosistoFormatted?: string;
}

export interface RetailerCalculationResponse {
  success: boolean;
  message: string;
  data: IRetailerCalculation[];
  summary: {
    totalJoma: string;
    totalKhoroc: string;
    totalObosisto: string;
    totalQuantity: string;
  };
  pagination: {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    itemsPerPage: number;
  };
}

export interface SingleRetailerCalculationResponse {
  success: boolean;
  message: string;
  data: IRetailerCalculation;
}

export interface RetailerDatesResponse {
  success: boolean;
  message: string;
  data: string[];
}

export interface CreateRetailerCalculationData {
  calculationDate: string;
  biboron?: string;
  joma?: number;
  khoroc?: number;
  obosisto?: number;
}

export interface UpdateRetailerCalculationData {
  calculationDate?: string;
  biboron?: string;
  joma?: number;
  quantity?: number;
  rate?: number;
  discount?: number;
  khoroc?: number;
  obosisto?: number;
}

export const retailerCalculationApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getRetailerCalculations: builder.query<
      RetailerCalculationResponse,
      {
        retailerId: string | number;
        startDate?: string;
        endDate?: string;
        page?: number;
        limit?: number;
        sortBy?: string;
        sortOrder?: string;
      }
    >({
      query: ({ retailerId, ...params }) => {
        const queryParams = new URLSearchParams();
        
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== '') {
            queryParams.append(key, value.toString());
          }
        });

        const queryString = queryParams.toString();
        const url = `/retailer/customer-calculations/${retailerId}${queryString ? `?${queryString}` : ''}`;

        return {
          url,
          method: 'GET',
        };
      },
      providesTags: (result) => 
        result
          ? [
              ...result.data.map(({ id }) => ({ type: 'RetailerCalculation' as const, id })),
              { type: 'RetailerCalculation', id: 'LIST' },
            ]
          : [{ type: 'RetailerCalculation', id: 'LIST' }],
    }),

    getRetailerCalculationById: builder.query<
      SingleRetailerCalculationResponse,
      { retailerId: string | number; id: number }
    >({
      query: ({ retailerId, id }) => ({
        url: `/retailer/customer-calculations/${retailerId}/${id}`,
        method: 'GET',
      }),
      providesTags: (result, error, { id }) => [{ type: 'RetailerCalculation', id }],
    }),

    getRetailerCalculationByDate: builder.query<
      { success: boolean; message: string; data: IRetailerCalculation[] },
      { retailerId: string | number; date: string }
    >({
      query: ({ retailerId, date }) => ({
        url: `/retailer/customer-calculations/${retailerId}/date/${date}`,
        method: 'GET',
      }),
      providesTags: (result, error, { retailerId, date }) => [
        { type: 'RetailerCalculation', id: `${retailerId}-${date}` },
      ],
    }),

    createRetailerCalculation: builder.mutation<
      SingleRetailerCalculationResponse,
      { retailerId: string | number; data: CreateRetailerCalculationData }
    >({
      query: ({ retailerId, data }) => ({
        url: `/retailer/customer-calculations/${retailerId}`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: [{ type: 'RetailerCalculation', id: 'LIST' }],
    }),

    updateRetailerCalculation: builder.mutation<
      SingleRetailerCalculationResponse,
      { retailerId: string | number; id: number; data: UpdateRetailerCalculationData }
    >({
      query: ({ retailerId, id, data }) => ({
        url: `/retailer/customer-calculations/${retailerId}/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'RetailerCalculation', id },
        { type: 'RetailerCalculation', id: 'LIST' },
      ],
    }),

    deleteRetailerCalculationById: builder.mutation<
      { success: boolean; message: string },
      { retailerId: string | number; id: number }
    >({
      query: ({ retailerId, id }) => ({
        url: `/retailer/customer-calculations/${retailerId}/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'RetailerCalculation', id },
        { type: 'RetailerCalculation', id: 'LIST' },
      ],
    }),

    deleteRetailerCalculationByDate: builder.mutation<
      { success: boolean; message: string },
      { retailerId: string | number; date: string }
    >({
      query: ({ retailerId, date }) => ({
        url: `/retailer/customer-calculations/${retailerId}/date/${date}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'RetailerCalculation', id: 'LIST' }],
    }),

    getRetailerDates: builder.query<RetailerDatesResponse, string | number>({
      query: (retailerId) => ({
        url: `/retailer/customer-calculations/dates/${retailerId}`,
        method: 'GET',
      }),
      providesTags: ['RetailerCalculation'],
    }),
  }),
});

export const {
  useGetRetailerCalculationsQuery,
  useGetRetailerCalculationByIdQuery,
  useGetRetailerCalculationByDateQuery,
  useCreateRetailerCalculationMutation,
  useUpdateRetailerCalculationMutation,
  useDeleteRetailerCalculationByIdMutation,
  useDeleteRetailerCalculationByDateMutation,
  useGetRetailerDatesQuery,
} = retailerCalculationApi;