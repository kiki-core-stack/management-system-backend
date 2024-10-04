import type { PluginOptions } from '@kikiutils/nitro-session/types/options';

export default {
	development: {
		enabled: true,
		storage: {
			data: {
				driver: 'cookie/header',
				options: {
					encodingOptions: { key: 'utf-8' },
					key: ''
				}
			}
		},
		strictIpValidation: true
	},
	production: {
		enabled: true,
		storage: {
			data: {
				driver: 'cookie/header',
				options: {
					encodingOptions: { key: 'utf-8' },
					key: ''
				}
			}
		},
		strictIpValidation: true
	}
} satisfies Record<'development' | 'production', PluginOptions>;
