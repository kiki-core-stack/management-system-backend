import { checkAndGetEnvValue } from '@kikiutils/node/env';
import type { OpenAPIObject } from 'openapi3-ts/oas31';
import type { ReadonlyDeep } from 'type-fest';

export type Configs = ReadonlyDeep<{
	openAPI: Omit<OpenAPIObject, 'components' | 'paths' | 'webhooks'>;
	sessionEncryptionKey: string;
}>;

const sessionEncryptionKey = Buffer.from(checkAndGetEnvValue('SESSION_ENCRYPTION_KEY'), 'ascii').toString('ascii');
if (sessionEncryptionKey.length !== 32) throw new Error(`Invalid SESSION_ENCRYPTION_KEY length: expected 32 bytes (256 bits for AES-256) when parsed as ASCII, but got ${sessionEncryptionKey.length} bytes.`);
export const configs: Configs = {
	openAPI: {
		info: { title: 'API Document', version: '0.1.0' },
		openapi: '3.1.0'
	},
	sessionEncryptionKey
};

export default configs;
