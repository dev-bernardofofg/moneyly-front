import { InitialConfigParams } from "../(types)/auth";
import api from "../(utils)/axios";

export const userService = {
  async updateInitialConfig(params: InitialConfigParams) {
    const response = await api.put("/users/income-and-period", params);
    return response.data;
  },

  async getProfile() {
    const response = await api.get("/users/profile");
    return response.data;
  },
};
