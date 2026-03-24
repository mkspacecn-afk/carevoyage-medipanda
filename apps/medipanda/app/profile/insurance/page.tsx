/**
 * Insurance Claims List Page
 * 保险申报列表页
 * 
 * Route: /profile/insurance
 */

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  FileText, 
  Plus, 
  Eye, 
  Download, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  XCircle,
  ChevronRight,
  Filter,
  Search,
  RefreshCw
} from 'lucide-react';
import type { ClaimListItem, ClaimStatus, InsuranceProvider } from '@/lib/insurance/types/insurance-claim';

// 状态配置
const STATUS_CONFIG: Record<ClaimStatus, { label: string; color: string; icon: React.ReactNode }> = {
  draft: { 
    label: '草稿', 
    color: 'bg-slate-100 text-slate-600', 
    icon: <FileText className="w-4 h-4" /> 
  },
  'pending-docs': { 
    label: '待补充资料', 
    color: 'bg-amber-100 text-amber-700', 
    icon: <AlertCircle className="w-4 h-4" /> 
  },
  ready: { 
    label: '待提交', 
    color: 'bg-blue-100 text-blue-700', 
    icon: <CheckCircle className="w-4 h-4" /> 
  },
  submitted: { 
    label: '已提交', 
    color: 'bg-purple-100 text-purple-700', 
    icon: <Clock className="w-4 h-4" /> 
  },
  acknowledged: { 
    label: '已受理', 
    color: 'bg-cyan-100 text-cyan-700', 
    icon: <CheckCircle className="w-4 h-4" /> 
  },
  approved: { 
    label: '已批准', 
    color: 'bg-green-100 text-green-700', 
    icon: <CheckCircle className="w-4 h-4" /> 
  },
  rejected: { 
    label: '已拒赔', 
    color: 'bg-red-100 text-red-700', 
    icon: <XCircle className="w-4 h-4" /> 
  },
};

// 保险公司配置
const PROVIDER_CONFIG: Record<InsuranceProvider, { name: string; nameCn: string; color: string }> = {
  cigna: { name: 'Cigna', nameCn: '信諾保險', color: 'bg-teal-500' },
  axa: { name: 'AXA', nameCn: '安盛保險', color: 'bg-blue-600' },
  allianz: { name: 'Allianz', nameCn: '安聯保險', color: 'bg-blue-800' },
  other: { name: 'Other', nameCn: '其他保險', color: 'bg-slate-500' },
};

// 货币符号
const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: '$',
  EUR: '€',
  CNY: '¥',
  SGD: 'S$',
  HKD: 'HK$',
};

