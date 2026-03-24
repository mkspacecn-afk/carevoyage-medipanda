/**
 * New Insurance Claim Page
 * 新建保险申报向导（4步骤）
 * 
 * Route: /profile/insurance/new
 */

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  ChevronLeft, 
  ChevronRight, 
  Building2, 
  User, 
  Stethoscope, 
  FileCheck,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import type { 
  InsuranceProvider, 
  ClaimType,
  CreateClaimRequest 
} from '@/lib/insurance/types/insurance-claim';
import ClaimForm from './components/claim-form';
import DocumentUploader from './components/document-uploader';
import CignaPreview from './components/cigna-preview';

// 步骤配置
const STEPS = [
  { id: 1, title: '選擇保險', icon: Building2 },
  { id: 2, title: '填寫資料', icon: User },
  { id: 3, title: '上傳附件', icon: Stethoscope },
  { id: 4, title: '確認提交', icon: FileCheck },
];

// 保险公司配置
const PROVIDERS: Array<{ id: InsuranceProvider; name: string; nameCn: string; description: string; color: string }> = [
  { 
    id: 'cigna', 
    name: 'Cigna', 
    nameCn: '信諾保險',
    description: '國際醫療保險領導者，覆蓋全球 200+ 國家和地區',
    color: 'bg-teal-500'
  },
  { 
    id: 'axa', 
    name: 'AXA', 
    nameCn: '安盛保險',
    description: '全球最大保險集團之一，提供全面醫療保障',
    color: 'bg-blue-600'
  },
  { 
    id: 'allianz', 
    name: 'Allianz', 
    nameCn: '安聯保險',
    description: '全球領先的保險和資產管理集團',
    color: 'bg-blue-800'
  },
  { 
    id: 'other', 
    name: 'Other', 
    nameCn: '其他保險',
    description: '其他保險公司或未知保險公司',
    color: 'bg-slate-500'
  },
];

// 申报类型配置
const CLAIM_TYPES: Array<{ id: ClaimType; label: string; description: string }> = [
  { 
    id: 'pre-auth', 
    label: '預授權申請',
    description: '在治療前申請保險公司預先授權，適用於住院、手術等'
  },
  { 
    id: 'claim', 
    label: '理賠申請',
    description: '治療完成後申請費用報銷，適用於門診、藥房等'
  },
  { 
    id: 'emergency', 
    label: '緊急醫療',
    description: '緊急醫療情況下的申報'
  },
];

