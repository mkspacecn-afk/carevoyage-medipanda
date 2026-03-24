/**
 * Document Uploader Component
 * 资料上传组件
 */

'use client';

import { useState, useCallback } from 'react';
import { Upload, File, X, FileText, Image as ImageIcon } from 'lucide-react';

interface Document {
  id: string;
  file: File;
  type: 'diagnosis' | 'invoice' | 'id-proof' | 'medical-report' | 'other';
  status: 'uploading' | 'completed' | 'error';
  progress: number;
}

interface DocumentUploaderProps {
  claimId: string;
  onComplete: (attachmentIds: string[]) => void;
  onBack?: () => void;
  maxFiles?: number;
  acceptedTypes?: string[];
}

const DOCUMENT_TYPES = [
  { id: 'diagnosis', label: '診斷報告', icon: FileText },
  { id: 'invoice', label: '發票/收據', icon: FileText },
  { id: 'id-proof', label: '身份證明', icon: FileText },
  { id: 'medical-report', label: '病歷資料', icon: FileText },
  { id: 'other', label: '其他', icon: File },
] as const;

export default function DocumentUploader({ 
  claimId,
  onComplete,
  onBack,
  maxFiles = 10,
  acceptedTypes = ['image/*', 'application/pdf'] 
}: DocumentUploaderProps) {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  }, []);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    handleFiles(files);
  }, []);

  const handleFiles = (files: File[]) => {
    if (documents.length + files.length > maxFiles) {
      alert(`最多只能上傳 ${maxFiles} 個文件`);
      return;
    }

    const newDocuments: Document[] = files.map((file, index) => ({
      id: `doc-${Date.now()}-${index}`,
      file,
      type: detectDocumentType(file),
      status: 'uploading',
      progress: 0,
    }));

    setDocuments(prev => [...prev, ...newDocuments]);

    // Simulate upload progress
    newDocuments.forEach((doc, index) => {
      simulateUpload(doc.id, index * 200);
    });
  };

  const detectDocumentType = (file: File): Document['type'] => {
    const name = file.name.toLowerCase();
    if (name.includes('diagnosis') || name.includes('诊断')) return 'diagnosis';
    if (name.includes('invoice') || name.includes('receipt') || name.includes('发票')) return 'invoice';
    if (name.includes('id') || name.includes('passport') || name.includes('身份证')) return 'id-proof';
    if (name.includes('medical') || name.includes('record') || name.includes('病历')) return 'medical-report';
    return 'other';
  };

  const simulateUpload = (docId: string, delay: number) => {
    setTimeout(() => {
      setDocuments(prev => prev.map(doc => {
        if (doc.id === docId) {
          return { ...doc, status: 'completed', progress: 100 };
        }
        return doc;
      }));
    }, 1000 + delay);
  };

  const removeDocument = (docId: string) => {
    setDocuments(prev => prev.filter(doc => doc.id !== docId));
  };

  const updateDocumentType = (docId: string, type: Document['type']) => {
    setDocuments(prev => prev.map(doc => 
      doc.id === docId ? { ...doc, type } : doc
    ));
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) return ImageIcon;
    return FileText;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          border-2 border-dashed rounded-xl p-8 text-center transition-colors
          ${isDragging 
            ? 'border-teal-500 bg-teal-50' 
            : 'border-gray-300 hover:border-gray-400'
          }
        `}
      >
        <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
        <p className="text-lg font-medium text-gray-900 mb-2">
          拖拽文件到這裡上傳
        </p>
        <p className="text-sm text-gray-500 mb-4">
          支持 PDF、JPG、PNG 格式，單個文件不超過 10MB
        </p>
        <label className="inline-flex items-center px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 cursor-pointer transition-colors">
          <Upload className="w-4 h-4 mr-2" />
          選擇文件
          <input
            type="file"
            multiple
            accept={acceptedTypes.join(',')}
            onChange={handleFileInput}
            className="hidden"
          />
        </label>
      </div>

      {/* Document List */}
      {documents.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-medium text-gray-900">
            已上傳文件 ({documents.length}/{maxFiles})
          </h3>
          
          {documents.map((doc) => {
            const FileIcon = getFileIcon(doc.file);
            
            return (
              <div
                key={doc.id}
                className="flex items-center gap-4 p-4 bg-white rounded-lg border border-gray-200"
              >
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FileIcon className="w-5 h-5 text-gray-600" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">
                    {doc.file.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {formatFileSize(doc.file.size)}
                  </p>
                  
                  {/* Progress bar */}
                  {doc.status === 'uploading' && (
                    <div className="mt-2 h-1 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-teal-600 transition-all duration-300"
                        style={{ width: `${doc.progress}%` }}
                      />
                    </div>
                  )}
                </div>

                {/* Document Type Selector */}
                <select
                  value={doc.type}
                  onChange={(e) => updateDocumentType(doc.id, e.target.value as Document['type'])}
                  className="text-sm border rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-teal-500"
                >
                  {DOCUMENT_TYPES.map(type => (
                    <option key={type.id} value={type.id}>
                      {type.label}
                    </option>
                  ))}
                </select>

                {/* Status */}
                {doc.status === 'completed' && (
                  <span className="text-green-600 text-sm">✓</span>
                )}

                {/* Remove button */}
                <button
                  onClick={() => removeDocument(doc.id)}
                  className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Continue Button */}
      {documents.length > 0 && (
        <div className="flex justify-between">
          {onBack && (
            <button
              onClick={onBack}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              返回
            </button>
          )}
          <button
            onClick={() => onComplete(documents.map(d => d.id))}
            className="px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
          >
            繼續
          </button>
        </div>
      )}
    </div>
  );
}
