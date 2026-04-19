// components/certificate/AddCertificate.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Save,
  RefreshCw,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2,
  ArrowLeft,
  Building2,
  FileText,
  Award,
  Globe,
  Calendar,
  Hash,
  MapPin,
  Briefcase,
  Upload,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";
import { useAddThumbnailMutation } from "@/redux/features/file/fileApi";
import BackButton from "../reusable-components/BackButton";
import { useCreateCertificateMutation } from "@/redux/api/sms-configurations/certificateApi";

const certificateSchema = z.object({
  name: z.string().min(1, "Company/Organization name is required"),
  address: z.string().min(1, "Address is required"),
  standard: z.string().min(1, "Standard is required"),
  accreditationBody: z.string().min(1, "Accreditation body is required"),
  certificationBody: z.string().min(1, "Certification body is required"),
  country: z.string().min(1, "Country is required"),
  scope: z.string().min(1, "Scope is required"),
  certificateNumber: z.string().min(1, "Certificate number is required"),
  issueDate: z.string().min(1, "Issue date is required"),
  registrationDate: z.string().min(1, "Registration date is required"),
  expiryDate: z.string().min(1, "Expiry date is required"),
  certificateFile: z.string().optional(),
  logo: z.string().optional(),
  status: z.string().optional(),
  notes: z.string().optional(),
});

type CertificateFormData = z.infer<typeof certificateSchema>;

