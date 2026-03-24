/**
 * Cigna Insurance Field Mapping
 * Cigna 保险字段映射配置
 */

import type { InsuranceProviderConfig, ValidationError } from '../types/insurance-claim';

/**
 * Cigna 字段映射表
 * key: 系统统一字段路径
 * value: Cigna 表单字段显示名称
 */
export const cignaFieldMapping: Record<string, string> = {
  // 保险信息
  'insurance.policyNumber': 'Policy Number',
  'insurance.memberId': 'Member ID / Certificate Number',
  'insurance.groupNumber': 'Group Number',
  
  // 患者信息
  'patient.name': 'Patient Full Name (as shown on ID)',
  'patient.dateOfBirth': 'Date of Birth (MM/DD/YYYY)',
  'patient.gender': 'Gender',
  'patient.phone': 'Phone Number',
  'patient.email': 'Email Address',
  'patient.address': 'Residential Address',
  'patient.passportNumber': 'Passport / ID Number',
  'patient.nationality': 'Nationality',
  
  // 就诊信息
  'medicalEvent.serviceDate': 'Date of Service / Treatment',
  'medicalEvent.admissionDate': 'Admission Date',
  'medicalEvent.dischargeDate': 'Discharge Date',
  'medicalEvent.hospitalName': 'Hospital/Facility Name',
  'medicalEvent.hospitalAddress': 'Hospital Address',
  'medicalEvent.department': 'Department/Specialty',
  'medicalEvent.doctorName': 'Treating Physician Name',
  'medicalEvent.doctorLicense': 'Physician License Number',
  'medicalEvent.doctorPhone': 'Physician Contact Number',
  'medicalEvent.type': 'Type of Request',
  
  // 诊断信息
  'diagnosis.primary.icd10Code': 'Primary Diagnosis Code (ICD-10)',
  'diagnosis.primary.description': 'Primary Diagnosis Description',
  'diagnosis.secondary': 'Secondary Diagnosis',
  'diagnosis.symptoms': 'Presenting Symptoms',
  
  // 费用信息
  'financial.totalAmount': 'Total Claim Amount',
  'financial.currency': 'Currency',
  'financial.patientPaid': 'Amount Paid by Patient',
  'financial.deductibleAmount': 'Deductible Amount',
  'financial.copayAmount': 'Copay Amount',
  'financial.isDirectBilling': 'Direct Billing Requested',
  
  // 治疗项目（数组字段，需要特殊处理）
  'treatments': 'Treatment/Service Details',
  'treatments.item': 'Service Item',
  'treatments.cptCode': 'CPT Code',
  'treatments.description': 'Service Description',
  'treatments.quantity': 'Quantity',
  'treatments.unitPrice': 'Unit Price',
  'treatments.totalPrice': 'Total Price',
};

/**
 * Cigna 必填字段列表
 */
export const cignaRequiredFields: string[] = [
  'insurance.memberId',
  'insurance.policyNumber',
  'patient.name',
  'patient.dateOfBirth',
  'patient.gender',
  'patient.phone',
  'medicalEvent.serviceDate',
  'medicalEvent.hospitalName',
  'medicalEvent.doctorName',
  'diagnosis.primary.icd10Code',
  'diagnosis.primary.description',
  'financial.totalAmount',
  'financial.currency',
];

/**
 * Cigna 预授权必填字段（额外）
 */
export const cignaPreAuthRequiredFields: string[] = [
  ...cignaRequiredFields,
  'medicalEvent.admissionDate',
  'diagnosis.symptoms',
  'financial.isDirectBilling',
];

/**
 * Cigna 字段验证规则
 */
export interface CignaValidationRule {
  field: string;
  required: boolean;
  pattern?: RegExp;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  customValidator?: (value: unknown) => ValidationError | null;
}

/**
 * Cigna 字段验证规则列表
 */
