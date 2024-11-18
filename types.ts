import { AVLTree, RedBlackTree, DoublyLinkedList } from "data-structure-typed";
import { SortedArray } from "./pure-data-structures/SortedArray";

export enum OrderType {
  MARKET = "MARKET",
  LIMIT = "LIMIT",
  STOP_MARKET = "STOP_MARKET",
  STOP_LIMIT = "STOP_LIMIT",
}

export enum OrderSide {
  BID = "BID",
  ASK = "ASK",
}

export interface BaseOrder {
  id: string;
  quantity: number;
  side: OrderSide;
}

export interface Order extends BaseOrder {
  type: OrderType;
  price?: number;
}

export interface LimitOrder extends Order {
  price: number;
}

export interface MarketOrder extends Omit<Order, "price"> {}

export type OrderBookRedBlackTree = RedBlackTree<number, DoublyLinkedList<LimitOrder>>;
export type OrderBookAVLTree = AVLTree<number, DoublyLinkedList<LimitOrder>>;
export type OrderBookSortedArray = SortedArray<number, DoublyLinkedList<LimitOrder>>;
export type DataStructure = OrderBookRedBlackTree | OrderBookAVLTree | OrderBookSortedArray;
export enum DataStructureTypes {
  RedBlackTree = "RedBlackTree",
  AVLTree = "AVLTree",
  SortedArray = "SortedArray",
}
