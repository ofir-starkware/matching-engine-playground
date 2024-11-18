import { MatchingEngine } from "./MatchingEngine";
import { mostlyAsks, randomBuyOrSell, randomNormalPrice, randomPrice, randomSize } from "./mathUtils";
import { DataStructureTypes, Order, OrderSide, OrderType } from "./types";

const testCompletelyDistinctPrices = (dataStructureType: DataStructureTypes, amountOfOrders: number) => {
  const matchingEngine = new MatchingEngine({ dataStructureType });

  for (let i = 0; i < amountOfOrders / 2; i++) {
    const order: Order = {
      id: i.toString(),
      type: OrderType.LIMIT,
      side: OrderSide.BID,
      price: randomPrice(),
      quantity: randomSize(),
    };

    matchingEngine.addOrder(order);
  }

  for (let i = 0; i < amountOfOrders / 2; i++) {
    const order: Order = {
      id: amountOfOrders + i.toString(),
      type: OrderType.LIMIT,
      side: OrderSide.ASK,
      price: randomPrice() + 1_000,
      quantity: randomSize(),
    };
    matchingEngine.addOrder(order);
  }
};

const testPricesInNormalDistribution = (dataStructureType: DataStructureTypes, amountOfOrders: number) => {
  const matchingEngine = new MatchingEngine({ dataStructureType });

  for (let i = 0; i < amountOfOrders; i++) {
    const order: Order = {
      id: i.toString(),
      type: OrderType.LIMIT,
      side: randomBuyOrSell(),
      price: randomNormalPrice(),
      quantity: randomSize(),
    };

    matchingEngine.addOrder(order);
  }
};

const testPerfectlyMatchedDistinctPrices = (dataStructureType: DataStructureTypes, amountOfOrders: number) => {
  const matchingEngine = new MatchingEngine({ dataStructureType });

  for (let i = 0; i < amountOfOrders / 2; i++) {
    const order: Order = {
      id: i.toString(),
      type: OrderType.LIMIT,
      side: OrderSide.BID,
      price: i,
      quantity: 1,
    };

    matchingEngine.addOrder(order);
  }

  for (let i = 0; i < amountOfOrders / 2; i++) {
    const order: Order = {
      id: amountOfOrders + i.toString(),
      type: OrderType.LIMIT,
      side: OrderSide.ASK,
      price: i,
      quantity: 1,
    };
    matchingEngine.addOrder(order);
  }
};

const testPerfectlyMatchedPricesWithTheSamePrice = (dataStructureType: DataStructureTypes, amountOfOrders: number) => {
  const matchingEngine = new MatchingEngine({ dataStructureType });

  for (let i = 0; i < amountOfOrders / 2; i++) {
    const order: Order = {
      id: i.toString(),
      type: OrderType.LIMIT,
      side: OrderSide.BID,
      price: 100,
      quantity: 1,
    };

    matchingEngine.addOrder(order);
  }

  for (let i = 0; i < amountOfOrders / 2; i++) {
    const order: Order = {
      id: amountOfOrders + i.toString(),
      type: OrderType.LIMIT,
      side: OrderSide.ASK,
      price: 100,
      quantity: 1,
    };
    matchingEngine.addOrder(order);
  }
};

const test75PercentAsksPricesWithTheSamePrice = (dataStructureType: DataStructureTypes, amountOfOrders: number) => {
  const matchingEngine = new MatchingEngine({ dataStructureType });

  for (let i = 0; i < amountOfOrders; i++) {
    const order: Order = {
      id: i.toString(),
      type: OrderType.LIMIT,
      side: mostlyAsks(),
      price: 100,
      quantity: 1,
    };

    matchingEngine.addOrder(order);
  }
};

export const pricesDistributionTest = [
  {
    name: "Completely Distinct Prices",
    test: testCompletelyDistinctPrices,
  },
  // {
  //   name: "Prices in Normal Distribution",
  //   test: testPricesInNormalDistribution,
  // },
  {
    name: "Perfectly Matched Distinct Prices",
    test: testPerfectlyMatchedDistinctPrices,
  },
  {
    name: "Perfectly Matched Prices With The Same Price",
    test: testPerfectlyMatchedPricesWithTheSamePrice,
  },
  {
    name: "75% Asks Prices With The Same Price",
    test: test75PercentAsksPricesWithTheSamePrice,
  },
];
