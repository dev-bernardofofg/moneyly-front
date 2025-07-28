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
    pagination: PaginationType;
  };
  message: string;
};

export type CategorySpecific = {
  id: string;
  name: string;
};
