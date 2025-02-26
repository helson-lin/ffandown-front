module.exports = {
    extends: [
        'stylelint-config-standard-scss', 
        'stylelint-config-recommended-vue/scss',
        'stylelint-config-recess-order',
    ],
    // customSyntax: 'postcss-html',
    // plugins: ["stylelint-scss", "stylelint-order"],
    rules: {
        'indentation': 4,
        'property-no-vendor-prefix': null,
        'at-rule-no-vendor-prefix': null,
        // 'selector-pseudo-element-no-unknown': [
        //     true,
        //     {
        //         ignorePseudoElements: ['v-deep']
        //     }
        // ],
        'number-leading-zero': 'never',
        'selector-class-pattern': null
        // 'no-descending-specificity': null,
        // 'font-family-no-missing-generic-family-keyword': null,
        // 'selector-type-no-unknown': null,
        // 'at-rule-no-unknown': null,
        // 'no-duplicate-selectors': null,
        // 'no-empty-source':null,
        // 'selector-pseudo-class-no-unknown': [true, { ignorePseudoClasses: ['global'] }]
    }
}
