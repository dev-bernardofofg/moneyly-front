import { AuthResponse, SignInParams, SignUpParams } from "../(types)/auth";
import api from "../(utils)/axios";

export const authService = {
  signIn: async (params: SignInParams): Promise<AuthResponse> => {
    const response = await api.post("/users/sign-in", params);

    return response.data;
  },

  signUp: async (params: SignUpParams): Promise<AuthResponse> => {
    const response = await api.post("/users/sign-up", params);

    return response.data;
  },
};
