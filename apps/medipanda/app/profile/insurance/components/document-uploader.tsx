/**
 * Document Uploader Component
 * 资料上传组件
 */

'use client';

import { useState, useCallback, useRef } from 'react';
import { 
  Upload, 
  X, 
  FileText, 
  Image as ImageIcon, 
  File, 
  CheckCircle, 
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Scan,
  Loader2
} from 'lucide-react';
import type { AttachmentType } from '@/lib/insurance/types/insurance-claim';

interface DocumentUploaderProps {
  claimId: string;
  onComplete: (attachmentIds: string[]) => void;
  onBack: () => void;
}

// 附件类型配置
const ATTACHMENT_TYPES: { type: AttachmentType; label: string; icon: React.ReactNode; description: string }[] = [
  { 
    type: 'invoice', 
    label: '發票 / Invoice', 
    icon: <FileText className="w-5 h-5" />,
    description: '醫療費用發票、收據'
  },
  { 
    type: 'receipt', 
    label: '收據 / Receipt', 
    icon: <FileText className="w-5 h-5" />,
    description: '付款收據、結賬單據'
  },
  { 
    type: 'medical-report', 
    label: '診斷報告 / Medical Report', 
    icon: <FileText className="w-5 h-5" />,
    description: '醫生診斷書、病歷摘要'
  },
  { 
    type: 'lab-result', 
    label: '檢驗報告 / Lab Result', 
    icon: <FileText className="w-5 h-5" />,
    description: '化驗單、檢查報告'
  },
  { 
    type: 'prescription', 
    label: '處方 / Prescription', 
    icon: <FileText className="w-5 h-5" />,
    description: '醫生處方箋'
  },
  { 
    type: 'id-proof', 
    label: '身份證明 / ID Proof', 
    icon: <FileText className="w-5 h-5" />,
    description: '身份證、護照'
  },
  { 
    type: 'other', 
    label: '其他 / Other', 
    icon: <File className="w-5 h-5" />,
    description: '其他相關文件'
  },
];

// 允许的文件类型
const ALLOWED_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'application/pdf',
];

// 最大文件大小 (10MB)
const MAX_FILE_SIZE = 10 * 1024 * 1024;

interface UploadingFile {
  id: string;
  file: File;
  type: AttachmentType;
  progress: number;
  status: 'uploading' | 'success' | 'error';
  error?: string;
  preview?: string;
  extractedData?: Record<string, unknown>;
}

