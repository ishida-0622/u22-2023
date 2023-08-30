export const romaNameCheck = (name: string) => {
  return /^[a-zA-Z]{2,20}$/.test(name);
};
