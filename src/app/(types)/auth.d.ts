export declare interface SignInParams {
  email: string;
  password: string;
}

export declare interface AuthResponse {
  user: {
    id: string;
    name: string;
    email: string;
  };
  token: string;
}

export declare interface SignUpParams {
  name: string;
  email: string;
  password: string;
}
