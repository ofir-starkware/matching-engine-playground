import { AVLTreeOrderBookSide } from "./AVLTreeOrderBookSide";
import { OrderBookSide } from "./OrderBookSide";
import { RedBlackTreeOrderBookSide } from "./RedBlackTreeOrderBookSide";
import { SortedListOrderBookSide } from "./SortedListOrderBookSide";
import { DataStructure, DataStructureTypes, OrderSide } from "./types";

export class OrderBookSideFactory {
  static createDataLayer(dataStructureType: DataStructureTypes, orderSide: OrderSide): OrderBookSide<DataStructure> {
    switch (dataStructureType) {
      case DataStructureTypes.RedBlackTree:
        return new RedBlackTreeOrderBookSide(orderSide);
      case DataStructureTypes.AVLTree:
        return new AVLTreeOrderBookSide(orderSide);
      case DataStructureTypes.SortedArray:
        return new SortedListOrderBookSide(orderSide);
      default:
        throw new Error("Data structure not supported");
    }
  }
}
