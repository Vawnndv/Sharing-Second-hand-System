module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'airbnb',
    'airbnb-typescript',
    'airbnb/hooks',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  overrides: [],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
  },
  plugins: ['react', '@typescript-eslint', 'prettier'],
  rules: {
    'react/react-in-jsx-scope': 0,
    "prettier/prettier": 0,
    "@typescript-eslint/no-explicit-any": 0,
    "import/prefer-default-export": 0,  
    "default-param-last": "off",  
    "@typescript-eslint/default-param-last": 0,
    "react/jsx-uses-react": "error",
    "react/jsx-uses-vars": "error",
    "no-undef": "off",
    "react/display-name": "off",
    "react/jsx-filename-extension": "off",
    "no-param-reassign": "off",
    "react/prop-types": 1,
    "react/require-default-props": "off",
    "react/no-array-index-key": "off",
    "react/jsx-props-no-spreading": "off",
    "react/forbid-prop-types": "off",
    "import/order": "off",
    "import/no-cycle": "off",
    "no-console": "off",
    "jsx-a11y/anchor-is-valid": "off",
    "prefer-destructuring": "off",
    "no-shadow": "off",
    "import/no-named-as-default": "off",
    "import/no-extraneous-dependencies": "off",
    "jsx-a11y/no-autofocus": "off",
    "no-restricted-imports": [
      "error",
      {
        "patterns": ["@mui/*/*/*", "!@mui/material/test-utils/*"]
      }
    ],
    "no-unused-vars": [
      "error",
      {
        "ignoreRestSiblings": false
      }
    ],
    // "prettier/prettier": [
    //   "warn",
    //   {
    //     "bracketSpacing": true,
    //     "printWidth": 140,
    //     "singleQuote": true,
    //     "trailingComma": "none",
    //     "tabWidth": 2,
    //     "useTabs": false,
    //     "endOfLine": "auto"
    //   }
    // ]
    "react-hooks/exhaustive-deps": "off"
  },
};
