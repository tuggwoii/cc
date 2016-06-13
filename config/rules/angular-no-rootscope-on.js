'use strict';

module.exports = function(context) {

    var MESSAGE = 'Use "{{scopeVarName}}.$on" instead of "$rootScope.$on"';
    var possibleScopeVars = ['scope', '$scope'];

    /**
     * @param {ASTNode} node The binary expression node to check.
     * @returns {void}
     * @private
     */
    function validate(node) {
        if (node.object.name === '$rootScope' && node.property.name === '$on') {

            var usedScopeVars = [];
            var contextScope = context.getScope();

            for (var i in contextScope.variables) {
                var variable = contextScope.variables[i];
                if (possibleScopeVars.indexOf(variable.name) >= 0) {
                    usedScopeVars.push(variable.name);
                }
            }

            if (usedScopeVars.length > 0) {
                for (var possibleScopeVarIndex in possibleScopeVars) {
                    var scopeVarName = possibleScopeVars[possibleScopeVarIndex];

                    if (usedScopeVars.indexOf(scopeVarName) >= 0) {
                        context.report(node, MESSAGE, {scopeVarName: scopeVarName});
                        return;
                    }
                }
            }
        }
    }

    return {
        'MemberExpression': validate
    };

};
