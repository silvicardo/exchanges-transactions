# Development Guidelines - Prisma Transactions V1

## Project Overview
This is a Next.js 13+ application for cryptocurrency transaction management and tax reporting. It supports multiple exchanges (Young Platform, Crypto.com, Bitpanda, Nexo, Coinbase) and provides a web interface for analyzing crypto transactions with fiat conversion tracking.

## Build/Configuration Instructions

### Prerequisites
- Node.js (version compatible with Next.js 13.4.6)
- PostgreSQL database
- pnpm (preferred package manager based on pnpm-lock.yaml)

### Environment Setup
1. Copy `.env.example` to `.env` and configure PostgreSQL connection:
   ```
   POSTGRES_URL=postgresql://username:password@localhost:5432/transactions-v1
   POSTGRES_URL_NON_POOLING=postgresql://username:password@localhost:5432/transactions-v1
   POSTGRES_USER=username
   POSTGRES_HOST=localhost
   POSTGRES_PASSWORD=password
   POSTGRES_DATABASE=transactions-v1
   POSTGRES_PRISMA_URL=postgresql://username:password@localhost:5432/transactions-v1
   ```

2. Start PostgreSQL database (using Docker Compose):
   ```bash
   docker-compose up -d
   ```

### Database Setup
1. Generate Prisma client: `prisma generate`
2. Push schema to database: `prisma db push`
3. Seed database (only on first setup): `prisma db seed`

**Important**: The seed command will fail if currencies/exchanges already exist due to unique constraints. This is expected behavior after initial setup.

### Development Commands
- `pnpm dev` - Start development server (includes Prisma generation)
- `pnpm build` - Full production build (includes DB setup and seeding)
- `pnpm start` - Start production server
- `pnpm seed` - Manual database seeding
- `pnpm parse` - Parse CSV files to JSON
- `pnpm parse:yp` - Parse Young Platform data
- `pnpm parse:bitpanda` - Parse Bitpanda data
- `pnpm parse:crypto-com-app` - Parse Crypto.com App data
- `pnpm parse:nexo` - Parse Nexo data

### Build Process Notes
- The build script runs: `prisma generate && prisma db push && prisma db seed && next build`
- Database must be available during build process
- Seeding may fail on subsequent builds due to existing data (this is normal)
- For production builds without seeding, use: `prisma generate && next build`

## Architecture & Code Organization

### Directory Structure
```
src/
├── app/                 # Next.js 13+ App Router pages
├── components/          # React components (organized in folders with index.tsx)
├── db/                  # Database abstraction layer
│   ├── selectors/       # Database query functions
│   └── handlers/        # Database mutation functions
├── manager/             # Business logic layer
├── adapters/            # Data transformation adapters
├── utils/               # Utility functions
├── constants.ts         # Shared constants
└── types.ts            # Shared TypeScript types

commands/               # CLI scripts for data parsing
prisma/                # Database schema and migrations
csvs/                  # CSV data files for import
```

### Key Technologies
- **Next.js 13.4.6** with App Router and Server Actions (experimental)
- **Prisma 4.13.0** with PostgreSQL
- **Chakra UI 2.7.0** for component library
- **TypeScript** with strict configuration
- **React 18.2.0** with Server Components and Suspense

## Development Patterns & Code Style

### Component Organization
- Components are organized in folders with `index.tsx` files
- Use `"use client"` directive only when client-side features are needed
- Server components are preferred for data fetching

### Import Patterns
- Use path aliases: `@/src/...` for absolute imports from project root
- Chakra UI components imported from `@/src/components/chakra`
- Database access through `@/src/db` abstraction layer

### Database Patterns
- Use the database abstraction layer: `database.selectors.*` and `database.handlers.*`
- All transaction models store `originalData` as JSON for audit trails
- Each exchange has dedicated models with specific enums and constraints
- Currency and exchange data is seeded, not hardcoded

### TypeScript Configuration
- Strict mode enabled
- Path mapping configured for `@/*` imports
- Includes Prisma seed file in compilation

### Server Components & Data Fetching
```typescript
// Async server components for data fetching
const MyComponent = async ({ timestamp }: QueryConfig) => {
  const data = await database.selectors.someQuery({ timestamp });
  return <div>{/* render data */}</div>;
};

// Use Suspense for loading states
// <Suspense fallback={<Skeleton height="57px" />}>
//   <MyComponent />
// </Suspense>
```

### CLI Command Pattern
```typescript
// commands/*.ts files use process.argv for argument parsing
import argv from "process.argv";

const config = argv<Config>(process.argv.slice(2));
// Usage: npm run command -- --param=value
```

## Database Schema Notes

### Multi-Exchange Support
The schema supports 6+ cryptocurrency exchanges with dedicated models:
- Young Platform: `YoungPlatformTrade`, `YoungPlatformMovement`
- Bitpanda: `BitpandaTrade`, `BitpandaProTrade`, `BitpandaProDepositWithdraw`
- Crypto.com: `CryptoComFiatTransaction`, `CryptoComCryptoTransaction`, etc.
- Nexo: `NexoTransaction`, `NexoProSpotTransaction`
- Coinbase: `CoinbaseTransaction`
- Ledger: `LedgerOperation`

