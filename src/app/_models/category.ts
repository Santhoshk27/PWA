export interface Category {
  Id: number;
  Name: string;
  ParentId: number;
  ChildesCat: Category[];
  fgColor: string;
  bgColor: string;
}
