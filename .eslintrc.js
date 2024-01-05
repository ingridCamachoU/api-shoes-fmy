module.exports = {
    env: {
        browser: true,
        commonjs: true,
        es2021: true,
        jest: true,
    },
    extends: 'airbnb-base',
    overrides: [
        {
            env: {
                node: true,
            },
            files: ['.eslintrc.{js,cjs}'],
            parserOptions: {
                sourceType: 'script',
            },
        },
    ],
    parserOptions: {
        ecmaVersion: 'latest',
    },
    rules: {
        indent: ['error', 4],
        'no-underscore-dangle': ['error', { allow: ['_document', '_docs', '_path'] }],
        'no-param-reassign': ['error', { props: false }],
        'no-restricted-syntax': [
            'error',
            'FunctionExpression[generator=false]:not(:has(ThisExpression))',
            'FunctionDeclaration[generator=false]:not(:has(ThisExpression))',
        ],
        'no-console': 'off',
    },
};
