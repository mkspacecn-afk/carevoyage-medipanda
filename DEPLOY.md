# CareVoyage & MediPanda 网站部署指南

## 📦 项目结构

```
carevoyage-medipanda-web/
├── apps/
│   ├── carevoyage/          # 高端品牌站 (Port 3000)
│   │   ├── app/            # Next.js 14 App Router
│   │   │   ├── components/ # React组件
│   │   │   ├── page.tsx    # 首页
│   │   │   └── layout.tsx  # 根布局
│   │   └── package.json
│   └── medipanda/           # 大众品牌站 (Port 3001)
│       └── [结构同上]
├── packages/               # 共享包
│   ├── ui/                # UI组件库
│   └── i18n/              # 多语言配置
├── turbo.json             # Monorepo配置
└── package.json           # 根配置
```

## 🚀 部署步骤

### 1. 推送代码到GitHub

```bash
# 在本地终端执行
cd /Users/mkspace/.openclaw/workspace/carevoyage-medipanda-web

# 初始化Git仓库
git init
git add .
git commit -m "Initial commit: CareVoyage & MediPanda websites"

# 创建GitHub仓库并推送
git remote add origin https://github.com/mkspace-cn/carevoyage-medipanda.git
git branch -M main
git push -u origin main
```

### 2. Vercel部署

**登录Vercel:**
- 网址: https://vercel.com
- 账号: mkspace.cn@gmail.com
- 密码: sunjing2020

**连接GitHub:**
1. 登录后点击 "Add New Project"
2. 选择 "Import Git Repository"
3. 授权GitHub访问
4. 选择 `carevoyage-medipanda` 仓库

**配置项目:**
```
Project Name: carevoyage-medipanda
Framework Preset: Next.js
Root Directory: apps/carevoyage  (先部署CareVoyage)
Build Command: turbo run build
Install Command: pnpm install
```

**部署MediPanda (第二个项目):**
1. 再次点击 "Add New Project"
2. 选择同一个GitHub仓库
3. Root Directory: apps/medipanda
4. 其他配置相同

### 3. 自定义域名配置

**CareVoyage:**
1. 在Vercel项目设置中找到 "Domains"
2. 添加: `carevoyageglobal.com`
3. 记录类型: CNAME
4. 值: `cname.vercel-dns.com`
5. 去Cloudflare添加对应DNS记录

**MediPanda:**
1. 同样在Vercel添加: `medipandachina.com`
2. DNS记录相同方式配置

### 4. Stripe支付配置 (香港公司)

**注册Stripe香港账户:**
1. 访问: https://dashboard.stripe.com/register
2. 选择: Hong Kong
3. 业务类型: Company
4. 填写香港公司信息 (CI + BR)
5. 绑定香港银行账户

**获取API Keys:**
- Publishable key: `pk_live_...` (前端用)
- Secret key: `sk_live_...` (后端用)

**配置环境变量 (Vercel):**
```
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

## 🌐 多语言配置

**已配置语言:**
- CareVoyage: 英语, 繁中, 法语, 德语, 葡萄牙语, 西班牙语, 泰语
- MediPanda: 英语, 繁中, 泰语, 马来语, 印尼语, 越南语, 菲律宾语

**添加新语言:**
1. 在 `next.config.js` 的 `i18n.locales` 中添加
2. 在 `public/locales/` 下创建语言文件
3. 更新语言切换组件

## 🔐 环境变量清单

```env
# 必需
NEXT_PUBLIC_SITE_URL=https://carevoyageglobal.com
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...

# 可选 (分析/监控)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_HOTJAR_ID=XXXXXXXX
```

## 📱 测试清单

**功能测试:**
- [ ] 首页正常显示
- [ ] 语言切换正常
- [ ] 移动端响应式
- [ ] 医院选择功能
- [ ] 预约表单提交
- [ ] Stripe测试支付

**性能测试:**
- [ ] Lighthouse评分 > 90
- [ ] 首屏加载 < 3秒
- [ ] 图片懒加载正常

## 🆘 故障排除

**部署失败?**
1. 检查Node版本: `node -v` (需要 >= 18)
2. 检查pnpm: `pnpm -v` (需要 >= 8)
3. 查看Vercel部署日志

**支付失败?**
1. 确认Stripe账户已激活
2. 检查API Keys是否正确
3. 查看Stripe Dashboard日志

**域名不生效?**
1. DNS传播需要5-48小时
2. 检查Cloudflare DNS记录
3. 确认SSL证书已颁发

## 📞 联系支持

**技术问题:** 小K (Kimi 2.5)
**部署问题:** Vercel Support (vercel.com/support)
**支付问题:** Stripe Support (stripe.com/support)

---

**部署状态:** 🟡 代码生成中 (70%)
**预计完成:** 1小时内
**下一步:** 完成MediPanda代码 → 生成部署包 → 指导部署

生成日期: 2026-03-04
版本: v1.0.0
