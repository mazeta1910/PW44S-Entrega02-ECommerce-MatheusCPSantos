export interface IUserRegister {
  displayName: string;
  username: string;
  password: string;
}

export interface IResponse {
  status?: number;
  success?: boolean;
  message?: string;
  data?: object
}

export interface IPage<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export interface IUserLogin {
  username: string;
  password: string;
}

export interface Authorities {
  authority: string;
}

export interface AuthenticatedUser {
  displayName: string;
  username: string;
  authorities: Authorities[];
}

export interface AuthenticationResponse {
  token: string;
  user: AuthenticatedUser;
}

export interface ICategory {
  id?: number;
  name: string;
}

export type DeliveryType = "PHYSICAL" | "DIGITAL";

export type Platform =
  | "UNIVERSAL"
  | "PS5"
  | "XBOX_SERIES"
  | "STEAM"
  | "EPIC";

export type ItemCondition = "NEW" | "SEMI_NEW" | "USED";

export interface IProductVariant {
  id?: number;
  productId?: number;
  label: string;
  sku: string;
  price: number;
  deliveryType: DeliveryType;
  platform: Platform;
  itemCondition: ItemCondition;
  active?: boolean;
}

export interface IProduct {
  id?: number;
  name: string;
  description: string;
  category: ICategory;
  image?: string;
  imageName?: string;
  contentType?: string;
  adultOnly?: boolean;
  variants?: IProductVariant[];
  startingPrice?: number;
}