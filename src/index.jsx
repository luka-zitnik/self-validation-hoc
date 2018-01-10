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

export const SelfValidating = (Form: FormComponent) =>
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
                if (child && child.type && child.type.name === 'TouchableCustomField') {
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

/**
 * For standard fields or those that are built on top of them
 */
export const Touchable = (Field: FieldComponent) =>
    class TouchableField extends React.Component<TouchableFieldProps, TouchableFieldState> {
        static defaultProps = {
            onChange: () => {},
            onInvalid: () => {},
        };

        handleChange: (SyntheticInputEvent<HTMLInputElement>) => void;
        handleInvalid: (SyntheticEvent<HTMLInputElement>) => void;

        constructor(props: TouchableFieldProps) {
            super(props);
            this.state = {
                touched: false,
                invalid: false,
            };
            this.handleChange = this.handleChange.bind(this);
            this.handleInvalid = this.handleInvalid.bind(this);
        }

        handleChange(ev: SyntheticInputEvent<HTMLInputElement>) {
            this.setState({touched: true, invalid: !ev.target.validity.valid});
            this.props.onChange(ev);
        }

        handleInvalid(ev: SyntheticEvent<HTMLInputElement>) {
            this.setState({touched: true, invalid: true});
            this.props.onInvalid(ev);
        }

        render() {
            return (
                <Field
                    {...this.props}
                    className={classnames(this.props.className, {
                        'touched': this.state.touched,
                        'invalid': this.state.invalid,
                    })}
                    onChange={this.handleChange}
                    onInvalid={this.handleInvalid}
                />
            );
        }
    };

/**
 * For fields that don't fire `invalid` events or their `onChange` property does
 * not pass `change` events
 */
export const TouchableCustom = (Field: CustomFieldComponent) =>
    class TouchableCustomField extends React.Component<
        TouchableCustomFieldProps, TouchableFieldState
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
            if (this.state.invalid !== !valid) { // Assuming state is not updated immediately
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
                        'touched': this.state.touched,
                        'invalid': this.state.invalid,
                    })}
                    onValidityChange={this.handleValidityChange}
                    onEndCheckValidity={this.handleEndCheckValidity}
                    endCheckValidity={this.props.endCheckValidity}
                />
            );
        }
    };

export default {SelfValidating, Touchable};