export default function InsuranceClaimsPage() {
  const router = useRouter();
  const [claims, setClaims] = useState<ClaimListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<ClaimStatus | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [stats, setStats] = useState({
    total: 0,
    draft: 0,
    submitted: 0,
    approved: 0,
  });

  // 获取申报列表
  useEffect(() => {
    fetchClaims();
  }, [filter]);

  const fetchClaims = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/insurance/claims?status=${filter !== 'all' ? filter : ''}`);
      
      if (!response.ok) {
        if (response.status === 401) {
          // 未登录，重定向到登录页
          router.push('/auth/signin');
          return;
        }
        throw new Error('Failed to fetch claims');
      }
      
      const result = await response.json();
      
      if (result.success) {
        setClaims(result.data.items);
        
        // 计算统计
        const allClaims = result.data.items;
        setStats({
          total: result.data.pagination.total,
          draft: allClaims.filter((c: ClaimListItem) => c.status === 'draft').length,
          submitted: allClaims.filter((c: ClaimListItem) => ['submitted', 'acknowledged'].includes(c.status)).length,
          approved: allClaims.filter((c: ClaimListItem) => c.status === 'approved').length,
        });
      }
    } catch (error) {
      console.error('Error fetching claims:', error);
      // 显示错误提示
      setClaims([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchClaims();
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('zh-CN', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const formatCurrency = (amount: number, currency: string) => {
    const symbol = CURRENCY_SYMBOLS[currency] || currency;
    return `${symbol}${amount.toLocaleString()}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F0FDFA] via-white to-[#F0FDFA]">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* 页面标题 */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-4">
            <Link href="/profile" className="hover:text-teal-600">會員中心</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-slate-800">保險申報</span>
          </div>
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">保險申報管理</h1>
              <p className="text-slate-500 mt-1">管理您的醫療保險預授權和理賠申報</p>
            </div>
            
            <Link
              href="/profile/insurance/new"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-teal-200 transition-all"
            >
              <Plus className="w-5 h-5" />
              新建申報
            </Link>
          </div>
        </div>

        {/* 统计卡片 */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: '全部申報', value: stats.total, color: 'bg-teal-500' },
            { label: '草稿', value: stats.draft, color: 'bg-slate-500' },
            { label: '處理中', value: stats.submitted, color: 'bg-blue-500' },
            { label: '已批准', value: stats.approved, color: 'bg-green-500' },
          ].map((stat) => (
            <div 
              key={stat.label}
              className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm"
            >
              <div className={`w-3 h-3 rounded-full ${stat.color} mb-3`} />
              <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
              <div className="text-sm text-slate-500">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* 过滤器和搜索 */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center gap-4">
            {/* 状态过滤 */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0">
              <Filter className="w-4 h-4 text-slate-400 flex-shrink-0" />
              {[
                { value: 'all', label: '全部' },
                { value: 'draft', label: '草稿' },
                { value: 'ready', label: '待提交' },
                { value: 'submitted', label: '已提交' },
                { value: 'approved', label: '已批准' },
                { value: 'rejected', label: '已拒赔' },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => setFilter(option.value as ClaimStatus | 'all')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                    filter === option.value
                      ? 'bg-teal-50 text-teal-700 border border-teal-200'
                      : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>

            {/* 搜索框 */}
            <form onSubmit={handleSearch} className="flex-1 lg:max-w-sm">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="搜索患者姓名..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-teal-500"
                />
              </div>
            </form>

            {/* 刷新按钮 */}
            <button
              onClick={fetchClaims}
              className="p-2 text-slate-400 hover:text-teal-600 transition-colors"
              title="刷新列表"
            >
              <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* 申报列表 */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-12 text-center">
              <div className="inline-block w-8 h-8 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-slate-500 mt-4">加載中...</p>
            </div>
          ) : claims.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-medium text-slate-900 mb-2">暫無申報記錄</h3>
              <p className="text-slate-500 mb-6">開始創建您的第一個保險申報</p>
              <Link
                href="/profile/insurance/new"
                className="inline-flex items-center gap-2 px-6 py-3 bg-teal-600 text-white rounded-xl font-medium hover:bg-teal-700 transition-colors"
              >
                <Plus className="w-5 h-5" />
                新建申報
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {claims.map((claim) => {
                const status = STATUS_CONFIG[claim.status];
                const provider = PROVIDER_CONFIG[claim.provider];
                
                return (
                  <div 
                    key={claim.id}
                    className="p-6 hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                      {/* 保险公司 */}
                      <div className="flex items-center gap-3 lg:w-48">
                        <div className={`w-10 h-10 ${provider.color} rounded-lg flex items-center justify-center text-white font-bold text-sm`}>
                          {provider.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-medium text-slate-900">{provider.nameCn}</div>
                          <div className="text-xs text-slate-500">{provider.name}</div>
                        </div>
                      </div>

                      {/* 申报信息 */}
                      <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 gap-4">
                        <div>
                          <div className="text-xs text-slate-500 mb-1">患者姓名</div>
                          <div className="font-medium text-slate-900">{claim.patientName}</div>
                        </div>
                        
                        <div>
                          <div className="text-xs text-slate-500 mb-1">就診日期</div>
                          <div className="font-medium text-slate-900">{formatDate(claim.serviceDate)}</div>
                        </div>
                        
                        <div>
                          <div className="text-xs text-slate-500 mb-1">申報金額</div>
                          <div className="font-medium text-slate-900">{formatCurrency(claim.totalAmount, claim.currency)}</div>
                        </div>
                        
                        <div>
                          <div className="text-xs text-slate-500 mb-1">創建時間</div>
                          <div className="font-medium text-slate-900">{formatDate(claim.createdAt)}</div>
                        </div>
                      </div>

                      {/* 状态和操作 */}
                      <div className="flex items-center gap-4 lg:justify-end">
                        <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${status.color}`}>
                          {status.icon}
                          {status.label}
                        </div>
                        
                        <div className="flex items-center gap-2">
                          {claim.attachmentCount > 0 && (
                            <span className="text-xs text-slate-500">
                              {claim.attachmentCount} 個附件
                            </span>
                          )}
                          
                          <Link
                            href={`/profile/insurance/${claim.id}`}
                            className="p-2 text-slate-400 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-colors"
                            title="查看詳情"
                          >
                            <Eye className="w-5 h-5" />
                          </Link>
                          
                          {claim.status === 'ready' && (
                            <button
                              className="p-2 text-slate-400 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-colors"
                              title="下載 PDF"
                            >
                              <Download className="w-5 h-5" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* 帮助信息 */}
        <div className="mt-8 bg-gradient-to-r from-teal-50 to-blue-50 rounded-2xl p-6 border border-teal-100">
          <h3 className="font-medium text-slate-900 mb-2">💡 需要幫助？</h3>
          <p className="text-sm text-slate-600">
            如果您在填寫保險申報時遇到問題，請聯繫我們的客服團隊。
            <Link href="/contact" className="text-teal-600 hover:underline">聯繫客服 →</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
