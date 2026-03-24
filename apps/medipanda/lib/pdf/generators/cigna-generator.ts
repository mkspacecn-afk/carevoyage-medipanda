/**
 * Cigna PDF Generator
 * Cigna 保险表单 PDF 生成器
 */

import type { InsuranceClaim, TreatmentItem } from '../../insurance/types/insurance-claim';
import { PDFDocument, PDFPage, rgb, StandardFonts } from 'pdf-lib';
import { cignaConfig, getCignaFieldDisplayName } from '../../insurance/mappings/cigna-mapping';

/**
 * Cigna 表单颜色配置
 */
const COLORS = {
  primary: rgb(0.08, 0.4, 0.36), // Cigna Teal
  secondary: rgb(0.95, 0.95, 0.95),
  text: rgb(0.2, 0.2, 0.2),
  textLight: rgb(0.5, 0.5, 0.5),
  border: rgb(0.8, 0.8, 0.8),
  white: rgb(1, 1, 1),
};

/**
 * 页面尺寸 (A4)
 */
const PAGE_WIDTH = 595.28;
const PAGE_HEIGHT = 841.89;
const MARGIN = 50;

/**
 * 绘制表单标题
 */
function drawFormHeader(
  page: PDFPage,
  title: string,
  subtitle: string,
  y: number
): number {
  const { width } = page.getSize();
  
  // 标题背景
  page.drawRectangle({
    x: 0,
    y: y - 60,
    width,
    height: 70,
    color: COLORS.primary,
  });
  
  // 标题文字
  page.drawText(title, {
    x: MARGIN,
    y: y - 35,
    size: 20,
    color: COLORS.white,
  });
  
  // 副标题
  page.drawText(subtitle, {
    x: MARGIN,
    y: y - 55,
    size: 10,
    color: rgb(0.8, 0.9, 0.9),
  });
  
  return y - 80;
}

/**
 * 绘制分区标题
 */
function drawSectionHeader(
  page: PDFPage,
  title: string,
  y: number
): number {
  // 分区标题背景
  page.drawRectangle({
    x: MARGIN - 10,
    y: y - 25,
    width: PAGE_WIDTH - (MARGIN * 2) + 20,
    height: 30,
    color: rgb(0.95, 0.95, 0.95),
    borderColor: COLORS.border,
    borderWidth: 1,
  });
  
  page.drawText(title.toUpperCase(), {
    x: MARGIN,
    y: y - 18,
    size: 11,
    color: COLORS.primary,
  });
  
  return y - 40;
}

/**
 * 绘制字段标签和值
 */
function drawField(
  page: PDFPage,
  label: string,
  value: string,
  x: number,
  y: number,
  width: number
): number {
  // 标签
  page.drawText(label + ':', {
    x,
    y,
    size: 8,
    color: COLORS.textLight,
  });
  
  // 值框
  page.drawRectangle({
    x,
    y: y - 25,
    width,
    height: 22,
    borderColor: COLORS.border,
    borderWidth: 1,
  });
  
  // 值
  if (value) {
    page.drawText(value.substring(0, 50), {
      x: x + 5,
      y: y - 20,
      size: 10,
      color: COLORS.text,
    });
  }
  
  return y - 35;
}

/**
 * 绘制两列布局的字段
 */
function drawTwoColumnFields(
  page: PDFPage,
  fields: { label: string; value: string }[],
  y: number
): number {
  const colWidth = (PAGE_WIDTH - (MARGIN * 2) - 20) / 2;
  let currentY = y;
  
  for (let i = 0; i < fields.length; i += 2) {
    const leftField = fields[i];
    const rightField = fields[i + 1];
    
    drawField(page, leftField.label, leftField.value, MARGIN, currentY, colWidth);
    if (rightField) {
      drawField(page, rightField.label, rightField.value, MARGIN + colWidth + 20, currentY, colWidth);
    }
    
    currentY -= 45;
  }
  
  return currentY;
}

/**
 * 绘制治疗项目表格
 */
function drawTreatmentsTable(
  page: PDFPage,
  treatments: TreatmentItem[],
  y: number
): number {
  const colWidths = [150, 180, 50, 70, 70];
  const startX = MARGIN;
  let currentY = y;
  
  // 表头
  const headers = ['Service Item', 'Description', 'Qty', 'Unit Price', 'Total'];
  let currentX = startX;
  
  page.drawRectangle({
    x: startX,
    y: currentY - 25,
    width: colWidths.reduce((a, b) => a + b, 0) + 20,
    height: 25,
    color: COLORS.secondary,
  });
  
  headers.forEach((header, i) => {
    page.drawText(header, {
      x: currentX,
      y: currentY - 17,
      size: 9,
      color: COLORS.primary,
    });
    currentX += colWidths[i] || 70;
  });
  
  currentY -= 30;
  
  // 数据行
  treatments.forEach((item) => {
    currentX = startX;
    const rowData = [
      item.item.substring(0, 20),
      item.description.substring(0, 25),
      String(item.quantity),
      item.unitPrice.toFixed(2),
      item.totalPrice.toFixed(2),
    ];
    
    rowData.forEach((cell, i) => {
      page.drawText(cell, {
        x: currentX,
        y: currentY - 5,
        size: 9,
        color: COLORS.text,
      });
      currentX += colWidths[i] || 70;
    });
    
    currentY -= 20;
  });
  
  return currentY - 10;
}

