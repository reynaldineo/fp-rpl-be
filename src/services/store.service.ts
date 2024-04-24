import { Service } from "typedi";
import db from "../config/database.js";
import { HttpException } from "../exceptions/HttpException.js";
import { prodAtt, qtyAtt } from "../interfaces/store.interface.js";
import { resCartInfo, resQtyInfo } from "../types/index.js";
import { StatusCodes } from "http-status-codes";

@Service()
export class StoreService {
  public getProds = async (pageSize: number, pageNumber: number, search: string) => {
    const totalCount = await db.product.count({
      where: {
        name: {
          contains: search,
        },
      },
    });

    const maxPage = Math.ceil(totalCount / pageSize);
    const offset = (pageNumber - 1) * pageSize;

    const query = await db.product.findMany({
      where: {
        name: {
          contains: search,
        },
      },
      select: {
        id: true,
        img_url: true,
        name: true,
        price: true,
        account: {
          select: {
            username: true,
          },
        },
      },
      take: pageSize,
      skip: offset,
    });

    return {
      query,
      pageNumber,
      pageSize,
      maxPage,
    };
  };

  public getProdDetail = async (id: string) => {
    return await db.product.findUnique({
      include: {
        account: {
          select: {
            username: true,
          },
        },
      },
      where: {
        id,
      },
    });
  };

  public addProd = async (attribute: prodAtt, account_id: string) => {
    return await db.product.create({
      data: {
        id: attribute.id,
        img_url: attribute.img_url,
        name: attribute.name,
        price: attribute.price,
        stock: attribute.price,
        description: attribute.description,
        account_id,
      },
      select: {
        id: true,
        img_url: true,
        name: true,
      },
    });
  };

  public updateProd = async (attribute: prodAtt, id: string, account_id: string) => {
    const isOwned = isOwn(id, account_id);
    if (!isOwned) {
      throw new HttpException(StatusCodes.FORBIDDEN, "You are not the owner of this product");
    }
    return await db.product.update({
      data: {
        name: attribute.name,
        price: attribute.price,
        stock: attribute.stock,
        description: attribute.description,
      },
      where: {
        id,
      },
      select: {
        id: true,
        img_url: true,
        name: true,
        price: true,
        stock: true,
        description: true,
      },
    });
  };

  public deleteProd = async (id: string, account_id: string) => {
    const isOwned = isOwn(id, account_id);
    if (!isOwned) {
      throw new HttpException(StatusCodes.FORBIDDEN, "You are not the owner of this product");
    }
    return await db.product.delete({
      where: {
        id,
      },
      select: {
        id: true,
        img_url: true,
        name: true,
      },
    });
  };

  public getCartDetail = async (acc_id: string) => {
    const { id: cart_id }: { id: string } = await getCurCart(acc_id);
    return await db.qty.findMany({
      where: {
        cart_id,
      },
      select: {
        id: true,
        product: {
          select: {
            img_url: true,
            name: true,
            price: true,
          },
        },
        quantity: true,
      },
    });
  };

  public updateCart = async (accID: string, prodID: string, new_qty: number) => {
    const { price: prodPrice, stock }: { price: number; stock: number } = await getProdDetail(prodID);
    if (new_qty > stock) {
      throw new HttpException(StatusCodes.CONFLICT, "Stock tidak mencukupi");
    }

    const { id: cID, current_cost: curCost }: { id: string; current_cost: number } = await getCurCart(accID);

    const isQExist = await getQtyProduct({
      prod_id: prodID,
      cart_id: cID,
    });

    if (!isQExist) {
      const { id: qID }: { id: string } = await createQty({
        prod_id: prodID,
        cart_id: cID,
      });
      return await updateCart(qID, new_qty, cID, curCost, 0, prodPrice);
    } else {
      const { id: qID, quantity: qty }: { id: string; quantity: number } = isQExist;
      return await updateCart(qID, new_qty, cID, curCost, qty, prodPrice);
    }
  };
}

export const isOwn = (id: string, account_id: string) => {
  return db.product.findFirst({
    where: {
      AND: {
        id,
        account_id,
      },
    },
  });
};

export const getCurCart = (account_id: string) => {
  return db.cart.findUnique({
    where: {
      account_id,
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

export const getProdDetail = (id: string) => {
  return db.product.findUnique({
    where: {
      id,
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

export const updateCart = (
  qID: string,
  new_qty: number,
  cartID: string,
  curCost: number,
  cur_qty: number,
  prodPrice: number,
) => {
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