export const cignaValidationRules: CignaValidationRule[] = [
  {
    field: 'insurance.memberId',
    required: true,
    minLength: 5,
    maxLength: 50,
  },
  {
    field: 'insurance.policyNumber',
    required: true,
    minLength: 5,
    maxLength: 50,
  },
  {
    field: 'patient.name',
    required: true,
    minLength: 2,
    maxLength: 100,
    pattern: /^[\p{L}\s'-]+$/u,
  },
  {
    field: 'patient.dateOfBirth',
    required: true,
    pattern: /^\d{4}-\d{2}-\d{2}$/,
  },
  {
    field: 'patient.phone',
    required: true,
    pattern: /^[\d\s\+\-\(\)]+$/,
    minLength: 8,
    maxLength: 20,
  },
  {
    field: 'patient.email',
    required: false,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
  {
    field: 'medicalEvent.serviceDate',
    required: true,
    pattern: /^\d{4}-\d{2}-\d{2}$/,
  },
  {
    field: 'diagnosis.primary.icd10Code',
    required: true,
    pattern: /^[A-Z]\d{2}(\.\d{1,2})?$/,
  },
  {
    field: 'financial.totalAmount',
    required: true,
    min: 0,
    max: 999999999,
  },
];

/**
 * Cigna 保险公司配置
 */
export const cignaConfig: InsuranceProviderConfig = {
  id: 'cigna',
  name: 'Cigna',
  nameCn: '信諾保險',
  supportedForms: ['pre-auth', 'claim', 'emergency'],
  fieldMapping: cignaFieldMapping,
  requiredFields: cignaRequiredFields,
  outputFormat: 'pdf',
  submissionMethod: 'email',
  submissionConfig: {
    email: 'claims@cigna.com',
    portalUrl: 'https://www.cigna.com/healthcare-providers/submit-claims',
  },
};

/**
 * Cigna 表单模板配置
 */
export interface CignaFormTemplate {
  formName: string;
  formCode: string;
  version: string;
  description: string;
  pages: number;
  sections: {
    id: string;
    title: string;
    titleCn: string;
    fields: string[];
    order: number;
  }[];
}

/**
 * Cigna 预授权表单模板
 */
export const cignaPreAuthTemplate: CignaFormTemplate = {
  formName: 'Pre-authorization Request Form',
  formCode: 'CIGNA-PA-001',
  version: '2024.1',
  description: 'Cigna International Pre-authorization Request Form',
  pages: 3,
  sections: [
    {
      id: 'patient-info',
      title: 'Patient Information',
      titleCn: '患者信息',
      fields: ['patient.name', 'patient.dateOfBirth', 'patient.gender', 'patient.phone', 'patient.email', 'patient.address', 'patient.passportNumber'],
      order: 1,
    },
    {
      id: 'insurance-info',
      title: 'Insurance Information',
      titleCn: '保险信息',
      fields: ['insurance.policyNumber', 'insurance.memberId', 'insurance.groupNumber'],
      order: 2,
    },
    {
      id: 'medical-info',
      title: 'Medical Information',
      titleCn: '就诊信息',
      fields: ['medicalEvent.hospitalName', 'medicalEvent.hospitalAddress', 'medicalEvent.department', 'medicalEvent.doctorName', 'medicalEvent.doctorLicense', 'medicalEvent.serviceDate', 'medicalEvent.admissionDate', 'medicalEvent.dischargeDate'],
      order: 3,
    },
    {
      id: 'diagnosis-info',
      title: 'Diagnosis Information',
      titleCn: '诊断信息',
      fields: ['diagnosis.primary.icd10Code', 'diagnosis.primary.description', 'diagnosis.symptoms'],
      order: 4,
    },
    {
      id: 'treatment-info',
      title: 'Treatment Information',
      titleCn: '治疗信息',
      fields: ['treatments', 'financial.totalAmount', 'financial.currency', 'financial.isDirectBilling'],
      order: 5,
    },
  ],
};

/**
 * Cigna 理赔表单模板
 */
export const cignaClaimTemplate: CignaFormTemplate = {
  formName: 'Medical Claim Form',
  formCode: 'CIGNA-CL-001',
  version: '2024.1',
  description: 'Cigna International Medical Claim Form',
  pages: 2,
  sections: [
    {
      id: 'patient-info',
      title: 'Patient Information',
      titleCn: '患者信息',
      fields: ['patient.name', 'patient.dateOfBirth', 'patient.gender', 'patient.phone', 'patient.email', 'patient.address'],
      order: 1,
    },
    {
      id: 'insurance-info',
      title: 'Insurance Information',
      titleCn: '保险信息',
      fields: ['insurance.policyNumber', 'insurance.memberId', 'insurance.groupNumber'],
      order: 2,
    },
    {
      id: 'claim-details',
      title: 'Claim Details',
      titleCn: '理赔详情',
      fields: ['medicalEvent.hospitalName', 'medicalEvent.doctorName', 'medicalEvent.serviceDate', 'diagnosis.primary.icd10Code', 'diagnosis.primary.description'],
      order: 3,
    },
    {
      id: 'payment-info',
      title: 'Payment Information',
      titleCn: '支付信息',
      fields: ['financial.totalAmount', 'financial.currency', 'financial.patientPaid', 'financial.deductibleAmount'],
      order: 4,
    },
  ],
};

/**
 * 获取 Cigna 表单模板
 * @param formType 表单类型
 * @returns 表单模板配置
 */
export function getCignaTemplate(formType: 'pre-auth' | 'claim'): CignaFormTemplate {
  return formType === 'pre-auth' ? cignaPreAuthTemplate : cignaClaimTemplate;
}

/**
 * 获取字段显示名称
 * @param fieldPath 字段路径
 * @returns 显示名称
 */
export function getCignaFieldDisplayName(fieldPath: string): string {
  return cignaFieldMapping[fieldPath] || fieldPath;
}

/**
 * 获取必填字段列表
 * @param formType 表单类型
 * @returns 必填字段列表
 */
export function getCignaRequiredFields(formType: 'pre-auth' | 'claim'): string[] {
  return formType === 'pre-auth' ? cignaPreAuthRequiredFields : cignaRequiredFields;
}
