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

export type CategoryResponse = {
  success: boolean;
  data: {
    categories: Category[];
    totalCount: number;
  };
  message: string;
};
