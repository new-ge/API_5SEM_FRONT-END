module.exports = {
  moduleFileExtensions: ['js', 'json', 'vue'],
  transform: {
    '^.+\\.vue$': 'vue-jest',       // Transforma arquivos .vue
    '^.+\\.js$': 'babel-jest'       // Transforma arquivos .js com babel
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1'  // Alias @ para src
  },
  transformIgnorePatterns: [
    "node_modules/(?!(axios)/)"    // Transforma também o axios (lib que usa ESModules)
  ],
  testEnvironment: 'jsdom'
};
