import { pricesDistributionTest } from "./testPricesDistribution";
import { DataStructureTypes } from "./types";
const DEFAULT_AMOUNT_OF_ORDERS = 10_000_000;

const measure = () => {
  const amountOfOrders = process.env.AMOUNT_OF_ORDERS ? parseInt(process.env.AMOUNT_OF_ORDERS) : DEFAULT_AMOUNT_OF_ORDERS;
  console.log(`Running performance tests with ${amountOfOrders} orders...\n`);
  const testResults = pricesDistributionTest.map(({ name, test }) => {
    console.log("\n--------------------------------------------------\n");
    console.log(`Running test: ${name}\n`);

    return { name, ...measureDataStructuresPerformance(test, amountOfOrders) };
  });

  console.table(testResults);
};

const measureDataStructuresPerformance = (
  fn: (dataStructure: DataStructureTypes, amountOfOrders: number) => void,
  amountOfOrders: number = DEFAULT_AMOUNT_OF_ORDERS
) => {
  const results: any = {};

  Object.keys(DataStructureTypes).forEach((dataStructureType) => {
    if (!gc) throw new Error("gc() is not available. Add the --expose-gc flag when running node to enable it.");
    // if (dataStructureType === DataStructureTypes.SortedArray) return;

    console.log(`Measuring performance of: ${dataStructureType}...`);

    const dataStructure = DataStructureTypes[dataStructureType as keyof typeof DataStructureTypes];

    const start = Date.now();
    gc();
    const beforeMemory = process.memoryUsage();

    fn(dataStructure, amountOfOrders);

    const afterMemory = process.memoryUsage();
    gc();
    const end = Date.now();

    const executionTime = end - start + "ms";
    const memoryUsed = Math.floor((afterMemory.heapUsed - beforeMemory.heapUsed) / (1024 * 1024)) + "MB";

    results[dataStructure] = `time: ${executionTime} | memory: ${memoryUsed}`;
    console.log("Done\n");
  });

  return results;
};

measure();
