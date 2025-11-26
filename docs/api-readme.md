# API Reference

The `@salesforce/b2c-tooling` package provides a programmatic API for interacting with Salesforce B2C Commerce instances.

## Installation

```bash
npm install @salesforce/b2c-tooling
```

## Quick Start

```typescript
import { B2CInstance } from '@salesforce/b2c-tooling/instance';
import { OAuthStrategy } from '@salesforce/b2c-tooling/auth';

const instance = new B2CInstance({
  hostname: 'your-instance.salesforce.com',
  auth: new OAuthStrategy({
    clientId: 'your-client-id',
    clientSecret: 'your-client-secret',
  }),
});
```
