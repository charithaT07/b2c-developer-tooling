# Sandbox Commands

Commands for managing on-demand sandboxes.

## b2c sandbox create

Create a new on-demand sandbox.

### Usage

```bash
b2c sandbox create <REALM>
```

### Arguments

| Argument | Description | Required |
|----------|-------------|----------|
| `REALM` | Realm ID | Yes |

### Flags

| Flag | Description | Default |
|------|-------------|---------|
| `--ttl` | Time to live in hours | `24` |
| `--profile` | Sandbox profile (small, medium, large) | `medium` |
| `--client-id` | OAuth client ID | |
| `--client-secret` | OAuth client secret | |

### Examples

```bash
# Create a sandbox with default settings
b2c sandbox create abcd --client-id xxx --client-secret yyy

# Create a sandbox with custom TTL and profile
b2c sandbox create abcd --ttl 48 --profile large --client-id xxx --client-secret yyy
```

### Authentication

This command requires OAuth authentication. Provide `--client-id` and `--client-secret` or set the corresponding `SFCC_CLIENT_ID` and `SFCC_CLIENT_SECRET` environment variables.

::: warning
This command is currently a stub and not yet fully implemented.
:::
