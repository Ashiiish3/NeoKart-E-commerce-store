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
