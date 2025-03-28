// SHA-256 Hashing in TypeScript

// Import the crypto module
import crypto from 'crypto'

// Type definitions
type HashFunction = (input: string) => string
type AsyncHashFunction = (input: string) => Promise<string>
type HmacFunction = (input: string, secret: string) => string

// Method 1: Using Node.js crypto module with TypeScript types
const hashWithNodeCrypto: HashFunction = (input: string): string => {
	const hash = crypto.createHash('sha256')
	hash.update(input)
	return hash.digest('hex')
}

// Method 2: Using Web Crypto API with TypeScript
const hashWithWebCrypto: AsyncHashFunction = async (
	input: string
): Promise<string> => {
	const encoder = new TextEncoder()
	const data = encoder.encode(input)
	const hashBuffer = await crypto.subtle.digest('SHA-256', data)

	// Convert buffer to hex string
	return Array.from(new Uint8Array(hashBuffer))
		.map((b: number) => b.toString(16).padStart(2, '0'))
		.join('')
}

// Method 3: Creating a HMAC with TypeScript
const createHmac: HmacFunction = (input: string, secret: string): string => {
	const hmac = crypto.createHmac('sha256', secret)
	hmac.update(input)
	return hmac.digest('hex')
}

// Example usage with TypeScript
const testString: string = 'Hello, world!'
const secret: string = 'my_secret_key'

console.log('Input string:', testString)
console.log('\nMethod 1 - Node.js crypto:')
console.log(hashWithNodeCrypto(testString))

console.log('\nMethod 3 - HMAC with secret key:')
console.log(createHmac(testString, secret))

// Method 2 is asynchronous
;(async () => {
	console.log('\nMethod 2 - Web Crypto API:')
	console.log(await hashWithWebCrypto(testString))

	// Verify that different inputs produce different hashes
	const anotherString: string = 'Hello, world'
	console.log('\nDifferent input produces different hash:')
	console.log('Input:', anotherString)
	console.log('Hash:', await hashWithWebCrypto(anotherString))
})()

// Example of a utility class with TypeScript
class Hasher {
	private readonly algorithm: string = 'sha256'
	private readonly encoding: crypto.BinaryToTextEncoding = 'hex'

	constructor(private readonly secret?: string) {}

	public hash(data: string): string {
		if (this.secret) {
			return this.hmacHash(data)
		}
		return this.simpleHash(data)
	}

	private simpleHash(data: string): string {
		const hash = crypto.createHash(this.algorithm)
		hash.update(data)
		return hash.digest(this.encoding)
	}

	private hmacHash(data: string): string {
		if (!this.secret) {
			throw new Error('Secret key is required for HMAC hashing')
		}
		const hmac = crypto.createHmac(this.algorithm, this.secret)
		hmac.update(data)
		return hmac.digest(this.encoding)
	}
}

// Using the Hasher class
const simpleHasher = new Hasher()
const hmacHasher = new Hasher('secure_secret')

console.log('\nUsing Hasher class:')
console.log('Simple hash:', simpleHasher.hash(testString))
console.log('HMAC hash:', hmacHasher.hash(testString))
