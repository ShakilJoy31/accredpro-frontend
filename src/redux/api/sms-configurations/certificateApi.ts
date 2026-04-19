// redux/api/certificate/certificateApi.ts
import { apiSlice } from "../apiSlice";

export const certificateApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Create certificate
    createCertificate: builder.mutation({
      query: (certificateData) => ({
        url: "/certificate/create-certificate",
        method: "POST",
        body: certificateData,
      }),
      invalidatesTags: ["Certificate"],
    }),

    // Get all certificates
    getAllCertificates: builder.query({
      query: ({
        page = 1,
        limit = 10,
        search = "",
        status = "",
        country = "",
        isExpired = "",
      }: {
        page?: number;
        limit?: number;
        search?: string;
        status?: string;
        country?: string;
        isExpired?: string;
      }) => {
        const params = new URLSearchParams();
        params.append("page", page.toString());
        params.append("limit", limit.toString());
        if (search) params.append("search", search);
        if (status) params.append("status", status);
        if (country) params.append("country", country);
        if (isExpired) params.append("isExpired", isExpired);

        return {
          url: `/certificate/get-certificates?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: (result) => {
        return result?.data
          ? [
              ...result.data.map(({ id }: { id: string }) => ({ type: 'Certificate' as const, id })),
              { type: 'Certificate', id: 'LIST' },
            ]
          : [{ type: 'Certificate', id: 'LIST' }];
      },
    }),

    // Get certificate by ID
    getCertificateById: builder.query({
      query: (id: string) => ({
        url: `/certificate/get-certificate/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: 'Certificate', id }],
    }),

    // Get certificate by number (public) - Regular query
    getCertificateByNumber: builder.query({
      query: (certificateNumber: string) => ({
        url: `/certificate/verify/${certificateNumber}`,
        method: "GET",
      }),
    }),

    // Get certificate by number (public) - Lazy query for manual triggering
    lazyGetCertificateByNumber: builder.query({
      query: (certificateNumber: string) => ({
        url: `/certificate/verify/${certificateNumber}`,
        method: "GET",
      }),
    }),

    // Update certificate
    updateCertificate: builder.mutation({
      query: ({ id, ...data }: { id: number; [key: string]: unknown }) => ({
        url: `/certificate/update-certificate/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Certificate', id },
        { type: 'Certificate', id: 'LIST' },
      ],
    }),

    // Delete certificate
    deleteCertificate: builder.mutation({
      query: (id: number) => ({
        url: `/certificate/delete-certificate/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: 'Certificate', id: 'LIST' }],
    }),

    // Update certificate status
    updateCertificateStatus: builder.mutation({
      query: ({ id, status }: { id: number; status: 'active' | 'expired' | 'suspended' | 'pending' }) => ({
        url: `/certificate/update-certificate-status/${id}`,
        method: "PUT",
        body: { status },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Certificate', id },
        { type: 'Certificate', id: 'LIST' },
      ],
    }),

    // Verify certificate
    verifyCertificate: builder.mutation({
      query: ({ id, isVerified }: { id: number; isVerified: boolean }) => ({
        url: `/certificate/verify-certificate/${id}`,
        method: "PUT",
        body: { isVerified },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Certificate', id },
        { type: 'Certificate', id: 'LIST' },
      ],
    }),

    // Get certificate statistics
    getCertificateStats: builder.query({
      query: () => ({
        url: '/certificate/get-certificate-stats',
        method: 'GET',
      }),
      providesTags: ['Certificate'],
    }),

    // Get certificates by company
    getCertificatesByCompany: builder.query({
      query: (companyName: string) => ({
        url: `/certificate/get-certificates-by-company/${companyName}`,
        method: 'GET',
      }),
      providesTags: ['Certificate'],
    }),
  }),
});

export const {
  useCreateCertificateMutation,
  useGetAllCertificatesQuery,
  useGetCertificateByIdQuery,
  useGetCertificateByNumberQuery,
  useLazyGetCertificateByNumberQuery, // Add this export
  useUpdateCertificateMutation,
  useDeleteCertificateMutation,
  useUpdateCertificateStatusMutation,
  useVerifyCertificateMutation,
  useGetCertificateStatsQuery,
  useGetCertificatesByCompanyQuery,
} = certificateApi;














// "use client";

// import { useState, useEffect, useCallback } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { Search } from "lucide-react";
// import Image from "next/image";
// import { useGetCertificateByNumberQuery } from "@/redux/api/sms-configurations/certificateApi";
// import CertificateDetails from "./CertificateDetails";

// import siteLogo from "../../../../public/The_Logo/linuxeon_logo.png";

// const CertificateVerification = () => {
//     const [certificateNumber, setCertificateNumber] = useState("");
//     const [searchedNumber, setSearchedNumber] = useState("");
//     const [isVisible, setIsVisible] = useState(false);
//     const [shouldSearch, setShouldSearch] = useState(false);
//     const [showCertificate, setShowCertificate] = useState(false);
//     const [hasSearched, setHasSearched] = useState(false);
//     const [validCertificateData, setValidCertificateData] = useState<any>(null);

