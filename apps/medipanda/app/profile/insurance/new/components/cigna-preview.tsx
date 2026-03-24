/**
 * Cigna Preview Component
 * Cigna 申报预览组件
 */

'use client';

import { useState } from 'react';
import { FileText, Download, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import type { CreateClaimRequest, ValidationError } from '@/lib/insurance/types/insurance-claim';

interface CignaPreviewProps {
  data: Partial<CreateClaimRequest>;
  provider: string;
  claimType: string;
}

export default function CignaPreview({ data, provider, claimType }: CignaPreviewProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGenerated, setIsGenerated] = useState(false);
  const [errors, setErrors] = useState<ValidationError[]>([]);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setErrors([]);
    
    try {
      // Simulate PDF generation
      await new Promise(resolve => setTimeout(resolve, 2000));
      setIsGenerated(true);
    } catch (err) {
      setErrors([{ field: 'general', message: '生成 PDF 失敗，請重試', code: 'GENERATE_ERROR' }]);
    } finally {
      setIsGenerating(false);
    }
  };

  const checkDataCompleteness = () => {
    const requiredFields = [
      { field: 'insurance.memberId', label: '會員編號' },
      { field: 'patient.name', label: '患者姓名' },
      { field: 'patient.dateOfBirth', label: '出生日期' },
      { field: 'medicalEvent.hospitalName', label: '醫院名稱' },
      { field: 'diagnosis.primary.icd10Code', label: '診斷代碼' },
    ];

    const missing = requiredFields.filter(({ field }) => {
      const value = field.split('.').reduce((obj, key) => obj?.[key], data as any);
      return !value;
    });

    return missing;
  };

  const missingFields = checkDataCompleteness();
  const isDataComplete = missingFields.length === 0;

  return (
    <div className="space-y-6">
      {/* Data Completeness Check */}
      <div className={`rounded-xl p-6 ${isDataComplete ? 'bg-green-50 border border-green-200' : 'bg-yellow-50 border border-yellow-200'}`}>
        <div className="flex items-start gap-3">
          {isDataComplete ? (
            <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-6 h-6 text-yellow-600 flex-shrink-0" />
          )}
          <div>
            <h3 className={`font-semibold ${isDataComplete ? 'text-green-900' : 'text-yellow-900'}`}>
              {isDataComplete ? '數據完整性檢查通過' : '數據不完整'}
            </h3>
            {!isDataComplete && (
              <div className="mt-2">
                <p className="text-yellow-800 text-sm mb-2">以下必填項缺失：</p>
                <ul className="text-yellow-700 text-sm space-y-1">
                  {missingFields.map(({ label }) => (
                    <li key={label}>• {label}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Form Data Summary */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">申報信息摘要</h3>
        
        <div className="space-y-4">
          {/* Insurance Info */}
          <div className="border-b border-gray-100 pb-4">
            <h4 className="text-sm font-medium text-gray-500 mb-2">保險信息</h4>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <span className="text-gray-500">保險公司：</span>
                <span className="font-medium">{provider === 'cigna' ? 'Cigna' : provider}</span>
              </div>
              <div>
                <span className="text-gray-500">會員編號：</span>
                <span className="font-medium">{(data as any).insurance?.memberId || '-'}</span>
              </div>
            </div>
          </div>

          {/* Patient Info */}
          <div className="border-b border-gray-100 pb-4">
            <h4 className="text-sm font-medium text-gray-500 mb-2">患者信息</h4>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <span className="text-gray-500">姓名：</span>
                <span className="font-medium">{data.patient?.name || '-'}</span>
              </div>
              <div>
                <span className="text-gray-500">出生日期：</span>
                <span className="font-medium">{data.patient?.dateOfBirth || '-'}</span>
              </div>
            </div>
          </div>

          {/* Medical Info */}
          <div className="border-b border-gray-100 pb-4">
            <h4 className="text-sm font-medium text-gray-500 mb-2">就診信息</h4>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <span className="text-gray-500">醫院：</span>
                <span className="font-medium">{data.medicalEvent?.hospitalName || '-'}</span>
              </div>
              <div>
                <span className="text-gray-500">就診日期：</span>
                <span className="font-medium">{data.medicalEvent?.serviceDate || '-'}</span>
              </div>
            </div>
          </div>

          {/* Diagnosis */}
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-2">診斷信息</h4>
            <div>
              <span className="text-gray-500">主要診斷：</span>
              <span className="font-medium">
                {data.diagnosis?.primary?.icd10Code || '-'} 
                {data.diagnosis?.primary?.description && 
                  ` (${data.diagnosis.primary.description})`
                }
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* PDF Generation */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-teal-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Cigna 申報表格</h3>
              <p className="text-sm text-gray-500">
                {isGenerated ? 'PDF 已生成' : '點擊下方按鈕生成 PDF 表格'}
              </p>
            </div>
          </div>

          {!isGenerated ? (
            <button
              onClick={handleGenerate}
              disabled={!isDataComplete || isGenerating}
              className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  生成中...
                </>
              ) : (
                <>
                  <FileText className="w-4 h-4" />
                  生成 PDF
                </>
              )}
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={() => {/* Download PDF */}}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Download className="w-4 h-4" />
                下載
              </button>
            </div>
          )}
        </div>

        {errors.length > 0 && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm">{errors[0].message}</p>
          </div>
        )}
      </div>

      {/* Submit Button */}
      {isGenerated && (
        <div className="flex justify-end gap-4">
          <button
            onClick={() => setIsGenerated(false)}
            className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            重新生成
          </button>
          <button
            onClick={() => alert('提交功能待實現')}
            className="px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
          >
            提交申報
          </button>
        </div>
      )}
    </div>
  );
}
