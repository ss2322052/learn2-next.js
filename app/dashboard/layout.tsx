import SideNav from '@/app/ui/dashboard/sidenav';
import { Metadata } from 'next';
import { auth } from '@/auth'; // NextAuth.js の認証関数

export const experimental_ppr = true;

// 1. default function Layout に async を追加し、ユーザー名取得ロジックを挿入
export default async function Layout({ children }: { children: React.ReactNode }) {
  // 認証セッションを取得
  const session = await auth(); 

  // セッションからユーザー名を取得。セッションがない、または名前にアクセスできない場合は「ゲスト」
  const userName = session?.user?.name || 'ゲスト'; 

  return (
    <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
      <div className="w-full flex-none md:w-64">
        <SideNav />
      </div>
      <div className="flex-grow p-6 md:overflow-y-auto md:p-12">
        <h1 className="mb-4 text-2xl font-bold">ようこそ、{userName}さん！</h1>
        {children}
      </div>
    </div>
  );
}

export const metadata: Metadata = {
  title: {
    template: '%s | Acme Dashboard',
    default: 'Acme Dashboard',
  },
  description: 'The official Next.js Course Dashboard, built with App Router.',
  metadataBase: new URL('https://next-learn-dashboard.vercel.sh'),
};