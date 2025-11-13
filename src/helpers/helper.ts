export const isNullOrEmpty = function (val: string | null): boolean {
  return val === undefined || val === null || val === ''
}
