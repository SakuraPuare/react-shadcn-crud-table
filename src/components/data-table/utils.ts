/**
 * 将驼峰命名转换为下划线命名
 * 例如：camelCaseText -> camel_case_text
 * @param str 驼峰命名的字符串
 * @returns 下划线命名的字符串
 */
export function camelToSnakeCase(str: string): string {
  return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
}

/**
 * 将下划线命名转换为驼峰命名
 * 例如：snake_case_text -> snakeCaseText
 * @param str 下划线命名的字符串
 * @returns 驼峰命名的字符串
 */
export function snakeToCamelCase(str: string): string {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
}