//     const { data, isLoading, error } = useGetCertificateByNumberQuery(searchedNumber, {
//         skip: !shouldSearch || !searchedNumber,
//     });

//     useEffect(() => {
//         const savedId = localStorage.getItem("verifiedCertificateId");
//         if (savedId) {
//             setCertificateNumber(savedId);
//             setSearchedNumber(savedId);
//             setShouldSearch(true);
//             setHasSearched(true);
//         }
//         setIsVisible(true);
//     }, []);

//     useEffect(() => {
//         if (!isLoading && shouldSearch && searchedNumber) {
//             const isValidCertificate =
//                 data?.data &&
//                 data?.isValid === true &&
//                 data?.data?.certificateNumber === searchedNumber;

//             if (isValidCertificate) {
//                 setValidCertificateData(data.data);
//                 localStorage.setItem("verifiedCertificateId", data.data.certificateNumber);
//                 setShowCertificate(true);
//                 setHasSearched(false);
//                 setShouldSearch(false);
//             } else {
//                 setValidCertificateData(null);
//                 setShowCertificate(false);
//                 setHasSearched(true);
//                 setShouldSearch(false);
//                 localStorage.removeItem("verifiedCertificateId");
//             }
//         }
//     }, [data, isLoading, shouldSearch, searchedNumber, error]);

//     const handleSearch = useCallback(() => {
//         if (certificateNumber.trim()) {
//             localStorage.removeItem("verifiedCertificateId");

//             setValidCertificateData(null);
//             setShowCertificate(false);
//             setHasSearched(false);
//             setShouldSearch(false);

//             setSearchedNumber("");

//             setTimeout(() => {
//                 setSearchedNumber(certificateNumber.trim());
//                 setShouldSearch(true);
//                 setHasSearched(true);
//             }, 0);
//         }
//     }, [certificateNumber]);

//     const handleReset = () => {
//         localStorage.removeItem("verifiedCertificateId");
//         setCertificateNumber("");
//         setSearchedNumber("");
//         setShouldSearch(false);
//         setShowCertificate(false);
//         setHasSearched(false);
//         setValidCertificateData(null);
//     };

//     const certificate = validCertificateData;

//     if (showCertificate && certificate) {
//         return (
//             <div className=" text-white py-12 my-28 px-4">
//                 <div className="max-w-6xl mx-auto">
//                     <div className="flex justify-end mb-6">
//                         <button
//                             onClick={handleReset}
//                             className="px-6 cursor-pointer py-2 border border-white/30 rounded-full hover:bg-white/10"
//                         >
//                             Search Another Certificate
//                         </button>
//                     </div>
//                     <CertificateDetails certificate={certificate} isValid={true} />
//                 </div>
//             </div>
//         );
//     }

//     return (
//         <>
//             {/* Loading */}
//             <AnimatePresence>
//                 {isLoading && shouldSearch && (
//                     <div className="fixed inset-0 flex items-center justify-center z-50 text-white">
//                         Searching...
//                     </div>
//                 )}
//             </AnimatePresence>

//             {/* Main UI */}
//             <div className="min-h-screen text-white relative flex flex-col items-center justify-center overflow-hidden">

//                 {/* Content */}
//                 <motion.div
//                     initial={{ opacity: 0, y: 30 }}
//                     animate={isVisible ? { opacity: 1, y: 0 } : {}}
//                     className="relative z-10 text-center px-4"
//                 >
//                     {/* Logo */}
//                     <div className="flex justify-center mb-6">
//                         <Image src={siteLogo} alt="logo" width={180} height={60} />
//                     </div>

//                     {/* Title */}
//                     <h1 className="text-3xl md:text-5xl font-semibold tracking-widest">
//                         CERTIFICATE VERIFICATION
//                     </h1>

//                     <p className="text-white/70 mt-4 italic text-lg">
//                         the first place to look
//                     </p>

//                     {/* Search Bar */}
//                     <div className="mt-10 flex justify-center">
//                         <div className="flex border border-white/40 w-full max-w-xl">
//                             <input
//                                 type="text"
//                                 value={certificateNumber}
//                                 onChange={(e) => setCertificateNumber(e.target.value)}
//                                 placeholder="Enter certificate number"
//                                 className="flex-1 bg-transparent px-4 py-3 outline-none text-white placeholder-white/60"
//                                 onKeyDown={(e) => e.key === "Enter" && handleSearch()}
//                             />

//                             <button
//                                 onClick={handleSearch}
//                                 disabled={!certificateNumber.trim()}
//                                 className="px-6 border-l border-white/40 hover:bg-white hover:text-black transition-all"
//                             >
//                                 SEARCH
//                             </button>
//                         </div>
//                     </div>

//                     {/* Description */}
//                     <p className="text-white/60 mt-10 max-w-2xl mx-auto text-sm leading-relaxed">
//                         Verify the authenticity of certificates issued by our organization.
//                         Enter the certificate number above to check validity and details.
//                     </p>
//                 </motion.div>
//             </div>
//         </>
//     );
// };

// export default CertificateVerification;