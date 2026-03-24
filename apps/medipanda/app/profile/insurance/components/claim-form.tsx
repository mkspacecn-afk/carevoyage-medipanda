/**
 * Claim Form Component
 * 申报表单组件
 */

'use client';

import { useState, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Plus, Trash2, AlertCircle } from 'lucide-react';
import type { 
  InsuranceProvider, 
  ClaimType, 
  CreateClaimRequest,
  PatientInfo,
  MedicalEvent,
  Diagnosis,
  FinancialInfo,
  TreatmentItem,
  Gender,
  Currency,
  ValidationResult
} from '@/lib/insurance/types/insurance-claim';
import { validateClaim, getFieldError } from '@/lib/insurance/validators/claim-validator';
import { getCignaFieldDisplayName } from '@/lib/insurance/mappings/cigna-mapping';

interface ClaimFormProps {
  provider: InsuranceProvider;
  claimType: ClaimType;
  initialData?: Partial<CreateClaimRequest>;
  onSubmit: (data: CreateClaimRequest) => void;
  onBack: () => void;
}

// 表单步骤
const FORM_STEPS = [
  { id: 'insurance', title: '保險信息' },
  { id: 'patient', title: '患者信息' },
  { id: 'medical', title: '就診信息' },
  { id: 'diagnosis', title: '診斷信息' },
  { id: 'treatment', title: '治療費用' },
];

