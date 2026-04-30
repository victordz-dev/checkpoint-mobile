export type UserRole = 'admin' | 'user';

export type UserTreatment = 'Sr.' | 'Sra.' | 'Srta.';

export interface User {
  id: number;
  username: string;
  password: string;
  role: UserRole;
  name: string;
  treatment?: UserTreatment;
  themePreference?: 'dark' | 'light';
}