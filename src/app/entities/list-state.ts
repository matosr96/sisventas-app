export interface ListState<T> {
  count: number;
  page: number;
  pages: number;
  items: T[];
}
