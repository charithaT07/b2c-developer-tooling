import i18next, { TOptions } from 'i18next'

/**
 * Initialize i18next with sensible defaults for CLI usage.
 *
 * Key features:
 * - Default strings are stored inline at point of use (no separate en.json needed)
 * - Future localization can add resource files without changing call sites
 * - Synchronous usage via pre-initialized instance
 *
 * Usage:
 *   import { t } from '@salesforce/b2c-tooling'
 *   throw new Error(t('error.serverRequired', 'Server is required.'))
 *
 * With interpolation:
 *   t('error.fileNotFound', 'File {{path}} not found.', { path: '/foo/bar' })
 */

const instance = i18next.createInstance()

instance.init({
  lng: 'en',
  fallbackLng: 'en',
  // Don't require keys to exist in resources - use defaultValue instead
  returnNull: false,
  returnEmptyString: false,
  // Use the default value when key is missing (our primary mode)
  saveMissing: false,
  // Namespace configuration
  defaultNS: 'cli',
  ns: ['cli'],
  // Start with empty resources - defaults come from inline strings
  resources: {},
  // Interpolation settings
  interpolation: {
    escapeValue: false, // CLI doesn't need HTML escaping
  },
})

/**
 * Translate a message key with an inline default.
 *
 * The default string is used directly during development and serves as
 * the English translation. Future localization adds translations via
 * resource files without changing call sites.
 *
 * @param key - Dot-notation key (e.g., 'error.serverRequired')
 * @param defaultValue - The default English string
 * @param options - Optional interpolation values
 * @returns The translated string
 *
 * @example
 * // Simple usage
 * t('error.serverRequired', 'Server is required.')
 *
 * @example
 * // With interpolation
 * t('error.fileNotFound', 'File {{path}} not found.', { path: filePath })
 *
 * @example
 * // With multiple interpolations
 * t('info.uploadProgress', 'Uploading {{file}} ({{percent}}%)', { file: name, percent: 50 })
 */
export function t(key: string, defaultValue: string, options?: TOptions): string {
  return instance.t(key, { defaultValue, ...options })
}

/**
 * Get the i18next instance for advanced usage (e.g., adding resources).
 *
 * @example
 * // Add translations for a new language
 * getI18nInstance().addResourceBundle('de', 'cli', {
 *   error: {
 *     serverRequired: 'Server ist erforderlich.'
 *   }
 * })
 *
 * @example
 * // Change language at runtime
 * getI18nInstance().changeLanguage('de')
 */
export function getI18nInstance() {
  return instance
}