export default function AddCertificate() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [certificateFile, setCertificateFile] = useState<string>("");
  const [logoFile, setLogoFile] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);

  const [createCertificate] = useCreateCertificateMutation();
  const [addThumbnail] = useAddThumbnailMutation();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CertificateFormData>({
    resolver: zodResolver(certificateSchema),
    defaultValues: {
      name: "",
      address: "",
      standard: "",
      accreditationBody: "",
      certificationBody: "",
      country: "",
      scope: "",
      certificateNumber: "",
      issueDate: "",
      registrationDate: "",
      expiryDate: "",
      status: "active",
      notes: "",
    },
  });

  const handleFileUpload = async (file: File, type: 'certificate' | 'logo') => {
    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append('image', file);
      const response = await addThumbnail(formData).unwrap();

      if (response.success && response.data && response.data[0]) {
        const fileUrl = response.data[0];
        if (type === 'certificate') {
          setCertificateFile(fileUrl);
          setValue('certificateFile', fileUrl);
        } else {
          setLogoFile(fileUrl);
          setValue('logo', fileUrl);
        }
        toast.success(`${type === 'certificate' ? 'Certificate' : 'Logo'} uploaded successfully!`);
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const onSubmit = async (data: CertificateFormData) => {
    setIsSubmitting(true);
    try {
      const result = await createCertificate(data).unwrap();

      if (result.success) {
        toast.success(
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <span>Certificate added successfully!</span>
          </div>,
          { duration: 3000 }
        );
        router.push("/admin/certificates/all-certificate");
      }
    } catch (error: any) {
      toast.error(
        <div className="flex items-center gap-2">
          <XCircle className="w-5 h-5 text-red-500" />
          <span>{error?.data?.message || "Failed to add certificate"}</span>
        </div>,
        { duration: 4000 }
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 md:p-6 lg:p-8">
      <div className="mb-8">
        <BackButton />
        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
          Add New Certificate
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Fill in the details to add a new certificate
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Basic Information */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
          <div className="p-6 border-b border-gray-200 dark:border-gray-800 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-900">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                <Award className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Basic Information</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">Certificate holder details</p>
              </div>
            </div>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2 md:col-span-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  <Building2 size={16} className="text-blue-500" />
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className={cn(
                    "w-full px-4 py-2.5 rounded-lg border",
                    "bg-gray-50 dark:bg-gray-800",
                    "border-gray-300 dark:border-gray-700",
                    "text-gray-900 dark:text-gray-100",
                    "focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500",
                    errors.name && "border-red-500 focus:ring-red-500/50"
                  )}
                  placeholder="Enter name"
                  {...register("name")}
                />
                {errors.name && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle size={14} />
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  <MapPin size={16} className="text-yellow-500" />
                  Address <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={3}
                  className={cn(
                    "w-full px-4 py-2.5 rounded-lg border",
                    "bg-gray-50 dark:bg-gray-800",
                    "border-gray-300 dark:border-gray-700",
                    "text-gray-900 dark:text-gray-100",
                    "focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500",
                    errors.address && "border-red-500 focus:ring-red-500/50"
                  )}
                  placeholder="Enter full address"
                  {...register("address")}
                />
                {errors.address && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle size={14} />
                    {errors.address.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  <FileText size={16} className="text-purple-500" />
                  Standard <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className={cn(
                    "w-full px-4 py-2.5 rounded-lg border",
                    "bg-gray-50 dark:bg-gray-800",
                    "border-gray-300 dark:border-gray-700",
                    "text-gray-900 dark:text-gray-100",
                    "focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500",
                    errors.standard && "border-red-500 focus:ring-red-500/50"
                  )}
                  placeholder="e.g., ISO 9001:2015-Quality Management System"
                  {...register("standard")}
                />
                {errors.standard && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle size={14} />
                    {errors.standard.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  <Hash size={16} className="text-indigo-500" />
                  Certification Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className={cn(
                    "w-full px-4 py-2.5 rounded-lg border",
                    "bg-gray-50 dark:bg-gray-800",
                    "border-gray-300 dark:border-gray-700",
                    "text-gray-900 dark:text-gray-100",
                    "focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500",
                    errors.certificateNumber && "border-red-500 focus:ring-red-500/50"
                  )}
                  placeholder="Enter Certification Number"
                  {...register("certificateNumber")}
                />
                {errors.certificateNumber && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle size={14} />
                    {errors.certificateNumber.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  <Globe size={16} className="text-emerald-500" />
                  Accreditation Body <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className={cn(
                    "w-full px-4 py-2.5 rounded-lg border",
                    "bg-gray-50 dark:bg-gray-800",
                    "border-gray-300 dark:border-gray-700",
                    "text-gray-900 dark:text-gray-100",
                    "focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500",
                    errors.accreditationBody && "border-red-500 focus:ring-red-500/50"
                  )}
                  placeholder="e.g., iSAB, USA"
                  {...register("accreditationBody")}
                />
                {errors.accreditationBody && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle size={14} />
                    {errors.accreditationBody.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  <Briefcase size={16} className="text-pink-500" />
                  Certification Body <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className={cn(
                    "w-full px-4 py-2.5 rounded-lg border",
                    "bg-gray-50 dark:bg-gray-800",
                    "border-gray-300 dark:border-gray-700",
                    "text-gray-900 dark:text-gray-100",
                    "focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500",
                    errors.certificationBody && "border-red-500 focus:ring-red-500/50"
                  )}
                  placeholder="e.g., Moody Inspection & Assurance LLC. USA"
                  {...register("certificationBody")}
                />
                {errors.certificationBody && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle size={14} />
                    {errors.certificationBody.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  <Globe size={16} className="text-cyan-500" />
                  Country <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className={cn(
                    "w-full px-4 py-2.5 rounded-lg border",
                    "bg-gray-50 dark:bg-gray-800",
                    "border-gray-300 dark:border-gray-700",
                    "text-gray-900 dark:text-gray-100",
                    "focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500",
                    errors.country && "border-red-500 focus:ring-red-500/50"
                  )}
                  placeholder="Enter country"
                  {...register("country")}
                />
                {errors.country && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle size={14} />
                    {errors.country.message}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Scope */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
          <div className="p-6 border-b border-gray-200 dark:border-gray-800 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-900">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
                <FileText className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Scope</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">Certificate scope and covered activities</p>
              </div>
            </div>
          </div>
          
          <div className="p-6">
            <textarea
              rows={6}
              className={cn(
                "w-full px-4 py-2.5 rounded-lg border",
                "bg-gray-50 dark:bg-gray-800",
                "border-gray-300 dark:border-gray-700",
                "text-gray-900 dark:text-gray-100",
                "focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500",
                errors.scope && "border-red-500 focus:ring-red-500/50"
              )}
              placeholder="Describe the scope of the certificate..."
              {...register("scope")}
            />
            {errors.scope && (
              <p className="text-sm text-red-500 flex items-center gap-1 mt-2">
                <AlertCircle size={14} />
                {errors.scope.message}
              </p>
            )}
          </div>
        </div>

        {/* Dates */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
          <div className="p-6 border-b border-gray-200 dark:border-gray-800 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-900">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-900/30">
                <Calendar className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Dates</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">Certificate validity dates</p>
              </div>
            </div>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  <Calendar size={16} className="text-blue-500" />
                  Issue Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  className={cn(
                    "w-full px-4 py-2.5 rounded-lg border",
                    "bg-gray-50 dark:bg-gray-800",
                    "border-gray-300 dark:border-gray-700",
                    "text-gray-900 dark:text-gray-100",
                    "focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500",
                    errors.issueDate && "border-red-500 focus:ring-red-500/50"
                  )}
                  {...register("issueDate")}
                />
                {errors.issueDate && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle size={14} />
                    {errors.issueDate.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  <Calendar size={16} className="text-purple-500" />
                  Registration Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  className={cn(
                    "w-full px-4 py-2.5 rounded-lg border",
                    "bg-gray-50 dark:bg-gray-800",
                    "border-gray-300 dark:border-gray-700",
                    "text-gray-900 dark:text-gray-100",
                    "focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500",
                    errors.registrationDate && "border-red-500 focus:ring-red-500/50"
                  )}
                  {...register("registrationDate")}
                />
                {errors.registrationDate && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle size={14} />
                    {errors.registrationDate.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  <Calendar size={16} className="text-red-500" />
                  Expiry Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  className={cn(
                    "w-full px-4 py-2.5 rounded-lg border",
                    "bg-gray-50 dark:bg-gray-800",
                    "border-gray-300 dark:border-gray-700",
                    "text-gray-900 dark:text-gray-100",
                    "focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500",
                    errors.expiryDate && "border-red-500 focus:ring-red-500/50"
                  )}
                  {...register("expiryDate")}
                />
                {errors.expiryDate && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle size={14} />
                    {errors.expiryDate.message}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Notes */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
          <div className="p-6 border-b border-gray-200 dark:border-gray-800 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-900">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800">
                <FileText className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Additional Notes</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">Any additional information</p>
              </div>
            </div>
          </div>
          
          <div className="p-6">
            <textarea
              rows={4}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200"
              placeholder="Enter any additional notes..."
              {...register("notes")}
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-8 py-3 rounded-xl font-medium flex items-center gap-2 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className={cn(
              "px-8 py-3 rounded-xl cursor-pointer font-medium flex items-center gap-2",
              "bg-gradient-to-r from-blue-600 to-purple-600",
              "hover:from-blue-700 hover:to-purple-700",
              "text-white shadow-lg shadow-blue-500/25",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              "transition-all duration-200"
            )}
          >
            {isSubmitting ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                <span>Adding Certificate...</span>
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                <span>Add Certificate</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}