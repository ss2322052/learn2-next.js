/** @type {import('next').NextConfig} */
const nextConfig = {
  // ここにリダイレクト設定を追加します
  async redirects() {
    return [
      {
        source: '/', // ルートURL (例: your-vercel-app.vercel.app/) にアクセスがあった場合
        destination: '/dashboard', // /dashboard にリダイレクトする
        permanent: true, // このリダイレクトは恒久的なものとしてブラウザにキャッシュさせる
      },
    ];
  },
  /* config options here */ // 他に既存の設定がある場合は、このコメントの代わりに記述してください
};

module.exports = nextConfig;