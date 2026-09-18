import type { ListState } from "./list-state";

export const RoleName = { USER: "USER", ADMIN: "ADMIN" } as const;
export type RoleNameValue = (typeof RoleName)[keyof typeof RoleName];

export const UserStatus = { ACTIVE: "ACTIVE", INACTIVE: "INACTIVE" } as const;
export type UserStatusValue = (typeof UserStatus)[keyof typeof UserStatus];

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  photo: string | null;
  username: string;
  roles: RoleNameValue[];
  status: UserStatusValue;
  createdAt: string;
}

/** Sesión que devuelve /auth/signin y /auth/signup. */
export interface Session {
  accessToken: string;
  tokenType: string;
  user: User;
}

export interface SigninDto { username: string; password: string; }
export interface SignupDto { firstName: string; lastName: string; username: string; password: string; photo?: string | null; }
export interface ChangePasswordDto { currentPassword: string; newPassword: string; }

export const EmptySigninState: SigninDto = { username: "", password: "" };
export const EmptySignupState: SignupDto = { firstName: "", lastName: "", username: "", password: "" };
export const EmptyChangePasswordState: ChangePasswordDto = { currentPassword: "", newPassword: "" };
export const EmptyUsersState: ListState<User> = { count: 0, page: 0, pages: 0, items: [] };

export const roleLabel = (role: string): string => (role === RoleName.ADMIN ? "Administrador" : "Vendedor");
export const userStatusLabel = (status: string): string => (status === UserStatus.INACTIVE ? "Inactivo" : "Activo");
