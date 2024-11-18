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
