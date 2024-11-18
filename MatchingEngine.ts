import { Order, OrderType, LimitOrder, MarketOrder, OrderSide, DataStructure, DataStructureTypes } from "./types";
import { OrderBookSide } from "./OrderBookSide";
import { OrderBookSideFactory } from "./OrderBookSideFactory";
import { DoublyLinkedList } from "data-structure-typed";

export interface MatchingEngineOptions {
  dataStructureType?: DataStructureTypes;
}

export class MatchingEngine {
  private bids: OrderBookSide<DataStructure>;
  private asks: OrderBookSide<DataStructure>;
  private dataStructureType: DataStructureTypes;

  constructor(options?: MatchingEngineOptions) {
    this.dataStructureType = options?.dataStructureType || DataStructureTypes.RedBlackTree;
    this.bids = OrderBookSideFactory.createDataLayer(this.dataStructureType, OrderSide.BID);
    this.asks = OrderBookSideFactory.createDataLayer(this.dataStructureType, OrderSide.ASK);
  }

  private getSideByOrder = (order: Order) => {
    return order.side === OrderSide.BID ? this.bids : this.asks;
  };

  private getOpposingSideByOrder = (order: Order) => {
    return order.side === OrderSide.BID ? this.asks : this.bids;
  };

  addOrder = (newOrder: Order) => {
    switch (newOrder.type) {
      case OrderType.LIMIT:
        this.addLimitOrder(newOrder as LimitOrder);
        break;
      case OrderType.MARKET:
        this.addMarketOrder(newOrder as MarketOrder);
        break;
    }
  };

  private addMarketOrder = (marketOrder: MarketOrder) => {
    this.matchWithImmediateTrades(marketOrder);
  };

  private addLimitOrder = (limitOrder: LimitOrder) => {
    this.matchWithImmediateTrades(limitOrder);
    if (limitOrder.quantity > 0) {
      const side = this.getSideByOrder(limitOrder);
      side.addOrder(limitOrder);
    }
  };

  private tradeImmediateOrder = (newOrder: Order, matchedOrdersWithMatchedPrice: DoublyLinkedList<LimitOrder>) => {
    const opposingSide = this.getOpposingSideByOrder(newOrder);
    const ordersToDelete = new DoublyLinkedList<LimitOrder>();
    /*
    if both order have the same quantity, remove matched order from the order book and break.
    if new order has more quantity, remove matched order from the order book and add the remaining quantity to the order book.
    */
    for (const matchedOrder of matchedOrdersWithMatchedPrice) {
      if (newOrder.quantity < matchedOrder.quantity) {
        matchedOrder.quantity -= newOrder.quantity;
        newOrder.quantity = 0;

        break;
      } else if (newOrder.quantity === matchedOrder.quantity) {
        newOrder.quantity = 0;
        ordersToDelete.push(matchedOrder);
        break;
      } else {
        newOrder.quantity -= matchedOrder.quantity;
        ordersToDelete.push(matchedOrder);
      }
    }
    if (ordersToDelete.size > 0) {
      opposingSide.deleteOrdersByPrice(ordersToDelete, ordersToDelete.at(0)!.price);
    }
  };

  private findImmediateTrades = (newOrder: Order): DoublyLinkedList<LimitOrder> => {
    const opposingSide = this.getOpposingSideByOrder(newOrder);
    switch (newOrder.type) {
      case OrderType.LIMIT:
        return opposingSide.matchOrdersForPrice(newOrder.price as number);
      case OrderType.MARKET:
        const bestPriceOrders = opposingSide.getBestPriceOrders();
        if (bestPriceOrders.size === 0) {
          throw new Error("No match found for market order");
        }
        return bestPriceOrders;
      default:
        throw new Error(`Order type ${newOrder.type} not supported`);
    }
  };

  private matchWithImmediateTrades = (newOrder: Order) => {
    let ordersForImmediateTrade = this.findImmediateTrades(newOrder);
    while (newOrder.quantity > 0 && ordersForImmediateTrade.size > 0) {
      this.tradeImmediateOrder(newOrder, ordersForImmediateTrade);
      ordersForImmediateTrade = this.findImmediateTrades(newOrder);
    }
  };

  public visualizeOrderBook = () => {
    this.bids.print();
    this.asks.print();
  };

  public logOrderBookState = () => {
    const bids = this.getBids();
    const asks = this.getAsks();
    const bidsOrders = bids.getAllOrders();
    const asksOrders = asks.getAllOrders();
    const distinctBidPrices = Array.from(bidsOrders.keys()).length;
    const distinctAskPrices = Array.from(asksOrders.keys()).length;
    console.log({ bidsOrders: bidsOrders.length, distinctBidPrices, asksOrders: asksOrders.length, distinctAskPrices });
  };

  public reset = () => {
    this.bids = OrderBookSideFactory.createDataLayer(this.dataStructureType, OrderSide.BID);
    this.asks = OrderBookSideFactory.createDataLayer(this.dataStructureType, OrderSide.ASK);
  };

  public getBids = () => {
    return this.bids;
  };

  public getAsks = () => {
    return this.asks;
  };
}
