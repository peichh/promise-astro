import identityOptions from '../data/identity-options.json';
export const IDENTITY_OPTIONS = identityOptions;
export type IdentityField = keyof typeof IDENTITY_OPTIONS;
export type IdentityValue<K extends IdentityField> = (typeof IDENTITY_OPTIONS)[K][number]['value'];
export type IdentityProfile = { [K in IdentityField]?: IdentityValue<K> };
export function isIdentityValue<K extends IdentityField>(field: K, value: unknown): value is IdentityValue<K> {
  return typeof value === 'string' && IDENTITY_OPTIONS[field].some((option) => option.value === value);
}
