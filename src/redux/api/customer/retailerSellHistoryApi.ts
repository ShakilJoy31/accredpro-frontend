import { apiSlice } from "../apiSlice";

export interface SellTransaction {
  id: number;
  date: string;
  formattedDate: string;
  description: string | null;
  quantity: number;
  rate: number;
  amount: number;        // khoroc
  payment: number;       // joma
  balance: number;       // obosisto
  discount: number;
  transactionType: 'purchase' | 'payment' | 'payment_with_purchase' | 'adjustment';
  createdBy: number | null;
  updatedBy: number | null;
  createdAt: string;
  updatedAt: string;
  retailerId: number;
  retailerName?: string;
  ownerName?: string;
}

export interface SellHistoryResponse {
  success: boolean;
  message: string;
  data: {
    transactions: SellTransaction[];
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

export interface AllRetailersSellHistoryResponse {
  success: boolean;
  message: string;
  data: {
    transactions: SellTransaction[];
    summary: {
      totalAmount: string;
      totalPayment: string;
      totalDiscount: string;
      netDue: string;
      totalRetailers: number;
    };
    pagination: {
      totalItems: number;
      totalPages: number;
      currentPage: number;
      itemsPerPage: number;
    };
  };
}

export interface SellSummaryResponse {
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

export interface AllRetailersSellSummaryResponse {
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
      totalRetailers: number;
      activeRetailers: number;
    };
    topRetailers: Array<{
      retailerId: number;
      shopName: string;
      ownerName: string;
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
      remainingBalance: number;
      discount: number;
      retailerId: number;
      retailerName: string;
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
    retailer: {
      id: number;
      name: string;
      ownerName: string;
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

export interface AllRetailersOutstandingResponse {
  success: boolean;
  message: string;
  data: {
    totalOutstanding: string;
    totalPurchases: string;
    totalPayments: string;
    retailersWithDue: Array<{
      retailerId: number;
      shopName: string;
      ownerName: string;
      outstandingBalance: string;
      lastTransactionDate: string | null;
    }>;
  };
}

export interface SellAnalyticsResponse {
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

export const retailerSellHistoryApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get all retailers (for dropdown)
    getAllRetailersList: builder.query({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params?.limit) queryParams.append('limit', params.limit);
        if (params?.search) queryParams.append('search', params.search);
        const url = `/retailer/get-retailers${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
        return {
          url,
          method: 'GET',
        };
      },
      providesTags: ['Retailer'],
    }),

    // Get sell history for ALL retailers
    getAllRetailersSellHistory: builder.query<
      AllRetailersSellHistoryResponse,
      {
        page?: number;
        limit?: number;
        startDate?: string;
        endDate?: string;
        transactionType?: 'purchase' | 'payment' | 'all';
        sortBy?: string;
        sortOrder?: string;
        retailerId?: string | number;
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
        const url = `/retailer/all-purchase-history${queryString ? `?${queryString}` : ''}`;

        return {
          url,
          method: 'GET',
        };
      },
      providesTags: (result, error, params) => [
        { type: 'SellHistory', id: 'ALL' },
        { type: 'SellHistory', id: params?.retailerId || 'ALL-RETAILERS' },
      ],
    }),

    // Get sell summary for ALL retailers
    getAllRetailersSellSummary: builder.query<
      AllRetailersSellSummaryResponse,
      { year?: string; month?: string }
    >({
      query: ({ year, month }) => {
        const queryParams = new URLSearchParams();
        if (year) queryParams.append('year', year);
        if (month) queryParams.append('month', month);
        
        const url = `/retailer/all-purchase-summary${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
        
        return {
          url,
          method: 'GET',
        };
      },
      providesTags: [{ type: 'SellHistory', id: 'ALL-SUMMARY' }],
    }),

    // Get sell history for a single retailer
    getSellHistory: builder.query<
      SellHistoryResponse,
      {
        retailerId: string | number;
        page?: number;
        limit?: number;
        startDate?: string;
        endDate?: string;
        transactionType?: 'purchase' | 'payment' | 'all';
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
        const url = `/retailer/purchase-history/${retailerId}${queryString ? `?${queryString}` : ''}`;

        return {
          url,
          method: 'GET',
        };
      },
      providesTags: (result, error, { retailerId }) => [
        { type: 'SellHistory', id: retailerId },
      ],
    }),

    // Get sell summary for a single retailer
    getSellSummary: builder.query<
      SellSummaryResponse,
      { retailerId: string | number; year?: string; month?: string }
    >({
      query: ({ retailerId, year, month }) => {
        const queryParams = new URLSearchParams();
        if (year) queryParams.append('year', year);
        if (month) queryParams.append('month', month);
        
        const url = `/retailer/purchase-history/${retailerId}/summary${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
        
        return {
          url,
          method: 'GET',
        };
      },
      providesTags: (result, error, { retailerId }) => [
        { type: 'SellHistory', id: `${retailerId}-summary` },
      ],
    }),

    // Get outstanding balance for a single retailer
    getOutstandingBalance: builder.query<
      OutstandingBalanceResponse,
      { retailerId: string | number }
    >({
      query: ({ retailerId }) => ({
        url: `/retailer/outstanding-balance/${retailerId}`,
        method: 'GET',
      }),
      providesTags: (result, error, { retailerId }) => [
        { type: 'SellHistory', id: `${retailerId}-balance` },
      ],
    }),

    // Get outstanding balance for ALL retailers
    getAllRetailersOutstanding: builder.query<
      AllRetailersOutstandingResponse,
      void
    >({
      query: () => ({
        url: '/retailer/all-outstanding-balance',
        method: 'GET',
      }),
      providesTags: [{ type: 'SellHistory', id: 'ALL-BALANCE' }],
    }),

    // Get payment history for ALL retailers
    getAllRetailersPaymentHistory: builder.query<
      PaymentHistoryResponse,
      { page?: number; limit?: number; startDate?: string; endDate?: string; retailerId?: string | number }
    >({
      query: (params) => {
        const queryParams = new URLSearchParams();
        
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== '' && value !== 'all') {
            queryParams.append(key, value.toString());
          }
        });

        const url = `/retailer/all-payment-history${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
        
        return {
          url,
          method: 'GET',
        };
      },
      providesTags: [{ type: 'SellHistory', id: 'ALL-PAYMENTS' }],
    }),

    // Get sell analytics for ALL retailers
    getAllRetailersSellAnalytics: builder.query<
      SellAnalyticsResponse,
      { year?: string }
    >({
      query: ({ year }) => {
        const queryParams = new URLSearchParams();
        if (year) queryParams.append('year', year);
        
        const url = `/retailer/all-purchase-analytics${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
        
        return {
          url,
          method: 'GET',
        };
      },
      providesTags: [{ type: 'SellHistory', id: 'ALL-ANALYTICS' }],
    }),
  }),
});

export const {
  useGetAllRetailersListQuery,
  useGetAllRetailersSellHistoryQuery,
  useGetAllRetailersSellSummaryQuery,
  useGetSellHistoryQuery,
  useGetSellSummaryQuery,
  useGetOutstandingBalanceQuery,
  useGetAllRetailersOutstandingQuery,
  useGetAllRetailersPaymentHistoryQuery,
  useGetAllRetailersSellAnalyticsQuery,
} = retailerSellHistoryApi;