/**
 * Generate PDF API Route
 * /api/insurance/claims/[id]/generate
 * 
 * POST: 生成申报 PDF 文件
 */

export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import type { InsuranceClaim, GeneratePdfResponse } from '@/lib/insurance/types/insurance-claim';
import { generateCignaForm, getFormFileName } from '@/lib/pdf/generators/cigna-generator';

// 模拟数据库
const claimsDB: Map<string, InsuranceClaim> = new Map();

/**
 * POST /api/insurance/claims/[id]/generate
 * 生成申报 PDF
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    const { id } = await params;
    
    if (!id) {
      return NextResponse.json(
        { error: 'Missing claim ID' },
        { status: 400 }
      );
    }
    
    // 获取申报数据
    const claim = claimsDB.get(id);
    
    if (!claim) {
      return NextResponse.json(
        { error: 'Claim not found' },
        { status: 404 }
      );
    }
    
    // 解析请求体
    const body = await request.json().catch(() => ({}));
    const formType = body.formType || 'claim';
    const includeAttachments = body.includeAttachments || false;
    
    // 验证 formType
    if (!['pre-auth', 'claim'].includes(formType)) {
      return NextResponse.json(
        { error: 'Invalid formType. Must be "pre-auth" or "claim"' },
        { status: 400 }
      );
    }
    
    // 生成 PDF
    let pdfBuffer: Uint8Array;
    
    switch (claim.insurance.provider) {
      case 'cigna':
        pdfBuffer = await generateCignaForm(claim, formType as 'pre-auth' | 'claim');
        break;
      case 'axa':
        return NextResponse.json(
          { error: 'AXA PDF generation not implemented yet' },
          { status: 501 }
        );
      case 'allianz':
        return NextResponse.json(
          { error: 'Allianz PDF generation not implemented yet' },
          { status: 501 }
        );
      default:
        return NextResponse.json(
          { error: `Unsupported insurance provider: ${claim.insurance.provider}` },
          { status: 400 }
        );
    }
    
    // 更新申报状态为 ready
    claim.metadata.status = 'ready';
    claim.metadata.updatedAt = new Date().toISOString();
    claimsDB.set(id, claim);
    
    // 生成文件名
    const fileName = getFormFileName(claim, formType as 'pre-auth' | 'claim');
    
    // 在实际项目中，这里应该将 PDF 上传到云存储（如 S3、Supabase Storage）
    // 并返回可下载的 URL
    // 为了演示，我们返回 base64 编码的 PDF 数据
    
    const base64Pdf = Buffer.from(pdfBuffer).toString('base64');
    const dataUrl = `data:application/pdf;base64,${base64Pdf}`;
    
    // 计算过期时间（24小时后）
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);
    
    const response: GeneratePdfResponse = {
      success: true,
      downloadUrl: dataUrl,
      previewUrl: dataUrl,
      fileName,
      fileSize: pdfBuffer.length,
      expiresAt: expiresAt.toISOString(),
      message: 'PDF generated successfully',
    };
    
    return NextResponse.json(response);
    
  } catch (error) {
    console.error('Error generating PDF:', error);
    return NextResponse.json(
      { 
        error: 'Failed to generate PDF',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/insurance/claims/[id]/generate
 * 获取 PDF 生成状态
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    const { id } = await params;
    
    if (!id) {
      return NextResponse.json(
        { error: 'Missing claim ID' },
        { status: 400 }
      );
    }
    
    const claim = claimsDB.get(id);
    
    if (!claim) {
      return NextResponse.json(
        { error: 'Claim not found' },
        { status: 404 }
      );
    }
    
    // 返回 PDF 生成状态
    return NextResponse.json({
      success: true,
      data: {
        claimId: id,
        status: claim.metadata.status,
        canGenerate: ['draft', 'pending-docs', 'ready'].includes(claim.metadata.status),
        provider: claim.insurance.provider,
        supportedFormTypes: ['pre-auth', 'claim'],
      },
    });
    
  } catch (error) {
    console.error('Error checking PDF status:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
