import { MenuItem } from '../types/MenuItem';
import { MenuItemResponse, MenuItemRequest } from '../lib/apiClient';

// Convert API response to local format
export const convertFromApiResponse = (apiItem: MenuItemResponse): MenuItem => ({
  Id: apiItem.id,
  NameEn: apiItem.nameEn,
  NameUk: apiItem.nameUk,
  DescriptionEn: apiItem.descriptionEn,
  DescriptionUk: apiItem.descriptionUk,
  Unit: apiItem.unit,
  Amount: apiItem.amount,
  TimeToCook: apiItem.timeToCook,
  Price: apiItem.price,
  PromoPrice: apiItem.promoPrice,
  IsNew: apiItem.isNew,
  IsPromo: apiItem.isPromo,
  IsOutOfStock: apiItem.isOutOfStock || false,
  ImageUrl: apiItem.imageUrl,
  Category: apiItem.category
});

// Convert local format to API request
export const convertToApiRequest = (item: MenuItem): MenuItemRequest => ({
  id: item.Id !== 0 ? item.Id : undefined,
  nameEn: item.NameEn,
  nameUk: item.NameUk,
  descriptionEn: item.DescriptionEn,
  descriptionUk: item.DescriptionUk,
  unit: item.Unit,
  amount: item.Amount,
  timeToCook: item.TimeToCook,
  price: item.Price,
  promoPrice: item.PromoPrice,
  isNew: item.IsNew,
  isPromo: item.IsPromo,
  isOutOfStock: item.IsOutOfStock,
  imageUrl: item.ImageUrl,
  category: item.Category
});