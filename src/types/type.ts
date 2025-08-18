// type declare for jwtpayload
export interface jwtPayload {
  user: {
    _id: string;
    userName: string;
    fullName: string;
    email: string;
    emailVerified: boolean;
    emailToken?: string;
    role: string;
  };
}

// user for auth context and register page
export interface User {
  fullName: string;
  userName: string;
  email: string;
  password: string;
}

// for login page
export interface LoginForm {
  identifier:string,
  password: string
}