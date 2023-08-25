export const childLockCheck = (pass: string) => {
  return /^[0-9]{4}$/.test(pass);
};
