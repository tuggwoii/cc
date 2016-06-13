'use strict';

module.exports = function(context) {

    var MESSAGE = 'Its not allowed to declare variables with dollar! Should be "{{validName}}"';

    /**
     * @param {ASTNode} node The binary expression node to check.
     * @returns {void}
     * @private
     */
    function validate(node) {
        var name = node.id.name;

        if (name[0] === '$') {
            context.report(node, MESSAGE, { validName: name.slice(1) });
        }
    }

    return {
        'VariableDeclarator': validate
    };

};
