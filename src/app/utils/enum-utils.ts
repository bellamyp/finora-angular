
export function enumToOptions<T extends Record<string, string>>(
  enumObj: T
): { id: string; name: string }[] {
  return Object.values(enumObj).map(v => ({
    id: v as string,
    name: (v as string).replace(/_/g, ' ')
  }));
}
