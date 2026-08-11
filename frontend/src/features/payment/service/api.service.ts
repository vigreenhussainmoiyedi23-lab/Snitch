import api from "../../../app/axios";

export async function CreateOrderApi() {
  const response = await api.post("/api/payment/create");
  return response.data;
}

export async function verifyPaymentApi(data: any) {
  const response = await api.post("/api/payment/verify", data);
  return response.data;
}