# Smart Contracts for AI - Integrated Network State project

Solidity Smart Contract

## Description

Smart Contracts for AI-integrated Network State project.
Blockchain Target deployment: Linea

## Usage

### Pre requisites

Copy this file to `.env` to run the Smart Contract locally:

```bash
cp .env-example .env
```

### Installation

Install the dependencies:

```bash
yarn install
```

Enable Git hooks (Husky):

```bash
yarn husky install
```

### Compile

Compile the smart contracts:

```bash
yarn compile
```

### TypeChain

Generate TypeChain artifacts:

```bash
yarn typechain
```

### Lint Solidity

Generate TypeChain artifacts:

```bash
yarn lint:sol
```

### Lint TypeScript

Generate TypeChain artifacts:

```bash
yarn lint:ts
```

### Prettier

Format code:

```bash
yarn prettier
```

### Test

Execute tests:

```bash
yarn test
```

### Coverage

Generate the code coverage report:

```bash
yarn coverage
```

### Report Gas

Generate report on gas usage per unit test and average gas per function:

```bash
REPORT_GAS=true yarn test
```

### Clean

Remove the smart contract & Typechain artifacts, the coverage reports and the Hardhat cache:

```bash
yarn clean
```

### Continuous Integration

For Github action workflows "Continuous Integration", set secret environment variables:

- MNEMONIC
- INFURA_API_KEY
