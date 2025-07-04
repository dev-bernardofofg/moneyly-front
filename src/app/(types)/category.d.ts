export type Category = {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
};

export type UpdateCategoryParams = {
  id: string;
  name: string;
};

export type CreateCategoryParams = {
  name: string;
};
