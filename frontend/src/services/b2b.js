import api from "./api";


export const get_lead_data = async (token) => {
  console.log("This is Token",token)
  const response = await api.get("/getleads", {
    params: { token },
  });
  return response.data;
};