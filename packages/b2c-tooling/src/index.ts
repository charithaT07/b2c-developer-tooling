/**
 * Generates a hello message
 * @param person - The person to greet
 * @param from - Who is saying hello
 * @returns A formatted hello message
 */
export function hello(person: string, from: string): string {
  return `hello ${person} from ${from}!`;
}
