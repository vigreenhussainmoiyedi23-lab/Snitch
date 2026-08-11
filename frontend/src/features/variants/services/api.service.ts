import api from "../../../app/axios";
import type { createVariant, updateVariant } from "../@types/types";

export const GetVariantsApi = async (productId: string) => {
  const response = await api.get(`/api/variants/${productId}`);
  return response.data;
};
export const CreateVariantApi = async (
  productId: string,
  data: createVariant,
) => {
  const response = await api.post(`/api/variants/${productId}`, data);
  return response.data;
};
export const UpdateVariantApi = async (id: string, data: updateVariant) => {
  const response = await api.put(`/api/variants/${id}`, data);
  return response.data;
};
export const DeleteVariantApi = async (id: string) => {
  const response = await api.delete(`/api/variants/${id}`);
  return response.data;
};
