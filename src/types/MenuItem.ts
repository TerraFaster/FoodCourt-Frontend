export interface MenuItem {
  Id: number;
  NameEn: string;
  NameUk: string;
  DescriptionEn: string;
  DescriptionUk: string;
  Unit: string;
  Amount: number;
  TimeToCook: number;
  Price: number;
  PromoPrice?: number | null;
  IsNew: boolean;
  IsPromo: boolean;
  IsOutOfStock: boolean;
  ImageUrl?: string;
  Category: string;
}

export const categories = ['food', 'drinks', 'desserts'] as const;
export const units = ['g', 'ml', 'pcs'] as const;