export default function DocumentUploader({ claimId, onComplete, onBack }: DocumentUploaderProps) {
  const [files, setFiles] = useState<UploadingFile[]>([]);
  const [selectedType, setSelectedType] = useState<AttachmentType>('invoice');
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 验证文件
  const validateFile = (file: File): { valid: boolean; error?: string } => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      return { valid: false, error: '不支持的文件類型' };
    }
    
    if (file.size > MAX_FILE_SIZE) {
      return { valid: false, error: '文件大小超過 10MB 限制' };
    }
    
    return { valid: true };
  };

  // 生成预览
  const generatePreview = (file: File): Promise<string | undefined> => {
    return new Promise((resolve) => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.readAsDataURL(file);
      } else {
        resolve(undefined);
      }
    });
  };

  // 添加文件
  const addFiles = useCallback(async (newFiles: FileList | null) => {
    if (!newFiles) return;

    const filesArray = Array.from(newFiles);
    
    for (const file of filesArray) {
      const validation = validateFile(file);
      
      const uploadingFile: UploadingFile = {
        id: `file_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
        file,
        type: selectedType,
        progress: 0,
        status: validation.valid ? 'uploading' : 'error',
        error: validation.valid ? undefined : validation.error,
        preview: await generatePreview(file),
      };

      setFiles(prev => [...prev, uploadingFile]);

      if (validation.valid) {
        // 模拟上传过程
        simulateUpload(uploadingFile.id);
      }
    }
  }, [selectedType]);

  // 模拟上传
  const simulateUpload = (fileId: string) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 20;
      
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        
        // 模拟 OCR 处理
        setFiles(prev => prev.map(f => {
          if (f.id === fileId) {
            return {
              ...f,
              progress: 100,
              status: 'success',
              extractedData: simulateOCR(f.type),
            };
          }
          return f;
        }));
      } else {
        setFiles(prev => prev.map(f => {
          if (f.id === fileId) {
            return { ...f, progress };
          }
          return f;
        }));
      }
    }, 200);
  };

  // 模拟 OCR 结果
  const simulateOCR = (type: AttachmentType): Record<string, unknown> => {
    switch (type) {
      case 'invoice':
        return {
          hospitalName: '華西天府醫院',
          date: '2026-03-15',
          totalAmount: 15800,
          items: [
            { name: '門診費', amount: 500 },
            { name: '檢查費', amount: 3000 },
            { name: '藥品費', amount: 12300 },
          ],
        };
      case 'medical-report':
        return {
          diagnosis: '肺炎',
          icd10Code: 'J18.9',
          doctorName: '張醫生',
          date: '2026-03-15',
        };
      default:
        return {};
    }
  };

  // 删除文件
  const removeFile = (fileId: string) => {
    setFiles(prev => prev.filter(f => f.id !== fileId));
  };

  // 更改文件类型
  const changeFileType = (fileId: string, newType: AttachmentType) => {
    setFiles(prev => prev.map(f => 
      f.id === fileId ? { ...f, type: newType } : f
    ));
  };

  // 拖拽处理
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    addFiles(e.dataTransfer.files);
  };

  // 完成上传
  const handleComplete = async () => {
    setIsProcessing(true);
    
    // 实际项目中应该等待所有文件上传完成
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const successfulFiles = files.filter(f => f.status === 'success');
    onComplete(successfulFiles.map(f => f.id));
  };

  // 获取文件图标
  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) {
      return <ImageIcon className="w-6 h-6 text-blue-500" />;
    }
    if (fileType === 'application/pdf') {
      return <FileText className="w-6 h-6 text-red-500" />;
    }
    return <File className="w-6 h-6 text-slate-500" />;
  };

  // 格式化文件大小
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const hasFiles = files.length > 0;
  const allUploaded = files.length > 0 && files.every(f => f.status !== 'uploading');
  const successCount = files.filter(f => f.status === 'success').length;

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-slate-900 mb-2">上傳醫療資料</h2>
        <p className="text-slate-500">請上傳與此次申報相關的醫療文件，我們將自動識別關鍵信息</p>
      </div>

      {/* 文件类型选择 */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-slate-700 mb-2">
          選擇文件類型
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {ATTACHMENT_TYPES.map((type) => (
            <button
              key={type.type}
              onClick={() => setSelectedType(type.type)}
              className={`p-3 rounded-lg border-2 text-left transition-all ${
                selectedType === type.type
                  ? 'border-teal-500 bg-teal-50'
                  : 'border-slate-200 hover:border-teal-300'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className={selectedType === type.type ? 'text-teal-600' : 'text-slate-500'}>
                  {type.icon}
                </span>
                <span className="text-sm font-medium text-slate-900">{type.label.split(' / ')[0]}</span>
              </div>
              <div className="text-xs text-slate-500">{type.description}</div>
            </button>
          ))}
        </div>
      </div>

      {/* 上传区域 */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
          isDragging
            ? 'border-teal-500 bg-teal-50'
            : 'border-slate-300 hover:border-teal-400 hover:bg-slate-50'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={ALLOWED_TYPES.join(',')}
          onChange={(e) => addFiles(e.target.files)}
          className="hidden"
        />
        
        <div className="mx-auto w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
          <Upload className="w-8 h-8 text-slate-400" />
        </div>
        
        <p className="text-lg font-medium text-slate-700 mb-1">
          點擊或拖拽文件至此處上傳
        </p>
        
        <p className="text-sm text-slate-500">
          支持 JPG、PNG、PDF 格式，單個文件不超過 10MB
        </p>
      </div>

      {/* 文件列表 */}
      {hasFiles && (
        <div className="mt-6 space-y-3">
          <h3 className="font-medium text-slate-900">
            已上傳文件 ({successCount}/{files.length})
          </h3>
          
          {files.map((file) => (
            <div
              key={file.id}
              className={`p-4 rounded-xl border ${
                file.status === 'error'
                  ? 'bg-red-50 border-red-200'
                  : file.status === 'success'
                  ? 'bg-green-50 border-green-200'
                  : 'bg-slate-50 border-slate-200'
              }`}
            >
              <div className="flex items-start gap-4">
                {/* 预览图 */}
                {file.preview ? (
                  <img
                    src={file.preview}
                    alt={file.file.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                ) : (
                  <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center">
                    {getFileIcon(file.file.type)}
                  </div>
                )}
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-slate-900 truncate">{file.file.name}</p>
                    <button
                      onClick={() => removeFile(file.id)}
                      className="p-1 text-slate-400 hover:text-red-500 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <p className="text-sm text-slate-500">{formatFileSize(file.file.size)}</p>
                  
                  {/* 类型选择 */}
                  <select
                    value={file.type}
                    onChange={(e) => changeFileType(file.id, e.target.value as AttachmentType)}
                    className="mt-2 text-sm border border-slate-300 rounded-lg px-2 py-1"
                  >
                    {ATTACHMENT_TYPES.map((t) => (
                      <option key={t.type} value={t.type}>{t.label}</option>
                    ))}
                  </select>
                  
                  {/* 上传进度 */}
                  {file.status === 'uploading' && (
                    <div className="mt-2">
                      <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-teal-500 transition-all duration-300"
                          style={{ width: `${file.progress}%` }}
                        />
                      </div>
                      <p className="text-xs text-slate-500 mt-1">{Math.round(file.progress)}%</p>
                    </div>
                  )}
                  
                  {/* 状态指示 */}
                  {file.status === 'success' && (
                    <div className="mt-2 flex items-center gap-2 text-green-600">
                      <CheckCircle className="w-4 h-4" />
                      <span className="text-sm">上傳成功</span>
                      {file.extractedData && Object.keys(file.extractedData).length > 0 && (
                        <span className="flex items-center gap-1 text-xs text-teal-600">
                          <Scan className="w-3 h-3" />
                          已識別關鍵信息
                        </span>
                      )}
                    </div>
                  )}
                  
                  {file.status === 'error' && (
                    <div className="mt-2 flex items-center gap-2 text-red-600">
                      <AlertCircle className="w-4 h-4" />
                      <span className="text-sm">{file.error}</span>
                    </div>
                  )}
                  
                  {/* 识别的数据预览 */}
                  {file.extractedData && Object.keys(file.extractedData).length > 0 && (
                    <div className="mt-3 p-3 bg-white rounded-lg border border-green-200">
                      <p className="text-xs font-medium text-slate-500 mb-2">識別結果：</p>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        {Object.entries(file.extractedData).slice(0, 4).map(([key, value]) => (
                          <div key={key}>
                            <span className="text-slate-500">{key}: </span>
                            <span className="text-slate-900">{String(value)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 操作按钮 */}
      <div className="flex justify-between mt-8">
        <button
          onClick={onBack}
          disabled={isProcessing}
          className="inline-flex items-center gap-2 px-6 py-3 border border-slate-300 text-slate-700 rounded-xl font-medium hover:bg-slate-50 disabled:opacity-50 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          上一步
        </button>

        <button
          onClick={handleComplete}
          disabled={!allUploaded || isProcessing}
          className="inline-flex items-center gap-2 px-8 py-3 bg-teal-600 text-white rounded-xl font-medium hover:bg-teal-700 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors"
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              處理中...
            </>
          ) : (
            <>
              下一步
              <ChevronRight className="w-5 h-5" />
            </>
          )}
        </button>
      </div>

      {/* 跳过按钮 */}
      <div className="text-center mt-4">
        <button
          onClick={() => onComplete([])}
          className="text-sm text-slate-500 hover:text-teal-600 transition-colors"
        >
          暫不上傳，跳過此步驟 →
        </button>
      </div>
    </div>
  );
}
