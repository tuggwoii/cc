'use strict';

module.exports = function(context) {

    var MESSAGE = 'Invalid order! Should be "{{correctOrder}}"';

    /**
     * @param (string) varName
     * @private
     */
    function isDollarVar(varName) {
        return (varName[0] === '$');
    }

    /**
     * @param {ASTNode} node The binary expression node to check.
     * @returns {void}
     * @private
     */
    function validate(node) {

        var preDefinedOrder = [];
        if (context.options && context.options.length > 0) {
            preDefinedOrder = context.options[0];
        }

        var currentOrder = [];
        var dollarVars = [];
        var otherVars = [];

        for (var paramIndex in node.params) {
            var paramName = node.params[paramIndex].name;

            if (preDefinedOrder.indexOf(paramName) < 0) {
                if (isDollarVar(paramName)) {
                    dollarVars.push(paramName);
                }else{
                    otherVars.push(paramName);
                }
            }

            currentOrder.push(paramName);
        }

        var expectedOrder = [];
        for (var preDefinedOrderIndex in preDefinedOrder) {
            if (currentOrder.indexOf(preDefinedOrder[preDefinedOrderIndex]) >= 0) {
                expectedOrder.push(preDefinedOrder[preDefinedOrderIndex]);
            }
        }

        expectedOrder.push.apply(expectedOrder, dollarVars);
        expectedOrder.push.apply(expectedOrder, otherVars);

        var expectedOrderString = expectedOrder.join(', ');
        var currentOrderString = currentOrder.join(', ');

        if (expectedOrderString !== currentOrderString) {
            context.report(node, MESSAGE, {correctOrder: expectedOrderString});
        }
    }

    return {
        'FunctionExpression': validate,
        'FunctionDeclaration': validate
    };

};