### Currency Management
- 130+ supported cryptocurrencies and fiat currencies
- Currency typology (CRYPTO/FIAT) classification
- Extensive enums for transaction types per exchange

### Data Integrity
- All models include `originalData` JSON field for raw data preservation
- Unique constraints on transaction IDs per exchange
- User and Account models for multi-user support

## Known Issues & Considerations

### Prisma Version
- Currently using Prisma 4.13.0 (major update to 6.11.1 available)
- Consider upgrading following the major version upgrade guide

### Docker Configuration
- Current Dockerfile is a template placeholder
- Only docker-compose.yaml is configured (PostgreSQL only)
- Production Docker setup needs implementation

### Build Process
- Database seeding fails on subsequent runs (expected behavior)
- Full build requires active database connection
- Consider separating build and deployment steps for production

## Testing & Quality Assurance

### Current Test Setup
- Jest configuration present but no tests implemented (`"Error: no test specified"`)
- Consider implementing tests for:
  - Database selectors and handlers
  - Data parsing functions
  - Component rendering
  - Business logic in managers

### Code Quality Tools
- ESLint configured with Next.js rules
- Prettier configured for code formatting
- TypeScript strict mode for type safety

## Application Structure & Functionality

### Core Application Purpose
The application is a comprehensive **Crypto Transactions Manager** designed as an in-house tool for:
- **Multi-Exchange Data Import**: Supports 9+ major crypto exchanges (Bitpanda, Crypto.com, Young Platform, Nexo, Coinbase, Ledger, etc.)
- **Transaction Management**: Centralized storage and analysis of crypto transactions with fiat conversion tracking
- **Tax Reporting**: Year-based reporting (2021-2024) with detailed breakdowns for tax compliance
- **Data Export**: Export capabilities to external tax software (Koinly format supported)

### src/app Directory Structure & Pages

#### Main Application Pages
- **`/` (page.tsx)**: Dashboard showing yearly overview of deposits, withdrawals, borrowing, and repayments
- **`/import`**: File upload interface for importing CSV data from various exchanges
- **`/convert`**: Export functionality to convert data to external formats (Koinly)
- **`/fiat-deposit`**: Fiat deposit tracking and analysis by year and exchange
- **`/fiat-withdrawal`**: Fiat withdrawal tracking and analysis by year and exchange
- **`/report/[year]`**: Comprehensive yearly tax reports with three main sections:
  - Fiat In/Out movements
  - Borrowing activities (Nexo integration)
  - Crypto-to-fiat sales for tax purposes

#### Dynamic Routes & Exchange-Specific Views
- **`/fiat-deposit/[exchangeName]`**: Detailed deposit lists filtered by specific exchange
- **`/fiat-withdrawal/[exchangeName]`**: Detailed withdrawal lists filtered by specific exchange
- **`/report/[year]/fiat-deposit`**: Year-specific fiat deposit reports
- **`/report/[year]/fiat-sales`**: Year-specific crypto sales reports for tax calculations

#### Import System Features
The import system (`/import`) supports:
- **Multi-Exchange Support**: 9 different exchanges with specific file format handling
- **File Type Validation**: Each exchange has predefined CSV file types (trades, deposits, transactions, etc.)
- **Year-Based Organization**: Data organized by tax years (2021-2024)
- **Server Actions**: Uses Next.js server actions for secure file processing

#### Supported Exchange Data Types
- **Bitpanda**: trades
- **Bitpanda Pro**: deposit_withdraw, trades
- **Crypto.com App**: card_transactions, crypto_transactions, fiat_transactions
- **Crypto.com Exchange**: dust_conversions
- **Young Platform**: buy_sell_swap, deposit_withdraw_fee_order
- **Nexo**: transactions
- **Nexo Pro**: spot_transactions
- **Ledger**: operations
- **Coinbase**: transactions

#### Component Architecture
- **`_components/`**: Shared components for fiat deposit functionality
- **`actions/`**: Server actions for form processing and data handling
- **Suspense Integration**: Extensive use of React Suspense for progressive loading
- **Server Components**: Async server components for database queries

### Business Logic Flow
1. **Data Import**: Users upload CSV files from exchanges via drag-and-drop interface
2. **Data Processing**: Server actions validate and process files into database models
3. **Data Analysis**: Dashboard and report pages aggregate data for tax reporting
4. **Export**: Users can export processed data to external tax software formats

### Tax Reporting Features
- **Multi-Year Analysis**: Supports tax years 2021-2024
- **Fiat Movement Tracking**: Detailed tracking of EUR deposits and withdrawals
- **Crypto Sales Reporting**: Capital gains/losses calculations for tax compliance
- **Borrowing Integration**: Special handling for Nexo borrowing and repayment activities
- **Exchange Aggregation**: Consolidated view across all supported exchanges

## Performance Considerations

### Database Queries
- Use the selector abstraction layer for consistent query patterns
- Consider implementing query optimization for large transaction datasets
- Original JSON data storage may impact performance with large datasets

### Next.js Optimization
- Server components used for data fetching (good for performance)
- Suspense boundaries for progressive loading
- Consider implementing caching strategies for expensive calculations
