/**
 * @type {import('semantic-release').GlobalConfig}
 */
export default {
    branches: ['main'],
    plugins: [
        [
            '@semantic-release/commit-analyzer',
            {
                preset: 'conventionalcommits',
                releaseRules: [
                    {
                        release: 'patch',
                        type: 'build',
                    },
                    {
                        release: 'patch',
                        type: 'chore',
                    },
                    {
                        release: 'patch',
                        type: 'refactor',
                    },
                    {
                        release: 'patch',
                        type: 'style',
                    },
                ],
            },
        ],
        [
            '@semantic-release/release-notes-generator',
            {
                preset: 'conventionalcommits',
                presetConfig: {
                    types: [
                        {
                            hidden: false,
                            section: '✅ Tests',
                            type: 'test',
                        },
                        {
                            hidden: false,
                            section: '🌊 Types',
                            type: 'types',
                        },
                        {
                            hidden: false,
                            section: '🎨 Styles',
                            type: 'style',
                        },

                        {
                            hidden: false,
                            section: '🏀 Examples',
                            type: 'examples',
                        },
                        {
                            hidden: false,
                            section: '🏡 Chore',
                            type: 'chore',
                        },
                        {
                            hidden: false,
                            section: '💅 Refactors',
                            type: 'refactor',
                        },
                        {
                            hidden: false,
                            section: '📖 Documentation',
                            type: 'docs',
                        },
                        {
                            hidden: false,
                            section: '📦 Build',
                            type: 'build',
                        },
                        {
                            hidden: false,
                            section: '🔥 Performance',
                            type: 'perf',
                        },
                        {
                            hidden: false,
                            section: '🤖 CI',
                            type: 'ci',
                        },
                        {
                            hidden: false,
                            section: '🩹 Fixes',
                            type: 'fix',
                        },
                        {
                            hidden: false,
                            section: '🚀 Enhancements',
                            type: 'feat',
                        },
                        {
                            hidden: false,
                            section: '📌 Others',
                            type: '*',
                        },
                    ],
                },
            },
        ],
        '@semantic-release/changelog',
        [
            '@semantic-release/git',
            // eslint-disable-next-line no-template-curly-in-string
            { message: 'chore(release): ${nextRelease.version} [skip ci]' },
        ],
        '@semantic-release/gitlab',
    ],
};
