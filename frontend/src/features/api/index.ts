export const endpoint = (() => {
  const url = process.env.NEXT_PUBLIC_API_ENDPOINT;
  if (url === undefined) {
    throw new Error('API endpoint is undefined. check ".env.local"');
  }
  return url;
})();
