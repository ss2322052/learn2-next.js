// src/app/ui/dashboard/revenue-chart.tsx

import { generateYAxis } from '@/app/lib/utils';
import { CalendarIcon } from '@heroicons/react/24/outline';
import { lusitana } from '@/app/ui/fonts';
import { Revenue } from '@/app/lib/definitions'; // Revenueの型定義をインポート
// import { fetchRevenue } from '@/app/lib/data'; // ★★★ ここは削除 ★★★

// ★★★ 追加: RevenueChart コンポーネントが受け取るPropsの型定義 ★★★
interface RevenueChartProps {
  revenue: Revenue[]; // Revenue 型の配列を受け取ることを明示
}

// ★★★ 修正: propsとして revenue を受け取るように変更 ★★★
export default function RevenueChart({ revenue }: RevenueChartProps) {
  // const revenue = await fetchRevenue(); // ★★★ ここは削除 ★★★
  // コンポーネントはもう自分でデータを取得しない

  const chartHeight = 350;
  const { yAxisLabels, topLabel } = generateYAxis(revenue); // 渡された revenue を使う

  if (!revenue || revenue.length === 0) {
    return (
      <div className="flex w-full items-center justify-center h-[350px]">
        <p className="mt-4 text-gray-400">No data available.</p>
      </div>
    );
  }

  return (
    <div className="w-full md:col-span-4">
      <h2 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        Recent Revenue
      </h2>
      <div className="rounded-xl bg-gray-50 p-4">
        <div className="sm:grid-cols-13 mt-0 grid grid-cols-12 items-end gap-2 rounded-md bg-white p-4 md:gap-4">
          <div
            className="mb-6 hidden flex-col justify-between text-sm text-gray-400 sm:flex"
            style={{ height: `${chartHeight}px` }}
          >
            {yAxisLabels.map((label) => (
              <p key={label}>{label}</p>
            ))}
          </div>

          {revenue.map((month) => (
            <div key={month.month} className="flex flex-col items-center gap-2">
              <div
                className="w-full rounded-md bg-blue-300"
                style={{
                  height: `${(chartHeight / topLabel) * month.revenue}px`,
                }}
              ></div>
              <p className="-rotate-90 text-sm text-gray-400 sm:rotate-0">
                {month.month}
              </p>
            </div>
          ))}
        </div>
        <div className="flex items-center pb-2 pt-6">
          <CalendarIcon className="h-5 w-5 text-gray-500" />
          <h3 className="ml-2 text-sm text-gray-500 ">Last 12 months</h3>
        </div>
      </div>
    </div>
  );
}