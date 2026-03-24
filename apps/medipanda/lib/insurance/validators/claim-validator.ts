/**
 * Insurance Claim Validator
 * 保险申报数据验证逻辑
 */

import type { 
  InsuranceClaim, 
  CreateClaimRequest, 
  ValidationResult, 
  ValidationError,
  ClaimType 
} from '../types/insurance-claim';
import { cignaValidationRules, getCignaRequiredFields } from '../mappings/cigna-mapping';

/**
 * 验证字段值
 * @param field 字段名
 * @param value 字段值
 * @param rules 验证规则
 * @returns 验证错误数组
 */
function validateField(
  field: string, 
  value: unknown, 
  rules: typeof cignaValidationRules
): ValidationError[] {
  const errors: ValidationError[] = [];
  const rule = rules.find(r => r.field === field);
  
  if (!rule) return errors;
  
  // 必填验证
  if (rule.required && (value === undefined || value === null || value === '')) {
    errors.push({
      field,
      message: `${field} is required`,
      code: 'REQUIRED',
    });
    return errors;
  }
  
  // 如果值为空且不是必填，跳过其他验证
  if (!value && !rule.required) return errors;
  
  const strValue = String(value);
  
  // 最小长度验证
  if (rule.minLength !== undefined && strValue.length < rule.minLength) {
    errors.push({
      field,
      message: `${field} must be at least ${rule.minLength} characters`,
      code: 'MIN_LENGTH',
    });
  }
  
  // 最大长度验证
  if (rule.maxLength !== undefined && strValue.length > rule.maxLength) {
    errors.push({
      field,
      message: `${field} must be at most ${rule.maxLength} characters`,
      code: 'MAX_LENGTH',
    });
  }
  
  // 正则表达式验证
  if (rule.pattern && !rule.pattern.test(strValue)) {
    errors.push({
      field,
      message: `${field} format is invalid`,
      code: 'PATTERN',
    });
  }
  
  // 数值最小值验证
  if (rule.min !== undefined && typeof value === 'number' && value < rule.min) {
    errors.push({
      field,
      message: `${field} must be at least ${rule.min}`,
      code: 'MIN_VALUE',
    });
  }
  
  // 数值最大值验证
  if (rule.max !== undefined && typeof value === 'number' && value > rule.max) {
    errors.push({
      field,
      message: `${field} must be at most ${rule.max}`,
      code: 'MAX_VALUE',
    });
  }
  
  // 自定义验证器
  if (rule.customValidator) {
    const customError = rule.customValidator(value);
    if (customError) {
      errors.push(customError);
    }
  }
  
  return errors;
}

/**
 * 获取嵌套字段值
 * @param obj 对象
 * @param path 字段路径 (如 'patient.name')
 * @returns 字段值
 */
function getNestedValue(obj: Record<string, unknown>, path: string): unknown {
  return path.split('.').reduce((current: unknown, key: string) => {
    if (current === null || current === undefined) return undefined;
    return (current as Record<string, unknown>)[key];
  }, obj);
}

/**
 * 验证 ICD-10 编码格式
 * @param code ICD-10 编码
 * @returns 是否有效
 */
export function validateICD10(code: string): boolean {
  // ICD-10 格式: 字母 + 两位数字 + 可选的小数点和一位或两位数字
  const pattern = /^[A-Z]\d{2}(\.\d{1,2})?$/;
  return pattern.test(code);
}

/**
 * 验证日期格式 (YYYY-MM-DD)
 * @param date 日期字符串
 * @param allowFuture 是否允许未来日期（预授权需要）
 * @returns 是否有效
 */
export function validateDate(date: string, allowFuture: boolean = false): boolean {
  const pattern = /^\d{4}-\d{2}-\d{2}$/;
  if (!pattern.test(date)) return false;
  
  const d = new Date(date);
  if (isNaN(d.getTime())) return false;
  
  // 如果不允许未来日期，检查日期是否合理
  if (!allowFuture) {
    const now = new Date();
    // 设置时间为当天开始，避免时区问题
    now.setHours(0, 0, 0, 0);
    if (d > now) return false;
  }
  
  return true;
}

/**
 * 验证邮箱格式
 * @param email 邮箱地址
 * @returns 是否有效
 */
export function validateEmail(email: string): boolean {
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return pattern.test(email);
}

/**
 * 验证电话号码格式
 * @param phone 电话号码
 * @returns 是否有效
 */
export function validatePhone(phone: string): boolean {
  // 支持国际格式: +86 138-0000-0000, (021) 1234-5678 等
  const pattern = /^[\d\s\+\-\(\)]{8,20}$/;
  return pattern.test(phone);
}

/**
 * 验证货币代码
 * @param currency 货币代码
 * @returns 是否有效
 */
export function validateCurrency(currency: string): boolean {
  const validCurrencies = ['USD', 'EUR', 'CNY', 'SGD', 'HKD'];
  return validCurrencies.includes(currency);
}

/**
 * 验证完整申报数据
 * @param data 申报数据
 * @param provider 保险公司
 * @param claimType 申报类型
 * @returns 验证结果
 */
