/* eslint-disable */
import { Service } from "typedi";
import db from "../config/init.js";

@Service()
export class StoreService {
  private accID: string;
  private cartID: string;
  private curCost: number;
  private prodID: string;
  
  constructor(accountID: string, productID: string) {
    this.accID = accountID;
    this.prodID = productID;
    this.init();
  }
  
  private async init() {
    const cart = await this.getCart();
    this.cartID = cart.id;
    this.curCost = cart.current_cost;
  }

  private async getCart() {
    return await db.cart.findFirst({
      select: {
        id: true,
        current_cost: true,
      },
      where: {
        account_id: this.accID,
      },
    });
  }

  private async getQtyProduct() {
    return await db.q.findFirst({
      where: {
        cart_id: this.cartID,
        product_id: this.prodID,
      },
      select: {
        id: true,
        quantity: true,
      },
    });
  }

  private async getPrice() {
    return await db.product.findFirst({
      select: {
        price: true
      },
      where: {
        id: this.prodID,
      },
    });
  }

  private async updateCart(new_qty: number, cur_qty: number, prodPrice: number) {
    return await db.cart.update({
      data: {
        current_cost: this.curCost + (new_qty - cur_qty) * prodPrice,
      },
      where: {
        id: this.cartID,
      }
    })
  }

  public async addToCart(new_qty: number) {
    const { id: qID, quantity: qty } : { id: string, quantity: number } = await this.getQtyProduct();
    const { price: prodPrice } : { price: number } = await this.getPrice();

    // delete product from cart
    if(qID && new_qty === 0) {
      return await db.$transaction([
        db.q.delete({
          where: {
            id: qID
          }
        }),
        db.cart.update({
          data: {
            current_cost: this.curCost - qty * prodPrice,
          },
          where: {
            id: this.cartID,
          }
        })
      ]);
    }

    if(!qID) {
      await db.q.create({
        data: {
          quantity: new_qty,
          cart_id: this.cartID,
          product_id: this.prodID,
        }
      });
    } 
    return await this.updateCart(new_qty, qty, prodPrice);
  }
}