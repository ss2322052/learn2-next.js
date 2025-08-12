import Pagination from '@/app/ui/invoices/pagination';
import Search from '@/app/ui/search';
import Table from '@/app/ui/users/table';
import { InvoicesTableSkeleton } from '@/app/ui/skeletons';
import { Suspense } from 'react';
import { fetchUsersPages } from '@/app/lib/data';
import { Metadata } from 'next';


// 削除機能のために必要なインポート
import { deleteUser } from '@/app/lib/actions'; 
import { Button } from '@/app/ui/button'; 

// ページのメタデータを設定
export const metadata: Metadata = {
  title: 'Users',
};

// ページのメインコンポーネント
export default async function Page({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    page?: string;
  };
}) {
  const query = searchParams?.query || '';
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