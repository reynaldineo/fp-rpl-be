/* eslint-disable */
import { Service } from "typedi";
import db from "../config/database.js";
import { HttpException } from "../exceptions/HttpException.js";
import { cartAtt, prodAtt, qtyAtt } from "../interfaces/store.interface.js";
import { resCartInfo, resQtyInfo } from "../types/index.js";

@Service()
export class StoreService {
  public async updateCart(accID: string, prodID: string, new_qty: number, isDelete: boolean = false) {
    const { price: prodPrice, stock }: { price: number; stock: number } = await getProdDetail({ id: prodID });
    if (new_qty > stock) {
      throw new HttpException(409, "Stock tidak mencukupi");
    }

    const { id: cID, current_cost: curCost }: { id: string; current_cost: number } = await getCart({ acc_id: accID });

    const isQExist = await getQtyProduct({
      prod_id: prodID,
      cart_id: cID,
    });

    if (!isQExist) {
      const { id: qID }: { id: string } = await createQty({
        prod_id: prodID,
        cart_id: cID,
      });
      const res = await updateCart(qID, new_qty, cID, curCost, 0, prodPrice);
      return res;
    } else {
      const { id: qID, quantity: qty }: { id: string; quantity: number } = isQExist;
      if (isDelete) {
        const res = await updateCart(qID, 0, cID, curCost, qty, prodPrice);
        return res;
      }
      const res = await updateCart(qID, new_qty, cID, curCost, qty, prodPrice);
      return res;
    }
  }
};

export const getCart = (attribute: cartAtt) => {
  return db.cart.findUnique({
    where: {
      account_id: attribute.acc_id,
    },
    select: {
      id: true,
      current_cost: true,
    },
  });
};

export const getQtyProduct = (attribute: qtyAtt) => {
  return db.qty.findFirst({
    where: {
      AND: {
        product_id: attribute.prod_id,
        cart_id: attribute.cart_id,
      },
    },
    select: {
      id: true,
      quantity: true,
    },
  });
};

export const getProdDetail = (attribute: prodAtt) => {
  return db.product.findFirst({
    where: {
      id: attribute.id,
    },
    select: {
      price: true,
      stock: true,
    },
  });
};

export const createQty = (attribute: qtyAtt) => {
  return db.qty.create({
    data: {
      product_id: attribute.prod_id,
      cart_id: attribute.cart_id,
    },
    select: {
      id: true,
    },
  });
};

export const updateCart = (qID: string, new_qty: number, cartID: string, curCost: number, cur_qty: number, prodPrice: number) => {
  return db.$transaction([
    new_qty === 0
      ? db.qty.delete({
          where: {
            id: qID,
          },
          select: resQtyInfo,
        })
      : db.qty.update({
          where: {
            id: qID,
          },
          data: {
            quantity: new_qty,
          },
          select: resQtyInfo,
        }),
    db.cart.update({
      where: {
        id: cartID,
      },
      data: {
        current_cost: curCost + (new_qty - cur_qty) * prodPrice,
      },
      select: resCartInfo,
    }),
  ]);
};
