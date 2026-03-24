/**
 * Insurance Claim Types
 * 保险申报统一数据模型
 */

export type InsuranceProvider = 'cigna' | 'axa' | 'allianz' | 'other';
export type ClaimType = 'pre-auth' | 'claim' | 'emergency';
export type ClaimStatus = 'draft' | 'pending-docs' | 'ready' | 'submitted' | 'acknowledged' | 'rejected' | 'approved';
export type Gender = 'M' | 'F' | 'O';
export type Currency = 'USD' | 'EUR' | 'CNY' | 'SGD' | 'HKD';
export type AttachmentType = 'invoice' | 'receipt' | 'medical-report' | 'lab-result' | 'id-proof' | 'diagnosis' | 'prescription' | 'other';

export interface PatientInfo {
  name: string;
  dateOfBirth: string; // YYYY-MM-DD
  gender: Gender;
  phone: string;
  email: string;
  address: string;
  passportNumber?: string;
  nationality?: string;
}

export interface DiagnosisInfo {
  icd10Code: string;
  description: string;
}

export interface Diagnosis {
  primary: DiagnosisInfo;
  secondary?: DiagnosisInfo[];
  symptoms: string;
}

export interface MedicalEvent {
  type: ClaimType;
  serviceDate: string; // YYYY-MM-DD
  admissionDate?: string;
  dischargeDate?: string;
  hospitalName: string;
  hospitalAddress: string;
  department: string;
  doctorName: string;
  doctorLicense?: string;
  doctorPhone?: string;
}

export interface TreatmentItem {
  id: string;
  item: string;
  cptCode?: string;
  description: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface FinancialInfo {
  totalAmount: number;
  currency: Currency;
  isDirectBilling: boolean;
  patientPaid?: number;
  deductibleAmount?: number;
  copayAmount?: number;
}

export interface Attachment {
  id: string;
  type: AttachmentType;
  fileUrl: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  uploadedAt: string;
  ocrText?: string;
  extractedData?: Record<string, unknown>;
}

export interface InsuranceInfo {
  provider: InsuranceProvider;
  policyNumber: string;
  memberId: string;
  groupNumber?: string;
  planName?: string;
  effectiveDate?: string;
}

export interface ClaimMetadata {
  createdAt: string;
  updatedAt: string;
  submittedBy: string;
  submittedAt?: string;
  status: ClaimStatus;
  notes?: string;
  insuranceResponse?: Record<string, unknown>;
  trackingNumber?: string;
}

/**
 * 统一的保险申报数据模型
 */
export interface InsuranceClaim {
  id: string;
  userId: string;
  insurance: InsuranceInfo;
  patient: PatientInfo;
  medicalEvent: MedicalEvent;
  diagnosis: Diagnosis;
  treatments: TreatmentItem[];
  financial: FinancialInfo;
  attachments: Attachment[];
  metadata: ClaimMetadata;
}

/**
 * 创建申报时的请求数据（不包含系统生成字段）
 */
export interface CreateClaimRequest {
  insurance: Omit<InsuranceInfo, 'provider'> & { provider: InsuranceProvider };
  patient: PatientInfo;
  medicalEvent: MedicalEvent;
  diagnosis: Diagnosis;
  treatments: TreatmentItem[];
  financial: FinancialInfo;
}

/**
 * 更新申报时的请求数据
 */
export interface UpdateClaimRequest {
  insurance?: Partial<InsuranceInfo>;
  patient?: Partial<PatientInfo>;
  medicalEvent?: Partial<MedicalEvent>;
  diagnosis?: Partial<Diagnosis>;
  treatments?: TreatmentItem[];
  financial?: Partial<FinancialInfo>;
  status?: ClaimStatus;
  notes?: string;
}

/**
 * 申报列表项（简化版）
 */
export interface ClaimListItem {
  id: string;
  provider: InsuranceProvider;
  claimType: ClaimType;
  patientName: string;
  serviceDate: string;
  totalAmount: number;
  currency: Currency;
  status: ClaimStatus;
  createdAt: string;
  attachmentCount: number;
}

/**
 * 保险公司配置
 */
export interface InsuranceProviderConfig {
  id: InsuranceProvider;
  name: string;
  nameCn: string;
  logo?: string;
  supportedForms: ClaimType[];
  fieldMapping: Record<string, string>;
  requiredFields: string[];
  outputFormat: 'pdf' | 'api';
  submissionMethod: 'email' | 'portal' | 'api';
  submissionConfig?: {
    email?: string;
    portalUrl?: string;
    apiEndpoint?: string;
  };
}

/**
 * 表单验证错误
 */
export interface ValidationError {
  field: string;
  message: string;
  code: string;
}

/**
 * 表单验证结果
 */
export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  missingRequiredFields: string[];
}

/**
 * PDF生成请求
 */
export interface GeneratePdfRequest {
  claimId: string;
  formType: 'pre-auth' | 'claim';
  includeAttachments: boolean;
}

/**
 * PDF生成响应
 */
export interface GeneratePdfResponse {
  success: boolean;
  downloadUrl: string;
  previewUrl: string;
  fileName: string;
  fileSize: number;
  expiresAt: string;
  message?: string;
}

/**
 * 文件上传响应
 */
export interface UploadResponse {
  success: boolean;
  attachment: Attachment;
  extractedData?: Record<string, unknown>;
  confidence?: number;
  message?: string;
}

/**
 * ICD-10 编码建议
 */
export interface ICD10Suggestion {
  code: string;
  description: string;
  confidence: number;
  category?: string;
}
