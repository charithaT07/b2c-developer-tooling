import { Args, Flags } from '@oclif/core'
import { OAuthCommand } from '@salesforce/b2c-tooling/cli'

/**
 * Stub command demonstrating OAuthCommand usage.
 * Sandbox API operations require OAuth but not instance credentials.
 */
export default class SandboxCreate extends OAuthCommand<typeof SandboxCreate> {
  static args = {
    realm: Args.string({
      description: 'Realm ID',
      required: true,
    }),
  }

  static description = 'Create a new on-demand sandbox'

  static examples = [
    '<%= config.bin %> <%= command.id %> abcd --ttl 24',
    '<%= config.bin %> <%= command.id %> abcd --profile medium',
  ]

  static flags = {
    ttl: Flags.integer({
      description: 'Time to live in hours',
      default: 24,
    }),
    profile: Flags.string({
      description: 'Sandbox profile (small, medium, large)',
      default: 'medium',
    }),
  }

  async run(): Promise<void> {
    this.requireOAuthCredentials()

    const auth = this.getOAuthStrategy()

    this.log(`Creating sandbox in realm ${this.args.realm}...`)
    this.log(`Profile: ${this.flags.profile}`)
    this.log(`TTL: ${this.flags.ttl} hours`)

    // TODO: Implement actual ODS API call
    // const response = await auth.fetch(
    //   `https://admin.dx.commercecloud.salesforce.com/api/v1/realms/${this.args.realm}/sandboxes`,
    //   { method: 'POST', body: JSON.stringify({ ttl: this.flags.ttl, profile: this.flags.profile }) }
    // )

    this.log('')
    this.log('(stub) Sandbox creation not yet implemented')
    this.log(`Would create sandbox with OAuth client: ${this.resolvedConfig.clientId}`)
  }
}
