import { Service } from "typedi";
import db from "../config/database.js";
import { HttpException } from "../exceptions/HttpException.js";
import { invoiceAtt, prodAtt, qtyAtt } from "../interfaces/store.interface.js";
import { resCartInfo, resQtyInfo } from "../types/store.type.js";
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
    const isOwned = await isOwn(id, account_id, 0);
    if (!isOwned) {
      throw new HttpException(StatusCodes.BAD_REQUEST, "You dont have permission to update this product");
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
    const isOwned = await isOwn(id, account_id, 0);
    if (!isOwned) {
      throw new HttpException(StatusCodes.BAD_REQUEST, "You don't have permission to delete this product");
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
    const cart = await getCurCart(acc_id);
    return await db.qty.findMany({
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
      where: {
        cart_id: cart.id,
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

  public createInvoice = async (attribute: invoiceAtt, account_id: string) => {
    const isExist = await isAddressExist(attribute.address, account_id);
    if (isExist) {
      throw new HttpException(StatusCodes.CONFLICT, "Address already exist");
    }
    return await db.invoice.create({
      data: {
        shippingAddress: attribute.address,
        payment_method: attribute.payment,
        account_id,
      },
      select: {
        id: true,
        shippingAddress: true,
        payment_method: true,
      },
    });
  };

  public getInvoices = async (account_id: string) => {
    return await db.invoice.findMany({
      where: {
        account_id,
      },
      select: {
        id: true,
        shippingAddress: true,
        payment_method: true,
      },
    });
  };

  public editInvoice = async (attribute: invoiceAtt, id: string, account_id: string) => {
    const isOwned = await isOwn(id, account_id, 1);
    if (!isOwned) {
      throw new HttpException(StatusCodes.BAD_REQUEST, "You dont have permission to edit this invoice");
    }

    const isExist = await isAddressExist(attribute.address, account_id);
    if (isExist) {
      throw new HttpException(StatusCodes.CONFLICT, "Address already exist");
    }
    return await db.invoice.update({
      where: {
        id,
      },
      data: {
        shippingAddress: attribute.address,
        payment_method: attribute.payment,
      },
      select: {
        id: true,
        shippingAddress: true,
        payment_method: true,
      },
    });
  };

  public deleteInvoice = async (id: string, account_id: string) => {
    const isOwned = await isOwn(id, account_id, 1);
    if (!isOwned) {
      throw new HttpException(StatusCodes.BAD_REQUEST, "You dont have permission to delete this invoice");
    }
    return await db.invoice.delete({
      where: {
        id,
      },
    });
  };

  public purchaseFromCart = async (account_id: string) => {
    const curCart = await getCurCart(account_id);
    const curInvoice = await getCurInvoice(account_id);
    return await db.$transaction([
      db.invoice_detail.create({
        data: {
          total_cost: curCart.current_cost,
          cart_id: curCart.id,
          invoice_id: curInvoice.id,
        },
        select: {
          id: true,
        },
      }),
      db.cart.update({
        data: {
          account_id: null,
        },
        where: {
          id: curCart.id as string,
        },
        select: {
          id: true,
        },
      }),
      db.cart.create({
        data: {
          account_id,
        },
        select: {
          id: true,
        },
      }),
    ]);
  };

  public getInvoiceByID = async (id: string, account_id: string) => {
    const isOwned = await isOwn(id, account_id, 1);
    if (!isOwned) {
      throw new HttpException(StatusCodes.BAD_REQUEST, "You dont have permission to view this invoice");
    }
    return await db.invoice.findMany({
      where: {
        id,
      },
      select: {
        shippingAddress: true,
        payment_method: true,
        invoice_detail: {
          include: {
            cart: {
              select: {
                qty: {
                  select: {
                    quantity: true,
                    product: {
                      select: {
                        id: true,
                        img_url: true,
                        name: true,
                        price: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });
  };
}

export const isOwn = (id: string, account_id: string, op: number) => {
  if (op == 0) {
    // check product
    return db.product.findFirst({
      where: {
        AND: [
          {
            id,
            account_id,
          },
        ],
      },
    });
  } else if (op == 1) {
    // check invoice
    return db.invoice.findFirst({
      where: {
        AND: [
          {
            id,
            account_id,
          },
        ],
      },
    });
  }
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

export const isAddressExist = (shippingAddress: string, account_id: string) => {
  return db.invoice.findFirst({
    where: {
      AND: {
        shippingAddress,
        account_id,
      },
    },
  });
};

export const getCurInvoice = (account_id: string) => {
  return db.invoice.findFirst({
    where: {
      account_id,
    },
    select: {
      id: true,
    },
  });
};
