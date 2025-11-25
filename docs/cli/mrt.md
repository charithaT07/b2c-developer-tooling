# MRT Commands

Commands for managing Managed Runtime (MRT) environments.

## b2c mrt env-var set

Set an environment variable on a Managed Runtime project.

### Usage

```bash
b2c mrt env-var set <KEY> <VALUE>
```

### Arguments

| Argument | Description | Required |
|----------|-------------|----------|
| `KEY` | Environment variable name | Yes |
| `VALUE` | Environment variable value | Yes |

### Flags

| Flag | Short | Description | Required |
|------|-------|-------------|----------|
| `--project` | | MRT project ID | Yes |
| `--environment` | `-e` | Target environment | Yes |
| `--api-key` | | MRT API key | Yes |

### Examples

```bash
# Set an environment variable
b2c mrt env-var set MY_VAR "my value" \
  --project acme-storefront \
  --environment production \
  --api-key your-api-key

# Using environment variables
export SFCC_MRT_API_KEY=your-api-key
b2c mrt env-var set MY_VAR "my value" \
  --project acme-storefront \
  --environment production
```

### Authentication

MRT commands use API key authentication. Provide `--api-key` or set the `SFCC_MRT_API_KEY` environment variable.

::: warning
This command is currently a stub and not yet fully implemented.
:::
