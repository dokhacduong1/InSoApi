export interface Find {
  homeowners?: string;
  age?: number;
  wife_homeowners?: string;
  wife_age?: number;
  address?: string;
  info_children?: [
    {
      name: string;
      age: number;
    }
  ];
  slug?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
