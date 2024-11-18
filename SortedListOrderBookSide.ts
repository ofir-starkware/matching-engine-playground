import { DoublyLinkedList } from "data-structure-typed";
import { LimitOrder, OrderSide, OrderBookSortedArray } from "./types";
import { OrderBookSide } from "./OrderBookSide";
import { SortedArray } from "./pure-data-structures/SortedArray";

type OrderBookSortedArrayNode = {
  key: number;
  value: DoublyLinkedList<LimitOrder>;
};

export class SortedListOrderBookSide implements OrderBookSide<OrderBookSortedArray> {
  dataStructure: OrderBookSortedArray;
  orderSide: OrderSide;

  constructor(orderSide: OrderSide) {
    this.dataStructure = new SortedArray<number, DoublyLinkedList<LimitOrder>>();
    this.orderSide = orderSide;
  }

  private get array() {
    return this.dataStructure;
  }

  addOrder = (order: LimitOrder) => {
    const ordersWithCurrentPrice = this.array.get(order.price);
    if (ordersWithCurrentPrice && ordersWithCurrentPrice.value) {
      ordersWithCurrentPrice.value.push(order);
    } else {
      this.array.add(order.price, new DoublyLinkedList<LimitOrder>([order]));
    }
  };

  getAllOrders = () => {
    const orders: LimitOrder[] = [];
    this.array.forEach((key, value) => {
      orders.push(...value.toArray());
    });
    return orders;
  };

  getOrderByPrice = (orderId: string, price: number) => {
    // this is currently O(log order with distinct price) + O(order with same price) and has to be optimized
    const orders = this.array.get(price)?.value;
    if (!orders) return;

    return orders.find((order) => order.id === orderId);
  };

  deleteOrder = (order: LimitOrder) => {
    const node = this.array.get(order.price);

    if (!node || !node.value) {
      console.warn(`No orders found at price ${order.price}`);
      return;
    }
    const orders = node.value;

    orders.delete(order);

    if (orders.size === 0) {
      this.array.delete(node.key);
    }
  };

  deleteOrdersByPrice = (orders: DoublyLinkedList<LimitOrder>, price: number) => {
    const node = this.array.get(price);
    if (!node || !node.value) {
      console.warn(`No orders found at price ${price}`);
      return;
    }

    const nodeOrders = node.value;
    for (const order of orders) {
      nodeOrders.delete(order);
    }

    if (nodeOrders.size === 0) {
      this.array.delete(node.key);
    }
  };

  matchOrdersForPrice = (price: number): DoublyLinkedList<LimitOrder> => {
    const bestPriceNode = this.orderSide === OrderSide.ASK ? this.array.head() : this.array.tail();
    if (!bestPriceNode || !bestPriceNode.key || !bestPriceNode.value) {
      return new DoublyLinkedList<LimitOrder>();
    }

    if (this.orderSide === OrderSide.ASK && bestPriceNode.key > price) {
      return new DoublyLinkedList<LimitOrder>();
    }
    if (this.orderSide === OrderSide.BID && bestPriceNode.key < price) {
      return new DoublyLinkedList<LimitOrder>();
    }
    return bestPriceNode?.value ?? new DoublyLinkedList<LimitOrder>();
  };

  getBestPriceOrders = () => {
    const bestPriceNode = this.orderSide === OrderSide.ASK ? this.array.head() : this.array.tail();
    return bestPriceNode?.value ?? new DoublyLinkedList<LimitOrder>();
  };

  print = () => {
    console.log(`\n------------ ${this.orderSide} ------------\n`);
    this.array.print();
    console.log(`\n----------------------------------\n`);
  };
}
