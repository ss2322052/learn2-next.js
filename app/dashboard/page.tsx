// ./app/dashboard/page.tsx

import { Card } from '@/app/ui/dashboard/cards';
import RevenueChart from '@/app/ui/dashboard/revenue-chart';
import LatestInvoices from '@/app/ui/dashboard/latest-invoices';
import { lusitana } from '@/app/ui/fonts';
// ★★★ 修正: fetchCardDataだけでなく、fetchRevenueもインポートする ★★★
import { fetchCardData, fetchRevenue } from '@/app/lib/data';
import { Suspense } from 'react';
import {
  RevenueChartSkeleton,
  LatestInvoicesSkeleton,
  CardsSkeleton,
} from '@/app/ui/skeletons';
 
export default async function Page() {
  // Cardコンポーネント用のデータは親コンポーネントで取得
  const {
    numberOfInvoices,
    numberOfCustomers,
    totalPaidInvoices,
    totalPendingInvoices,
  } = await fetchCardData();

  // ★★★ 追加: RevenueChartコンポーネント用のデータを取得する ★★★
  const revenue = await fetchRevenue();
 
  return (
    <main>
      <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        Dashboard
      </h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {/* カードの読み込み中にスケルトンを表示 */}
        <Suspense fallback={<CardsSkeleton />}>
          <Card title="Collected" value={totalPaidInvoices} type="collected" />
          <Card title="Pending" value={totalPendingInvoices} type="pending" />
          <Card title="Total Invoices" value={numberOfInvoices} type="invoices" />
          <Card
            title="Total Customers"
            value={numberOfCustomers}
            type="customers"
          />
        </Suspense>
      </div>
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
        {/* グラフの読み込み中にスケルトンを表示 */}
        <Suspense fallback={<RevenueChartSkeleton />}>
          {/* ★★★ 修正: RevenueChartに revenue={revenue} を渡す ★★★ */}
          <RevenueChart revenue={revenue} />
        </Suspense>
        {/* 請求書リストの読み込み中にスケルトンを表示 */}
        <Suspense fallback={<LatestInvoicesSkeleton />}>
          <LatestInvoices />
        </Suspense>
      </div>
    </main>
  );
}