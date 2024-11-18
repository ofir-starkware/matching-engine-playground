# matching-engine-playground

Playground to test behavior and performance of various data structures on a lean & simple matching engine with an in-memory order book.
The repo contains:
1. A matching engine with basic funcionallity of adding new limit & market orders (and a few simple visualization options). It can optionally accept which type of data structure to use as an option.
2. Multiple order book implementations using various data structures (explained below)
3. Unit tests to check business logic validity
4. Performance tests to test both time durations and memory usage of the various order book data structures in various cases (explained below)


## Data Structures
All data structures holds currently similar logic - all are trees/arrays holds nodes/items that are sorted by price. 
Each node/item has its own doubly linked list containing all orders with the same price, and are matched in a FIFO order.

These are the currently available data structures:
1. Red black tree
2. AVL tree
3. Sorted list

## Performance tests 

They are ran as a node process locally. Outputs are logged into the terminal.

These are the scenearios being tested currenty:
1. Completely Distinct Prices - fills both bids and asks with orders such that no orders will be matched and order book will be filled completely
2. Prices in Normal Distribution - should generally emulate matching engine behavior on orders that would distribut normally on the assets price.
3. Perfectly Matched Distinct Prices - fills up bids and asks orders such that they would all match. In each side, prices are distinct to test the outer layer nodes of the data structures.
4. Perfectly Matched Prices With The Same Price - same as 3, but all orders are with the same price in order to test the inner layer nodes (FIFO layer)
5. 75% Asks Prices With The Same Price - tests behavior where most orders are of the same side.

## Usage


#### Run performance tests:
`pnpm run measure`

make sure to adjust the amount of orders you want to measure by editing the `AMOUNT_OF_ORDERS` env var in `package.json`.


#### Run unit tests:
`pnpm run test`

Please make sure you install deps first :)


## A few measure test results:

### 10M orders
| Test Name                                           | RedBlackTree                  | AVLTree                      | SortedArray                 |
|------------------------------------------------|-------------------------------|-------------------------------|-----------------------------|
| Completely Distinct Prices                    | time: 8047ms, memory: 1458MB  | time: 8635ms, memory: 1452MB  | time: 4650ms, memory: 1449MB |
| Prices in Normal Distribution                 | time: 8464ms, memory: 450MB   | time: 12495ms, memory: 431MB  | time: 5684ms, memory: 314MB  |
| Perfectly Matched Distinct Prices             | time: 21821ms, memory: 2207MB | time: 27707ms, memory: 2907MB | time: 6924ms, memory: 2069MB |
| Perfectly Matched Prices With The Same Price  | time: 4294ms, memory: 850MB   | time: 4488ms, memory: 854MB   | time: 3020ms, memory: 745MB   |
| 75% Asks Prices With The Same Price           | time: 4857ms, memory: 944MB   | time: 5164ms, memory: 898MB   | time: 4021ms, memory: 847MB   |


### 1M orders
| Name                                           | RedBlackTree                | AVLTree                    | SortedArray               |
|------------------------------------------------|-----------------------------|-----------------------------|---------------------------|
| Completely Distinct Prices                    | time: 747ms, memory: 150MB  | time: 753ms, memory: 157MB  | time: 433ms, memory: 145MB |
| Prices in Normal Distribution                 | time: 816ms, memory: 43MB   | time: 1222ms, memory: 66MB  | time: 508ms, memory: 35MB  |
| Perfectly Matched Distinct Prices             | time: 1716ms, memory: 225MB | time: 2160ms, memory: 294MB | time: 613ms, memory: 205MB |
| Perfectly Matched Prices With The Same Price  | time: 441ms, memory: 87MB   | time: 435ms, memory: 96MB   | time: 324ms, memory: 86MB  |
| 75% Asks Prices With The Same Price           | time: 497ms, memory: 110MB  | time: 487ms, memory: 114MB  | time: 406ms, memory: 102MB |


### 100K orders

| Name                                           | RedBlackTree              | AVLTree                  | SortedArray             |
|------------------------------------------------|---------------------------|---------------------------|-------------------------|
| Completely Distinct Prices                    | time: 96ms, memory: 27MB  | time: 84ms, memory: 15MB  | time: 48ms, memory: 15MB |
| Prices in Normal Distribution                 | time: 100ms, memory: 16MB | time: 131ms, memory: 20MB | time: 73ms, memory: 8MB  |
| Perfectly Matched Distinct Prices             | time: 173ms, memory: 33MB | time: 261ms, memory: 42MB | time: 63ms, memory: 22MB |
| Perfectly Matched Prices With The Same Price  | time: 64ms, memory: 21MB  | time: 64ms, memory: 22MB  | time: 54ms, memory: 12MB |
| 75% Asks Prices With The Same Price           | time: 66ms, memory: 19MB  | time: 59ms, memory: 22MB  | time: 48ms, memory: 11MB |

