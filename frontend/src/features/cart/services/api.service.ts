import api from "../../../app/axios";

export const GetCartHandler = async () => {
    const response = await api.get("/api/cart");
    return response.data;
};

export const AddToCartHandler = async (data: any) => {
    const response = await api.put("/api/cart", data);
    return response.data;
};