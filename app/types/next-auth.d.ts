import { DefaultSession, DefaultJWT, DefaultUser } from "next-auth"; 

declare module "next-auth" {
  interface Session {
    user: {
      id: string; 
      name?: string | null; 
      email?: string | null;
      image?: string | null;
      role: string; 
    } & DefaultSession["user"]; 
  }

  interface JWT extends DefaultJWT {
    id: string; 
    name?: string | null; 
    email?: string | null;
    role: string;
  }

  interface User extends DefaultUser { 
    role: string; 
  }
}

declare module "@auth/core/types" { 
  interface Session {
    user?: {
      id?: string; 
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role: string;
    } & DefaultSession["user"]; 
  }
}

declare module "next-auth/providers/credentials" {
  import { User as DBUser } from './app/lib/definitions'; 

  interface User extends DBUser { 
    role: string;
  }
}