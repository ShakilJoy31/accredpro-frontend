// utils/interface/studentDocumentInterface.ts

export interface StudentDocument {
  id: number;
  studentId: number | null;
  documentType: string;
  title: string;
  originalFileName: string;
  storedFileName: string;
  filePath: string;
  fileUrl: string;
  fileSize: number;
  mimeType: string;
  remarks: string | null;
  // Approval fields
  approvalStatus: 'pending' | 'approved' | 'rejected' | 'revision_required';
  approvedBy: number | null;
  approvedByName: string | null;
  approvedAt: string | null;
  approvalRemarks: string | null;
  rejectionReason: string | null;
  reviewedAt: string | null;
  reviewedBy: number | null;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  tags: string[];
  version: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface StudentDocumentResponse {
  success: boolean;
  data: StudentDocument[];
  message?: string;
  pagination?: {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    itemsPerPage: number;
  };
}

export interface SingleStudentDocumentResponse {
  success: boolean;
  data: StudentDocument;
  message?: string;
}

export interface UploadDocumentRequest {
  studentId: number;
  documentType: string;
  title: string;
  remarks?: string;
  document: File;
}

export interface BulkUploadDocumentRequest {
  studentId: number;
  documents: Array<{
    title: string;
    file: File;
    remarks?: string;
  }>;
}

export interface CertificateDocument {
  id: string;
  title: string;
  file: File | null;
  previewUrl: string | null;
  remarks: string;
  uploaded: boolean;
}

export interface StudentInfo {
  id: number;
  studentId: string;
  fullName: string;
  email: string;
  phoneNo: string;
  fatherName?: string;
  motherName?: string;
  dateOfBirth?: string;
  gender?: string;
  enrolledCourseId?: number;
  enrolledCourses?: Array<{
    id?: number;
    courseId?: string;
    courseName?: string;
    enrollmentDate?: string;
    completionDate?: string;
    status?: string;
    progress?: number;
  }>;
  certificateIssued?: boolean;
  certificateNumber?: string;
  qualification?: string;
  profileImage?: string;
}

// Document approval statistics interface
export interface DocumentApprovalStatistics {
  pending: number;
  approved: number;
  rejected: number;
  revisionRequired: number;
  total: number;
  approvalRate: number;
}

// Document filter params interface
export interface DocumentFilterParams {
  studentId?: number;
  documentType?: string;
  approvalStatus?: string;
  priority?: string;
  search?: string;
  page?: number;
  limit?: number;
}

// Document with student info interface
export interface DocumentWithStudent extends StudentDocument {
  student?: {
    id: number;
    studentId: string;
    fullName: string;
    email: string;
    phoneNo: string;
    profileImage?: string;
  };
}

// Document status update request
export interface DocumentStatusUpdateRequest {
  id: number;
  approvalRemarks?: string;
  rejectionReason?: string;
  revisionFeedback?: string;
}

// Bulk document approval request
export interface BulkDocumentApprovalRequest {
  documentIds: number[];
  approvalRemarks?: string;
}

// Document upload progress interface
export interface DocumentUploadProgress {
  fileName: string;
  progress: number;
  status: 'pending' | 'uploading' | 'completed' | 'failed';
  error?: string;
}

// Document type enum
export enum DocumentType {
  CERTIFICATE_DOCUMENT = 'certificate_document',
  ID_PROOF = 'id_proof',
  ADDRESS_PROOF = 'address_proof',
  EDUCATIONAL_PROOF = 'educational_proof',
  PHOTOGRAPH = 'photograph',
  SIGNATURE = 'signature',
  OTHER = 'other',
}

// Approval status enum
export enum ApprovalStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  REVISION_REQUIRED = 'revision_required',
}

// Priority enum
export enum Priority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent',
}