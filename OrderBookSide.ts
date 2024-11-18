import { DoublyLinkedList } from "data-structure-typed";
import { OrderSide, LimitOrder } from "./types";

export interface OrderBookSide<DataStructure> {
  orderSide: OrderSide;

  dataStructure: DataStructure;

  addOrder: (order: LimitOrder) => void;
  deleteOrder: (order: LimitOrder) => void;
  deleteOrdersByPrice: (orders: DoublyLinkedList<LimitOrder>, price: number) => void;
  getOrderByPrice: (orderId: string, price: number) => LimitOrder | undefined;
  matchOrdersForPrice: (price: number) => DoublyLinkedList<LimitOrder>;
  getBestPriceOrders: () => DoublyLinkedList<LimitOrder>;
  getAllOrders: () => LimitOrder[];
  print: () => void;
}
