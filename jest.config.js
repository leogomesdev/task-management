module.exports = {
    moduleFileExtensions: ['js', 'json', 'ts'],
    rootDir: 'src',
    testRegex: '.spec.ts$',
    transform: {
        '^.+\\.(t|j)s$': 'ts-jest',
    },
    coverageDirectory: '../coverage',
    testEnvironment: 'node',
    collectCoverageFrom: [
        '<rootDir>/**/*.ts',
        '!<rootDir>/main.ts',
        '!<rootDir>/**/*.entity.ts',
        '!<rootDir>/**/*.module.ts',
        '!<rootDir>/**/*.config.ts',
        '!<rootDir>/**/*.decorator.ts',
    ],
};
