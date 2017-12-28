var _jsxFileName = './src/index.jsx';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/* eslint-disable react/no-multi-comp */

import React from 'react';
import classnames from 'classnames';
import Children from 'react-children-utilities';

export var SelfValidating = function SelfValidating(Form) {
    return function (_React$Component) {
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
                if (this.customFields.count === 0 && this.customFields.valid && this.lastSubmit && this.lastSubmit.target.validity.valid) {
                    this.props.onSubmit(this.lastSubmit);
                }
            }
        }, {
            key: 'render',
            value: function render() {
                var _this2 = this;

                var count = 0;
                var children = Children.deepMap(this.props.children, function (child) {
                    if (child.type.name === 'TouchableCustomField') {
                        count++;
                        return React.cloneElement(child, {
                            endCheckValidity: _this2.state.endCheckValidity,
                            onEndCheckValidity: _this2.handleEndCheckValidity
                        });
                    }
                    return child;
                });

                this.customFields.count = count;
                this.customFields.valid = true;

                return React.createElement(
                    Form,
                    Object.assign({
                        noValidate: true
                    }, this.props, {
                        onSubmit: this.handleSubmit,
                        __source: {
                            fileName: _jsxFileName,
                            lineNumber: 81
                        },
                        __self: this
                    }),
                    children
                );
            }
        }]);

        return SelfValidatingForm;
    }(React.Component);
};

/**
 * For standard fields or those that are built on top of them
 */
export var Touchable = function Touchable(Field) {
    var _class2, _temp;

    return _temp = _class2 = function (_React$Component2) {
        _inherits(TouchableField, _React$Component2);

        function TouchableField(props) {
            _classCallCheck(this, TouchableField);

            var _this3 = _possibleConstructorReturn(this, (TouchableField.__proto__ || Object.getPrototypeOf(TouchableField)).call(this, props));

            _this3.state = {
                touched: false,
                invalid: false
            };
            _this3.handleChange = _this3.handleChange.bind(_this3);
            _this3.handleInvalid = _this3.handleInvalid.bind(_this3);
            return _this3;
        }

        _createClass(TouchableField, [{
            key: 'handleChange',
            value: function handleChange(ev) {
                this.setState({ touched: true, invalid: !ev.target.validity.valid });
                this.props.onChange(ev);
            }
        }, {
            key: 'handleInvalid',
            value: function handleInvalid(ev) {
                this.setState({ touched: true, invalid: true });
                this.props.onInvalid(ev);
            }
        }, {
            key: 'render',
            value: function render() {
                return React.createElement(Field, Object.assign({}, this.props, {
                    className: classnames(this.props.className, {
                        'touched': this.state.touched,
                        'invalid': this.state.invalid
                    }),
                    onChange: this.handleChange,
                    onInvalid: this.handleInvalid,
                    __source: {
                        fileName: _jsxFileName,
                        lineNumber: 125
                    },
                    __self: this
                }));
            }
        }]);

        return TouchableField;
    }(React.Component), _class2.defaultProps = {
        onChange: function onChange() {},
        onInvalid: function onInvalid() {}
    }, _temp;
};

/**
 * For fields that don't fire `invalid` events or their `onChange` property does
 * not pass `change` events
 */
export var TouchableCustom = function TouchableCustom(Field) {
    var _class3, _temp2;

    return _temp2 = _class3 = function (_React$Component3) {
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
                if (this.state.invalid !== !valid) {
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
                return React.createElement(Field, Object.assign({}, this.props, {
                    className: classnames(this.props.className, {
                        'touched': this.state.touched,
                        'invalid': this.state.invalid
                    }),
                    onValidityChange: this.handleValidityChange,
                    onEndCheckValidity: this.handleEndCheckValidity,
                    endCheckValidity: this.props.endCheckValidity,
                    __source: {
                        fileName: _jsxFileName,
                        lineNumber: 183
                    },
                    __self: this
                }));
            }
        }]);

        return TouchableCustomField;
    }(React.Component), _class3.defaultProps = {
        onInvalid: function onInvalid() {},
        onValidityChange: function onValidityChange() {},
        onEndCheckValidity: function onEndCheckValidity() {},
        endCheckValidity: false
    }, _temp2;
};

export default { SelfValidating: SelfValidating, Touchable: Touchable };

//# sourceMappingURL=index.js.map