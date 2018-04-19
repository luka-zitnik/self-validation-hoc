/* eslint-disable react/jsx-filename-extension, react/no-multi-comp */

import React from 'react';
import {Form, FormGroup, FormControl, ControlLabel, HelpBlock, Button, Checkbox} from 'react-bootstrap';

import {storiesOf} from '@storybook/react';
import {action} from '@storybook/addon-actions';

import {SelfValidating, Touchable, TouchableCustom} from './index';

const stories = storiesOf('Self-Validating Form', module);
const SelfValidatingBootstrapForm = SelfValidating(Form);
const TouchableFormControl = Touchable()(FormControl);
const TouchableCheckbox = Touchable()(Checkbox);
const SelfValidatingStandardForm = SelfValidating(props => (
    <form {...props} />
));
const TouchableSelect = Touchable()(props => {
    const p = {...props};
    delete p.inputRef;
    return <select {...p} ref={input => { props.inputRef(input); }} />;
});
const TouchableInput = Touchable()(props => {
    const p = {...props};
    delete p.inputRef;
    return <input {...p} ref={input => { props.inputRef(input); }} />;
});
const TouchableTextarea = Touchable()(props => {
    const p = {...props};
    delete p.inputRef;
    return <textarea {...p} ref={input => { props.inputRef(input); }} />;
});
const TouchableStandardCheckbox = Touchable()(props => (
    <div className={props.className}>
        <label htmlFor={props.id}>
            <input
                id={props.id}
                required={props.required}
                onChange={props.onChange}
                onInvalid={props.onInvalid}
                ref={input => { props.inputRef(input); }}
                type="checkbox"
            />
            {props.children}
        </label>
    </div>
));

class AtLeastOne extends React.Component {
    chk1: null;
    chk2: null;

    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.endCheckValidity) {
            nextProps.onEndCheckValidity(this.isValid());
        }
    }

    handleChange() {
        this.props.onValidityChange(this.isValid());
    }

    isValid() {
        return this.chk1 && this.chk2 && (this.chk1.checked || this.chk2.checked);
    }

    render() {
        return (
            <div onChange={this.handleChange}>
                <input type="checkbox" ref={input => this.chk1 = input} />
                <input type="checkbox" ref={input => this.chk2 = input} />
            </div>
        );
    }
}

const TouchableAtLeastOne = TouchableCustom()(AtLeastOne);

stories.add('bootstrap form', () => (
    <SelfValidatingBootstrapForm onSubmit={action('Valid form submitted')}>
        <FormGroup controlId="select">
            <TouchableFormControl
                required
                componentClass="select"
                onChange={action('Option changed')}
                onInvalid={action('Selected option is invalid')}
            >
                <option value="">Select an option</option>
                <option value="1">Option 1</option>
                <option value="2">Option 2</option>
            </TouchableFormControl>
            <ControlLabel className="">
                A select field
            </ControlLabel>
            <HelpBlock>This field is required</HelpBlock>
        </FormGroup>
        <FormGroup controlId="short-text">
            <TouchableFormControl
                required
                onChange={action('Short text changed')}
                onInvalid={action('Short text is invalid')}
            />
            <ControlLabel className="">
                A short text field
            </ControlLabel>
            <HelpBlock>This field is required</HelpBlock>
        </FormGroup>
        <FormGroup controlId="long-text">
            <TouchableFormControl
                required
                componentClass="textarea"
                onChange={action('Long text changed')}
                onInvalid={action('Long text is invalid')}
            />
            <ControlLabel className="">
                A long text field
            </ControlLabel>
            <HelpBlock>This field is required</HelpBlock>
        </FormGroup>
        <FormGroup controlId="checkbox">
            <TouchableCheckbox
                required
                onChange={action('Checkbox changed')}
                onInvalid={action('Checkbox is not checked')}
            >Option 1</TouchableCheckbox>
            <ControlLabel className="">
                A checkbox field
            </ControlLabel>
            <HelpBlock>This field is required</HelpBlock>
        </FormGroup>
        <FormGroup controlId="form-group">
            <TouchableAtLeastOne
                id="at-least-one"
                onValidityChange={action('At least one is changed')}
                onInvalid={action('At least one is invalid')}
            />
            <ControlLabel className="">
                At least one
            </ControlLabel>
            <HelpBlock>At least one item must be selected</HelpBlock>
        </FormGroup>
        <Button
            type="submit"
            className="btn btn--primary btn--medium"
        >Submit</Button>
    </SelfValidatingBootstrapForm>
));

stories.add('standard form', () => (
    <SelfValidatingStandardForm onSubmit={action('Valid form submitted')}>
        <div className="form-group">
            <TouchableSelect
                required
                id="select"
                className=""
                onChange={action('Option changed')}
                onInvalid={action('Selected option is invalid')}
            >
                <option value="">Select an option</option>
                <option value="1">Option 1</option>
                <option value="2">Option 2</option>
            </TouchableSelect>
            <label htmlFor="select" className="">
                A select field
            </label>
            <div className="help-block">This field is required</div>
        </div>
        <div className="form-group">
            <TouchableInput
                required
                id="short-text"
                className=""
                onChange={action('Short text changed')}
                onInvalid={action('Short text is invalid')}
            />
            <label htmlFor="short-text" className="">
                A short text field
            </label>
            <div className="help-block">This field is required</div>
        </div>
        <div className="form-group">
            <TouchableTextarea
                required
                id="long-text"
                className=""
                onChange={action('Long text changed')}
                onInvalid={action('Long text is invalid')}
            />
            <label htmlFor="long-text" className="">
                A long text field
            </label>
            <div className="help-block">This field is required</div>
        </div>
        <div className="form-group">
            <TouchableStandardCheckbox
                required
                id="checkbox"
                onChange={action('Checkbox is changed')}
                onInvalid={action('Checkbox is not checked')}
            >
                Option 1
            </TouchableStandardCheckbox>
            <label htmlFor="checkbox" className="">
                A checkbox field
            </label>
            <div className="help-block">This field is required</div>
        </div>
        <div className="form-group">
            <TouchableAtLeastOne
                id="at-least-one"
                onValidityChange={action('At least one is changed')}
                onInvalid={action('At least one is invalid')}
            />
            <label htmlFor="at-least-one" className="">
                At least one
            </label>
            <div className="help-blok">At least one item must be selected</div>
        </div>
        <button className="btn btn--primary btn--medium">Submit</button>
    </SelfValidatingStandardForm>
));
