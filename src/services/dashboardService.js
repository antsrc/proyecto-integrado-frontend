import axios from "../config/axios";

export async function getResumenNotificaciones() {
  const { data } = await axios.get("/notificaciones");
  return data;
}
