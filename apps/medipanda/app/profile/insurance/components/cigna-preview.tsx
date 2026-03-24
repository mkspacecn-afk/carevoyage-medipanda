/**
 * Cigna Preview Component
 * Cigna PDF 预览组件
 */

'use client';

import { useState, useEffect } from 'react';
import { 
  Eye, 
  Download, 
  FileText, 
  ChevronDown, 
  ChevronUp,
  Building2,
  User,
  Stethoscope,
  FileCheck,
  AlertCircle
} from 'lucide-react';
import type { 
  InsuranceProvider, 
  ClaimType, 
  CreateClaimRequest 
} from '@/lib/insurance/types/insurance-claim';

interface CignaPreviewProps {
  data: Partial<CreateClaimRequest>;
  provider: InsuranceProvider;
  claimType: ClaimType;
}

// 预览部分配置
const PREVIEW_SECTIONS = [
  { id: 'insurance', title: '保險信息', icon: Building2 },
  { id: 'patient', title: '患者信息', icon: User },
  { id: 'medical', title: '就診信息', icon: Stethoscope },
  { id: 'diagnosis', title: '診斷信息', icon: FileCheck },
  { id: 'financial', title: '費用信息', icon: FileText },
];

export default function CignaPreview({ data, provider, claimType }: CignaPreviewProps) {
  const [expandedSections, setExpandedSections] = useState<string[]>(['insurance', 'patient', 'financial']);
  const [isGenerating, setIsGenerating] = useState(false);

  // 切换部分展开/收起
  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => 
      prev.includes(sectionId)
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  // 生成 PDF
  const handleGeneratePDF = async () => {
    setIsGenerating(true);
    try {
      // 实际项目中调用 API 生成 PDF
      // const response = await fetch(`/api/insurance/claims/${claimId}/generate`, {
      //   method: 'POST',
      //   body: JSON.stringify({ formType: claimType }),
      // });
      
      // 模拟生成
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // 这里可以触发下载或打开预览
      alert('PDF 生成成功！');
    } finally {
      setIsGenerating(false);
    }
  };

  // 格式化日期
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    return date.toLocaleDateString('zh-CN');
  };

  // 格式化金额
  const formatCurrency = (amount?: number, currency?: string) => {
    if (amount === undefined) return '-';
    const symbols: Record<string, string> = {
      CNY: '¥',
      USD: '$',
      EUR: '€',
      SGD: 'S$',
      HKD: 'HK$',
    };
    const symbol = symbols[currency || 'CNY'] || currency || '¥';
    return `${symbol}${amount.toLocaleString()}`;
  };

  return (
    <div className="space-y-4">
      {/* 预览头部 */}
      <div className="bg-gradient-to-r from-teal-600 to-teal-700 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <span className="font-bold text-lg">C</span>
              </div>
              <div>
                <h3 className="font-semibold">Cigna International</h3>
                <p className="text-sm text-teal-100">{claimType === 'pre-auth' ? 'Pre-authorization Request' : 'Medical Claim Form'}</p>
              </div>
            </div>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={handleGeneratePDF}
              disabled={isGenerating}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white text-teal-600 rounded-lg font-medium hover:bg-teal-50 disabled:opacity-50 transition-colors"
            >
              <Eye className="w-4 h-4" />
              {isGenerating ? '生成中...' : '預覽 PDF'}
            </button>
          </div>
        </div>
      </div>

      {/* 数据完整性检查 */}
      <DataCompletenessCheck data={data} />

      {/* 预览部分 */}
      <div className="space-y-3">
        {/* 保险信息 */}
        <PreviewSection
          id="insurance"
          title="保險信息 / Insurance Information"
          icon={Building2}
          isExpanded={expandedSections.includes('insurance')}
          onToggle={() => toggleSection('insurance')}
        >
          <PreviewGrid>
            <PreviewItem label="保險公司" value="Cigna 信諾保險" />
            <PreviewItem label="會員編號" value={data.insurance?.memberId} />
            <PreviewItem label="保單號碼" value={data.insurance?.policyNumber} />
            <PreviewItem label="團體號碼" value={data.insurance?.groupNumber || '-'} />
            <PreviewItem label="計劃名稱" value={data.insurance?.planName || '-'} />
          </PreviewGrid>
        </PreviewSection>

        {/* 患者信息 */}
        <PreviewSection
          id="patient"
          title="患者信息 / Patient Information"
          icon={User}
          isExpanded={expandedSections.includes('patient')}
          onToggle={() => toggleSection('patient')}
        >
          <PreviewGrid>
            <PreviewItem label="姓名" value={data.patient?.name} />
            <PreviewItem label="出生日期" value={formatDate(data.patient?.dateOfBirth)} />
            <PreviewItem label="性別" value={data.patient?.gender === 'M' ? '男' : data.patient?.gender === 'F' ? '女' : '其他'} />
            <PreviewItem label="電話" value={data.patient?.phone} />
            <PreviewItem label="電郵" value={data.patient?.email || '-'} />
            <PreviewItem label="地址" value={data.patient?.address} />
            <PreviewItem label="護照/身份證" value={data.patient?.passportNumber || '-'} />
            <PreviewItem label="國籍" value={data.patient?.nationality || '-'} />
          </PreviewGrid>
        </PreviewSection>

        {/* 就诊信息 */}
        <PreviewSection
          id="medical"
          title="就診信息 / Medical Information"
          icon={Stethoscope}
          isExpanded={expandedSections.includes('medical')}
          onToggle={() => toggleSection('medical')}
        >
          <PreviewGrid>
            <PreviewItem label="醫院名稱" value={data.medicalEvent?.hospitalName} />
            <PreviewItem label="科室" value={data.medicalEvent?.department || '-'} />
            <PreviewItem label="主治醫生" value={data.medicalEvent?.doctorName} />
            <PreviewItem label="就診日期" value={formatDate(data.medicalEvent?.serviceDate)} />
            <PreviewItem label="申報類型" value={claimType === 'pre-auth' ? '預授權申請' : '理賠申請'} />
          </PreviewGrid>
          
          {data.medicalEvent?.hospitalAddress && (
            <div className="mt-3 pt-3 border-t border-slate-200">
              <p className="text-sm text-slate-500">醫院地址</p>
              <p className="text-slate-900">{data.medicalEvent.hospitalAddress}</p>
            </div>
          )}
        </PreviewSection>

        {/* 诊断信息 */}
        <PreviewSection
          id="diagnosis"
          title="診斷信息 / Diagnosis Information"
          icon={FileCheck}
          isExpanded={expandedSections.includes('diagnosis')}
          onToggle={() => toggleSection('diagnosis')}
        >
          <div className="space-y-4">
            <div className="bg-teal-50 rounded-lg p-4">
              <p className="text-sm text-slate-500 mb-1">主要診斷 / Primary Diagnosis</p>
              <div className="flex items-center gap-3">
                <span className="px-2 py-1 bg-teal-600 text-white text-sm font-mono rounded">
                  {data.diagnosis?.primary?.icd10Code || '-'}
                </span>
                <span className="font-medium text-slate-900">{data.diagnosis?.primary?.description}</span>
              </div>
            </div>
            
            {data.diagnosis?.symptoms && (
              <div>
                <p className="text-sm text-slate-500 mb-1">症狀描述 / Symptoms</p>
                <p className="text-slate-900 bg-slate-50 rounded-lg p-3">{data.diagnosis.symptoms}</p>
              </div>
            )}
          </div>
        </PreviewSection>

        {/* 费用信息 */}
        <PreviewSection
          id="financial"
          title="費用信息 / Financial Information"
          icon={FileText}
          isExpanded={expandedSections.includes('financial')}
          onToggle={() => toggleSection('financial')}
        >
          <div className="space-y-4">
            {/* 治疗项目列表 */}
            {data.treatments && data.treatments.length > 0 && (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="text-left py-2 text-slate-500">項目</th>
                      <th className="text-center py-2 text-slate-500">數量</th>
                      <th className="text-right py-2 text-slate-500">單價</th>
                      <th className="text-right py-2 text-slate-500">小計</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.treatments.map((treatment, index) => (
                      <tr key={index} className="border-b border-slate-100">
                        <td className="py-2">{treatment.item}</td>
                        <td className="text-center py-2">{treatment.quantity}</td>
                        <td className="text-right py-2">{formatCurrency(treatment.unitPrice, data.financial?.currency)}</td>
                        <td className="text-right py-2 font-medium">{formatCurrency(treatment.totalPrice, data.financial?.currency)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* 费用汇总 */}
            <div className="bg-gradient-to-r from-teal-50 to-blue-50 rounded-xl p-4 border border-teal-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">總金額 / Total Amount</p>
                  <p className="text-2xl font-bold text-teal-600">
                    {formatCurrency(data.financial?.totalAmount, data.financial?.currency)}
                  </p>
                </div>
                
                <div className="text-right">
                  <p className="text-sm text-slate-500">貨幣</p>
                  <p className="font-medium text-slate-900">{data.financial?.currency}</p>
                </div>
              </div>
              
              {data.financial?.isDirectBilling && (
                <div className="mt-3 pt-3 border-t border-teal-200">
                  <div className="flex items-center gap-2 text-teal-700">
                    <FileCheck className="w-5 h-5" />
                    <span className="font-medium">已申請直付 / Direct Billing Requested</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </PreviewSection>
      </div>
    </div>
  );
}

// 预览部分组件
interface PreviewSectionProps {
  id: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  isExpanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

function PreviewSection({ title, icon: Icon, isExpanded, onToggle, children }: PreviewSectionProps) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full px-4 py-3 flex items-center justify-between bg-slate-50 hover:bg-slate-100 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm">
            <Icon className="w-4 h-4 text-teal-600" />
          </div>
          <span className="font-medium text-slate-900">{title}</span>
        </div>
        
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-slate-400" />
        ) : (
          <ChevronDown className="w-5 h-5 text-slate-400" />
        )}
      </button>
      
      {isExpanded && (
        <div className="p-4">{children}</div>
      )}
    </div>
  );
}

// 预览网格
function PreviewGrid({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-2 gap-4">{children}</div>
  );
}

// 预览项
function PreviewItem({ label, value }: { label: string; value?: string }) {
  return (
    <div>
      <p className="text-sm text-slate-500">{label}</p>
      <p className="font-medium text-slate-900">{value || '-'}</p>
    </div>
  );
}

// 数据完整性检查组件
function DataCompletenessCheck({ data }: { data: Partial<CreateClaimRequest> }) {
  const checks = [
    { id: 'insurance', label: '保險信息', required: ['insurance.memberId', 'insurance.policyNumber'] },
    { id: 'patient', label: '患者信息', required: ['patient.name', 'patient.dateOfBirth', 'patient.phone'] },
    { id: 'medical', label: '就診信息', required: ['medicalEvent.hospitalName', 'medicalEvent.doctorName', 'medicalEvent.serviceDate'] },
    { id: 'diagnosis', label: '診斷信息', required: ['diagnosis.primary.icd10Code', 'diagnosis.primary.description'] },
    { id: 'financial', label: '費用信息', required: ['financial.totalAmount', 'financial.currency'] },
  ];

  const getFieldValue = (path: string): unknown => {
    return path.split('.').reduce((obj: unknown, key: string) => {
      if (obj === null || obj === undefined) return undefined;
      return (obj as Record<string, unknown>)[key];
    }, data as unknown as Record<string, unknown>);
  };

  const checkResults = checks.map(check => {
    const completed = check.required.every(field => {
      const value = getFieldValue(field);
      return value !== undefined && value !== null && value !== '';
    });
    return { ...check, completed };
  });

  const completedCount = checkResults.filter(r => r.completed).length;
  const totalCount = checkResults.length;

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-amber-500" />
          <span className="font-medium text-slate-900">數據完整性檢查</span>
        </div>
        <span className="text-sm text-slate-500">{completedCount}/{totalCount} 項已完成</span>
      </div>

      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-teal-500 to-green-500 transition-all duration-500"
          style={{ width: `${(completedCount / totalCount) * 100}%` }}
        />
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {checkResults.map((result) => (
          <span
            key={result.id}
            className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
              result.completed
                ? 'bg-green-100 text-green-700'
                : 'bg-amber-100 text-amber-700'
            }`}
          >
            {result.completed ? '✓' : '○'} {result.label}
          </span>
        ))}
      </div>
    </div>
  );
}
