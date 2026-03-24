/**
 * PDF Renderer Utilities
 * PDF 渲染工具函数
 */

import type { InsuranceClaim } from '../../insurance/types/insurance-claim';
import { generateCignaForm, getFormFileName } from '../generators/cigna-generator';

/**
 * 支持的 PDF 生成类型
 */
export type PDFGeneratorType = 'cigna' | 'axa' | 'allianz';

/**
 * 表单类型
 */
export type FormType = 'pre-auth' | 'claim';

/**
 * PDF 生成选项
 */
export interface PDFRenderOptions {
  /** 保险公司 */
  provider: PDFGeneratorType;
  /** 表单类型 */
  formType: FormType;
  /** 是否包含附件 */
  includeAttachments?: boolean;
  /** 是否添加水印 */
  addWatermark?: boolean;
  /** 水印文字 */
  watermarkText?: string;
}

/**
 * PDF 生成结果
 */
export interface PDFRenderResult {
  /** PDF 字节数据 */
  buffer: Uint8Array;
  /** 文件名 */
  fileName: string;
  /** 文件大小（字节） */
  fileSize: number;
  /** MIME 类型 */
  mimeType: string;
  /** 生成时间戳 */
  generatedAt: string;
}

/**
 * 生成保险申报 PDF
 * @param claim 申报数据
 * @param options 生成选项
 * @returns PDF 生成结果
 */
export async function renderClaimPDF(
  claim: InsuranceClaim,
  options: PDFRenderOptions
): Promise<PDFRenderResult> {
  const { provider, formType } = options;
  
  let buffer: Uint8Array;
  
  // 根据保险公司选择对应的生成器
  switch (provider) {
    case 'cigna':
      buffer = await generateCignaForm(claim, formType);
      break;
    case 'axa':
      // TODO: 实现 AXA 生成器
      throw new Error('AXA PDF generator not implemented yet');
    case 'allianz':
      // TODO: 实现 Allianz 生成器
      throw new Error('Allianz PDF generator not implemented yet');
    default:
      throw new Error(`Unsupported insurance provider: ${provider}`);
  }
  
  // 如果需要，添加水印
  if (options.addWatermark && options.watermarkText) {
    buffer = await addWatermark(buffer, options.watermarkText);
  }
  
  const fileName = getFormFileName(claim, formType);
  
  return {
    buffer,
    fileName,
    fileSize: buffer.length,
    mimeType: 'application/pdf',
    generatedAt: new Date().toISOString(),
  };
}

/**
 * 生成预览用的简化 PDF
 * @param claim 申报数据
 * @param options 生成选项
 * @returns PDF 生成结果
 */
export async function renderPreviewPDF(
  claim: InsuranceClaim,
  options: Omit<PDFRenderOptions, 'includeAttachments'>
): Promise<PDFRenderResult> {
  // 预览版添加水印
  return renderClaimPDF(claim, {
    ...options,
    addWatermark: true,
    watermarkText: 'PREVIEW - NOT FOR SUBMISSION',
  });
}

/**
 * 为 PDF 添加水印
 * @param pdfBuffer PDF 字节数据
 * @param watermarkText 水印文字
 * @returns 带水印的 PDF 字节数据
 */
async function addWatermark(
  pdfBuffer: Uint8Array,
  watermarkText: string
): Promise<Uint8Array> {
  // 这里使用 pdf-lib 添加水印
  // 由于需要动态导入 pdf-lib，这里返回原始 buffer
  // 实际实现时可以使用 PDFDocument.load() 和 PDFPage.drawText() 添加水印
  
  // TODO: 实现水印添加逻辑
  // const { PDFDocument } = await import('pdf-lib');
  // const pdfDoc = await PDFDocument.load(pdfBuffer);
  // ... 添加水印逻辑
  
  return pdfBuffer;
}

/**
 * 合并多个 PDF 文件
 * @param pdfBuffers PDF 字节数据数组
 * @returns 合并后的 PDF 字节数据
 */
