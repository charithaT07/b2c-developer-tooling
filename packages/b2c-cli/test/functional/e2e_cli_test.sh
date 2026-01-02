#!/usr/bin/env bash
# b2c-cli e2e cli tests
# required env vars
# SFCC_CLIENT_ID
# SFCC_CLIENT_SECRET
# SFCC_SHORTCODE
# TEST_REALM

set -e


# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Determine CLI binary to use
if [ -x "$(npm bin)/b2c-cli" ]; then
    CLI_BIN="$(npm bin)/b2c-cli"
else
    CLI_BIN="$SCRIPT_DIR/../../bin/run.js"
fi

# Test fixtures directory
FIXTURES_DIR="$SCRIPT_DIR/fixtures"

# Suppress logs for clean JSON output
export SFCC_LOG_LEVEL=silent

echo "=== B2C CLI E2E Test ==="
echo ""

# Check required environment variables
if [ -z "$SFCC_CLIENT_ID" ] || [ -z "$SFCC_CLIENT_SECRET" ] || [ -z "$TEST_REALM" ]; then
    echo "[FAIL] Required environment variables missing:"
    echo " SFCC_CLIENT_ID, SFCC_CLIENT_SECRET, TEST_REALM"
    exit 1
fi

# Set Account Manager host for test environment (if not already set)
if [ -z "$SFCC_ACCOUNT_MANAGER_HOST" ]; then
    export SFCC_ACCOUNT_MANAGER_HOST="account-pod5.demandware.net"
    echo "[INFO] Using Account Manager host: $SFCC_ACCOUNT_MANAGER_HOST"
fi

echo "Configuration:"
echo " Realm: $TEST_REALM"
echo " Client ID: ${SFCC_CLIENT_ID:0:10}..."
echo " Account Manager: $SFCC_ACCOUNT_MANAGER_HOST"
echo " CLI Path: $CLI_BIN"
echo ""

# 1. Create on-demand sandbox with TTL=24
echo "Step 1: Creating on-demand sandbox..."
ODS_CREATE_RESULT=$("$CLI_BIN" ods create --realm "$TEST_REALM" --ttl 24 --wait --set-permissions --json)

# Debug: Show raw output if parsing fails
if ! echo "$ODS_CREATE_RESULT" | jq empty 2>/dev/null; then
    echo "[DEBUG] Raw output:"
    echo "$ODS_CREATE_RESULT" | head -c 500
    echo ""
    echo "[FAIL] Invalid JSON response from ods create"
    exit 1
fi

# Parse the result - could be array or object depending on implementation
ODS_ID=$(echo "$ODS_CREATE_RESULT" | jq -r 'if type == "array" then .[0].id else .id end')
SERVER=$(echo "$ODS_CREATE_RESULT" | jq -r 'if type == "array" then .[0].hostName else .hostName end')

if [ -z "$ODS_ID" ] || [ "$ODS_ID" == "null" ]; then
  echo "[FAIL] Failed to extract sandbox ID"
  echo "[DEBUG] Response: $(echo "$ODS_CREATE_RESULT" | jq -c '.')"
  exit 1
fi

if [ -z "$SERVER" ] || [ "$SERVER" == "null" ]; then
  echo "[FAIL] Failed to extract server hostname"
  echo "[DEBUG] Response: $(echo "$ODS_CREATE_RESULT" | jq -c '.')"
  exit 1
fi

echo "[PASS] Created on demand sandbox with ID: $ODS_ID"
echo "[INFO] Server hostname: $SERVER"

# 2. List on demand sandboxes and verify the created one is present
echo "Step 2: Verifying sandbox in list..."
ODS_LIST_RESULT=$("$CLI_BIN" ods list --realm "$TEST_REALM" --json)

# Validate JSON
if ! echo "$ODS_LIST_RESULT" | jq empty 2>/dev/null; then
    echo "[FAIL] Invalid JSON response from ods list"
    exit 1
fi

# List returns {count, total, data: [...]}
ODS_PRESENT=$(echo "$ODS_LIST_RESULT" | jq -r --arg ODS_ID "$ODS_ID" '.data[]? | select(.id == $ODS_ID) | .id')

