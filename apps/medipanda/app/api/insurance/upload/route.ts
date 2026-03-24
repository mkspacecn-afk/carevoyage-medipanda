/**
 * File Upload API Route
 * /api/insurance/upload
 * 
 * POST: 上传附件文件
 */

export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import type { UploadResponse, AttachmentType } from '@/lib/insurance/types/insurance-claim';

// 允许的文件类型
const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

// 最大文件大小 (10MB)
const MAX_FILE_SIZE = 10 * 1024 * 1024;

// 允许的文件扩展名
const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.pdf', '.doc', '.docx'];

/**
 * 验证文件类型
 * @param file 文件对象
 * @returns 是否有效
 */
function validateFile(file: File): { valid: boolean; error?: string } {
  // 检查 MIME 类型
  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: `Invalid file type: ${file.type}. Allowed types: images, PDF, Word documents`,
    };
  }
  
  // 检查文件大小
  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `File too large: ${(file.size / 1024 / 1024).toFixed(2)}MB. Maximum size: 10MB`,
    };
  }
  
  // 检查文件扩展名
  const extension = '.' + file.name.split('.').pop()?.toLowerCase();
  if (!ALLOWED_EXTENSIONS.includes(extension)) {
    return {
      valid: false,
      error: `Invalid file extension: ${extension}`,
    };
  }
  
  return { valid: true };
}

/**
 * 生成唯一文件名
 * @param originalName 原始文件名
 * @returns 新生成的文件名
 */
function generateFileName(originalName: string): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 9);
  const extension = originalName.split('.').pop() || 'bin';
  return `${timestamp}_${random}.${extension}`;
}

/**
 * 确定附件类型
 * @param fileType 文件类型参数
 * @param fileName 文件名
 * @returns 附件类型
 */
function determineAttachmentType(fileType: string | null, fileName: string): AttachmentType {
  if (fileType) {
    return fileType as AttachmentType;
  }
  
  // 根据文件名自动推断类型
  const lowerName = fileName.toLowerCase();
  if (lowerName.includes('invoice') || lowerName.includes('receipt') || lowerName.includes('发票')) {
    return 'invoice';
  }
  if (lowerName.includes('report') || lowerName.includes('诊断')) {
    return 'medical-report';
  }
  if (lowerName.includes('lab') || lowerName.includes('test') || lowerName.includes('检验')) {
    return 'lab-result';
  }
  if (lowerName.includes('id') || lowerName.includes('passport') || lowerName.includes('身份证') || lowerName.includes('护照')) {
    return 'id-proof';
  }
  if (lowerName.includes('prescription') || lowerName.includes('处方')) {
    return 'prescription';
  }
  
  return 'other';
}

/**
 * POST /api/insurance/upload
 * 上传文件
 * 
 * FormData:
 * - file: 文件
 * - fileType: 文件类型（可选）
 * - claimId: 关联的申报ID（可选）
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // 解析 multipart/form-data
    const formData = await request.formData();
    
    const file = formData.get('file') as File | null;
    const fileType = formData.get('fileType') as string | null;
    const claimId = formData.get('claimId') as string | null;
    
    // 验证文件
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }
    
    const validation = validateFile(file);
    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      );
    }
    
    // 生成文件信息
    const attachmentId = `att_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const fileName = generateFileName(file.name);
    const attachmentType = determineAttachmentType(fileType, file.name);
    
    // 将文件转换为 Buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // 在实际项目中，这里应该:
    // 1. 上传到云存储（如 S3、Supabase Storage）
    // 2. 保存文件元数据到数据库
    // 3. 如果有关联 claimId，更新申报的 attachments 数组
    
    // 为了演示，我们生成一个模拟的 URL
    // 实际项目中应该是云存储的 URL
    const base64Data = buffer.toString('base64');
    const fileUrl = `data:${file.type};base64,${base64Data.substring(0, 100)}...`; // 截断显示
    
    // 模拟 OCR 提取数据（实际项目中应该调用 OCR 服务）
    const extractedData: Record<string, unknown> = {};
    const confidence = 0.85; // 模拟置信度
    
    // 模拟 OCR 文本（根据文件类型）
    let ocrText = '';
    if (attachmentType === 'invoice') {
      ocrText = 'Invoice #12345\nDate: 2026-03-15\nAmount: ¥15,800\nHospital: 华西天府医院';
      extractedData.amount = 15800;
      extractedData.date = '2026-03-15';
      extractedData.hospitalName = '华西天府医院';
    } else if (attachmentType === 'medical-report') {
      ocrText = 'Medical Report\nDiagnosis: Pneumonia (J18.9)\nPatient: 张三\nDate: 2026-03-15';
      extractedData.diagnosisCode = 'J18.9';
      extractedData.diagnosis = 'Pneumonia';
    }
    
    // 构建响应
    const response: UploadResponse = {
      success: true,
      attachment: {
        id: attachmentId,
        type: attachmentType,
        fileUrl: `/api/insurance/files/${fileName}`, // 模拟的下载 URL
        fileName: file.name,
        fileSize: file.size,
        mimeType: file.type,
        uploadedAt: new Date().toISOString(),
        ocrText,
        extractedData,
      },
      extractedData,
      confidence,
      message: 'File uploaded successfully',
    };
    
    // 如果有关联 claimId，这里应该更新数据库
    if (claimId) {
      // 实际项目中更新数据库
      console.log(`Updating claim ${claimId} with new attachment ${attachmentId}`);
    }
    
    return NextResponse.json(response, { status: 201 });
    
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json(
      { 
        error: 'Failed to upload file',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/insurance/upload
 * 获取上传配置信息
 */
export async function GET(): Promise<NextResponse> {
  return NextResponse.json({
    success: true,
    data: {
      maxFileSize: MAX_FILE_SIZE,
      maxFileSizeFormatted: '10MB',
      allowedTypes: ALLOWED_MIME_TYPES,
      allowedExtensions: ALLOWED_EXTENSIONS,
      attachmentTypes: [
        { value: 'invoice', label: 'Invoice / 发票' },
        { value: 'receipt', label: 'Receipt / 收据' },
        { value: 'medical-report', label: 'Medical Report / 诊断报告' },
        { value: 'lab-result', label: 'Lab Result / 检验报告' },
        { value: 'id-proof', label: 'ID Proof / 身份证明' },
        { value: 'prescription', label: 'Prescription / 处方' },
        { value: 'other', label: 'Other / 其他' },
      ],
    },
  });
}