export default function ClaimForm({ 
  provider, 
  claimType, 
  initialData, 
  onSubmit, 
  onBack 
}: ClaimFormProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [validation, setValidation] = useState<ValidationResult | null>(null);
  
  // 表单数据
  const [formData, setFormData] = useState<CreateClaimRequest>({
    insurance: {
      provider,
      policyNumber: initialData?.insurance?.policyNumber || '',
      memberId: initialData?.insurance?.memberId || '',
      groupNumber: initialData?.insurance?.groupNumber || '',
      planName: initialData?.insurance?.planName || '',
    },
    patient: {
      name: initialData?.patient?.name || '',
      dateOfBirth: initialData?.patient?.dateOfBirth || '',
      gender: initialData?.patient?.gender || 'M',
      phone: initialData?.patient?.phone || '',
      email: initialData?.patient?.email || '',
      address: initialData?.patient?.address || '',
      passportNumber: initialData?.patient?.passportNumber || '',
      nationality: initialData?.patient?.nationality || '',
    },
    medicalEvent: {
      type: claimType,
      serviceDate: initialData?.medicalEvent?.serviceDate || '',
      admissionDate: initialData?.medicalEvent?.admissionDate || '',
      dischargeDate: initialData?.medicalEvent?.dischargeDate || '',
      hospitalName: initialData?.medicalEvent?.hospitalName || '',
      hospitalAddress: initialData?.medicalEvent?.hospitalAddress || '',
      department: initialData?.medicalEvent?.department || '',
      doctorName: initialData?.medicalEvent?.doctorName || '',
      doctorLicense: initialData?.medicalEvent?.doctorLicense || '',
      doctorPhone: initialData?.medicalEvent?.doctorPhone || '',
    },
    diagnosis: {
      primary: {
        icd10Code: initialData?.diagnosis?.primary?.icd10Code || '',
        description: initialData?.diagnosis?.primary?.description || '',
      },
      secondary: initialData?.diagnosis?.secondary || [],
      symptoms: initialData?.diagnosis?.symptoms || '',
    },
    treatments: initialData?.treatments || [],
    financial: {
      totalAmount: initialData?.financial?.totalAmount || 0,
      currency: initialData?.financial?.currency || 'CNY',
      isDirectBilling: initialData?.financial?.isDirectBilling || false,
      patientPaid: initialData?.financial?.patientPaid || 0,
      deductibleAmount: initialData?.financial?.deductibleAmount || 0,
      copayAmount: initialData?.financial?.copayAmount || 0,
    },
  });

  // 更新表单数据
  const updateFormData = useCallback((section: string, data: unknown) => {
    setFormData(prev => ({
      ...prev,
      [section]: data,
    }));
    setValidation(null);
  }, []);

  // 验证当前步骤
  const validateStep = useCallback(() => {
    const result = validateClaim(formData, provider, claimType);
    setValidation(result);
    return result.isValid;
  }, [formData, provider, claimType]);

  // 处理下一步
  const handleNext = () => {
    if (currentStep < FORM_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      const result = validateClaim(formData, provider, claimType);
      if (result.isValid) {
        onSubmit(formData);
      } else {
        setValidation(result);
      }
    }
  };

  // 处理上一步
  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else {
      onBack();
    }
  };

  // 添加治疗项目
  const addTreatment = () => {
    const newTreatment: TreatmentItem = {
      id: `treatment_${Date.now()}`,
      item: '',
      description: '',
      quantity: 1,
      unitPrice: 0,
      totalPrice: 0,
    };
    setFormData(prev => ({
      ...prev,
      treatments: [...prev.treatments, newTreatment],
    }));
  };

  // 更新治疗项目
  const updateTreatment = (index: number, field: keyof TreatmentItem, value: string | number) => {
    setFormData(prev => {
      const treatments = [...prev.treatments];
      treatments[index] = {
        ...treatments[index],
        [field]: value,
      };
      
      // 自动计算总价
      if (field === 'quantity' || field === 'unitPrice') {
        treatments[index].totalPrice = 
          treatments[index].quantity * treatments[index].unitPrice;
      }
      
      // 更新总费用
      const totalAmount = treatments.reduce((sum, t) => sum + t.totalPrice, 0);
      
      return {
        ...prev,
        treatments,
        financial: {
          ...prev.financial,
          totalAmount,
        },
      };
    });
  };

  // 删除治疗项目
  const removeTreatment = (index: number) => {
    setFormData(prev => {
      const treatments = prev.treatments.filter((_, i) => i !== index);
      const totalAmount = treatments.reduce((sum, t) => sum + t.totalPrice, 0);
      
      return {
        ...prev,
        treatments,
        financial: {
          ...prev.financial,
          totalAmount,
        },
      };
    });
  };

  const currentStepId = FORM_STEPS[currentStep].id;

  return (
    <div>
      {/* 子步骤指示器 */}
      <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2">
        {FORM_STEPS.map((step, index) => (
          <button
            key={step.id}
            onClick={() => setCurrentStep(index)}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              index === currentStep
                ? 'bg-teal-500 text-white'
                : index < currentStep
                ? 'bg-teal-100 text-teal-700'
                : 'bg-slate-100 text-slate-500'
            }`}
          >
            {step.title}
          </button>
        ))}
      </div>

      {/* 表单字段 */}
      <div className="space-y-6">
        {/* 保险信息 */}
        {currentStepId === 'insurance' && (
          <InsuranceSection 
            data={formData.insurance}
            onChange={(data) => updateFormData('insurance', data)}
            validation={validation}
          />
        )}

        {/* 患者信息 */}
        {currentStepId === 'patient' && (
          <PatientSection 
            data={formData.patient}
            onChange={(data) => updateFormData('patient', data)}
            validation={validation}
          />
        )}

        {/* 就诊信息 */}
        {currentStepId === 'medical' && (
          <MedicalSection 
            data={formData.medicalEvent}
            claimType={claimType}
            onChange={(data) => updateFormData('medicalEvent', data)}
            validation={validation}
          />
        )}

        {/* 诊断信息 */}
        {currentStepId === 'diagnosis' && (
          <DiagnosisSection 
            data={formData.diagnosis}
            onChange={(data) => updateFormData('diagnosis', data)}
            validation={validation}
          />
        )}

        {/* 治疗费用 */}
        {currentStepId === 'treatment' && (
          <TreatmentSection 
            treatments={formData.treatments}
            financial={formData.financial}
            onAddTreatment={addTreatment}
            onUpdateTreatment={updateTreatment}
            onRemoveTreatment={removeTreatment}
            onFinancialChange={(data) => updateFormData('financial', { ...formData.financial, ...data })}
          />
        )}
      </div>

      {/* 验证错误提示 */}
      {validation?.errors.length > 0 && (
        <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl">
          <div className="flex items-center gap-2 text-red-700 font-medium mb-2">
            <AlertCircle className="w-5 h-5" />
            請修正以下錯誤
          </div>
          <ul className="space-y-1 text-sm text-red-600">
            {validation.errors.slice(0, 5).map((error, index) => (
              <li key={index}>• {getCignaFieldDisplayName(error.field)}: {error.message}</li>
            ))}
            {validation.errors.length > 5 && (
              <li>...還有 {validation.errors.length - 5} 個錯誤</li>
            )}
          </ul>
        </div>
      )}

      {/* 导航按钮 */}
      <div className="flex justify-between mt-8">
        <button
          onClick={handleBack}
          className="inline-flex items-center gap-2 px-6 py-3 border border-slate-300 text-slate-700 rounded-xl font-medium hover:bg-slate-50 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          {currentStep === 0 ? '返回' : '上一步'}
        </button>

        <button
          onClick={handleNext}
          className="inline-flex items-center gap-2 px-6 py-3 bg-teal-600 text-white rounded-xl font-medium hover:bg-teal-700 transition-colors"
        >
          {currentStep === FORM_STEPS.length - 1 ? '完成' : '下一步'}
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

// 保险信息部分
interface InsuranceSectionProps {
  data: CreateClaimRequest['insurance'];
  onChange: (data: CreateClaimRequest['insurance']) => void;
  validation: ValidationResult | null;
}

function InsuranceSection({ data, onChange, validation }: InsuranceSectionProps) {
  const fields: { key: keyof typeof data; label: string; required: boolean; type?: string }[] = [
    { key: 'memberId', label: '會員編號 / Member ID', required: true },
    { key: 'policyNumber', label: '保單號碼 / Policy Number', required: true },
    { key: 'groupNumber', label: '團體號碼 / Group Number', required: false },
    { key: 'planName', label: '計劃名稱 / Plan Name', required: false },
  ];

  return (
    <div className="space-y-4">
      {fields.map((field) => {
        const error = validation ? getFieldError(validation, `insurance.${String(field.key)}`) : undefined;
        
        return (
          <div key={field.key}>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              {field.label}
              {field.required && <span className="text-red-500"> *</span>}
            </label>
            <input
              type={field.type || 'text'}
              value={data[field.key] || ''}
              onChange={(e) => onChange({ ...data, [field.key]: e.target.value })}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                error ? 'border-red-500' : 'border-slate-300'
              }`}
              placeholder={`請輸入${field.label.split(' / ')[0]}`}
            />
            {error && (
              <p className="mt-1 text-sm text-red-500">{error}</p>
            )}
          </div>
        );
      })}
    </div>
  );
}

