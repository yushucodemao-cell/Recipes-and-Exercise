# 好吃好练

你和室友的每周食谱规划 + 健康运动记录应用。手机浏览器打开即可使用，支持添加到主屏幕。

## 功能

- **食材驱动食谱**：勾选本周食材，自动生成一周菜单
- **分场景采购**：周五线下大采购 + 周中线上补货，一键复制清单
- **每日记录**：体重、情绪、经期、睡眠、运动
- **隐私控制**：健康/运动记录默认室友可见，可勾选「仅自己可见」
- **双人云端同步**：不同设备实时同步

## 快速开始（只需 3 步）

### 第 1 步：创建 Supabase 项目（免费）

1. 打开 [https://supabase.com](https://supabase.com)，注册账号
2. 点击 **New Project**，取名 `haochi-haolian`，设置数据库密码
3. 项目创建完成后，进入 **Settings → API**，复制：
   - `Project URL`
   - `anon public` key

### 第 2 步：初始化数据库

1. 在 Supabase 控制台打开 **SQL Editor**
2. 把 `supabase/schema.sql` 文件的全部内容粘贴进去
3. 点击 **Run** 执行

4. **关闭邮箱验证**（方便快速注册）：进入 **Authentication → Providers → Email**，关闭 **Confirm email**

### 第 3 步：部署到 Vercel（免费）

1. 把本项目文件夹上传到 GitHub（或用 Git 推送）
2. 打开 [https://vercel.com](https://vercel.com)，用 GitHub 登录
3. 点击 **Import**，选择这个仓库
4. 在 **Environment Variables** 中添加：

   | 变量名 | 值 |
   |--------|-----|
   | `NEXT_PUBLIC_SUPABASE_URL` | 你的 Supabase Project URL |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | 你的 Supabase anon key |

5. 点击 **Deploy**，等 1-2 分钟
6. 部署完成后会得到一个网址，如 `https://haochi-haolian.vercel.app`

### 在手机上使用

1. 用手机浏览器打开部署好的网址
2. **iPhone**：Safari → 分享 → 「添加到主屏幕」
3. **Android**：Chrome → 菜单 → 「添加到主屏幕」

## 使用流程

### 第一次使用

1. 你注册账号 → 创建室友空间 → 记下邀请码
2. 室友注册账号 → 加入室友空间 → 输入邀请码
3. 两人开始用！

### 每周食谱

1. 打开「食谱」页，勾选本周想吃的食材
2. 点击「生成食谱」→ 自动分配一周菜单
3. 打开「采购」页查看两份清单：
   - **周五大采购**：米面、调料、耐储存食材
   - **周中线上补货**：牛奶、绿叶菜等易坏食材
4. 点击「复制清单」，粘贴到备忘录或购物 App

### 每日记录

1. 打开「记录」页，填写今天的数据
2. 健康/运动默认室友可见
3. 不想分享的内容，勾选「仅自己可见」

### 查看状态

「状态」页可看到室友本周的体重趋势、运动次数等（私密记录不会显示）。

## 本地开发（可选）

需要安装 [Node.js](https://nodejs.org/)（LTS 版本）：

```bash
npm install
cp .env.local.example .env.local
# 编辑 .env.local 填入 Supabase 配置
npm run dev
```

浏览器打开 http://localhost:3000

## 部署到 GitHub Pages（免费）

GitHub Pages 可以免费托管公开仓库的静态站点。本项目已配置 GitHub Actions，推送到 `main` 分支后会自动构建并发布到 Pages。

### 1. 准备 Supabase

按上面的“快速开始”完成 Supabase 项目创建、执行 `supabase/schema.sql`、关闭邮箱验证。

### 2. 上传到 GitHub

如果这是新仓库：

```bash
git init
git add .
git commit -m "Initial GitHub Pages deployment"
git branch -M main
git remote add origin https://github.com/你的用户名/你的仓库名.git
git push -u origin main
```

### 3. 配置 GitHub Pages

进入 GitHub 仓库：

1. 打开 **Settings → Pages**
2. 在 **Build and deployment** 中选择 **Source: GitHub Actions**

### 4. 配置 Supabase 环境变量

进入 **Settings → Secrets and variables → Actions → New repository secret**，添加：

| Secret 名 | 值 |
|----------|-----|
| `NEXT_PUBLIC_SUPABASE_URL` | 你的 Supabase Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | 你的 Supabase anon key |

添加完成后，进入 **Actions**，重新运行 `Deploy to GitHub Pages`，或重新 push 一次代码。

### 5. 访问地址

如果仓库名是 `haochi-haolian`，部署完成后一般是：

```text
https://你的用户名.github.io/haochi-haolian/
```

如果仓库名是 `你的用户名.github.io`，部署完成后一般是：

```text
https://你的用户名.github.io/
```

## 内置数据

创建空间时会自动导入 **61 种** 你们常吃的食材和 **35 道** 家常菜，后续可在数据库中自行添加。

## 技术栈

- Next.js 15 + React 19 + Tailwind CSS
- Supabase（认证 + 数据库 + 行级安全）
- 部署：Vercel
