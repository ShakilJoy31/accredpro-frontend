import { apiSlice } from "@/redux/api/apiSlice";

export const fileApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Upload file
    addThumbnail: builder.mutation({
      query: (data) => ({
        url: "/file/upload",
        method: "POST",
        body: data,
      }),
    }),

    // Get gallery
    getGallery: builder.query({
      query: (data) => ({
        url: `/file/get-images-all?search=${data.search || ""}`,
      }),
    }),

    // Delete file
    deleteFile: builder.mutation({
      query: (key: string) => ({
        url: `/file/delete?key=${encodeURIComponent(key)}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const { useAddThumbnailMutation, useDeleteFileMutation, useGetGalleryQuery } = fileApi;