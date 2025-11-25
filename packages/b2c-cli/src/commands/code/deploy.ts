import { Args } from '@oclif/core'
import { uploadCartridges } from '@salesforce/b2c-tooling'
import { InstanceCommand } from '@salesforce/b2c-tooling/cli'

export default class Deploy extends InstanceCommand<typeof Deploy> {
  static args = {
    cartridgePath: Args.string({
      description: 'Path to cartridges directory',
      default: './cartridges',
    }),
  }

  static description = 'Deploy cartridges to a B2C Commerce instance'

  static examples = [
    '<%= config.bin %> <%= command.id %>',
    '<%= config.bin %> <%= command.id %> ./my-cartridges',
    '<%= config.bin %> <%= command.id %> --server my-sandbox.demandware.net --code-version v1',
  ]

  async run(): Promise<void> {
    this.requireServer()
    this.requireCodeVersion()
    this.requireWebDavCredentials()

    const instance = this.createWebDavInstance()

    this.log(`Deploying cartridges from ${this.args.cartridgePath}...`)
    this.log(`Target: ${this.resolvedConfig.hostname}`)
    this.log(`Code Version: ${this.resolvedConfig.codeVersion}`)

    try {
      await uploadCartridges(instance, this.args.cartridgePath)
      this.log('Deployment complete')
    } catch (error) {
      if (error instanceof Error) {
        this.error(`Deployment failed: ${error.message}`)
      }
      throw error
    }
  }
}
