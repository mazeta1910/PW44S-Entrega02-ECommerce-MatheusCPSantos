export interface IUserRegister {
  fullName: string;
  password: string;
  confirmPassword: string;
  birthDate: string;
  email: string;
  cpf: string;
  phone: string;
  newsletterSubscription?: boolean;
  parentId?: number | null;
  termsAccepted: boolean;
}

export interface IRegisterFormValues {
  fullName: string;
  password: string;
  confirmPassword: string;
  birthDate: Date | null;
  email: string;
  cpf: string;
  phone: string;
  newsletterSubscription: boolean;
  parentId: number | null;
  termsAccepted: boolean;
}

export interface IApiError {
  status?: number;
  message?: string;
  url?: string;
  validationErrors?: Record<string, string>;
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
  email: string;
  password: string;
}

export interface Authorities {
  authority: string;
}

export interface AuthenticatedUser {
  fullName: string;
  email: string;
  authorities: Authorities[];
}

export interface AuthenticationResponse {
  token: string;
  user: AuthenticatedUser;
}

export interface IUserProfile {
  id?: number;
  fullName: string;
  birthDate: string;
  email: string;
  cpf: string;
  phone: string;
  newsletterSubscription?: boolean;
  parentId?: number | null;
  termsAccepted?: boolean;
}

export interface IUserProfileUpdate {
  fullName: string;
  phone: string;
  newsletterSubscription?: boolean;
}

export interface IAddress {
  id?: number;
  zipCode: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  isPrimary?: boolean;
}

export interface ICepLookup {
  zipCode: string;
  street: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  found?: boolean;
}

export interface IFreightOption {
  carrierId: number;
  carrierName: string;
  price: number;
  estimatedDays: number;
}

export interface ICouponValidation {
  code: string;
  discountAmount: number;
  valid: boolean;
  message: string;
}

export interface ICheckoutOrderPayload {
  items: { variantId: number; quantity: number }[];
  deliveryAddress: IAddress;
  freightPrice?: number;
  couponCode?: string;
  couponDiscount?: number;
  carrierName?: string;
  estimatedDeliveryDays?: number;
}

export interface IOrderItem {
  id?: number;
  variantId?: number;
  productName: string;
  variantLabel?: string;
  deliveryType?: DeliveryType;
  platform?: Platform;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface IOrder {
  id?: number;
  items?: IOrderItem[];
  deliveryAddress?: IAddress;
  total: number;
  freightPrice?: number;
  couponDiscount?: number;
  carrierName?: string;
  estimatedDeliveryDays?: number;
  status?: OrderStatus;
  supportRequestMessage?: string;
  orderDate: string;
}

export type OrderStatus =
  | "CONFIRMED"
  | "CANCELLED"
  | "REFUND_REQUESTED"
  | "EXCHANGE_REQUESTED"
  | "REFUNDED"
  | "EXCHANGED";

export type OrderSupportRequestType = "CANCEL" | "REFUND" | "EXCHANGE";

export interface IOrderSupportRequest {
  type: OrderSupportRequestType;
  message?: string;
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
  listPrice?: number;
  deliveryType: DeliveryType;
  platform: Platform;
  itemCondition: ItemCondition;
  active?: boolean;
  stockQuantity?: number;
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
  averageRating?: number;
  reviewCount?: number;
  specifications?: string;
  variants?: IProductVariant[];
  startingPrice?: number;
}