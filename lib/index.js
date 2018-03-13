'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.TouchableCustom = exports.Touchable = exports.SelfValidating = undefined;
var _jsxFileName = './src/index.jsx';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
/* eslint-disable react/no-multi-comp */

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _classnames3 = require('classnames');

var _classnames4 = _interopRequireDefault(_classnames3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function deepMap(children, deepMapFn) {
    return _react2.default.Children.map(children, function (child) {
        if (child && child.props && child.props.children && _typeof(child.props.children) === 'object') {
            // Clone the child that has children and map them too
            return deepMapFn(_react2.default.cloneElement(child, Object.assign({}, child.props, {
                children: deepMap(child.props.children, deepMapFn)
            })));
        }
        return deepMapFn(child);
    });
}

function getDisplayName(WrappedComponent) {
    return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}

var SelfValidating = exports.SelfValidating = function SelfValidating(Form) {
    var SelfValidatingForm = function (_React$Component) {
        _inherits(SelfValidatingForm, _React$Component);

        function SelfValidatingForm(props) {
            _classCallCheck(this, SelfValidatingForm);

            var _this = _possibleConstructorReturn(this, (SelfValidatingForm.__proto__ || Object.getPrototypeOf(SelfValidatingForm)).call(this, props));

            _this.state = {
                endCheckValidity: false
            };
            _this.customFields = {
                count: 0,
                valid: true
            };
            _this.lastSubmit = null;

            _this.handleSubmit = _this.handleSubmit.bind(_this);
            _this.handleEndCheckValidity = _this.handleEndCheckValidity.bind(_this);
            return _this;
        }

        _createClass(SelfValidatingForm, [{
            key: 'handleSubmit',
            value: function handleSubmit(ev) {
                ev.preventDefault();
                if (ev.target.checkValidity() && this.customFields.count === 0) {
                    this.props.onSubmit(ev);
                } else if (this.customFields.count) {
                    ev.persist();
                    this.lastSubmit = ev;
                    this.setState({ endCheckValidity: true });
                }
            }
        }, {
            key: 'handleEndCheckValidity',
            value: function handleEndCheckValidity(valid) {
                this.setState({ endCheckValidity: false });
                this.customFields.count--;
                this.customFields.valid = valid && this.customFields.valid;
                if (this.customFields.count === 0 && this.customFields.valid && this.lastSubmit && this.lastSubmit.target.checkValidity()) {
                    this.props.onSubmit(this.lastSubmit);
                }
            }
        }, {
            key: 'render',
            value: function render() {
                var _this2 = this;

                var count = 0;
                var children = deepMap(this.props.children, function (child) {
                    if (child && child.type && child.type.displayName && child.type.displayName.search(/^TouchableCustomField(.+)$/) === 0) {
                        count++;
                        return _react2.default.cloneElement(child, {
                            endCheckValidity: _this2.state.endCheckValidity,
                            onEndCheckValidity: _this2.handleEndCheckValidity
                        });
                    }
                    return child;
                });

                this.customFields.count = count;
                this.customFields.valid = true;

                return _react2.default.createElement(
                    Form,
                    Object.assign({
                        noValidate: true
                    }, this.props, {
                        onSubmit: this.handleSubmit,
                        __source: {
                            fileName: _jsxFileName,
                            lineNumber: 101
                        },
                        __self: this
                    }),
                    children
                );
            }
        }]);

        return SelfValidatingForm;
    }(_react2.default.Component);

    ;
    SelfValidatingForm.displayName = 'SelfValidatingForm(' + getDisplayName(Form) + ')';
    return SelfValidatingForm;
};

var defaultConfig = {
    touchedClassName: 'touched',
    invalidClassName: 'invalid'
};

/**
 * For standard fields or those that are built on top of them
 */
var Touchable = exports.Touchable = function Touchable() {
    var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : defaultConfig;
    return function (Field) {
        var TouchableField = function (_React$Component2) {
            _inherits(TouchableField, _React$Component2);

            function TouchableField(props) {
                _classCallCheck(this, TouchableField);

                var _this3 = _possibleConstructorReturn(this, (TouchableField.__proto__ || Object.getPrototypeOf(TouchableField)).call(this, props));

                _this3.state = {
                    touched: false,
                    invalid: false,
                    value: props.value || ''
                };
                _this3.handleChange = _this3.handleChange.bind(_this3);
                _this3.handleInvalid = _this3.handleInvalid.bind(_this3);
                _this3.handleInputRef = _this3.handleInputRef.bind(_this3);
                return _this3;
            }

            _createClass(TouchableField, [{
                key: 'componentWillReceiveProps',
                value: function componentWillReceiveProps(nextProps) {
                    this.setState({ value: nextProps.value });
                }
            }, {
                key: 'componentDidUpdate',
                value: function componentDidUpdate() {
                    if (this.state.touched && this.input && this.input.validity && this.state.invalid === this.input.validity.valid) {
                        this.setState({ invalid: !this.input.validity.valid });
                    }
                }
            }, {
                key: 'handleChange',
                value: function handleChange(ev) {
                    this.setState({ touched: true, invalid: !ev.target.validity.valid, value: ev.target.value });
                    this.props.onChange(ev);
                }
            }, {
                key: 'handleInvalid',
                value: function handleInvalid(ev) {
                    this.setState({ touched: true, invalid: true });
                    this.props.onInvalid(ev);
                }
            }, {
                key: 'handleInputRef',
                value: function handleInputRef(input) {
                    this.input = input;
                    this.props.inputRef(input);
                }
            }, {
                key: 'render',
                value: function render() {
                    var _classnames;

                    return _react2.default.createElement(Field, Object.assign({}, this.props, {
                        className: (0, _classnames4.default)(this.props.className, (_classnames = {}, _defineProperty(_classnames, config.touchedClassName || defaultConfig.touchedClassName, this.state.touched), _defineProperty(_classnames, config.invalidClassName || defaultConfig.invalidClassName, this.state.invalid), _classnames)),
                        onChange: this.handleChange,
                        onInvalid: this.handleInvalid,
                        inputRef: this.handleInputRef,
                        value: this.state.value,
                        __source: {
                            fileName: _jsxFileName,
                            lineNumber: 173
                        },
                        __self: this
                    }));
                }
            }]);

            return TouchableField;
        }(_react2.default.Component);

        TouchableField.defaultProps = {
            onChange: function onChange() {},
            onInvalid: function onInvalid() {},
            inputRef: function inputRef() {}
        };
        ;
        TouchableField.displayName = 'TouchableField(' + getDisplayName(Field) + ')';
        return TouchableField;
    };
};

/**
 * For fields that don't fire `invalid` events or their `onChange` property does
 * not pass `change` events
 */
var TouchableCustom = exports.TouchableCustom = function TouchableCustom() {
    var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : defaultConfig;
    return function (Field) {
        var TouchableCustomField = function (_React$Component3) {
            _inherits(TouchableCustomField, _React$Component3);

            function TouchableCustomField(props) {
                _classCallCheck(this, TouchableCustomField);

                var _this4 = _possibleConstructorReturn(this, (TouchableCustomField.__proto__ || Object.getPrototypeOf(TouchableCustomField)).call(this, props));

                _this4.state = {
                    touched: false,
                    invalid: false
                };
                _this4.handleValidityChange = _this4.handleValidityChange.bind(_this4);
                _this4.handleEndCheckValidity = _this4.handleEndCheckValidity.bind(_this4);
                return _this4;
            }

            _createClass(TouchableCustomField, [{
                key: 'handleValidityChange',
                value: function handleValidityChange(valid) {
                    this.setState({ touched: true, invalid: !valid });
                    if (this.state.invalid === valid) {
                        // Assuming state is not updated immediately
                        this.props.onValidityChange(valid);
                    }
                }
            }, {
                key: 'handleEndCheckValidity',
                value: function handleEndCheckValidity(valid) {
                    this.handleValidityChange(valid);
                    if (!valid) {
                        this.props.onInvalid();
                    }
                    this.props.onEndCheckValidity(valid);
                }
            }, {
                key: 'render',
                value: function render() {
                    var _classnames2;

                    return _react2.default.createElement(Field, Object.assign({}, this.props, {
                        className: (0, _classnames4.default)(this.props.className, (_classnames2 = {}, _defineProperty(_classnames2, config.touchedClassName || defaultConfig.touchedClassName, this.state.touched), _defineProperty(_classnames2, config.invalidClassName || defaultConfig.invalidClassName, this.state.invalid), _classnames2)),
                        onValidityChange: this.handleValidityChange,
                        onEndCheckValidity: this.handleEndCheckValidity,
                        endCheckValidity: this.props.endCheckValidity,
                        __source: {
                            fileName: _jsxFileName,
                            lineNumber: 236
                        },
                        __self: this
                    }));
                }
            }]);

            return TouchableCustomField;
        }(_react2.default.Component);

        TouchableCustomField.defaultProps = {
            onInvalid: function onInvalid() {},
            onValidityChange: function onValidityChange() {},
            onEndCheckValidity: function onEndCheckValidity() {},
            endCheckValidity: false
        };
        ;
        TouchableCustomField.displayName = 'TouchableCustomField(' + getDisplayName(Field) + ')';
        return TouchableCustomField;
    };
};

exports.default = { SelfValidating: SelfValidating, Touchable: Touchable, TouchableCustom: TouchableCustom };

//# sourceMappingURL=index.js.map