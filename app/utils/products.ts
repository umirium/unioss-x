// get parameters for redirect
export const getParams = (page: number | null, q?: string) => {
  const params = [];

  q && params.push(`q=${q}`);
  page !== 1 && params.push(`page=${page}`);

  return params.length !== 0 ? `?${params.join("&")}` : "";
};
