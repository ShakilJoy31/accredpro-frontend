import { apiSlice } from "../apiSlice";

export interface ISupplierCalculation {
  id: number;
  supplierId: number;
  calculationDate: string;
  biboron: string | null;
  poriman: number;
  dor: number;
  taka: number;
  joma: number;
  baki: number;
  discount: number;
  sign: string | null;
  createdBy: number | null;
  updatedBy: number | null;
  createdAt: string;
  updatedAt: string;
  formattedDate?: string;
  porimanFormatted?: string;
  dorFormatted?: string;
  takaFormatted?: string;
  jomaFormatted?: string;
  bakiFormatted?: string;
}

export interface CalculationResponse {
  success: boolean;
  message: string;
  data: ISupplierCalculation[];
  summary: {
    totalTaka: string;
    totalJoma: string;
    totalBaki: string;
    totalPoriman: string;
  };
  pagination: {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    itemsPerPage: number;
  };
}

export interface SingleCalculationResponse {
  success: boolean;
  message: string;
  data: ISupplierCalculation;
}

export interface DatesResponse {
  success: boolean;
  message: string;
  data: string[];
}

export interface CreateCalculationData {
  calculationDate: string;
  biboron?: string;
  poriman?: number;
  dor?: number;
  taka?: number;
  joma?: number;
  baki?: number;
  sign?: string;
}

export interface UpdateCalculationData {
  calculationDate?: string;
  biboron?: string;
  poriman?: number;
  dor?: number;
  taka?: number;
  joma?: number;
  baki?: number;
  sign?: string;
}

export const supplierCalculationApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get all calculations for a supplier
    getSupplierCalculations: builder.query<
      CalculationResponse,
      {
        supplierId: string | number;
        startDate?: string;
        endDate?: string;
        page?: number;
        limit?: number;
        sortBy?: string;
        sortOrder?: string;
      }
    >({
      query: ({ supplierId, ...params }) => {
        const queryParams = new URLSearchParams();
        
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== '') {
            queryParams.append(key, value.toString());
          }
        });

        const queryString = queryParams.toString();
        const url = `/suppliers/supplier-calculations/${supplierId}${queryString ? `?${queryString}` : ''}`;

        return {
          url,
          method: 'GET',
        };
      },
      providesTags: (result) => 
        result
          ? [
              ...result.data.map(({ id }) => ({ type: 'SupplierCalculation' as const, id })),
              { type: 'SupplierCalculation', id: 'LIST' },
            ]
          : [{ type: 'SupplierCalculation', id: 'LIST' }],
    }),

    // Get calculation by ID
    getCalculationById: builder.query<
      SingleCalculationResponse,
      { supplierId: string | number; id: number }
    >({
      query: ({ supplierId, id }) => ({
        url: `/suppliers/supplier-calculations/${supplierId}/${id}`,
        method: 'GET',
      }),
      providesTags: (result, error, { id }) => [{ type: 'SupplierCalculation', id }],
    }),

    // Get calculation by specific date (returns all entries for that date)
    getCalculationByDate: builder.query<
      { success: boolean; message: string; data: ISupplierCalculation[] },
      { supplierId: string | number; date: string }
    >({
      query: ({ supplierId, date }) => ({
        url: `/suppliers/supplier-calculations/${supplierId}/date/${date}`,
        method: 'GET',
      }),
      providesTags: (result, error, { supplierId, date }) => [
        { type: 'SupplierCalculation', id: `${supplierId}-${date}` },
      ],
    }),

    // Create new calculation
    createCalculation: builder.mutation<
      SingleCalculationResponse,
      { supplierId: string | number; data: CreateCalculationData }
    >({
      query: ({ supplierId, data }) => ({
        url: `/suppliers/supplier-calculations/${supplierId}`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: [{ type: 'SupplierCalculation', id: 'LIST' }],
    }),

    // Update calculation by ID
    updateCalculation: builder.mutation<
      SingleCalculationResponse,
      { supplierId: string | number; id: number; data: UpdateCalculationData }
    >({
      query: ({ supplierId, id, data }) => ({
        url: `/suppliers/supplier-calculations/${supplierId}/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'SupplierCalculation', id },
        { type: 'SupplierCalculation', id: 'LIST' },
      ],
    }),

    // Delete calculation by ID
    deleteCalculationById: builder.mutation<
      { success: boolean; message: string },
      { supplierId: string | number; id: number }
    >({
      query: ({ supplierId, id }) => ({
        url: `/suppliers/supplier-calculations/${supplierId}/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'SupplierCalculation', id },
        { type: 'SupplierCalculation', id: 'LIST' },
      ],
    }),

    // Delete calculation by date (deletes ALL entries for that date)
    deleteCalculationByDate: builder.mutation<
      { success: boolean; message: string },
      { supplierId: string | number; date: string }
    >({
      query: ({ supplierId, date }) => ({
        url: `/suppliers/supplier-calculations/${supplierId}/date/${date}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'SupplierCalculation', id: 'LIST' }],
    }),

    // Get all distinct dates for a supplier
    getSupplierDates: builder.query<DatesResponse, string | number>({
      query: (supplierId) => ({
        url: `/suppliers/supplier-calculations/dates/${supplierId}`,
        method: 'GET',
      }),
      providesTags: ['SupplierCalculation'],
    }),
  }),
});

export const {
  useGetSupplierCalculationsQuery,
  useGetCalculationByIdQuery,
  useGetCalculationByDateQuery,
  useCreateCalculationMutation,
  useUpdateCalculationMutation,
  useDeleteCalculationByIdMutation,
  useDeleteCalculationByDateMutation,
  useGetSupplierDatesQuery,
} = supplierCalculationApi;