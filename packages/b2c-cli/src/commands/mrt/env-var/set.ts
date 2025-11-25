import { Args, Flags } from '@oclif/core'
import { MrtCommand } from '@salesforce/b2c-tooling/cli'

/**
 * Stub command demonstrating MrtCommand usage.
 * MRT operations use API key authentication.
 */
export default class MrtEnvVarSet extends MrtCommand<typeof MrtEnvVarSet> {
  static args = {
    key: Args.string({
      description: 'Environment variable name',
      required: true,
    }),
    value: Args.string({
      description: 'Environment variable value',
      required: true,
    }),
  }

  static description = 'Set an environment variable on a Managed Runtime project'

  static examples = [
    '<%= config.bin %> <%= command.id %> MY_VAR "my value" --project acme-storefront --environment production',
  ]

  static flags = {
    project: Flags.string({
      description: 'MRT project ID',
      required: true,
    }),
    environment: Flags.string({
      char: 'e',
      description: 'Target environment',
      required: true,
    }),
  }

  async run(): Promise<void> {
    this.requireMrtCredentials()

    this.log(`Setting ${this.args.key} on ${this.flags.project}/${this.flags.environment}...`)

    // TODO: Implement actual MRT API call using this.createMrtClient()

    this.log('')
    this.log('(stub) Environment variable setting not yet implemented')
    this.log(`Would set ${this.args.key}=${this.args.value}`)
    this.log(`Project: ${this.flags.project}`)
    this.log(`Environment: ${this.flags.environment}`)
  }
}
