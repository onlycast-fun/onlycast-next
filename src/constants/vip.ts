import { VipType } from "@prisma/client";

export const VIP_PRICE_MAP = {
  [VipType.trial]: {
    usd: 19,
    cny: 139,
  },

  [VipType.basic]: {
    usd: 139,
    cny: 999,
  },
  [VipType.pro]: {
    usd: 159,
    cny: 1160,
  },
};
