import { OrderSide } from "./types";

export const getRandomInt = (max: number) => {
  return Math.floor(Math.random() * max);
};

export const randomBuyOrSell = () => {
  return getRandomInt(2) === 0 ? OrderSide.BID : OrderSide.ASK;
};

export const randomSize = () => {
  return getRandomInt(10) + 1;
};

export const randomPrice = () => {
  return getRandomInt(1_000) + 1;
};

export const mostlyAsks = () => {
  return getRandomInt(4) === 0 ? OrderSide.BID : OrderSide.ASK;
};
const generateNormalRandom = (mean: number, stdDev: number): number => {
  let u1 = Math.random(); // Uniform(0,1) random number
  let u2 = Math.random(); // Uniform(0,1) random number

  // Apply Box-Muller transform
  let z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);

  // Scale and shift to the desired mean and standard deviation
  return z0 * stdDev + mean;
};

export const randomNormalPrice = () => {
  return Math.abs(generateNormalRandom(1_000, 1));
};
