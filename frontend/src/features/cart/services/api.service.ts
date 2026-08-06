import api from "../../../app/axios";

export const GetCartHandler = async () => {
  const response = await api.get("/api/cart");
  return response.data;
};

export const AddToCartHandler = async (data: any) => {
  const response = await api.put("/api/cart", data);
  return response.data;
};

export const UpdateCartItemHandler = async (data: {
  productId: string;
  increaseBy?: number;
  decreaseBy?: number;
}) => {
  const response = await api.patch("/api/cart", data);
  return response.data;
};

export const DeleteCartItemHandler = async (id: string) => {
  const response = await api.delete(`/api/cart/${id}`);
  return response.data;
};

export const DeleteCartHandler = async () => {
  const response = await api.delete("/api/cart");
  return response.data;
};
