module.exports = {
    extends: ['@antfu', 'plugin:prettier/recommended'],
    plugins: ['prettier', 'simple-import-sort'],
    rules: {
        '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'no-type-imports' }],
        'import/order': 'off',
        'simple-import-sort/imports': 'error',
        'simple-import-sort/exports': 'error'
    }
};