export function validateClaim(
  data: Partial<InsuranceClaim> | CreateClaimRequest,
  provider: string,
  claimType: ClaimType
): ValidationResult {
  const errors: ValidationError[] = [];
  const missingRequiredFields: string[] = [];
  
  // 预授权允许未来日期
  const allowFutureDate = claimType === 'pre-auth';
  
  // 根据保险公司获取验证规则和必填字段
  let requiredFields: string[] = [];
  let validationRules = cignaValidationRules;
  
  if (provider === 'cigna') {
    requiredFields = getCignaRequiredFields(claimType === 'pre-auth' ? 'pre-auth' : 'claim');
  } else {
    // 默认使用 Cigna 的规则
    requiredFields = getCignaRequiredFields('claim');
  }
  
  // 转换为 InsuranceClaim 格式以便统一处理
  const claimData = 'metadata' in data ? data as InsuranceClaim : {
    ...data,
    id: '',
    userId: '',
    attachments: [],
    metadata: {
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      submittedBy: '',
      status: 'draft',
    },
  } as InsuranceClaim;
  
  // 验证必填字段
  for (const field of requiredFields) {
    const value = getNestedValue(claimData as unknown as Record<string, unknown>, field);
    if (value === undefined || value === null || value === '') {
      missingRequiredFields.push(field);
      errors.push({
        field,
        message: `${field} is required`,
        code: 'REQUIRED',
      });
    }
  }
  
  // 应用字段验证规则
  for (const rule of validationRules) {
    const value = getNestedValue(claimData as unknown as Record<string, unknown>, rule.field);
    const fieldErrors = validateField(rule.field, value, [rule]);
    errors.push(...fieldErrors);
  }
  
  // 额外的业务逻辑验证
  
  // 验证日期顺序
  if (claimData.medicalEvent?.admissionDate && claimData.medicalEvent?.dischargeDate) {
    const admission = new Date(claimData.medicalEvent.admissionDate);
    const discharge = new Date(claimData.medicalEvent.dischargeDate);
    if (discharge < admission) {
      errors.push({
        field: 'medicalEvent.dischargeDate',
        message: 'Discharge date must be after admission date',
        code: 'DATE_ORDER',
      });
    }
  }
  
  // 验证服务日期（预授权允许未来日期）
  if (claimData.medicalEvent?.serviceDate) {
    if (!validateDate(claimData.medicalEvent.serviceDate, allowFutureDate)) {
      errors.push({
        field: 'medicalEvent.serviceDate',
        message: allowFutureDate 
          ? 'Invalid service date format' 
          : 'Service date cannot be in the future',
        code: 'INVALID_DATE',
      });
    }
  }
  
  // 验证费用计算
  if (claimData.treatments && claimData.treatments.length > 0) {
    const calculatedTotal = claimData.treatments.reduce((sum, item) => sum + item.totalPrice, 0);
    if (Math.abs(calculatedTotal - (claimData.financial?.totalAmount || 0)) > 0.01) {
      errors.push({
        field: 'financial.totalAmount',
        message: 'Total amount does not match sum of treatment items',
        code: 'AMOUNT_MISMATCH',
      });
    }
  }
  
  // 验证 ICD-10 编码
  if (claimData.diagnosis?.primary?.icd10Code && !validateICD10(claimData.diagnosis.primary.icd10Code)) {
    errors.push({
      field: 'diagnosis.primary.icd10Code',
      message: 'Invalid ICD-10 code format',
      code: 'INVALID_ICD10',
    });
  }
  
  // 验证邮箱格式
  if (claimData.patient?.email && !validateEmail(claimData.patient.email)) {
    errors.push({
      field: 'patient.email',
      message: 'Invalid email format',
      code: 'INVALID_EMAIL',
    });
  }
  
  // 验证电话号码
  if (claimData.patient?.phone && !validatePhone(claimData.patient.phone)) {
    errors.push({
      field: 'patient.phone',
      message: 'Invalid phone number format',
      code: 'INVALID_PHONE',
    });
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    missingRequiredFields,
  };
}

/**
 * 验证创建申报请求
 * @param request 创建请求
 * @param provider 保险公司
 * @param claimType 申报类型
 * @returns 验证结果
 */
export function validateCreateRequest(
  request: CreateClaimRequest,
  provider: string,
  claimType: ClaimType
): ValidationResult {
  return validateClaim(request, provider, claimType);
}

/**
 * 验证更新申报请求
 * @param request 更新请求数据
 * @returns 验证结果
 */
export function validateUpdateRequest(
  request: Record<string, unknown>
): ValidationResult {
  const errors: ValidationError[] = [];
  const missingRequiredFields: string[] = [];
  
  // 更新请求可以部分更新，所以只验证提供的字段
  const patientEmail = (request.patient as Record<string, unknown> | undefined)?.email;
  if (patientEmail && !validateEmail(patientEmail as string)) {
    errors.push({
      field: 'patient.email',
      message: 'Invalid email format',
      code: 'INVALID_EMAIL',
    });
  }
  
  const patientPhone = (request.patient as Record<string, unknown> | undefined)?.phone;
  if (patientPhone && !validatePhone(patientPhone as string)) {
    errors.push({
      field: 'patient.phone',
      message: 'Invalid phone number format',
      code: 'INVALID_PHONE',
    });
  }
  
  const diagnosisCode = ((request.diagnosis as Record<string, unknown> | undefined)?.primary as Record<string, unknown> | undefined)?.icd10Code;
  if (diagnosisCode && !validateICD10(diagnosisCode as string)) {
    errors.push({
      field: 'diagnosis.primary.icd10Code',
      message: 'Invalid ICD-10 code format',
      code: 'INVALID_ICD10',
    });
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    missingRequiredFields,
  };
}

/**
 * 获取字段错误信息
 * @param result 验证结果
 * @param field 字段名
 * @returns 错误信息
 */
export function getFieldError(result: ValidationResult, field: string): string | undefined {
  const error = result.errors.find(e => e.field === field);
  return error?.message;
}

/**
 * 检查字段是否有错误
 * @param result 验证结果
 * @param field 字段名
 * @returns 是否有错误
 */
export function hasFieldError(result: ValidationResult, field: string): boolean {
  return result.errors.some(e => e.field === field);
}
