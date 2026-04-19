import { apiSlice } from "../apiSlice";

export interface PurchaseTransaction {
  id: number;
  date: string;
  formattedDate: string;
  description: string | null;
  quantity: number;
  rate: number;
  amount: number;
  payment: number;
  balance: number;
  discount: number;
  reference: string | null;
  transactionType: 'purchase' | 'payment' | 'payment_with_purchase' | 'adjustment';
  createdBy: number | null;
  updatedBy: number | null;
  createdAt: string;
  updatedAt: string;
  supplierId: number;
  supplierName?: string;
  companyName?: string;
}

export interface PurchaseHistoryResponse {
  success: boolean;
  message: string;
  data: {
    transactions: PurchaseTransaction[];
    summary: {
      totalAmount: string;
      totalPayment: string;
      totalDiscount: string;
      netDue: string;
    };
    pagination: {
      totalItems: number;
      totalPages: number;
      currentPage: number;
      itemsPerPage: number;
    };
  };
}

export interface AllSuppliersPurchaseHistoryResponse {
  success: boolean;
  message: string;
  data: {
    transactions: PurchaseTransaction[];
    summary: {
      totalAmount: string;
      totalPayment: string;
      totalDiscount: string;
      netDue: string;
      totalSuppliers: number;
    };
    pagination: {
      totalItems: number;
      totalPages: number;
      currentPage: number;
      itemsPerPage: number;
    };
  };
}

export interface PurchaseSummaryResponse {
  success: boolean;
  message: string;
  data: {
    overall: {
      totalPurchaseAmount: string;
      totalPayments: string;
      totalDiscount: string;
      outstandingBalance: string;
      totalQuantity: string;
      transactionCount: number;
      averageRate: string;
    };
    timeline: {
      firstPurchaseDate: string | null;
      latestPurchaseDate: string | null;
      purchaseDuration: string | null;
    };
    dailyBreakdown: Array<{
      date: string;
      amount: string;
      payment: string;
      discount: string;
      quantity: string;
      transactions: number;
    }>;
  };
}

export interface AllSuppliersPurchaseSummaryResponse {
  success: boolean;
  message: string;
  data: {
    overall: {
      totalPurchaseAmount: string;
      totalPayments: string;
      totalDiscount: string;
      outstandingBalance: string;
      totalQuantity: string;
      transactionCount: number;
      totalSuppliers: number;
      activeSuppliers: number;
    };
    topSuppliers: Array<{
      supplierId: number;
      supplierName: string;
      companyName: string;
      totalAmount: string;
      totalPayments: string;
      outstandingBalance: string;
      transactionCount: number;
    }>;
    monthlyTrend: Array<{
      month: string;
      amount: string;
      payment: string;
    }>;
  };
}

export interface PaymentHistoryResponse {
  success: boolean;
  message: string;
  data: {
    summary: {
      totalPayments: string;
      paymentCount: number;
    };
    payments: Array<{
      id: number;
      date: string;
      formattedDate: string;
      amount: number;
      description: string | null;
      reference: string | null;
      remainingBalance: number;
      discount: number;
      supplierId: number;
      supplierName: string;
    }>;
    pagination: {
      totalItems: number;
      totalPages: number;
      currentPage: number;
      itemsPerPage: number;
    };
  };
}

export interface OutstandingBalanceResponse {
  success: boolean;
  message: string;
  data: {
    supplier: {
      id: number;
      name: string;
      company: string;
    };
    financialSummary: {
      totalPurchases: string;
      totalPayments: string;
      totalDiscount: string;
      outstandingBalance: string;
      currentBalance: string;
      lastTransactionDate: string | null;
    };
    agingAnalysis: {
      current: string;
      "31-60 days": string;
      "61-90 days": string;
      "90+ days": string;
    };
    paymentStatus: string;
  };
}

export interface AllSuppliersOutstandingResponse {
  success: boolean;
  message: string;
  data: {
    totalOutstanding: string;
    totalPurchases: string;
    totalPayments: string;
    suppliersWithDue: Array<{
      supplierId: number;
      supplierName: string;
      companyName: string;
      outstandingBalance: string;
      lastTransactionDate: string | null;
    }>;
  };
}

export interface PurchaseAnalyticsResponse {
  success: boolean;
  message: string;
  data: {
    year: number;
    summary: {
      totalPurchases: string;
      averageMonthlyPurchase: string;
      growthFromPreviousYear: string;
      totalTransactions: number;
    };
    monthlyBreakdown: Array<{
      month: string;
      amount: string;
      payment: string;
      discount: string;
      quantity: string;
      transactions: number;
    }>;
    yearlyTrend: Array<{
      year: number;
      amount: string;
      payment: string;
      transactions: number;
    }>;
    topProducts: Array<{
      productName: string;
      totalAmount: string;
      totalQuantity: string;
      purchaseCount: number;
    }>;
  };
}

export const supplierPurchaseHistoryApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get all suppliers (for dropdown)
    getAllSuppliersList: builder.query({
      query: () => ({
        url: '/suppliers/get-suppliers?limit=100',
        method: 'GET',
      }),
      providesTags: ['Supplier'],
    }),

    // Get purchase history for ALL suppliers
    getAllSuppliersPurchaseHistory: builder.query<
      AllSuppliersPurchaseHistoryResponse,
      {
        page?: number;
        limit?: number;
        startDate?: string;
        endDate?: string;
        transactionType?: 'purchase' | 'payment' | 'all';
        sortBy?: string;
        sortOrder?: string;
        supplierId?: string | number;
      }
    >({
      query: (params) => {
        const queryParams = new URLSearchParams();
        
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== '' && value !== 'all') {
            queryParams.append(key, value.toString());
          }
        });

        const queryString = queryParams.toString();
        const url = `/suppliers/all-purchase-history${queryString ? `?${queryString}` : ''}`;

        return {
          url,
          method: 'GET',
        };
      },
      providesTags: (result, error, params) => [
        { type: 'PurchaseHistory', id: 'ALL' },
        { type: 'PurchaseHistory', id: params?.supplierId || 'ALL-SUPPLIERS' },
      ],
    }),

    // Get purchase summary for ALL suppliers
    getAllSuppliersPurchaseSummary: builder.query<
      AllSuppliersPurchaseSummaryResponse,
      { year?: string; month?: string }
    >({
      query: ({ year, month }) => {
        const queryParams = new URLSearchParams();
        if (year) queryParams.append('year', year);
        if (month) queryParams.append('month', month);
        
        const url = `/suppliers/all-purchase-summary${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
        
        return {
          url,
          method: 'GET',
        };
      },
      providesTags: [{ type: 'PurchaseHistory', id: 'ALL-SUMMARY' }],
    }),

    // Get purchase history for a single supplier
    getPurchaseHistory: builder.query<
      PurchaseHistoryResponse,
      {
        supplierId: string | number;
        page?: number;
        limit?: number;
        startDate?: string;
        endDate?: string;
        transactionType?: 'purchase' | 'payment' | 'all';
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
        const url = `/suppliers/purchase-history/${supplierId}${queryString ? `?${queryString}` : ''}`;

        return {
          url,
          method: 'GET',
        };
      },
      providesTags: (result, error, { supplierId }) => [
        { type: 'PurchaseHistory', id: supplierId },
      ],
    }),

    // Get purchase summary for a single supplier
    getPurchaseSummary: builder.query<
      PurchaseSummaryResponse,
      { supplierId: string | number; year?: string; month?: string }
    >({
      query: ({ supplierId, year, month }) => {
        const queryParams = new URLSearchParams();
        if (year) queryParams.append('year', year);
        if (month) queryParams.append('month', month);
        
        const url = `/suppliers/purchase-history/${supplierId}/summary${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
        
        return {
          url,
          method: 'GET',
        };
      },
      providesTags: (result, error, { supplierId }) => [
        { type: 'PurchaseHistory', id: `${supplierId}-summary` },
      ],
    }),

    // Get outstanding balance for a single supplier
    getOutstandingBalance: builder.query<
      OutstandingBalanceResponse,
      { supplierId: string | number }
    >({
      query: ({ supplierId }) => ({
        url: `/suppliers/outstanding-balance/${supplierId}`,
        method: 'GET',
      }),
      providesTags: (result, error, { supplierId }) => [
        { type: 'PurchaseHistory', id: `${supplierId}-balance` },
      ],
    }),

    // Get outstanding balance for ALL suppliers
    getAllSuppliersOutstanding: builder.query<
      AllSuppliersOutstandingResponse,
      void
    >({
      query: () => ({
        url: '/suppliers/all-outstanding-balance',
        method: 'GET',
      }),
      providesTags: [{ type: 'PurchaseHistory', id: 'ALL-BALANCE' }],
    }),

    // Get payment history for ALL suppliers
    getAllSuppliersPaymentHistory: builder.query<
      PaymentHistoryResponse,
      { page?: number; limit?: number; startDate?: string; endDate?: string; supplierId?: string | number }
    >({
      query: (params) => {
        const queryParams = new URLSearchParams();
        
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== '' && value !== 'all') {
            queryParams.append(key, value.toString());
          }
        });

        const url = `/suppliers/all-payment-history${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
        
        return {
          url,
          method: 'GET',
        };
      },
      providesTags: [{ type: 'PurchaseHistory', id: 'ALL-PAYMENTS' }],
    }),

    // Get purchase analytics for ALL suppliers
    getAllSuppliersPurchaseAnalytics: builder.query<
      PurchaseAnalyticsResponse,
      { year?: string }
    >({
      query: ({ year }) => {
        const queryParams = new URLSearchParams();
        if (year) queryParams.append('year', year);
        
        const url = `/suppliers/all-purchase-analytics${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
        
        return {
          url,
          method: 'GET',
        };
      },
      providesTags: [{ type: 'PurchaseHistory', id: 'ALL-ANALYTICS' }],
    }),
  }),
});

export const {
  useGetAllSuppliersListQuery,
  useGetAllSuppliersPurchaseHistoryQuery,
  useGetAllSuppliersPurchaseSummaryQuery,
  useGetPurchaseHistoryQuery,
  useGetPurchaseSummaryQuery,
  useGetOutstandingBalanceQuery,
  useGetAllSuppliersOutstandingQuery,
  useGetAllSuppliersPaymentHistoryQuery,
  useGetAllSuppliersPurchaseAnalyticsQuery,
} = supplierPurchaseHistoryApi;