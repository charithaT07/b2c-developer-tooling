# Configuration

The B2C CLI supports multiple authentication methods and configuration options.

## Authentication Methods

### OAuth (Recommended)

OAuth authentication is the recommended method for production use. It uses the Account Manager OAuth flow.

```bash
b2c code deploy \
  --server your-instance.demandware.net \
  --client-id your-client-id \
  --client-secret your-client-secret
```

### Basic Authentication

For development and testing, you can use basic authentication with Business Manager credentials.

```bash
b2c code deploy \
  --server your-instance.demandware.net \
  --username your-username \
  --password your-password
```

### API Key

For certain operations, you may use an API key.

## Environment Variables

You can also configure authentication using environment variables:

| Variable | Description |
|----------|-------------|
| `B2C_SERVER` | The B2C instance hostname |
| `B2C_CLIENT_ID` | OAuth client ID |
| `B2C_CLIENT_SECRET` | OAuth client secret |
| `B2C_USERNAME` | Basic auth username |
| `B2C_PASSWORD` | Basic auth password |

## Configuration File

You can create a configuration file to store instance settings. See the [CLI Reference](/cli/) for more details on configuration file options.

## Next Steps

- [CLI Reference](/cli/) - Browse available commands
- [API Reference](/api/) - Explore the SDK API
