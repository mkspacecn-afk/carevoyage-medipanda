/**
 * Insurance Claims API Routes
 * /api/insurance/claims
 * 
 * GET: 获取申报列表
 * POST: 创建新申报
 */

export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import type { 
  InsuranceClaim, 
  CreateClaimRequest, 
  ClaimListItem,
  ClaimStatus 
} from '@/lib/insurance/types/insurance-claim';
import { validateCreateRequest } from '@/lib/insurance/validators/claim-validator';

/**
 * 模拟数据库
 */
const claimsDB: Map<string, InsuranceClaim> = new Map();

/**
 * 获取当前用户（简化版，后续接入真实认证）
 */
async function getCurrentUser() {
  // TODO: 接入真实 Supabase Auth
  return { id: 'mock-user-id', email: 'user@example.com' };
}

/**
 * 将完整申报转换为列表项
 */
function toListItem(claim: InsuranceClaim): ClaimListItem {
  return {
    id: claim.id,
    provider: claim.insurance.provider,
    claimType: claim.medicalEvent.type,
    patientName: claim.patient.name,
    serviceDate: claim.medicalEvent.serviceDate,
    totalAmount: claim.financial.totalAmount,
    currency: claim.financial.currency,
    status: claim.metadata.status,
    createdAt: claim.metadata.createdAt,
    attachmentCount: claim.attachments.length,
  };
}

/**
 * GET /api/insurance/claims
 * 获取申报列表
 * 
 * Query Parameters:
 * - status: 状态过滤
 * - provider: 保险公司过滤
 * - page: 页码（默认1）
 * - limit: 每页数量（默认10）
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    // 验证用户身份
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const { searchParams } = new URL(request.url);
    
    // 获取查询参数
    const status = searchParams.get('status') as ClaimStatus | null;
    const provider = searchParams.get('provider');
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    
    // 从内存数据库查询（TODO: 接入真实 Supabase）
    let claims = Array.from(claimsDB.values());
    
    // 应用过滤器
    if (status) {
      claims = claims.filter(c => c.metadata.status === status);
    }
    
    if (provider) {
      claims = claims.filter(c => c.insurance.provider === provider);
    }
    
    // 按创建时间排序
    claims.sort((a, b) => new Date(b.metadata.createdAt).getTime() - new Date(a.metadata.createdAt).getTime());
    
    // 分页
    const total = claims.length;
    const startIndex = (page - 1) * limit;
    const paginatedClaims = claims.slice(startIndex, startIndex + limit);
    
    // 转换为列表项格式
    const items = paginatedClaims.map(toListItem);
    
    return NextResponse.json({
      success: true,
      data: {
        items,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
    });
    
  } catch (error) {
    console.error('Error fetching claims:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/insurance/claims
 * 创建新申报
 * 
 * Body: CreateClaimRequest
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // 验证用户身份
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const body = await request.json() as CreateClaimRequest & { claimType: string };
    
    // 验证必需字段
    if (!body.insurance?.provider) {
      return NextResponse.json(
        { error: 'Missing required field: insurance.provider' },
        { status: 400 }
      );
    }
    
    // 验证数据
    const validation = validateCreateRequest(
      body,
      body.insurance.provider,
      (body.claimType as 'pre-auth' | 'claim') || 'claim'
    );
    
    if (!validation.isValid) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: validation.errors,
          missingFields: validation.missingRequiredFields,
        },
        { status: 422 }
      );
    }
    
    // 创建申报数据（使用内存数据库，TODO: 接入真实 Supabase）
    const now = new Date().toISOString();
    const claimId = `claim-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const newClaim: InsuranceClaim = {
      id: claimId,
      userId: user.id,
      insurance: {
        provider: body.insurance.provider,
        policyNumber: body.insurance.policyNumber,
        memberId: body.insurance.memberId,
        groupNumber: body.insurance.groupNumber,
        planName: body.insurance.planName,
      },
      patient: body.patient,
      medicalEvent: {
        ...body.medicalEvent,
        type: (body.claimType as 'pre-auth' | 'claim' | 'emergency') || 'claim',
      },
      diagnosis: body.diagnosis,
      treatments: body.treatments || [],
      financial: body.financial,
      attachments: [],
      metadata: {
        createdAt: now,
        updatedAt: now,
        submittedBy: user.id,
        status: 'draft',
      },
    };
    
    claimsDB.set(claimId, newClaim);
    
    return NextResponse.json(
      {
        success: true,
        data: {
          claim: toListItem(newClaim),
        },
        message: 'Claim created successfully',
      },
      { status: 201 }
    );
    
  } catch (error) {
    console.error('Error creating claim:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