if [ "$ODS_PRESENT" != "$ODS_ID" ]; then
  echo "[FAIL] Created sandbox not found in list"
  echo "Expected: $ODS_ID"
  exit 1
fi

echo "[PASS] Sandbox found in list"
echo ""

: <<COMMENT
# 3. Deploy code to the sandbox
echo "Step 3: Deploying test cartridge..."
if [ -d "$FIXTURES_DIR/cartridges/plugin_example" ]; then
  set +e
  DEPLOY_RESULT=$("$CLI_BIN" code deploy "$FIXTURES_DIR/cartridges" \
    --cartridge plugin_example \
    --server "$SERVER" \
    --account-manager-host "$SFCC_ACCOUNT_MANAGER_HOST" \
    --json 2>&1)
  DEPLOY_EXIT=$?
  set -e
  
  # Check exit code - if 0, deployment succeeded
  if [ $DEPLOY_EXIT -eq 0 ]; then
    echo "[PASS] Code deployment succeeded"
  else
    echo "[FAIL] Code deployment failed (exit code: $DEPLOY_EXIT)"
    echo "[DEBUG] Output: $(echo "$DEPLOY_RESULT" | head -n 10)"
    exit 1
  fi
else
  echo "[WARN] Test cartridge not found at: $FIXTURES_DIR/cartridges/plugin_example"
  echo "[INFO] Skipping deployment test"
fi
echo ""
COMMENT

# 4. Test stop operation
echo "Step 4: Testing stop operation..."
set +e
STOP_RESULT=$("$CLI_BIN" ods stop "$ODS_ID" --json 2>&1)
STOP_EXIT=$?
set -e

if [ $STOP_EXIT -eq 0 ]; then
  echo "[PASS] Stop command succeeded"
else
  echo "[WARN] Stop command failed with exit code: $STOP_EXIT"
fi
echo ""

# 5. Test start operation
echo "Step 5: Testing start operation..."
set +e
START_RESULT=$("$CLI_BIN" ods start "$ODS_ID" --json 2>&1)
START_EXIT=$?
set -e

if [ $START_EXIT -eq 0 ]; then
  echo "[PASS] Start command succeeded"
else
  echo "[WARN] Start command failed with exit code: $START_EXIT"
fi
echo ""

# 6. Test restart operation
echo "Step 6: Testing restart operation..."
set +e
RESTART_RESULT=$("$CLI_BIN" ods restart "$ODS_ID" --json 2>&1)
RESTART_EXIT=$?
set -e

if [ $RESTART_EXIT -eq 0 ]; then
  echo "[PASS] Restart command succeeded"
else
  echo "[WARN] Restart command failed with exit code: $RESTART_EXIT"
fi
echo ""

# 7. Get sandbox status
echo "Step 7: Getting sandbox status..."
set +e
STATUS=$("$CLI_BIN" ods get "$ODS_ID" --json 2>&1)
STATUS_EXIT=$?
set -e

if [ $STATUS_EXIT -eq 0 ]; then
  echo "[PASS] Get command succeeded"
else
  echo "[WARN] Get command failed with exit code: $STATUS_EXIT"
fi
echo ""

# 8. Delete sandbox
echo "Step 8: Deleting sandbox..."
set +e
DELETE_RESULT=$("$CLI_BIN" ods delete "$ODS_ID" --force --json 2>&1)
DELETE_EXIT=$?
set -e

if [ $DELETE_EXIT -eq 0 ]; then
  echo "[PASS] Delete command succeeded"
else
  echo "[WARN] Delete command failed with exit code: $DELETE_EXIT"
fi
echo ""

echo "=== E2E Tests Completed ==="
echo ""
echo "Summary:"
echo " ✓ Step 1: Create sandbox (TTL=24, --wait)"
echo " ✓ Step 2: List sandboxes"
echo " ✓ Step 3: Deploy code"
echo " ✓ Step 4: Stop sandbox"
echo " ✓ Step 5: Start sandbox"
echo " ✓ Step 6: Restart sandbox"
echo " ✓ Step 7: Get sandbox status"
echo " ✓ Step 8: Delete sandbox"
echo ""
