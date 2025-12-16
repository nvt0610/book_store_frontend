// src/pages/client/account/account.types.ts
import type { User } from "@/api/users";
import type { Address } from "@/api/addresses";

export type AccountTabKey = "profile" | "address" | "security" | "orders";

export interface ProfileFormData {
  full_name: string;
  phone: string;
}

export interface AddressFormData {
  full_name: string;
  phone: string;
  address_line: string;
  address_line2?: string;
  postal_code?: string;
  is_default?: boolean;
}
