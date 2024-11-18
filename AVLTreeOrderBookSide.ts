import { AVLTree, AVLTreeNode, DoublyLinkedList } from "data-structure-typed";
import { LimitOrder, OrderSide, OrderBookAVLTree } from "./types";
import { OrderBookSide } from "./OrderBookSide";

type OrderBookAVLTreeNode = AVLTreeNode<number, DoublyLinkedList<LimitOrder>>;
export class AVLTreeOrderBookSide implements OrderBookSide<OrderBookAVLTree> {
  dataStructure: OrderBookAVLTree;
  orderSide: OrderSide;

  constructor(orderSide: OrderSide) {
    this.dataStructure = new AVLTree<number, DoublyLinkedList<LimitOrder>>();
    this.orderSide = orderSide;
  }

  private get tree() {
    return this.dataStructure;
  }

  addOrder = (order: LimitOrder) => {
    const ordersWithCurrentPrice = this.tree.getNodeByKey(order.price);
    if (ordersWithCurrentPrice && ordersWithCurrentPrice.value) {
      ordersWithCurrentPrice.value.push(order);
    } else {
      this.tree.add(order.price);
      this.tree.getNodeByKey(order.price)!.value = new DoublyLinkedList<LimitOrder>([order]);
    }
  };

  getAllOrders = () => {
    const orders: LimitOrder[] = [];
    this.tree.dfs((node) => {
      if (node.value) {
        orders.push(...node.value);
      }
    }, "IN");

    return orders;
  };

  getOrderByPrice = (orderId: string, price: number) => {
    // this is currently O(log order with distinct price) + O(order with same price) and has to be optimized
    const orders = this.tree.getNodeByKey(price)?.value;
    if (!orders) return;

    return orders.find((order) => order.id === orderId);
  };

  deleteOrder = (order: LimitOrder) => {
    const node = this.tree.getNodeByKey(order.price);

    if (!node || !node.value) {
      console.warn(`No orders found at price ${order.price}`);
      return;
    }
    const orders = node.value;

    orders.delete(order);

    if (orders.size === 0) {
      this.tree.delete(node);
    }
  };

  deleteOrdersByPrice = (orders: DoublyLinkedList<LimitOrder>, price: number) => {
    const node = this.tree.getNodeByKey(price);
    if (!node || !node.value) {
      console.warn(`No orders found at price ${price}`);
      return;
    }

    const nodeOrders = node.value;
    for (const order of orders) {
      nodeOrders.delete(order);
    }

    if (nodeOrders.size === 0) {
      this.tree.delete(node);
    }
  };

  matchOrdersForPrice = (price: number): DoublyLinkedList<LimitOrder> => {
    const bestPriceNode = this.getBestPriceNode();
    if (!bestPriceNode || !bestPriceNode.key || !bestPriceNode.value) {
      return new DoublyLinkedList<LimitOrder>();
    }

    if (this.orderSide === OrderSide.ASK && bestPriceNode.key > price) {
      return new DoublyLinkedList<LimitOrder>();
    }
    if (this.orderSide === OrderSide.BID && bestPriceNode.key < price) {
      return new DoublyLinkedList<LimitOrder>();
    }
    const orders = bestPriceNode?.value;
    return orders ?? new DoublyLinkedList<LimitOrder>();
  };

  private getBestPriceNode = () => {
    let bestPriceNode: OrderBookAVLTreeNode | undefined;

    if (this.orderSide === OrderSide.ASK) {
      this.tree.getLeftMost((node) => {
        if (!node || !node.value) {
          return;
        }
        bestPriceNode = node;
      });
    } else {
      this.tree.getRightMost((node) => {
        if (!node || !node.value) {
          return;
        }
        bestPriceNode = node;
      });
    }

    return bestPriceNode;
  };

  getBestPriceOrders = () => {
    const bestPriceNode = this.getBestPriceNode();

    return bestPriceNode?.value ?? new DoublyLinkedList<LimitOrder>();
  };

  print = () => {
    console.log(`\n------------ ${this.orderSide} ------------\n`);
    this.tree.print();
    console.log(`\n----------------------------------\n`);
  };
}
