import { Prisma } from "@prisma/client";

export const resCartInfo: Prisma.cartSelect = {
  account: {
    select: {
      email: true,
    },
  },
  current_cost: true,
};

export const resQtyInfo: Prisma.qtySelect = {
  product: {
    select: {
      id: true,
      name: true,
    },
  },
  quantity: true,
};