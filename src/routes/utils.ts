export const isValidId = (id: string) => id.match(/^[0-9a-fA-F]{24}$/);

export const isEveryFieldExist = (...params: string[]): boolean =>
  params.every((value) => value !== undefined && value !== null);
