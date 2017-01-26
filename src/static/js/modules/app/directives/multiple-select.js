module.directive('multipleSelect', ['$timeout', function ($timeout) {
    return {
        scope: {
            options: '=',
            model: '='
        },
        template: `<dl class="dropdown cls" ng-click="dropdownClick($event)">
                    <dt class="cls">
                        <a href="javascript:;" class="cls">
                            <span class="hida cls">Select</span>
                            <p class="multiSel"></p>
                        </a>
                    </dt>
                    <dd>
                        <div class="mutliSelect">
                            <ul>
                                <li class="selectall">
                                    <input type="checkbox" value="all" /><span class ="multiple-select-label">Select all<span></li>
                                </li>
                                <li ng-repeat="p in options">
                                    <input type="checkbox" value="{{p.value}}" data-text="{{p.key}}" /><span class ="multiple-select-label">{{p.key}}<span></li>
                                <li>
                            </ul>
                        </div>
                    </dd>
                </dl>`,
        link: function (scope, element, attrs) {
            scope.isExpand = false;
            scope.val = '';
            scope.dropdownClick = function (e) {
                if (!scope.isExpand) {
                    $(element).find("dd ul").slideDown('fast');
                    setTimeout(function () {
                        scope.isExpand = true;
                    }, 200);
                }
            }

            $(document).bind('click', function (e) {
                if (scope.isExpand) {
                    if (!$(e.target).parents('.dropdown').length) {
                        scope.isExpand = false;
                        $(element).find("dd ul").hide();
                    }
                    if ($(e.target).hasClass('cls')) {
                        scope.isExpand = false;
                        $(element).find("dd ul").hide();
                    }
                }
            });

            $timeout(function () {
                var inputs = $(element).find('input[type=checkbox]');
                $(inputs).click(function () {
                    if ($(this).val() == 'all') {
                        var isCheck = $(this).is(':checked');
                        $(element).find('input[type=checkbox]').each(function () {
                            if (isCheck) {
                                $(this).prop('checked', true);
                            }
                            else {
                                $(this).prop('checked', false);
                            }
                        });
                    }
                    else {
                        var total = $(element).find('.selectall input').is(':checked') ? 13 : 12;
                        if ($(element).find('input[type=checkbox]:checked').length < total) {
                            $(element).find('.selectall input').prop('checked', false);
                        }
                        else {
                            $(element).find('.selectall input').prop('checked', true);
                        }
                    }
                    
                    var values = '';
                    var text = '';
                    $(element).find('input[type=checkbox]:checked').each(function () {
                        if ($(this).val() != 'all') {
                            text += $(this).attr('data-text') + ', ';
                            values += $(this).val() + ', ';
                        }
                    });
                    if (values) {
                        values = values.slice(0, -2);
                        scope.model = values;
                    }
                    else {
                        scope.model = '';
                    }
                    if (text) {
                        text = text.slice(0, -2);
                        $(element).find('.hida').text(text);
                    }
                    else {
                        $(element).find('.hida').text('Select');
                    }
                });
            }, 500);
        }
    };
}]);