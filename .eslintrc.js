module.exports = {
    "root": true,
    "env": {
      "node": true
    },
    "extends": [
      "plugin:vue/vue3-essential",
      "eslint:recommended"
    ],
    "parserOptions": {
      "parser": "@babel/eslint-parser"
    },
    "rules": {
      "no-unused-vars": process.env.NODE_ENV === "production" ? "error" : "warn",
      "no-debugger" : process.env.NODE_ENV === "production" ? "error" : "warn",
      "vue/multi-word-component-names": "off",
      "vue/no-deprecated-router-link-tag-prop": "off"
    }
}