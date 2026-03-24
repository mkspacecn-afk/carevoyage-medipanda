/**
 * Claim Form Component
 * 申报表单组件
 */

'use client';

import { useState } from 'react';
import { AlertCircle, CheckCircle } from 'lucide-react';
import type { CreateClaimRequest, ValidationError, InsuranceProvider, ClaimType } from '@/lib/insurance/types/insurance-claim';

interface ClaimFormProps {
  provider: InsuranceProvider;
  claimType: ClaimType;
  initialData?: Partial<CreateClaimRequest>;
  onSubmit: (data: CreateClaimRequest) => void;
  onBack?: () => void;
  errors?: ValidationError[];
}

export default function ClaimForm({ provider, claimType, initialData = {}, onSubmit, onBack, errors = [] }: ClaimFormProps) {
  const [formData, setFormData] = useState<Partial<CreateClaimRequest>>(initialData);
  const [localErrors, setLocalErrors] = useState<ValidationError[]>(errors);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Basic validation
    const newErrors: ValidationError[] = [];
    if (!formData.patient?.name) {
      newErrors.push({ field: 'patient.name', message: '請輸入患者姓名', code: 'REQUIRED' });
    }
    if (!formData.patient?.dateOfBirth) {
      newErrors.push({ field: 'patient.dateOfBirth', message: '請輸入出生日期', code: 'REQUIRED' });
    }
    
    if (newErrors.length > 0) {
      setLocalErrors(newErrors);
      return;
    }
    
    onSubmit(formData as CreateClaimRequest);
  };

  const getFieldError = (field: string) => {
    return localErrors.find(e => e.field === field)?.message;
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Patient Information */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">患者信息</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              患者姓名 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.patient?.name || ''}
              onChange={(e) => handleChange('patient.name', e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500"
              placeholder="請輸入患者姓名"
            />
            {getFieldError('patient.name') && (
              <p className="text-red-500 text-sm mt-1">{getFieldError('patient.name')}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              出生日期 <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={formData.patient?.dateOfBirth || ''}
              onChange={(e) => handleChange('patient.dateOfBirth', e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500"
            />
            {getFieldError('patient.dateOfBirth') && (
              <p className="text-red-500 text-sm mt-1">{getFieldError('patient.dateOfBirth')}</p>
            )}
          </div>
        </div>
      </div>

      {/* Medical Information */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">就诊信息</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              醫院名稱 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.medicalEvent?.hospitalName || ''}
              onChange={(e) => handleChange('medicalEvent.hospitalName', e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500"
              placeholder="例如：華西天府醫院"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              就診日期 <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={formData.medicalEvent?.serviceDate || ''}
              onChange={(e) => handleChange('medicalEvent.serviceDate', e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500"
            />
          </div>
        </div>
      </div>

      {/* Diagnosis Information */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">診斷信息</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              主要診斷 (ICD-10) <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.diagnosis?.primary?.icd10Code || ''}
              onChange={(e) => handleChange('diagnosis.primary.icd10Code', e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500"
              placeholder="例如：J18.9"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              診斷描述
            </label>
            <textarea
              value={formData.diagnosis?.primary?.description || ''}
              onChange={(e) => handleChange('diagnosis.primary.description', e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500"
              rows={3}
              placeholder="請輸入診斷描述"
            />
          </div>
        </div>
      </div>

      {/* Financial Information */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">費用信息</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              總金額
            </label>
            <input
              type="number"
              value={formData.financial?.totalAmount || ''}
              onChange={(e) => handleChange('financial.totalAmount', e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500"
              placeholder="0.00"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              幣種
            </label>
            <select
              value={formData.financial?.currency || 'CNY'}
              onChange={(e) => handleChange('financial.currency', e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500"
            >
              <option value="CNY">CNY - 人民幣</option>
              <option value="USD">USD - 美元</option>
              <option value="EUR">EUR - 歐元</option>
              <option value="SGD">SGD - 新加坡元</option>
            </select>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-between">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            返回
          </button>
        )}
        <button
          type="submit"
          className="px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
        >
          保存並繼續
        </button>
      </div>
    </form>
  );
}