/**
 * 生成 Cigna 预授权申请表
 * @param claim 申报数据
 * @returns PDF 字节数组
 */
export async function generateCignaPreAuthForm(claim: InsuranceClaim): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  
  // 第一页
  let page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  let y = PAGE_HEIGHT - 20;
  
  // 表单标题
  y = drawFormHeader(
    page,
    'CIGNA INTERNATIONAL',
    'Pre-authorization Request Form',
    y
  );
  
  // 表单说明
  page.drawText('Please complete all sections clearly. Incomplete forms may delay processing.', {
    x: MARGIN,
    y,
    size: 9,
    color: COLORS.textLight,
  });
  y -= 30;
  
  // Section 1: Patient Information
  y = drawSectionHeader(page, '1. Patient Information', y);
  y = drawTwoColumnFields(page, [
    { label: 'Full Name', value: claim.patient.name },
    { label: 'Date of Birth (MM/DD/YYYY)', value: formatDateUS(claim.patient.dateOfBirth) },
    { label: 'Gender', value: claim.patient.gender },
    { label: 'Phone Number', value: claim.patient.phone },
    { label: 'Email Address', value: claim.patient.email },
    { label: 'Passport/ID Number', value: claim.patient.passportNumber || '' },
  ], y);
  
  y = drawField(page, 'Residential Address', claim.patient.address, MARGIN, y, PAGE_WIDTH - (MARGIN * 2));
  y -= 20;
  
  // Section 2: Insurance Information
  y = drawSectionHeader(page, '2. Insurance Information', y);
  y = drawTwoColumnFields(page, [
    { label: 'Member ID / Certificate Number', value: claim.insurance.memberId },
    { label: 'Policy Number', value: claim.insurance.policyNumber },
    { label: 'Group Number', value: claim.insurance.groupNumber || '' },
    { label: 'Plan Name', value: claim.insurance.planName || '' },
  ], y);
  y -= 20;
  
  // Section 3: Medical Provider Information
  y = drawSectionHeader(page, '3. Medical Provider Information', y);
  y = drawField(page, 'Hospital/Facility Name', claim.medicalEvent.hospitalName, MARGIN, y, PAGE_WIDTH - (MARGIN * 2));
  y = drawField(page, 'Hospital Address', claim.medicalEvent.hospitalAddress, MARGIN, y, PAGE_WIDTH - (MARGIN * 2));
  y = drawTwoColumnFields(page, [
    { label: 'Department/Specialty', value: claim.medicalEvent.department },
    { label: 'Treating Physician', value: claim.medicalEvent.doctorName },
    { label: 'Physician License #', value: claim.medicalEvent.doctorLicense || '' },
    { label: 'Physician Phone', value: claim.medicalEvent.doctorPhone || '' },
  ], y);
  y -= 20;
  
  // 第二页
  page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  y = PAGE_HEIGHT - 20;
  
  y = drawFormHeader(
    page,
    'CIGNA INTERNATIONAL',
    'Pre-authorization Request Form (Continued)',
    y
  );
  y -= 20;
  
  // Section 4: Diagnosis Information
  y = drawSectionHeader(page, '4. Diagnosis Information', y);
  y = drawField(page, 'Primary Diagnosis (ICD-10)', `${claim.diagnosis.primary.icd10Code} - ${claim.diagnosis.primary.description}`, MARGIN, y, PAGE_WIDTH - (MARGIN * 2));
  
  // 症状描述区域
  page.drawText('Presenting Symptoms / Reason for Admission:', {
    x: MARGIN,
    y,
    size: 9,
    color: COLORS.textLight,
  });
  y -= 15;
  
  page.drawRectangle({
    x: MARGIN,
    y: y - 80,
    width: PAGE_WIDTH - (MARGIN * 2),
    height: 80,
    borderColor: COLORS.border,
    borderWidth: 1,
  });
  
  // 多行文本处理
  const symptoms = wrapText(claim.diagnosis.symptoms, 80);
  symptoms.forEach((line, i) => {
    page.drawText(line, {
      x: MARGIN + 5,
      y: y - 20 - (i * 12),
      size: 9,
      color: COLORS.text,
    });
  });
  y -= 100;
  
  // 次要诊断
  if (claim.diagnosis.secondary && claim.diagnosis.secondary.length > 0) {
    page.drawText('Secondary Diagnosis:', {
      x: MARGIN,
      y,
      size: 9,
      color: COLORS.textLight,
    });
    y -= 15;
    
    claim.diagnosis.secondary.forEach((diag, i) => {
      const text = `${i + 1}. ${diag.icd10Code} - ${diag.description}`;
      page.drawText(text.substring(0, 90), {
        x: MARGIN + 5,
        y: y - (i * 14),
        size: 9,
        color: COLORS.text,
      });
    });
    y -= (claim.diagnosis.secondary.length * 14) + 20;
  }
  
  // Section 5: Treatment Information
  y = drawSectionHeader(page, '5. Treatment / Service Information', y);
  
  if (claim.treatments.length > 0) {
    y = drawTreatmentsTable(page, claim.treatments, y);
  }
  
  // 费用汇总
  y -= 10;
  const totalY = y;
  page.drawText('CURRENCY:', {
    x: MARGIN,
    y: totalY,
    size: 9,
    color: COLORS.textLight,
  });
  page.drawText(claim.financial.currency, {
    x: MARGIN + 80,
    y: totalY,
    size: 10,
    color: COLORS.text,
  });
  
  page.drawText('TOTAL ESTIMATED COST:', {
    x: PAGE_WIDTH - 200,
    y: totalY,
    size: 9,
    color: COLORS.primary,
  });
  page.drawText(`${claim.financial.currency} ${claim.financial.totalAmount.toFixed(2)}`, {
    x: PAGE_WIDTH - 200,
    y: totalY - 20,
    size: 14,
    color: COLORS.primary,
  });
  
  y = totalY - 50;
  
  // 直付选项
  page.drawText('Direct Billing Requested:', {
    x: MARGIN,
    y,
    size: 9,
    color: COLORS.textLight,
  });
  const checkboxX = MARGIN + 120;
  page.drawRectangle({
    x: checkboxX,
    y: y - 3,
    width: 12,
    height: 12,
    borderColor: COLORS.border,
    borderWidth: 1,
  });
  if (claim.financial.isDirectBilling) {
    page.drawText('✓', {
      x: checkboxX + 2,
      y: y - 2,
      size: 10,
      color: COLORS.primary,
    });
  }
  page.drawText('Yes', {
    x: checkboxX + 20,
    y: y - 2,
    size: 9,
    color: COLORS.text,
  });
  
  // 页脚
  const { height } = page.getSize();
  page.drawText(`Form: ${cignaConfig.submissionConfig?.portalUrl || 'CIGNA-PA-001'} | Generated by CareVoyage`, {
    x: MARGIN,
    y: 30,
    size: 8,
    color: COLORS.textLight,
  });
  page.drawText(`Page 2 of 2 | Claim ID: ${claim.id.substring(0, 8)}`, {
    x: PAGE_WIDTH - 150,
    y: 30,
    size: 8,
    color: COLORS.textLight,
  });
  
  return await pdfDoc.save();
}

