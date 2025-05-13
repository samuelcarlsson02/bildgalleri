module.exports = {
    testEnvironment: 'jsdom',
    transform: {
        '^.+\\.[t|j]sx?$': ['babel-jest', {
            presets: [
                '@babel/preset-env',
                ['@babel/preset-react', { runtime: 'automatic' }]
            ]
        }]
    }
};