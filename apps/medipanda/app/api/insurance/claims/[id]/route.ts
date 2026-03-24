/**
 * Single Insurance Claim API Routes
 * /api/insurance/claims/[id]
 * 
 * GET: 获取单条申报详情
 * PATCH: 更新申报
 * DELETE: 删除申报（仅草稿状态）
 */

export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import type { 
  InsuranceClaim, 
  UpdateClaimRequest,
  ClaimStatus 
} from '@/lib/insurance/types/insurance-claim';
import { validateUpdateRequest } from '@/lib/insurance/validators/claim-validator';

// 模拟数据库（实际项目中使用 Supabase）
// 注意：在实际实现中，这应该与 route.ts 共享同一个数据库连接
const claimsDB: Map<string, InsuranceClaim> = new Map();

/**
 * GET /api/insurance/claims/[id]
 * 获取单条申报详情
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
    
    // 从数据库获取申报
    const claim = claimsDB.get(id);
    
    if (!claim) {
      return NextResponse.json(
        { error: 'Claim not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: { claim },
    });
    
  } catch (error) {
    console.error('Error fetching claim:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/insurance/claims/[id]
 * 更新申报
 * 
 * Body: UpdateClaimRequest
 */
export async function PATCH(
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
    
    // 获取现有申报
    const existingClaim = claimsDB.get(id);
    
    if (!existingClaim) {
      return NextResponse.json(
        { error: 'Claim not found' },
        { status: 404 }
      );
    }
    
    // 检查状态是否允许更新
    const nonEditableStatuses: ClaimStatus[] = ['submitted', 'acknowledged', 'approved'];
    if (nonEditableStatuses.includes(existingClaim.metadata.status)) {
      return NextResponse.json(
        { error: `Cannot edit claim with status: ${existingClaim.metadata.status}` },
        { status: 409 }
      );
    }
    
    const body = await request.json() as UpdateClaimRequest;
    
    // 验证更新数据
    const validation = validateUpdateRequest(body as Record<string, unknown>);
    
    if (!validation.isValid) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: validation.errors,
        },
        { status: 422 }
      );
    }
    
    // 更新申报数据
    const now = new Date().toISOString();
    
    const updatedClaim: InsuranceClaim = {
      ...existingClaim,
      insurance: {
        ...existingClaim.insurance,
        ...body.insurance,
      },
      patient: {
        ...existingClaim.patient,
        ...body.patient,
      },
      medicalEvent: {
        ...existingClaim.medicalEvent,
        ...body.medicalEvent,
      },
      diagnosis: body.diagnosis ? {
        ...existingClaim.diagnosis,
        ...body.diagnosis,
        primary: body.diagnosis.primary || existingClaim.diagnosis.primary,
      } : existingClaim.diagnosis,
      treatments: body.treatments || existingClaim.treatments,
      financial: {
        ...existingClaim.financial,
        ...body.financial,
      },
      metadata: {
        ...existingClaim.metadata,
        updatedAt: now,
        ...(body.status && { status: body.status }),
        ...(body.notes && { notes: body.notes }),
      },
    };
    
    // 保存更新
    claimsDB.set(id, updatedClaim);
    
    return NextResponse.json({
      success: true,
      data: { claim: updatedClaim },
      message: 'Claim updated successfully',
    });
    
  } catch (error) {
    console.error('Error updating claim:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/insurance/claims/[id]
 * 删除申报（仅草稿状态可删除）
 */
export async function DELETE(
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
    
    // 获取现有申报
    const existingClaim = claimsDB.get(id);
    
    if (!existingClaim) {
      return NextResponse.json(
        { error: 'Claim not found' },
        { status: 404 }
      );
    }
    
    // 检查状态是否允许删除
    if (existingClaim.metadata.status !== 'draft') {
      return NextResponse.json(
        { error: 'Only draft claims can be deleted' },
        { status: 409 }
      );
    }
    
    // 删除申报
    claimsDB.delete(id);
    
    return NextResponse.json({
      success: true,
      message: 'Claim deleted successfully',
    });
    
  } catch (error) {
    console.error('Error deleting claim:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
