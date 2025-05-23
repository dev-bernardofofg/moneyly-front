import { SignInParams, SignInResponse } from "../(types)/auth";
import api from "../(utils)/axios";

export const authService = {
  signIn: async (params: SignInParams): Promise<SignInResponse> => {
    const response = await api.post("/users/sign-up", params);

    return response.data;
  },
};