export async function mergePDFs(pdfBuffers: Uint8Array[]): Promise<Uint8Array> {
  if (pdfBuffers.length === 0) {
    throw new Error('No PDFs to merge');
  }
  
  if (pdfBuffers.length === 1) {
    return pdfBuffers[0];
  }
  
  const { PDFDocument } = await import('pdf-lib');
  
  const mergedPdf = await PDFDocument.create();
  
  for (const buffer of pdfBuffers) {
    const pdf = await PDFDocument.load(buffer);
    const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
    pages.forEach(page => mergedPdf.addPage(page));
  }
  
  return await mergedPdf.save();
}

/**
 * 生成包含附件的完整申报包 PDF
 * @param claim 申报数据
 * @param attachmentBuffers 附件 PDF 字节数据数组
 * @param options 生成选项
 * @returns 合并后的 PDF 字节数据
 */
export async function generateSubmissionPackage(
  claim: InsuranceClaim,
  attachmentBuffers: Uint8Array[],
  options: Omit<PDFRenderOptions, 'includeAttachments'>
): Promise<PDFRenderResult> {
  // 生成主表单
  const formResult = await renderClaimPDF(claim, options);
  
  // 如果有附件，合并所有 PDF
  if (attachmentBuffers.length > 0) {
    const mergedBuffer = await mergePDFs([formResult.buffer, ...attachmentBuffers]);
    
    return {
      buffer: mergedBuffer,
      fileName: formResult.fileName.replace('.pdf', '_Package.pdf'),
      fileSize: mergedBuffer.length,
      mimeType: 'application/pdf',
      generatedAt: formResult.generatedAt,
    };
  }
  
  return formResult;
}

/**
 * 生成 Blob URL（用于前端预览）
 * @param buffer PDF 字节数据
 * @returns Blob URL
 */
export function createBlobUrl(buffer: Uint8Array): string {
  const blob = new Blob([buffer as BlobPart], { type: 'application/pdf' });
  return URL.createObjectURL(blob);
}

/**
 * 下载 PDF 文件
 * @param buffer PDF 字节数据
 * @param fileName 文件名
 */
export function downloadPDF(buffer: Uint8Array, fileName: string): void {
  const blob = new Blob([buffer as BlobPart], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
}

/**
 * 验证 PDF 数据
 * @param buffer PDF 字节数据
 * @returns 是否有效
 */
export async function validatePDF(buffer: Uint8Array): Promise<boolean> {
  try {
    const { PDFDocument } = await import('pdf-lib');
    const pdf = await PDFDocument.load(buffer);
    return pdf.getPageCount() > 0;
  } catch {
    return false;
  }
}

/**
 * 获取 PDF 页数
 * @param buffer PDF 字节数据
 * @returns 页数
 */
export async function getPDFPageCount(buffer: Uint8Array): Promise<number> {
  try {
    const { PDFDocument } = await import('pdf-lib');
    const pdf = await PDFDocument.load(buffer);
    return pdf.getPageCount();
  } catch {
    return 0;
  }
}

/**
 * PDF 渲染器类
 * 提供更高级的 PDF 操作功能
 */
export class PDFRenderer {
  private provider: PDFGeneratorType;
  
  constructor(provider: PDFGeneratorType) {
    this.provider = provider;
  }
  
  /**
   * 生成表单
   */
  async generateForm(
    claim: InsuranceClaim,
    formType: FormType
  ): Promise<PDFRenderResult> {
    return renderClaimPDF(claim, {
      provider: this.provider,
      formType,
    });
  }
  
  /**
   * 生成预览
   */
  async generatePreview(
    claim: InsuranceClaim,
    formType: FormType
  ): Promise<PDFRenderResult> {
    return renderPreviewPDF(claim, {
      provider: this.provider,
      formType,
    });
  }
  
  /**
   * 生成完整申报包
   */
  async generatePackage(
    claim: InsuranceClaim,
    attachments: Uint8Array[],
    formType: FormType
  ): Promise<PDFRenderResult> {
    return generateSubmissionPackage(claim, attachments, {
      provider: this.provider,
      formType,
    });
  }
}

/**
 * 创建 PDF 渲染器实例
 * @param provider 保险公司
 * @returns PDFRenderer 实例
 */
export function createPDFRenderer(provider: PDFGeneratorType): PDFRenderer {
  return new PDFRenderer(provider);
}
