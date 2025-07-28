import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { authConfig } from './auth.config';
import { z } from 'zod';
import postgres from 'postgres';
import type { User } from '@/app/lib/definitions';
import bcrypt from 'bcrypt';

// ここにpostgresクライアントの初期化を追加します
const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

async function getUser(email: string): Promise<User | undefined> {
  try {
    const user = await sql<User[]>`SELECT * FROM users WHERE email=${email}`;
    return user[0]; 
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw new Error('Failed to fetch user.');
  }
}

export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);

         if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;
          const user = await getUser(email);
          if (!user) return null;
          const passwordsMatch = await bcrypt.compare(password, user.password);

          if (passwordsMatch) return user;
        }

        console.log('Invalid credentials');
        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) { // token (現在のJWT) と user (認証成功時のユーザーデータ) を引数にとる
      if (user) { // userオブジェクトは、ユーザーが正常にログインした時（`authorize` 関数から返された時）にのみ存在する
        token.id = user.id;     // 認証されたユーザーのIDをJWTに追加
        token.name = user.name; //  認証されたユーザーの「名前」をJWTに追加、これがUIに表示する名前の元になる
        token.email = user.email; // 認証されたユーザーのメールアドレスをJWTに追加
      }
      return token; // 更新されたtokenオブジェクトを返し、このtokenはセッション作成に使用
    },
    async session({ session, token }) {
      if (token) { // もしJWTトークンがあれば、中の情報をセッションにコピーする
        session.user.id = token.id as string;     // トークンのIDをセッションのユーザーIDに設定
        session.user.name = token.name as string; // トークンの名前をセッションのユーザー名に設定（これが表示される名前）
        session.user.email = token.email as string; // トークンのメールアドレスをセッションのメールアドレスに設定
      }
      return session; // アプリが使う最終的なユーザー情報（セッション）を返す
    },
  },
});