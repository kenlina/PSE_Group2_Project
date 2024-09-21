# Project content

This project provides the functionality to link auction contracts to a web app.
> Check [spec](./spec/spec.md) for more details

## Preliminary Steps

First, you need to install the dependencies for both the contract and the web application.

1. Enter the `contracts` directory and install dependencies:
    ```bash
    cd contracts
    npm install
    ```
> If there are changes to the contract, recompile them in the contracts directory: 
    ```
    npx hardhat compile
    ```

2. Enter the `web-ts` directory and install dependencies:
    ```bash
    cd web-ts
    npm install
    ```

## Running the Web App

Next, start the contract node and deploy the contract, then run the web application.

### Start the Contract Node First

1. Navigate to the `contracts` directory:
    ```bash
    cd contracts
    ```

2. Launch the Hardhat node:
    ```bash
    npx hardhat node
    ```

3. In a new terminal window, execute the following command to deploy the contract to the local network:
    ```bash
    npx hardhat ignition deploy ./ignition/modules/Auction.js --network localhost
    ```

### Run the Web Application

1. In another terminal window, navigate to the `web-ts` directory:
    ```bash
    cd ../web-ts
    ```

2. Start the development server:
    ```bash
    npm run dev
    ```

3. Open a browser and visit [localhost:3000](http://localhost:3000) to view the application.
