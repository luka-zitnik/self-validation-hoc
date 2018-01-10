# SelfValidationHoc

A minimal and sensible form validation library for React apps.

[![Build Status](https://travis-ci.org/luka-zitnik/self-validation-hoc.svg?branch=master)](https://travis-ci.org/luka-zitnik/self-validation-hoc)
[![Code Coverage](https://codecov.io/gh/luka-zitnik/self-validation-hoc/branch/master/graph/badge.svg)](https://codecov.io/gh/luka-zitnik/self-validation-hoc)

## Requirements for This Library

- Adds validation to **exiting forms**
- Reduces interaction with the form to a **bare minimum**
- Uses **standard validation attributes**
- It's not a mixin, rather a HOC, if necessary
- Marks form elements as "touched" when input is changed or form is submitted
- Works for both, `react-bootstrap` and standard forms
- Custom form fields can be **easily adapted to it**

## Resulting Properties

- Can validate any custom field that's built on top of a standard form element
- For other custom fields, it exposes a simple API for them to report their validity to their form
- Always cancels submit event, assuming no one will ever want a submit to navigate off the page

## Usage

This library consists of three higher order components (HOCs). `SelfValidating` HOC runs validity checks on `submit` event of the provided *form component*, which has to be built on top of the standard form, and calls `onSubmit` handler if the form is valid. `Touchable` and `TouchableCustom` manage a couple of CSS classes, `touched` and `invalid`, of two types of provided *form field components*.

### Standard Fields

You only need to pass your form through the `SelfValidating` function, and optionally your fields through the `Touchable` function.

```diff
import React from 'react';
import {FormGroup, FormControl, ControlLabel, HelpBlock, Button} from 'react-bootstrap';

+import {SelfValidating, Touchable} from './index';
+
+const SelfValidatingStandardForm = SelfValidating(props => (
+    <form {...props} />
+));
+const TouchableFormControl = Touchable(FormControl);
+
const Page = () => (
-    <form onSubmit={() => { alert('sumbitted'); }}>
+    <SelfValidatingStandardForm onSubmit={() => { alert('sumbitted'); }}>
        <FormGroup controlId="short-text">
-            <FormControl
+            <TouchableFormControl
                required
            />
            <ControlLabel>
                A short text field
            </ControlLabel>
            <HelpBlock>This field is required</HelpBlock>
        </FormGroup>
        <Button type="submit">Submit</Button>
-    </form>
+    </SelfValidatingStandardForm>
);

export default Page;
```

### Custom Fields That Don't Fire `change` or `invalid`

You first need to make a few adaptations to your custom field.

```diff
// CustomField.jsx

import React from 'react';

export default class CustomField extends React.Component {
    static defaultProps = {
+        onValidityChange: () => {},
+        onEndCheckValidity: () => {},
+        endCheckValidity: false,
    };
    
    componentWillReceiveProps(nextProps) {
+        if (nextProps.endCheckValidity) {
+            nextProps.onEndCheckValidity(true); // or false
+        }
    }
    
    handleChange() {
+        this.props.onValidityChange(true); // or false
    }
    
    render() {}
}
```

That is all your custom field is required to have, three additional properties, `onValidityChange`, `onEndCheckValidity` and `endCheckValidity` and a way to determine validity of its input value. It should call `onEndCheckValidity` when the *self-validating form* wants it, that is when `endCheckValidity` is `true`, and `onValidityChange` whenever the input changes.

You then pass your `CustomField` through the `TouchableCustom` function.

Unlike with standard fields, where using `Touchable` is optional, you have to pass your custom field through `TouchableCustom` in order for self-validating form to determine the validity of the field.

```diff
import React from 'react';

import CustomField from './CustomField';

+const SelfValidatingStandardForm = SelfValidating(props => (
+    <form {...props} />
+));
+const TouchableCustomField = TouchableCustom(CustomField);
+
const Page = () => (
-    <form onSubmit={() => { alert('sumbitted'); }}>
+    <SelfValidatingStandardForm onSubmit={() => { alert('sumbitted'); }}>
        <div className="form-group">
-            <CustomField
+            <TouchableCustomField
                id="custom-field"
                required
            />
            <label htmlFor="custom-field">
                A custom field
            </label>
            <div className="help-block">This field is required</div>
        </div>
        <button>Submit</button>
-    </form>
+    </SelfValidatingStandardForm>
);

export default Page;
```