/**
 * 生成 Cigna 理赔申请表
 * @param claim 申报数据
 * @returns PDF 字节数组
 */
export async function generateCignaClaimForm(claim: InsuranceClaim): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  
  const page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  let y = PAGE_HEIGHT - 20;
  
  // 表单标题
  y = drawFormHeader(
    page,
    'CIGNA INTERNATIONAL',
    'Medical Claim Form',
    y
  );
  
  // 表单说明
  page.drawText('Submit this form along with original receipts and medical reports for claim processing.', {
    x: MARGIN,
    y,
    size: 9,
    color: COLORS.textLight,
  });
  y -= 30;
  
  // Section 1: Patient Information
  y = drawSectionHeader(page, '1. Patient Information', y);
  y = drawTwoColumnFields(page, [
    { label: 'Full Name', value: claim.patient.name },
    { label: 'Date of Birth (MM/DD/YYYY)', value: formatDateUS(claim.patient.dateOfBirth) },
    { label: 'Gender', value: claim.patient.gender },
    { label: 'Phone Number', value: claim.patient.phone },
    { label: 'Email Address', value: claim.patient.email },
  ], y);
  y -= 20;
  
  // Section 2: Insurance Information
  y = drawSectionHeader(page, '2. Insurance Information', y);
  y = drawTwoColumnFields(page, [
    { label: 'Member ID / Certificate Number', value: claim.insurance.memberId },
    { label: 'Policy Number', value: claim.insurance.policyNumber },
    { label: 'Group Number', value: claim.insurance.groupNumber || '' },
  ], y);
  y -= 20;
  
  // Section 3: Claim Details
  y = drawSectionHeader(page, '3. Claim Details', y);
  y = drawField(page, 'Hospital/Facility Name', claim.medicalEvent.hospitalName, MARGIN, y, PAGE_WIDTH - (MARGIN * 2));
  y = drawTwoColumnFields(page, [
    { label: 'Treating Physician', value: claim.medicalEvent.doctorName },
    { label: 'Date of Service', value: formatDateUS(claim.medicalEvent.serviceDate) },
    { label: 'Primary Diagnosis (ICD-10)', value: claim.diagnosis.primary.icd10Code },
    { label: 'Diagnosis Description', value: claim.diagnosis.primary.description },
  ], y);
  y -= 20;
  
  // Section 4: Payment Information
  y = drawSectionHeader(page, '4. Payment Information', y);
  
  if (claim.treatments.length > 0) {
    y = drawTreatmentsTable(page, claim.treatments, y);
  }
  
  y -= 20;
  y = drawTwoColumnFields(page, [
    { label: 'Total Claim Amount', value: `${claim.financial.currency} ${claim.financial.totalAmount.toFixed(2)}` },
    { label: 'Amount Paid by Patient', value: `${claim.financial.currency} ${(claim.financial.patientPaid || 0).toFixed(2)}` },
  ], y);
  y -= 20;
  
  // 声明和签名区域
  page.drawText('DECLARATION:', {
    x: MARGIN,
    y,
    size: 9,
    color: COLORS.primary,
  });
  y -= 15;
  
  const declaration = 'I hereby declare that the information provided above is true and accurate to the best of my knowledge.';
  page.drawText(declaration, {
    x: MARGIN,
    y,
    size: 8,
    color: COLORS.textLight,
  });
  y -= 40;
  
  // 签名行
  page.drawLine({
    start: { x: MARGIN, y },
    end: { x: MARGIN + 200, y },
    color: COLORS.text,
    thickness: 1,
  });
  page.drawText('Patient/Claimant Signature', {
    x: MARGIN,
    y: y - 15,
    size: 8,
    color: COLORS.textLight,
  });
  
  page.drawLine({
    start: { x: MARGIN + 250, y },
    end: { x: MARGIN + 350, y },
    color: COLORS.text,
    thickness: 1,
  });
  page.drawText('Date', {
    x: MARGIN + 250,
    y: y - 15,
    size: 8,
    color: COLORS.textLight,
  });
  
  // 页脚
  page.drawText(`Form: CIGNA-CL-001 | Generated by CareVoyage | Claim ID: ${claim.id.substring(0, 8)}`, {
    x: MARGIN,
    y: 30,
    size: 8,
    color: COLORS.textLight,
  });
  
  return await pdfDoc.save();
}