export default function NewClaimPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // 表单数据
  const [formData, setFormData] = useState<{
    provider: InsuranceProvider | null;
    claimType: ClaimType | null;
    claimData: Partial<CreateClaimRequest>;
    attachments: string[];
  }>({
    provider: null,
    claimType: null,
    claimData: {},
    attachments: [],
  });

  // 步骤 1: 选择保险和类型
  const handleStep1Submit = (provider: InsuranceProvider, claimType: ClaimType) => {
    setFormData(prev => ({
      ...prev,
      provider,
      claimType,
    }));
    setCurrentStep(2);
    setError(null);
  };

  // 步骤 2: 填写申报数据
  const handleStep2Submit = (data: CreateClaimRequest) => {
    setFormData(prev => ({
      ...prev,
      claimData: data,
    }));
    setCurrentStep(3);
    setError(null);
  };

  // 步骤 3: 上传附件
  const handleStep3Submit = (attachmentIds: string[]) => {
    setFormData(prev => ({
      ...prev,
      attachments: attachmentIds,
    }));
    setCurrentStep(4);
    setError(null);
  };

  // 步骤 4: 提交申报
  const handleFinalSubmit = async () => {
    setIsSubmitting(true);
    setError(null);
    
    try {
      // 实际项目中调用 API
      // const response = await fetch('/api/insurance/claims', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     userId: 'current_user',
      //     ...formData.claimData,
      //     insurance: {
      //       ...formData.claimData.insurance,
      //       provider: formData.provider,
      //     },
      //     medicalEvent: {
      //       ...formData.claimData.medicalEvent,
      //       type: formData.claimType,
      //     },
      //   }),
      // });
      
      // 模拟 API 调用
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // 跳转到列表页
      router.push('/profile/insurance');
    } catch (err) {
      setError(err instanceof Error ? err.message : '提交失敗，請重試');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 返回上一步
  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setError(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F0FDFA] via-white to-[#F0FDFA]">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* 页面标题 */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-4">
            <Link href="/profile/insurance" className="hover:text-teal-600">保險申報</Link>
            <ChevronLeft className="w-4 h-4 rotate-180" />
            <span className="text-slate-800">新建申報</span>
          </div>
          
          <h1 className="text-3xl font-bold text-slate-900">新建保險申報</h1>
          <p className="text-slate-500 mt-1">按照以下步驟完成您的保險申報</p>
        </div>

        {/* 步骤指示器 */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {STEPS.map((step, index) => {
              const Icon = step.icon;
              const isActive = step.id === currentStep;
              const isCompleted = step.id < currentStep;
              
              return (
                <div key={step.id} className="flex items-center flex-1">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                        isActive
                          ? 'bg-teal-500 text-white'
                          : isCompleted
                          ? 'bg-green-500 text-white'
                          : 'bg-slate-200 text-slate-500'
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle className="w-6 h-6" />
                      ) : (
                        <Icon className="w-6 h-6" />
                      )}
                    </div>
                    <span
                      className={`text-xs mt-2 font-medium ${
                        isActive ? 'text-teal-600' : 'text-slate-500'
                      }`}
                    >
                      {step.title}
                    </span>
                  </div>
                  
                  {index < STEPS.length - 1 && (
                    <div
                      className={`flex-1 h-0.5 mx-4 ${
                        isCompleted ? 'bg-green-500' : 'bg-slate-200'
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* 错误提示 */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
            <span className="text-red-700">{error}</span>
          </div>
        )}

        {/* 步骤内容 */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
          {/* 步骤 1: 选择保险 */}
          {currentStep === 1 && (
            <Step1SelectInsurance 
              providers={PROVIDERS}
              claimTypes={CLAIM_TYPES}
              onSubmit={handleStep1Submit}
              selectedProvider={formData.provider}
              selectedType={formData.claimType}
            />
          )}

          {/* 步骤 2: 填写资料 */}
          {currentStep === 2 && formData.provider && formData.claimType && (
            <Step2FillForm
              provider={formData.provider}
              claimType={formData.claimType}
              initialData={formData.claimData}
              onSubmit={handleStep2Submit}
              onBack={handleBack}
            />
          )}

          {/* 步骤 3: 上传附件 */}
          {currentStep === 3 && (
            <Step3UploadAttachments
              claimId="temp-claim-id"
              onSubmit={handleStep3Submit}
              onBack={handleBack}
            />
          )}

          {/* 步骤 4: 确认提交 */}
          {currentStep === 4 && (
            <Step4ReviewAndSubmit
              formData={formData}
              onSubmit={handleFinalSubmit}
              onBack={handleBack}
              isSubmitting={isSubmitting}
            />
          )}
        </div>
      </div>
    </div>
  );
}

// 步骤 1: 选择保险和类型
interface Step1Props {
  providers: typeof PROVIDERS;
  claimTypes: typeof CLAIM_TYPES;
  onSubmit: (provider: InsuranceProvider, claimType: ClaimType) => void;
  selectedProvider: InsuranceProvider | null;
  selectedType: ClaimType | null;
}

function Step1SelectInsurance({ 
  providers, 
  claimTypes, 
  onSubmit,
  selectedProvider,
  selectedType 
}: Step1Props) {
  const [provider, setProvider] = useState<InsuranceProvider | null>(selectedProvider);
  const [claimType, setClaimType] = useState<ClaimType | null>(selectedType);

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-slate-900 mb-2">選擇保險公司</h2>
        <p className="text-slate-500">請選擇您的醫療保險公司</p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        {providers.map((p) => (
          <button
            key={p.id}
            onClick={() => setProvider(p.id)}
            className={`p-5 rounded-xl border-2 text-left transition-all ${
              provider === p.id
                ? 'border-teal-500 bg-teal-50'
                : 'border-slate-200 hover:border-teal-300'
            }`}
          >
            <div className="flex items-start gap-4">
              <div className={`w-12 h-12 ${p.color} rounded-lg flex items-center justify-center text-white font-bold text-lg flex-shrink-0`}>
                {p.name.charAt(0)}
              </div>
              <div>
                <div className="font-semibold text-slate-900">{p.nameCn}</div>
                <div className="text-sm text-slate-500">{p.name}</div>
                <div className="text-xs text-slate-400 mt-2">{p.description}</div>
              </div>
            </div>
          </button>
        ))}
      </div>

      {provider && (
        <>
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-2">選擇申報類型</h3>
            <p className="text-slate-500">請選擇您需要的申報類型</p>
          </div>

          <div className="space-y-3 mb-8">
            {claimTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => setClaimType(type.id)}
                className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                  claimType === type.id
                    ? 'border-teal-500 bg-teal-50'
                    : 'border-slate-200 hover:border-teal-300'
                }`}
              >
                <div className="font-medium text-slate-900">{type.label}</div>
                <div className="text-sm text-slate-500 mt-1">{type.description}</div>
              </button>
            ))}
          </div>
        </>
      )}

      <div className="flex justify-end">
        <button
          onClick={() => provider && claimType && onSubmit(provider, claimType)}
          disabled={!provider || !claimType}
          className="inline-flex items-center gap-2 px-6 py-3 bg-teal-600 text-white rounded-xl font-medium hover:bg-teal-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
        >
          下一步
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

// 步骤 2: 填写资料
interface Step2Props {
  provider: InsuranceProvider;
  claimType: ClaimType;
  initialData: Partial<CreateClaimRequest>;
  onSubmit: (data: CreateClaimRequest) => void;
  onBack: () => void;
}

function Step2FillForm({ provider, claimType, initialData, onSubmit, onBack }: Step2Props) {
  return (
    <div className="p-6 lg:p-8">
      <ClaimForm
        provider={provider}
        claimType={claimType}
        initialData={initialData}
        onSubmit={onSubmit}
        onBack={onBack}
      />
    </div>
  );
}

// 步骤 3: 上传附件
interface Step3Props {
  claimId: string;
  onSubmit: (attachmentIds: string[]) => void;
  onBack: () => void;
}

function Step3UploadAttachments({ claimId, onSubmit, onBack }: Step3Props) {
  return (
    <div className="p-6 lg:p-8">
      <DocumentUploader
        claimId={claimId}
        onComplete={onSubmit}
        onBack={onBack}
      />
    </div>
  );
}

// 步骤 4: 确认提交
interface Step4Props {
  formData: {
    provider: InsuranceProvider | null;
    claimType: ClaimType | null;
    claimData: Partial<CreateClaimRequest>;
    attachments: string[];
  };
  onSubmit: () => void;
  onBack: () => void;
  isSubmitting: boolean;
}

function Step4ReviewAndSubmit({ formData, onSubmit, onBack, isSubmitting }: Step4Props) {
  const provider = PROVIDERS.find(p => p.id === formData.provider);
  const claimType = CLAIM_TYPES.find(t => t.id === formData.claimType);
  
  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-slate-900 mb-2">確認申報信息</h2>
        <p className="text-slate-500">請確認以下信息無誤後提交</p>
      </div>

      {/* 预览组件 */}
      {formData.provider === 'cigna' && (
        <CignaPreview 
          data={formData.claimData}
          provider={formData.provider}
          claimType={formData.claimType || 'claim'}
        />
      )}

      {/* 操作按钮 */}
      <div className="flex justify-between mt-8">
        <button
          onClick={onBack}
          disabled={isSubmitting}
          className="inline-flex items-center gap-2 px-6 py-3 border border-slate-300 text-slate-700 rounded-xl font-medium hover:bg-slate-50 disabled:opacity-50 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          返回修改
        </button>

        <button
          onClick={onSubmit}
          disabled={isSubmitting}
          className="inline-flex items-center gap-2 px-8 py-3 bg-teal-600 text-white rounded-xl font-medium hover:bg-teal-700 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              提交中...
            </>
          ) : (
            <>
              確認提交
              <CheckCircle className="w-5 h-5" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
