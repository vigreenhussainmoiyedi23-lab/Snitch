import api from "../../../app/axios";

export const GetCartAPI = async () => {
  const response = await api.get("/api/cart");
  return response.data;
};

export const AddToCartAPI = async (data: {
  productId: string;
  quantity: number;
  variantId?: string;
}) => {
  const response = await api.put("/api/cart", data);
  return response.data;
};

export const UpdateCartItemAPI = async (data: {
  productId: string;
  increaseBy?: number;
  decreaseBy?: number;
  variantId?: string;
}) => {
  const response = await api.patch("/api/cart", data);
  return response.data;
};

export const DeleteCartItemAPI = async (
  productId: string,
  variantId?: string,
) => {
  const response = await api.delete(`/api/cart/${productId}`, {
    data: { variantId },
  });
  return response.data;
};

export const DeleteCartAPI = async () => {
  const response = await api.delete("/api/cart");
  return response.data;
};
