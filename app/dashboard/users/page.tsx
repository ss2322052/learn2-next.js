import Pagination from '@/app/ui/invoices/pagination';
import Search from '@/app/ui/search';
import Table from '@/app/ui/users/table';
import { InvoicesTableSkeleton } from '@/app/ui/skeletons';
import { Suspense } from 'react';
import { fetchUsersPages } from '@/app/lib/data';
import { Metadata } from 'next';

// ページのメタデータを設定
export const metadata: Metadata = {
  title: 'Users',
};

// Next.jsのsearchParamsの型を手動で定義
type SearchParams = {
  [key: string]: string | string[] | undefined;
};

// PageコンポーネントのPropsの型を定義
type PageProps = {
  params?: { [key: string]: string | string[] | undefined };
  searchParams: SearchParams;
};

// ページのメインコンポーネント
export default async function Page({ searchParams }: PageProps) {
  const query = (searchParams?.query as string) || '';
  const currentPage = Number(searchParams?.page) || 1;

  // ページネーションの総ページ数を取得
  const totalPages = await fetchUsersPages(query);

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`text-2xl`}>Users</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        {/* ユーザー検索コンポーネント */}
        <Search placeholder="Search users..." />
      </div>
      {/* ユーザーテーブルコンポーネント */}
      <Suspense key={query + currentPage} fallback={<InvoicesTableSkeleton />}>
        <Table query={query} currentPage={currentPage} />
      </Suspense>
      {/* ページネーションコンポーネント */}
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
}