// 患者信息部分
interface PatientSectionProps {
  data: PatientInfo;
  onChange: (data: PatientInfo) => void;
  validation: ValidationResult | null;
}

function PatientSection({ data, onChange, validation }: PatientSectionProps) {
  return (
    <div className="grid sm:grid-cols-2 gap-4">
      <div className="sm:col-span-2">
        <label className="block text-sm font-medium text-slate-700 mb-1">
          姓名 / Full Name *
        </label>
        <input
          type="text"
          value={data.name}
          onChange={(e) => onChange({ ...data, name: e.target.value })}
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
          placeholder="請輸入患者姓名"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          出生日期 / Date of Birth *
        </label>
        <input
          type="date"
          value={data.dateOfBirth}
          onChange={(e) => onChange({ ...data, dateOfBirth: e.target.value })}
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          性別 / Gender *
        </label>
        <select
          value={data.gender}
          onChange={(e) => onChange({ ...data, gender: e.target.value as Gender })}
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
        >
          <option value="M">男 / Male</option>
          <option value="F">女 / Female</option>
          <option value="O">其他 / Other</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          電話 / Phone *
        </label>
        <input
          type="tel"
          value={data.phone}
          onChange={(e) => onChange({ ...data, phone: e.target.value })}
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
          placeholder="+86 138 0000 0000"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          電郵 / Email
        </label>
        <input
          type="email"
          value={data.email}
          onChange={(e) => onChange({ ...data, email: e.target.value })}
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
          placeholder="example@email.com"
        />
      </div>

      <div className="sm:col-span-2">
        <label className="block text-sm font-medium text-slate-700 mb-1">
          地址 / Address *
        </label>
        <textarea
          value={data.address}
          onChange={(e) => onChange({ ...data, address: e.target.value })}
          rows={2}
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
          placeholder="請輸入完整地址"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          護照/身份證號 / Passport/ID
        </label>
        <input
          type="text"
          value={data.passportNumber || ''}
          onChange={(e) => onChange({ ...data, passportNumber: e.target.value })}
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
          placeholder="請輸入證件號碼"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          國籍 / Nationality
        </label>
        <input
          type="text"
          value={data.nationality || ''}
          onChange={(e) => onChange({ ...data, nationality: e.target.value })}
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
          placeholder="請輸入國籍"
        />
      </div>
    </div>
  );
}

