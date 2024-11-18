import { MatchingEngine } from "./MatchingEngine";
import { Order, OrderType, OrderSide, DataStructureTypes } from "./types";

describe("MatchingEngine business logic", () => {
  const matchingEngine = new MatchingEngine({ dataStructureType: DataStructureTypes.SortedArray });

  beforeEach(() => {
    matchingEngine.reset();
  });

  it("should add a limit order to the order book", () => {
    const order: Order = {
      id: "1",
      type: OrderType.LIMIT,
      side: OrderSide.BID,
      price: 100,
      quantity: 10,
    };

    matchingEngine.addOrder(order);
    const bids = matchingEngine.getBids();
    expect(bids.getAllOrders().length).toBe(1);
    expect(bids.getAllOrders()[0]).toEqual(order);
  });

  it("should not match buy and sell orders if prices do not overlap", () => {
    const buyOrder: Order = {
      id: "1",
      type: OrderType.LIMIT,
      side: OrderSide.BID,
      price: 100,
      quantity: 10,
    };

    const sellOrder: Order = {
      id: "2",
      type: OrderType.LIMIT,
      side: OrderSide.ASK,
      price: 101,
      quantity: 10,
    };

    matchingEngine.addOrder(buyOrder);
    matchingEngine.addOrder(sellOrder);
    const bids = matchingEngine.getBids();
    const asks = matchingEngine.getAsks();
    expect(bids.getAllOrders().length).toBe(1);
    expect(asks.getAllOrders().length).toBe(1);
  });

  it("should match a limit buy order with an exact price limit sell order", () => {
    const buyOrder: Order = {
      id: "1",
      type: OrderType.LIMIT,
      side: OrderSide.BID,
      price: 100,
      quantity: 10,
    };

    const sellOrder: Order = {
      id: "2",
      type: OrderType.LIMIT,
      side: OrderSide.ASK,
      price: 100,
      quantity: 10,
    };

    matchingEngine.addOrder(buyOrder);
    matchingEngine.addOrder(sellOrder);
    const bids = matchingEngine.getBids();
    const asks = matchingEngine.getAsks();
    expect(bids.getAllOrders().length).toBe(0);
    expect(asks.getAllOrders().length).toBe(0);
  });

  it("should partially match a buy order with a sell order of smaller quantity", () => {
    const buyOrder: Order = {
      id: "1",
      type: OrderType.LIMIT,
      side: OrderSide.BID,
      price: 100,
      quantity: 10,
    };

    const sellOrder: Order = {
      id: "2",
      type: OrderType.LIMIT,
      side: OrderSide.ASK,
      price: 100,
      quantity: 5,
    };

    matchingEngine.addOrder(buyOrder);
    matchingEngine.addOrder(sellOrder);
    const bids = matchingEngine.getBids();
    const asks = matchingEngine.getAsks();
    expect(bids.getAllOrders().length).toBe(1);
    expect(asks.getAllOrders().length).toBe(0);
    expect(bids.getAllOrders()[0].quantity).toBe(5);
  });

  it("should match with best opposite order if eligible for an immediate match", () => {
    const buyOrder1: Order = {
      id: "1",
      type: OrderType.LIMIT,
      side: OrderSide.BID,
      price: 100,
      quantity: 10,
    };

    const buyOrder2: Order = {
      id: "2",
      type: OrderType.LIMIT,
      side: OrderSide.BID,
      price: 101,
      quantity: 10,
    };

    const buyOrder3: Order = {
      id: "3",
      type: OrderType.LIMIT,
      side: OrderSide.BID,
      price: 102,
      quantity: 10,
    };

    const sellOrder: Order = {
      id: "4",
      type: OrderType.LIMIT,
      side: OrderSide.ASK,
      price: 100,
      quantity: 10,
    };

    matchingEngine.addOrder(buyOrder1);
    matchingEngine.addOrder(buyOrder2);
    matchingEngine.addOrder(buyOrder3);
    console.log("\n---------------------------------------------------------'n", "\n\n\n");

    matchingEngine.addOrder(sellOrder);
    const bids = matchingEngine.getBids();
    const asks = matchingEngine.getAsks();
    // console.log("\n---------------------------------------------------------'n", matchingEngine.getBids().getAllOrders(), "\n\n\n");
    expect(bids.getAllOrders().length).toBe(2);
    expect(asks.getAllOrders().length).toBe(0);
    expect(bids.getAllOrders()[0].quantity).toBe(10);
    expect(bids.getAllOrders()[0].price).toBe(100);
  });

  it("should prioritize earlier orders when prices are the same (FIFO)", () => {
    const buyOrder1: Order = {
      id: "1",
      type: OrderType.LIMIT,
      side: OrderSide.BID,
      price: 100,
      quantity: 10,
    };

    const buyOrder2: Order = {
      id: "2",
      type: OrderType.LIMIT,
      side: OrderSide.BID,
      price: 100,
      quantity: 10,
    };

    const sellOrder: Order = {
      id: "3",
      type: OrderType.LIMIT,
      side: OrderSide.ASK,
      price: 100,
      quantity: 10,
    };

    matchingEngine.addOrder(buyOrder1);
    matchingEngine.addOrder(buyOrder2);
    matchingEngine.addOrder(sellOrder);
    const bids = matchingEngine.getBids();
    const asks = matchingEngine.getAsks();
    expect(bids.getAllOrders().length).toBe(1);
    expect(asks.getAllOrders().length).toBe(0);
    expect(bids.getAllOrders()[0].quantity).toBe(10);
    expect(bids.getAllOrders()[0].id).toBe("2");
  });

  it("should match a market order with best available limit orders", () => {
    const limitOrder1: Order = {
      id: "1",
      type: OrderType.LIMIT,
      side: OrderSide.ASK,
      price: 100,
      quantity: 10,
    };

    const limitOrder2: Order = {
      id: "2",
      type: OrderType.LIMIT,
      side: OrderSide.ASK,
      price: 95,
      quantity: 10,
    };

    const marketOrder: Order = {
      id: "3",
      type: OrderType.MARKET,
      side: OrderSide.BID,
      quantity: 10,
    };

    matchingEngine.addOrder(limitOrder1);
    matchingEngine.addOrder(limitOrder2);
    matchingEngine.addOrder(marketOrder);

    const bids = matchingEngine.getBids();
    const asks = matchingEngine.getAsks();

    expect(bids.getAllOrders().length).toBe(0);
    expect(asks.getAllOrders().length).toBe(1);
    expect(asks.getAllOrders()[0].id).toBe("1");
    expect(asks.getAllOrders()[0].price).toBe(100);
  });

  it("should partially match a market order with existing limit orders", () => {
    const limitOrder: Order = {
      id: "1",
      type: OrderType.LIMIT,
      side: OrderSide.ASK,
      price: 100,
      quantity: 10,
    };

    matchingEngine.addOrder(limitOrder);

    const marketOrder: Order = {
      id: "2",
      type: OrderType.MARKET,
      side: OrderSide.BID,
      quantity: 5,
    };

    matchingEngine.addOrder(marketOrder);
    const bids = matchingEngine.getBids();
    const asks = matchingEngine.getAsks();
    expect(bids.getAllOrders().length).toBe(0);
    expect(asks.getAllOrders().length).toBe(1);
    expect(asks.getAllOrders()[0].quantity).toBe(5);
  });

  it("should return a no match error when adding a market order to an empty order book", () => {
    const marketOrder: Order = {
      id: "1",
      type: OrderType.MARKET,
      side: OrderSide.BID,
      quantity: 10,
    };

    expect(() => matchingEngine.addOrder(marketOrder)).toThrow("No match found for market order");
  });

  it("should handle multiple distinct limit orders on the same side, regardless of price or amount", () => {
    const order1: Order = {
      id: "1",
      type: OrderType.LIMIT,
      side: OrderSide.BID,
      price: 100,
      quantity: 10,
    };

    const order2: Order = {
      id: "2",
      type: OrderType.LIMIT,
      side: OrderSide.BID,
      price: 101,
      quantity: 5,
    };

    const order3: Order = {
      id: "3",
      type: OrderType.LIMIT,
      side: OrderSide.BID,
      price: 100,
      quantity: 15,
    };

    matchingEngine.addOrder(order1);
    matchingEngine.addOrder(order2);
    matchingEngine.addOrder(order3);
    const bids = matchingEngine.getBids();
    const bidsOrders = bids.getAllOrders();

    expect(bidsOrders).toContainEqual(order1);
    expect(bidsOrders).toContainEqual(order2);
    expect(bidsOrders).toContainEqual(order3);
  });
});
