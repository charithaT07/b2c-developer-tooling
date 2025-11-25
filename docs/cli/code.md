# Code Commands

Commands for managing cartridge code on B2C Commerce instances.

## b2c code deploy

Deploy cartridges to a B2C Commerce instance.

### Usage

```bash
b2c code deploy [CARTRIDGEPATH]
```

### Arguments

| Argument | Description | Default |
|----------|-------------|---------|
| `CARTRIDGEPATH` | Path to cartridges directory | `./cartridges` |

### Flags

In addition to [global flags](./index#global-flags):

| Flag | Short | Description |
|------|-------|-------------|
| `--code-version` | `-v` | Code version to deploy to (required) |

### Examples

```bash
# Deploy from default ./cartridges directory
b2c code deploy --server my-sandbox.demandware.net --code-version v1

# Deploy from custom path
b2c code deploy ./my-cartridges --server my-sandbox.demandware.net --code-version v1

# Using environment variables
export SFCC_SERVER=my-sandbox.demandware.net
export SFCC_CODE_VERSION=v1
export SFCC_USERNAME=my-user
export SFCC_PASSWORD=my-access-key
b2c code deploy
```

### Authentication

This command supports both Basic Authentication and OAuth:

- **Basic Auth** (recommended for WebDAV): Provide `--username` and `--password`
- **OAuth**: Provide `--client-id` and `--client-secret`

Basic authentication is preferred for WebDAV operations due to better performance.
