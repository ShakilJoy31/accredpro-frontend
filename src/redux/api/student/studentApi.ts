// redux/api/student/studentApi.ts

import { SingleStudentResponse, Student, StudentResponse, StudentStatsResponse } from "@/utils/interface/studentInterface";
import { apiSlice } from "../apiSlice";

export const studentApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Create student
    createStudent: builder.mutation<SingleStudentResponse, Partial<Student>>({
      query: (data) => ({
        url: '/students/register-student',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Student'],
    }),

    // Get all students with pagination and filters
    getAllStudents: builder.query<StudentResponse, {
      page?: number;
      limit?: number;
      search?: string;
      status?: string;
      district?: string;
      courseId?: string;
      paymentStatus?: string;
    }>({
      query: (params = {}) => {
        const queryParams = new URLSearchParams();
        
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== '') {
            queryParams.append(key, value.toString());
          }
        });

        return {
          url: `/students/get-students?${queryParams.toString()}`,
          method: 'GET',
        };
      },
      providesTags: ['Student'],
    }),

    // Get student by ID
    getStudentById: builder.query<SingleStudentResponse, string | number>({
      query: (id) => ({
        url: `/students/get-student/${id}`,
        method: 'GET',
      }),
      providesTags: (result, error, id) => [{ type: 'Student', id }],
    }),

    // Get student by student ID
    getStudentByStudentId: builder.query<SingleStudentResponse, string>({
      query: (studentId) => ({
        url: `/students/get-student-by-student-id/${studentId}`,
        method: 'GET',
      }),
      providesTags: (result, error, studentId) => [{ type: 'Student', id: studentId }],
    }),

    // Update student
    updateStudent: builder.mutation<SingleStudentResponse, { id: string | number; data: Partial<Student> }>({
      query: ({ id, data }) => ({
        url: `/students/update-student/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Student', id }, 'Student'],
    }),

    // Delete student
    deleteStudent: builder.mutation<{ success: boolean; message: string }, string | number>({
      query: (id) => ({
        url: `/students/delete-student/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Student'],
    }),

    // Update student status
    updateStudentStatus: builder.mutation<SingleStudentResponse, { id: string | number; status: string }>({
      query: ({ id, status }) => ({
        url: `/students/update-student-status/${id}`,
        method: 'PUT',
        body: { status },
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Student', id }, 'Student'],
    }),

    // Update attendance
    updateAttendance: builder.mutation<SingleStudentResponse, { id: string | number; attended: boolean }>({
      query: ({ id, attended }) => ({
        url: `/students/update-attendance/${id}`,
        method: 'PUT',
        body: { attended },
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Student', id }, 'Student'],
    }),

    // Issue certificate
    issueCertificate: builder.mutation<SingleStudentResponse, { id: string | number; certificateNumber?: string }>({
      query: ({ id, certificateNumber }) => ({
        url: `/students/issue-certificate/${id}`,
        method: 'PUT',
        body: { certificateNumber },
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Student', id }, 'Student'],
    }),

    // Change student password
    changeStudentPassword: builder.mutation<{ success: boolean; message: string }, { id: string | number; currentPassword: string; newPassword: string; confirmNewPassword: string }>({
      query: ({ id, currentPassword, newPassword, confirmNewPassword }) => ({
        url: `/students/change-student-password/${id}`,
        method: 'PUT',
        body: { currentPassword, newPassword, confirmNewPassword },
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Student', id }],
    }),

    // Get student statistics
    getStudentStats: builder.query<StudentStatsResponse, void>({
      query: () => ({
        url: '/students/get-student-stats',
        method: 'GET',
      }),
      providesTags: ['StudentStats'],
    }),
  }),
});

export const {
  useCreateStudentMutation,
  useGetAllStudentsQuery,
  useGetStudentByIdQuery,
  useGetStudentByStudentIdQuery,
  useUpdateStudentMutation,
  useDeleteStudentMutation,
  useUpdateStudentStatusMutation,
  useUpdateAttendanceMutation,
  useIssueCertificateMutation,
  useChangeStudentPasswordMutation,
  useGetStudentStatsQuery,
} = studentApi;