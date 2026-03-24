/**
 * PDF Module Exports
 * PDF 模块统一导出
 */

// PDF 渲染工具导出
export {
  renderClaimPDF,
  renderPreviewPDF,
  mergePDFs,
  generateSubmissionPackage,
  createBlobUrl,
  downloadPDF,
  validatePDF,
  getPDFPageCount,
  PDFRenderer,
  createPDFRenderer,
} from './utils/pdf-renderer';

// Cigna 生成器导出
export {
  generateCignaPreAuthForm,
  generateCignaClaimForm,
  generateCignaForm,
  getFormFileName,
} from './generators/cigna-generator';

// 类型导出
export type {
  PDFGeneratorType,
  FormType,
  PDFRenderOptions,
  PDFRenderResult,
} from './utils/pdf-renderer';
