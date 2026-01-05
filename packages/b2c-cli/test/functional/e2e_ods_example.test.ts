/**
 * Example E2E test using Mocha + Chai + Execa
 * 
 * This is a POC to compare with shell-based E2E tests.
 * 
 * To run: pnpm mocha test/functional/e2e_ods_example.test.ts
 */

import {expect} from 'chai';
import {execa} from 'execa';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe('E2E: ODS functionality', function () {
  // Increase timeout for real API calls
  this.timeout(30000);

  const CLI_PATH = path.resolve(__dirname, '../../bin/run.js');

  // Helper to run CLI commands
  async function runCli(command: string, args: string[] = [], options: {logLevel?: string} = {}) {
    const result = await execa('node', [CLI_PATH, command, ...args], {
      env: {
        ...process.env,
        SFCC_CLIENT_ID: process.env.SFCC_CLIENT_ID,
        SFCC_CLIENT_SECRET: process.env.SFCC_CLIENT_SECRET,
        SFCC_LOG_LEVEL: options.logLevel || process.env.SFCC_LOG_LEVEL || 'info',
      },
      reject: false, // Don't throw on non-zero exit
    });

    return {
      stdout: result.stdout,
      stderr: result.stderr,
      exitCode: result.exitCode,
      parseJson: () => JSON.parse(result.stdout),
    };
  }

  it('should list sandboxes with --json flag', async function () {
    // Arrange
    const realm = process.env.TEST_REALM;
    if (!realm) {
      this.skip();
    }

    // Act - test with normal logging to ensure JSON parsing works with mixed output
    const result = await runCli('ods', ['list', '--realm', realm!, '--json'], {logLevel: 'info'});

    // Assert
    expect(result.exitCode).to.equal(0, 'Command should succeed');

    // Parse JSON even with log messages present
    const json = result.parseJson();

    expect(json).to.have.property('count');
    expect(json).to.have.property('data');
    expect(json.data).to.be.an('array');
    
    console.log(`✓ Found ${json.data.length} sandboxes (with logging)`);
  });

  it('should list sandboxes in table format (default)', async function () {
    // Arrange
    const realm = process.env.TEST_REALM;
    if (!realm) {
      this.skip();
    }

    // Act
    const result = await runCli('ods', ['list', '--realm', realm!]);

    // Assert
    expect(result.exitCode).to.equal(0);
    expect(result.stdout).to.include('ID'); // Table header
    expect(result.stdout).to.include('Realm'); // Table header
    
    console.log('✓ Table output looks correct');
  });

  it('should handle authentication errors gracefully', async function () {
    // Act - run with invalid credentials
    const result = await execa('node', [CLI_PATH, 'ods', 'list', '--realm', 'zzzz'], {
      env: {
        SFCC_CLIENT_ID: 'invalid',
        SFCC_CLIENT_SECRET: 'invalid',
      },
      reject: false,
    });

    // Assert
    expect(result.exitCode).to.not.equal(0);
    expect(result.stderr).to.match(/auth|401|unauthorized/i);
    
    console.log('✓ Authentication error handled correctly');
  });
});

