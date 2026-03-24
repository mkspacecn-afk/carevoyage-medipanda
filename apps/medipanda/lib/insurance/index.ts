/**
 * Insurance Module Exports
 * 保险模块统一导出
 */

// 类型导出
export type {
  InsuranceClaim,
  CreateClaimRequest,
  UpdateClaimRequest,
  ClaimListItem,
  InsuranceProvider,
  ClaimType,
  ClaimStatus,
  Gender,
  Currency,
  AttachmentType,
  PatientInfo,
  DiagnosisInfo,
  Diagnosis,
  MedicalEvent,
  TreatmentItem,
  FinancialInfo,
  Attachment,
  InsuranceInfo,
  ClaimMetadata,
  ValidationError,
  ValidationResult,
  GeneratePdfRequest,
  GeneratePdfResponse,
  UploadResponse,
  ICD10Suggestion,
  InsuranceProviderConfig,
} from './types/insurance-claim';

// 验证器导出
export {
  validateClaim,
  validateCreateRequest,
  validateUpdateRequest,
  validateICD10,
  validateDate,
  validateEmail,
  validatePhone,
  validateCurrency,
  getFieldError,
  hasFieldError,
} from './validators/claim-validator';

// Cigna 映射导出
export {
  cignaFieldMapping,
  cignaRequiredFields,
  cignaPreAuthRequiredFields,
  cignaValidationRules,
  cignaConfig,
  cignaPreAuthTemplate,
  cignaClaimTemplate,
  getCignaTemplate,
  getCignaFieldDisplayName,
  getCignaRequiredFields,
} from './mappings/cigna-mapping';
