// app/dashboard/users/page.tsx

import Pagination from '@/app/ui/invoices/pagination';
import Search from '@/app/ui/search';
import Table from '@/app/ui/users/table';
import { InvoicesTableSkeleton } from '@/app/ui/skeletons';
import { Suspense } from 'react';
import { fetchUsersPages } from '@/app/lib/data';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Users',
};

// Next.jsのPagePropsに合うように、paramsも含めて型を定義する
interface PageProps {
  // 動的ルートパラメータ。使用しない場合でも含める。
  params: { [key: string]: string | string[] };
  // URLのクエリパラメータ
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function Page({
  searchParams,
}: PageProps) {
  // searchParamsは常に存在するため、?.は不要
  const query = (searchParams.query as string) || '';
  const currentPage = Number(searchParams.page) || 1;

  const totalPages = await fetchUsersPages(query);

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`text-2xl`}>Users</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Search users..." />
      </div>
      <Suspense key={query + currentPage} fallback={<InvoicesTableSkeleton />}>
        <Table query={query} currentPage={currentPage} />
      </Suspense>
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
}