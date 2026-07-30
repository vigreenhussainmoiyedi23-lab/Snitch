import { CreateProductAPI } from "../service/api.service";

export const useProduct = () => {
  async function createProductHandler(data: any) {
    try {
      const response = await CreateProductAPI(data);
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  }
  return {createProductHandler};
};
