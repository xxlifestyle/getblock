import axios from "axios";

const api = axios.create(
  {
    baseURL: "https://api.changenow.io/v2/",
    headers: {
      'x-changenow-api-key': 'c9155859d90d239f909d2906233816b26cd8cf5ede44702d422667672b58b0cd',
    },

  });


export default api;