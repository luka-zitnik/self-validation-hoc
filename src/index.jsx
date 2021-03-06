// @flow
/* eslint-disable react/no-multi-comp */

import React from 'react';
import classnames from 'classnames';

import type {
    FormComponent,
    SelfValidatingFormProps,
    FieldComponent,
    TouchableFieldProps,
    CustomFieldComponent,
    TouchableCustomFieldProps,
    TouchableFieldState,
    TouchableCustomFieldState,
    Config,
} from './index.types';

function deepMap(children, deepMapFn) {
    return React.Children
    .map(children, (child) => {
        if (child && child.props && child.props.children
            && typeof child.props.children === 'object') {
                // Clone the child that has children and map them too
                return deepMapFn(React.cloneElement(child, {
                    ...child.props,
                    children: deepMap(child.props.children, deepMapFn),
                }));
            }
            return deepMapFn(child);
        });
}

function getDisplayName(WrappedComponent) {
    return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}

export const SelfValidating = (Form: FormComponent) => {
    class SelfValidatingForm extends React.Component<SelfValidatingFormProps, {
        endCheckValidity: boolean,
    }> {
        state = {
            endCheckValidity: false,
        };
        customFields = {
            count: 0,
            valid: true,
        };
        lastSubmit = null;
        handleSubmit: (SyntheticInputEvent<HTMLFormElement>) => void;
        handleEndCheckValidity: (boolean) => void;

        constructor(props: SelfValidatingFormProps) {
            super(props);
            this.handleSubmit = this.handleSubmit.bind(this);
            this.handleEndCheckValidity = this.handleEndCheckValidity.bind(this);
        }

        handleSubmit(ev: SyntheticInputEvent<HTMLFormElement>) {
            ev.preventDefault();
            if (ev.target.checkValidity() && this.customFields.count === 0) {
                this.props.onSubmit(ev);
            } else if (this.customFields.count) {
                ev.persist();
                this.lastSubmit = ev;
                this.setState({endCheckValidity: true});
            }
        }

        handleEndCheckValidity(valid: boolean) {
            this.setState({endCheckValidity: false});
            this.customFields.count--;
            this.customFields.valid = valid && this.customFields.valid;
            if (
                this.customFields.count === 0
                && this.customFields.valid
                && this.lastSubmit
                && this.lastSubmit.target.checkValidity()
            ) {
                this.props.onSubmit(this.lastSubmit);
            }
        }

        render() {
            let count = 0;
            const children = deepMap(this.props.children, (child) => {
                if (child && child.type && child.type.displayName && child.type.displayName.search(/^TouchableCustomField(.+)$/) === 0) {
                    count++;
                    return React.cloneElement(child, {
                        endCheckValidity: this.state.endCheckValidity,
                        onEndCheckValidity: this.handleEndCheckValidity,
                    });
                }
                return child;
            });

            this.customFields.count = count;
            this.customFields.valid = true;

            return (
                <Form
                    noValidate
                    {...this.props}
                    onSubmit={this.handleSubmit}
                >{children}</Form>
            );
        }
    };
    SelfValidatingForm.displayName = `SelfValidatingForm(${getDisplayName(Form)})`;
    return SelfValidatingForm;
}

const defaultConfig = {
    touchedClassName: 'touched',
    invalidClassName: 'invalid',
};

/**
 * For standard fields or those that are built on top of them
 */
export const Touchable = (config: Config = defaultConfig) => (Field: FieldComponent) => {
    class TouchableField extends React.Component<TouchableFieldProps, TouchableFieldState> {
        static defaultProps = {
            onChange: () => {},
            onInvalid: () => {},
            inputRef: () => {},
        };

        input: HTMLInputElement;
        handleChange: (SyntheticInputEvent<HTMLInputElement>) => void;
        handleInvalid: (SyntheticEvent<HTMLInputElement>) => void;
        handleInputRef: (HTMLInputElement) => void;

        constructor(props: TouchableFieldProps) {
            super(props);
            this.state = {
                touched: false,
                invalid: false,
                value: props.value || '',
            };
            this.handleChange = this.handleChange.bind(this);
            this.handleInvalid = this.handleInvalid.bind(this);
            this.handleInputRef = this.handleInputRef.bind(this);
        }

        componentWillReceiveProps(nextProps: TouchableFieldProps) {
            this.setState({value: nextProps.value});
        }

        componentDidUpdate() {
            if (this.state.touched && this.input && this.input.validity && this.state.invalid === this.input.validity.valid) {
                this.setState({invalid: !this.input.validity.valid});
            }
        }

        handleChange(ev: SyntheticInputEvent<HTMLInputElement>) {
            this.setState({touched: true, invalid: !ev.target.validity.valid, value: ev.target.value});
            this.props.onChange(ev);
        }

        handleInvalid(ev: SyntheticEvent<HTMLInputElement>) {
            this.setState({touched: true, invalid: true});
            this.props.onInvalid(ev);
        }

        handleInputRef(input: HTMLInputElement) {
            this.input = input;
            this.props.inputRef(input);
        }

        render() {
            return (
                <Field
                    {...this.props}
                    className={classnames(this.props.className, {
                        [config.touchedClassName || defaultConfig.touchedClassName]: this.state.touched,
                        [config.invalidClassName || defaultConfig.invalidClassName]: this.state.invalid,
                    })}
                    onChange={this.handleChange}
                    onInvalid={this.handleInvalid}
                    inputRef={this.handleInputRef}
                    value={this.state.value}
                />
            );
        }
    };
    TouchableField.displayName = `TouchableField(${getDisplayName(Field)})`;
    return TouchableField;
}

/**
 * For fields that don't fire `invalid` events or their `onChange` property does
 * not pass `change` events
 */
export const TouchableCustom = (config: Config = defaultConfig) => (Field: CustomFieldComponent) => {
    class TouchableCustomField extends React.Component<
        TouchableCustomFieldProps, TouchableCustomFieldState
    > {
        static defaultProps = {
            onInvalid: () => {},
            onValidityChange: () => {},
            onEndCheckValidity: () => {},
            endCheckValidity: false,
        };

        handleValidityChange: (boolean) => void;
        handleEndCheckValidity: (boolean) => void;

        constructor(props: TouchableCustomFieldProps) {
            super(props);
            this.state = {
                touched: false,
                invalid: false,
            };
            this.handleValidityChange = this.handleValidityChange.bind(this);
            this.handleEndCheckValidity = this.handleEndCheckValidity.bind(this);
        }

        handleValidityChange(valid: boolean) {
            this.setState({touched: true, invalid: !valid});
            if (this.state.invalid === valid) { // Assuming state is not updated immediately
                this.props.onValidityChange(valid);
            }
        }

        handleEndCheckValidity(valid: boolean) {
            this.handleValidityChange(valid);
            if (!valid) {
                this.props.onInvalid();
            }
            this.props.onEndCheckValidity(valid);
        }

        render() {
            return (
                <Field
                    {...this.props}
                    className={classnames(this.props.className, {
                        [config.touchedClassName || defaultConfig.touchedClassName]: this.state.touched,
                        [config.invalidClassName || defaultConfig.invalidClassName]: this.state.invalid,
                    })}
                    onValidityChange={this.handleValidityChange}
                    onEndCheckValidity={this.handleEndCheckValidity}
                    endCheckValidity={this.props.endCheckValidity}
                />
            );
        }
    };
    TouchableCustomField.displayName = `TouchableCustomField(${getDisplayName(Field)})`;
    return TouchableCustomField;
}

export default {SelfValidating, Touchable, TouchableCustom};
