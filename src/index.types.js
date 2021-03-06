// @flow

import type {ComponentType} from 'react';

export type FormComponent = ComponentType<{
    noValidate: boolean,
    onSubmit: (SyntheticInputEvent<HTMLFormElement>) => void,
}>;

export type SelfValidatingFormProps = Object & {
    onSubmit: (SyntheticEvent<HTMLFormElement>) => void,
};

export type FieldComponent = ComponentType<{
    className: string,
    onChange: (SyntheticInputEvent<HTMLInputElement>) => void,
    onInvalid: (SyntheticEvent<HTMLInputElement>) => void
}>;

export type TouchableFieldProps = Object & {
    onChange: (SyntheticInputEvent<HTMLInputElement>) => void,
    onInvalid: (SyntheticEvent<HTMLInputElement>) => void,
    inputRef: (HTMLInputElement) => void,
};

export type CustomFieldComponent = ComponentType<{
    className: string,
    onValidityChange: (boolean) => void,
    onEndCheckValidity: (boolean) => void,
    endCheckValidity: boolean,
}>;

export type TouchableCustomFieldProps = Object & {
    onValidityChange: (boolean) => void,
    onInvalid: () => void,
};

export type TouchableFieldState = {
    touched: boolean,
    invalid: boolean,
    value: string,
};

export type TouchableCustomFieldState = {
    touched: boolean,
    invalid: boolean,
};

export type Config = {
    touchedClassName: string,
    invalidClassName: string,
};
