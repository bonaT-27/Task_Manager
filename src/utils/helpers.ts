export const excludeFields = <T, K extends keyof T>(
  obj: T,
  keys: K[]
): Omit<T, K> => {
  const result = { ...obj };
  keys.forEach((key) => delete result[key]);
  return result;
};

export const sanitizeUser = (user: any) => {
  return excludeFields(user, ['password']);
};