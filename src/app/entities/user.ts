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
/** Alta por un administrador: elige el rol de entrada. */
export interface CreateUserDto { firstName: string; lastName: string; photo: string; username: string; password: string; role: RoleNameValue | null; }
/** Datos personales (propios o de otro): "" = no tocar, se limpia antes de enviar. */
export interface UpdateUserProfileDto { firstName: string; lastName: string; photo: string; }
export interface ChangePasswordDto { currentPassword: string; newPassword: string; }
export interface ResetPasswordDto { newPassword: string; }

export const EmptySigninState: SigninDto = { username: "", password: "" };
export const EmptySignupState: SignupDto = { firstName: "", lastName: "", username: "", password: "" };
export const EmptyCreateUserState: CreateUserDto = { firstName: "", lastName: "", photo: "", username: "", password: "", role: RoleName.USER };
export const EmptyChangePasswordState: ChangePasswordDto = { currentPassword: "", newPassword: "" };
export const EmptyResetPasswordState: ResetPasswordDto = { newPassword: "" };
export const EmptyUsersState: ListState<User> = { count: 0, page: 0, pages: 0, items: [] };

export const roleLabel = (role: string): string => (role === RoleName.ADMIN ? "Administrador" : "Vendedor");
export const userStatusLabel = (status: string): string => (status === UserStatus.INACTIVE ? "Inactivo" : "Activo");
