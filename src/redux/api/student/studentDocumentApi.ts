// redux/api/student/studentDocumentApi.ts
import { SingleStudentDocumentResponse, StudentDocumentResponse, UploadDocumentRequest } from "@/utils/interface/studentDocumentInterface";
import { apiSlice } from "../apiSlice";

export const studentDocumentApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Upload document
    uploadDocument: builder.mutation<SingleStudentDocumentResponse, FormData>({
      query: (formData) => ({
        url: '/student-documents/upload',
        method: 'POST',
        body: formData,
        formData: true,
      }),
      invalidatesTags: ['StudentDocument'],
    }),

    // Get all documents
    getAllDocuments: builder.query<StudentDocumentResponse, {
      studentId?: number;
      documentType?: string;
      approvalStatus?: string;
    }>({
      query: (params = {}) => {
        const queryParams = new URLSearchParams();
        if (params.studentId) queryParams.append('studentId', params.studentId.toString());
        if (params.documentType) queryParams.append('documentType', params.documentType);
        if (params.approvalStatus) queryParams.append('approvalStatus', params.approvalStatus);
        return {
          url: `/student-documents?${queryParams.toString()}`,
          method: 'GET',
        };
      },
      providesTags: ['StudentDocument'],
    }),

    // Get documents by approval status
    getDocumentsByApprovalStatus: builder.query<StudentDocumentResponse, {
      status: string;
      studentId?: number;
      priority?: string;
    }>({
      query: (params) => {
        const queryParams = new URLSearchParams();
        queryParams.append('status', params.status);
        if (params.studentId) queryParams.append('studentId', params.studentId.toString());
        if (params.priority) queryParams.append('priority', params.priority);
        return {
          url: `/student-documents/by-status?${queryParams.toString()}`,
          method: 'GET',
        };
      },
      providesTags: ['StudentDocument'],
    }),

    // Get approval statistics
    getApprovalStatistics: builder.query<{
      success: boolean;
      data: {
        pending: number;
        approved: number;
        rejected: number;
        revisionRequired: number;
        total: number;
        approvalRate: number;
      };
    }, void>({
      query: () => ({
        url: '/student-documents/statistics',
        method: 'GET',
      }),
      providesTags: ['StudentDocument'],
    }),

    // Approve document
    approveDocument: builder.mutation<SingleStudentDocumentResponse, {
      id: number;
      approvalRemarks?: string;
    }>({
      query: ({ id, approvalRemarks }) => ({
        url: `/student-documents/${id}/approve`,
        method: 'PATCH',
        body: { approvalRemarks },
      }),
      invalidatesTags: ['StudentDocument'],
    }),

    // Reject document
    rejectDocument: builder.mutation<SingleStudentDocumentResponse, {
      id: number;
      rejectionReason: string;
    }>({
      query: ({ id, rejectionReason }) => ({
        url: `/student-documents/${id}/reject`,
        method: 'PATCH',
        body: { rejectionReason },
      }),
      invalidatesTags: ['StudentDocument'],
    }),

    // Request revision
    requestRevision: builder.mutation<SingleStudentDocumentResponse, {
      id: number;
      revisionFeedback: string;
    }>({
      query: ({ id, revisionFeedback }) => ({
        url: `/student-documents/${id}/request-revision`,
        method: 'PATCH',
        body: { revisionFeedback },
      }),
      invalidatesTags: ['StudentDocument'],
    }),

    // Bulk approve documents
    bulkApproveDocuments: builder.mutation<{
      success: boolean;
      message: string;
      data: { updatedCount: number };
    }, {
      documentIds: number[];
      approvalRemarks?: string;
    }>({
      query: ({ documentIds, approvalRemarks }) => ({
        url: '/student-documents/bulk-approve',
        method: 'POST',
        body: { documentIds, approvalRemarks },
      }),
      invalidatesTags: ['StudentDocument'],
    }),

    // Get document by ID
    getDocumentById: builder.query<SingleStudentDocumentResponse, number>({
      query: (id) => ({
        url: `/student-documents/${id}`,
        method: 'GET',
      }),
      providesTags: (result, error, id) => [{ type: 'StudentDocument', id }],
    }),

    // Update document
    updateDocument: builder.mutation<SingleStudentDocumentResponse, { id: number; data: Partial<UploadDocumentRequest> }>({
      query: ({ id, data }) => ({
        url: `/student-documents/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'StudentDocument', id }, 'StudentDocument'],
    }),

    // Delete document
    deleteDocument: builder.mutation<{ success: boolean; message: string }, number>({
      query: (id) => ({
        url: `/student-documents/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['StudentDocument'],
    }),

    bulkUploadDocuments: builder.mutation<StudentDocumentResponse, {
      studentId: number;
      documents: Array<{ title: string; file: File; remarks?: string }>;
    }>({
      query: ({ studentId, documents }) => ({
        url: '/student-documents/bulk-upload',
        method: 'POST',
        body: { studentId, documents },
      }),
      invalidatesTags: ['StudentDocument'],
    }),
  }),
});

export const {
  useUploadDocumentMutation,
  useGetAllDocumentsQuery,
  useGetDocumentByIdQuery,
  useUpdateDocumentMutation,
  useDeleteDocumentMutation,
  useBulkUploadDocumentsMutation,
  useApproveDocumentMutation,
  useRejectDocumentMutation,
  useRequestRevisionMutation,
  useGetDocumentsByApprovalStatusQuery,
  useBulkApproveDocumentsMutation,
  useGetApprovalStatisticsQuery,
} = studentDocumentApi;