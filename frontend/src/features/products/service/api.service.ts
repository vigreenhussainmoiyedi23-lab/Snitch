import api from "../../../app/axios";

export const CreateProductAPI = async (data: any) => {
  const response = await api.post("/api/products", data);
  return response.data;
};

export const GetProductsAPI = async (params: any) => {
  let urlParams = Object.keys(params)
    .filter((key) => params[key])
    .map((key) => {
      return `${key}=${params[key]}`;
    })
    .join("&");

  const response = await api.get("/api/products?" + urlParams);
  return response.data;
};

export const GetSingleProductAPI = async (slug: string) => {
  const response = await api.get(`/api/products/${slug}`);
  return response.data;
};

export const UpdateProductPutAPI = async (id: string, data: any) => {
  const response = await api.put(`/api/products/${id}`, data);
  return response.data;
};

export const UpdateProductPatchApi = async (id: string, data: any) => {
  const response = await api.patch(`/api/products/${id}`, data);
  return response.data;
};

export const DeleteProductAPI = async (id: string) => {
  const response = await api.delete(`/api/products/${id}`);
  return response.data;
};

export const GetAllEnumsApi = async () => {
  const response = await api.get("/api/products/all/enums");
  return response.data;
};

export const UpdateOptionApi = async (id: string, data: any) => {
  const response = await api.put(`/api/products/${id}/options`, data);
  return response.data;
};
