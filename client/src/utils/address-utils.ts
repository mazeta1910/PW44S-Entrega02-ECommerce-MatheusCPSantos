import type { IAddress } from "@/commons/types";

export function sortAddressesByPrimary(addresses: IAddress[]): IAddress[] {
  return [...addresses].sort((a, b) => {
    if (a.isPrimary && !b.isPrimary) {
      return -1;
    }
    if (!a.isPrimary && b.isPrimary) {
      return 1;
    }
    return (a.id ?? 0) - (b.id ?? 0);
  });
}

export function applyPrimaryAddress(
  addresses: IAddress[],
  primaryId: number,
): IAddress[] {
  return sortAddressesByPrimary(
    addresses.map((address) => ({
      ...address,
      isPrimary: address.id === primaryId,
    })),
  );
}
