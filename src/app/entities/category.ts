import type { ListState } from "./list-state";

export interface Category {
  id: number;
  name: string;
  icon: string | null;
  createdBy: number | null;
  createdAt: string;
  updatedAt: string | null;
}

export interface CreateCategoryDto {
  name: string;
  icon: string;
}

export type UpdateCategoryDto = CreateCategoryDto;

export const EmptyCategoryState: CreateCategoryDto = { name: "", icon: "" };
export const EmptyCategoriesState: ListState<Category> = { count: 0, page: 0, pages: 0, items: [] };
