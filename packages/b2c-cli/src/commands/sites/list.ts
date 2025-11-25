import { InstanceCommand } from '@salesforce/b2c-tooling/cli'

interface SitesResponse {
  _v: string
  count: number
  data: Array<{
    id: string
    display_name?: { default?: string }
    status?: string
  }>
  total: number
}

export default class SitesList extends InstanceCommand<typeof SitesList> {
  static description = 'List sites on a B2C Commerce instance'

  static examples = [
    '<%= config.bin %> <%= command.id %>',
    '<%= config.bin %> <%= command.id %> --server my-sandbox.demandware.net',
  ]

  async run(): Promise<void> {
    this.requireServer()
    this.requireOAuthCredentials()

    const instance = this.createApiInstance()

    this.log(`Fetching sites from ${this.resolvedConfig.hostname}...`)

    try {
      const response = await instance.ocapiDataRequest('sites?select=(**)')

      if (!response.ok) {
        const errorText = await response.text()
        this.error(`Failed to fetch sites: ${response.status} ${response.statusText}\n${errorText}`)
      }

      const data = (await response.json()) as SitesResponse

      if (data.count === 0) {
        this.log('No sites found.')
        return
      }

      this.log(`\nFound ${data.count} site(s):\n`)

      for (const site of data.data) {
        const displayName = site.display_name?.default || site.id
        const status = site.status || 'unknown'
        this.log(`  ${site.id}`)
        this.log(`    Display Name: ${displayName}`)
        this.log(`    Status: ${status}`)
        this.log('')
      }
    } catch (error) {
      if (error instanceof Error) {
        this.error(`Failed to fetch sites: ${error.message}`)
      }
      throw error
    }
  }
}
