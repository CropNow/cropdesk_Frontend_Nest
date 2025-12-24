/** @type {import("stylelint").Config} */
export default {
  extends: ['stylelint-config-standard', 'stylelint-config-tailwindcss'],
  rules: {
    'value-keyword-case': ['lower', { camelCaseSvgKeywords: true }],
    'at-rule-no-unknown': null,
    'at-rule-no-deprecated': true,
    'hue-degree-notation': null,
    'lightness-notation': null,
  },
};
