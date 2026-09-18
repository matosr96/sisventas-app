import type { ListState } from "./list-state";

export const SupplierStatus = { ACTIVE: "ACTIVE", INACTIVE: "INACTIVE" } as const;
export type SupplierStatusValue = (typeof SupplierStatus)[keyof typeof SupplierStatus];

export interface Supplier {
  id: number;
  name: string;
  taxId: string | null;
  phone: string | null;
  email: string | null;
  status: SupplierStatusValue;
  createdBy: number | null;
  createdAt: string;
  updatedAt: string | null;
}

export interface CreateSupplierDto {
  name: string;
  taxId: string;
  phone: string;
  email: string;
}

export type UpdateSupplierDto = CreateSupplierDto & { status: SupplierStatusValue | null };

export const EmptySupplierState: CreateSupplierDto = { name: "", taxId: "", phone: "", email: "" };
export const EmptySuppliersState: ListState<Supplier> = { count: 0, page: 0, pages: 0, items: [] };

export const supplierStatusLabel = (status: string): string =>
  status === SupplierStatus.INACTIVE ? "Inactivo" : "Activo";
