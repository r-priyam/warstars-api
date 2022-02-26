module.exports = {
    extends: ['@antfu', 'plugin:prettier/recommended'],
    plugins: ['prettier'],
    rules: { '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'no-type-imports' }] }
};
