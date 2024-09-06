export const isNullOrEmpty = function (val: string | null): boolean {
  return val === null || val === undefined || val === ''
}