/**
 * 生成 Cigna 表单（根据类型自动选择）
 * @param claim 申报数据
 * @param formType 表单类型
 * @returns PDF 字节数组
 */
export async function generateCignaForm(
  claim: InsuranceClaim,
  formType: 'pre-auth' | 'claim'
): Promise<Uint8Array> {
  if (formType === 'pre-auth') {
    return generateCignaPreAuthForm(claim);
  }
  return generateCignaClaimForm(claim);
}

/**
 * 格式化日期为美国格式 (MM/DD/YYYY)
 * @param dateStr ISO 日期字符串
 * @returns 美国格式日期
 */
function formatDateUS(dateStr: string): string {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  const yyyy = date.getFullYear();
  
  return `${mm}/${dd}/${yyyy}`;
}

/**
 * 文本换行处理
 * @param text 原始文本
 * @param maxLength 每行最大长度
 * @returns 换行后的文本数组
 */
function wrapText(text: string, maxLength: number): string[] {
  if (!text) return [];
  
  const lines: string[] = [];
  let currentLine = '';
  
  const words = text.split(' ');
  
  for (const word of words) {
    if ((currentLine + word).length <= maxLength) {
      currentLine += (currentLine ? ' ' : '') + word;
    } else {
      if (currentLine) lines.push(currentLine);
      currentLine = word;
    }
  }
  
  if (currentLine) lines.push(currentLine);
  
  return lines.length > 0 ? lines : [text.substring(0, maxLength)];
}

/**
 * 获取表单文件名
 * @param claim 申报数据
 * @param formType 表单类型
 * @returns 文件名
 */
export function getFormFileName(claim: InsuranceClaim, formType: 'pre-auth' | 'claim'): string {
  const prefix = formType === 'pre-auth' ? 'PreAuth' : 'Claim';
  const patientName = claim.patient.name.replace(/\s+/g, '_');
  const date = new Date().toISOString().split('T')[0];
  return `Cigna_${prefix}_${patientName}_${date}.pdf`;
}
