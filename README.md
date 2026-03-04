# CareVoyage & MediPanda 网站项目

## 📋 项目信息

| 项目 | 详情 |
|:---|:---|
| **项目名称** | CareVoyage + MediPanda 医疗旅游双品牌网站 |
| **技术栈** | Next.js 14 + TypeScript + Tailwind CSS |
| **部署平台** | Vercel (Hobby免费版) |
| **支付方式** | Stripe Hong Kong (香港公司) |
| **域名** | carevoyageglobal.com + medipandachina.com |
| **设计师** | 小K (Kimi 2.5) |
| **创建日期** | 2026-03-04 |

## 🎨 设计规范

### CareVoyage (高端品牌)
- **风格**: 科技极简风
- **主色调**: 深蓝 #1E3A5F + 草绿 #7CB342 + 香槟金 #C9A227
- **目标客群**: 欧美高净值人群
- **核心卖点**: 极致时效 + 顶级医院 + 三人管家

### MediPanda (大众品牌)
- **风格**: 温馨家庭风
- **主色调**: 翠绿 #4CAF50 + 珊瑚橙 #FF8A65
- **目标客群**: 东南亚中产阶级
- **核心卖点**: 高性价比 + 家庭套餐 + 熊猫协调官

## 🚀 快速开始

### 1. 安装依赖
```bash
cd carevoyage-medipanda-web
pnpm install
```

### 2. 本地开发
```bash
# 启动CareVoyage (Port 3000)
pnpm --filter carevoyage dev

# 启动MediPanda (Port 3001)
pnpm --filter medipanda dev
```

### 3. 构建部署
```bash
pnpm build
```

## 📁 文件结构

```
carevoyage-medipanda-web/
├── apps/
│   ├── carevoyage/          # 高端品牌站
│   │   ├── app/
│   │   │   ├── components/  # React组件
│   │   │   ├── page.tsx     # 首页
│   │   │   └── layout.tsx   # 布局
│   │   └── package.json
│   └── medipanda/           # 大众品牌站
├── packages/               # 共享包
├── DEPLOY.md              # 部署指南
└── README.md              # 本文件
```

## 🌍 多语言支持

| 语言 | CareVoyage | MediPanda |
|:---|:---:|:---:|
| 🇺🇸 English | ✅ | ✅ |
| 🇹🇼 繁體中文 | ✅ | ✅ |
| 🇹🇭 ไทย | ✅ | ✅ |
| 🇫🇷 Français | ✅ | ❌ |
| 🇩🇪 Deutsch | ✅ | ❌ |
| 🇵🇹 Português | ✅ | ❌ |
| 🇪🇸 Español | ✅ | ❌ |
| 🇲🇾 Melayu | ❌ | ✅ |
| 🇮🇩 Indonesia | ❌ | ✅ |
| 🇻🇳 Tiếng Việt | ❌ | ✅ |
| 🇵🇭 Filipino | ❌ | ✅ |

## 💳 支付配置

### Stripe Hong Kong (主支付)
- 香港公司注册
- 支持全球信用卡
- 费率: 3.4-4.4% + HK$2.35
- 提现至香港银行: 免费

### PayPal Hong Kong (备用)
- 国际通用
- 费率: 4.4% + 固定费用

## 📞 联系方式

- **邮箱**: concierge@carevoyageglobal.com
- **电话**: +852 1234 5678
- **地址**: Hong Kong SAR, China

## 📝 后续待办

- [ ] 完成MediPanda组件开发
- [ ] 添加Stripe支付组件
- [ ] 创建会员系统
- [ ] 添加后台管理面板
- [ ] SEO优化
- [ ] 性能优化 (Lighthouse > 90)

## ⚖️ 许可证

Private - 内部使用

---

**注意**: 本项目代码由小K (Kimi 2.5) 生成，部署前请进行充分测试。