// 就诊信息部分
interface MedicalSectionProps {
  data: MedicalEvent;
  claimType: ClaimType;
  onChange: (data: MedicalEvent) => void;
  validation: ValidationResult | null;
}

function MedicalSection({ data, claimType, onChange, validation }: MedicalSectionProps) {
  const isInpatient = claimType === 'pre-auth' || data.admissionDate;

  return (
    <div className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-slate-700 mb-1">
            醫院名稱 / Hospital Name *
          </label>
          <input
            type="text"
            value={data.hospitalName}
            onChange={(e) => onChange({ ...data, hospitalName: e.target.value })}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            placeholder="例如：華西天府醫院"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-slate-700 mb-1">
            醫院地址 / Hospital Address
          </label>
          <textarea
            value={data.hospitalAddress}
            onChange={(e) => onChange({ ...data, hospitalAddress: e.target.value })}
            rows={2}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            placeholder="請輸入醫院完整地址"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            科室 / Department
          </label>
          <input
            type="text"
            value={data.department}
            onChange={(e) => onChange({ ...data, department: e.target.value })}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            placeholder="例如：心臟科"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            主治醫生 / Doctor Name *
          </label>
          <input
            type="text"
            value={data.doctorName}
            onChange={(e) => onChange({ ...data, doctorName: e.target.value })}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            placeholder="請輸入醫生姓名"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            醫生執照號 / License Number
          </label>
          <input
            type="text"
            value={data.doctorLicense || ''}
            onChange={(e) => onChange({ ...data, doctorLicense: e.target.value })}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            placeholder="選填"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            醫生電話 / Doctor Phone
          </label>
          <input
            type="tel"
            value={data.doctorPhone || ''}
            onChange={(e) => onChange({ ...data, doctorPhone: e.target.value })}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            placeholder="選填"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            就診日期 / Service Date *
          </label>
          <input
            type="date"
            value={data.serviceDate}
            onChange={(e) => onChange({ ...data, serviceDate: e.target.value })}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        {isInpatient && (
          <>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                入院日期 / Admission Date
              </label>
              <input
                type="date"
                value={data.admissionDate || ''}
                onChange={(e) => onChange({ ...data, admissionDate: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                出院日期 / Discharge Date
              </label>
              <input
                type="date"
                value={data.dischargeDate || ''}
                onChange={(e) => onChange({ ...data, dischargeDate: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// 诊断信息部分
interface DiagnosisSectionProps {
  data: Diagnosis;
  onChange: (data: Diagnosis) => void;
  validation: ValidationResult | null;
}

function DiagnosisSection({ data, onChange, validation }: DiagnosisSectionProps) {
  return (
    <div className="space-y-4">
      <div className="bg-teal-50 border border-teal-200 rounded-xl p-4 mb-4">
        <p className="text-sm text-teal-800">
          請使用標準的 ICD-10 診斷編碼。如果您不確定編碼，請填寫診斷描述，我們的系統會嘗試自動匹配。
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          主要診斷編碼 / Primary ICD-10 Code *
        </label>
        <input
          type="text"
          value={data.primary.icd10Code}
          onChange={(e) => onChange({
            ...data,
            primary: { ...data.primary, icd10Code: e.target.value.toUpperCase() }
          })}
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 font-mono"
          placeholder="例如：J18.9"
        />
        <p className="text-xs text-slate-500 mt-1">格式：字母 + 兩位數字 + 可選小數點</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          主要診斷描述 / Primary Diagnosis Description *
        </label>
        <input
          type="text"
          value={data.primary.description}
          onChange={(e) => onChange({
            ...data,
            primary: { ...data.primary, description: e.target.value }
          })}
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
          placeholder="請輸入詳細診斷描述"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          症狀描述 / Symptoms *
        </label>
        <textarea
          value={data.symptoms}
          onChange={(e) => onChange({ ...data, symptoms: e.target.value })}
          rows={3}
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
          placeholder="請描述患者的症狀和就診原因"
        />
      </div>
    </div>
  );
}

// 治疗费用部分
interface TreatmentSectionProps {
  treatments: TreatmentItem[];
  financial: FinancialInfo;
  onAddTreatment: () => void;
  onUpdateTreatment: (index: number, field: keyof TreatmentItem, value: string | number) => void;
  onRemoveTreatment: (index: number) => void;
  onFinancialChange: (data: Partial<FinancialInfo>) => void;
}

function TreatmentSection({ 
  treatments, 
  financial, 
  onAddTreatment, 
  onUpdateTreatment, 
  onRemoveTreatment,
  onFinancialChange 
}: TreatmentSectionProps) {
  const currencies: Currency[] = ['CNY', 'USD', 'EUR', 'SGD', 'HKD'];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-slate-900">治療項目 / Treatment Items</h3>
        <button
          onClick={onAddTreatment}
          className="inline-flex items-center gap-1 px-3 py-1.5 text-sm bg-teal-50 text-teal-700 rounded-lg hover:bg-teal-100 transition-colors"
        >
          <Plus className="w-4 h-4" />
          添加項目
        </button>
      </div>

      {treatments.length === 0 ? (
        <div className="text-center py-8 bg-slate-50 rounded-xl border border-dashed border-slate-300">
          <p className="text-slate-500">暫無治療項目，請點擊上方按鈕添加</p>
        </div>
      ) : (
        <div className="space-y-3">
          {treatments.map((treatment, index) => (
            <div key={treatment.id} className="bg-slate-50 rounded-xl p-4 border border-slate-200">
              <div className="grid sm:grid-cols-12 gap-3">
                <div className="sm:col-span-4">
                  <label className="block text-xs text-slate-500 mb-1">項目名稱</label>
                  <input
                    type="text"
                    value={treatment.item}
                    onChange={(e) => onUpdateTreatment(index, 'item', e.target.value)}
                    className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="例如：門診費"
                  />
                </div>

                <div className="sm:col-span-3">
                  <label className="block text-xs text-slate-500 mb-1">數量</label>
                  <input
                    type="number"
                    min="1"
                    value={treatment.quantity}
                    onChange={(e) => onUpdateTreatment(index, 'quantity', parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div className="sm:col-span-3">
                  <label className="block text-xs text-slate-500 mb-1">單價</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={treatment.unitPrice}
                    onChange={(e) => onUpdateTreatment(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div className="sm:col-span-2 flex items-end">
                  <div className="flex-1">
                    <label className="block text-xs text-slate-500 mb-1">小計</label>
                    <div className="px-3 py-1.5 text-sm font-medium text-slate-900 bg-slate-200 rounded-lg">
                      {treatment.totalPrice.toFixed(2)}
                    </div>
                  </div>
                  <button
                    onClick={() => onRemoveTreatment(index)}
                    className="ml-2 p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="sm:col-span-12">
                  <input
                    type="text"
                    value={treatment.description}
                    onChange={(e) => onUpdateTreatment(index, 'description', e.target.value)}
                    className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="項目描述（選填）"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 费用汇总 */}
      <div className="mt-6 p-4 bg-gradient-to-r from-teal-50 to-blue-50 rounded-xl border border-teal-100">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-slate-700 mb-1">
              貨幣 / Currency
            </label>
            <select
              value={financial.currency}
              onChange={(e) => onFinancialChange({ currency: e.target.value as Currency })}
              className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              {currencies.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className="text-right">
            <div className="text-sm text-slate-500">總金額 / Total Amount</div>
            <div className="text-2xl font-bold text-teal-600">
              {financial.currency} {financial.totalAmount.toLocaleString()}
            </div>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-teal-200">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={financial.isDirectBilling}
              onChange={(e) => onFinancialChange({ isDirectBilling: e.target.checked })}
              className="w-4 h-4 text-teal-600 border-slate-300 rounded focus:ring-teal-500"
            />
            <span className="text-sm text-slate-700">申請直付 / Request Direct Billing</span>
          </label>
        </div>
      </div>
    </div>
  );
}
