import React from 'react';
import {mount} from 'enzyme';

import {Touchable, SelfValidating} from './index';

describe('SelfValidationHoc', () => {
    let SelfValidatingForm;
    let TouchableInput;

    beforeEach(() => {
        SelfValidatingForm = SelfValidating(props => <form {...props} />);
        TouchableInput = Touchable(props => <input {...props} />);
    });

    it('should call onInvalid when form is submitted', () => {
        const handleInvalid = jest.fn();
        const wrapper = mount(
            <SelfValidatingForm onSubmit={() => {}}>
                <TouchableInput onInvalid={handleInvalid} required />
            </SelfValidatingForm>,
        );
        wrapper.find('form').simulate('submit', {
            target: {
                checkValidity: () => {
                    wrapper.find('input').simulate('invalid');
                },
            },
        });
        expect(handleInvalid).toHaveBeenCalled();
    });

    it('should call onChange when its value is changed', () => {
        const handleChange = jest.fn();
        const wrapper = mount(
            <SelfValidatingForm>
                <TouchableInput onChange={handleChange} />
            </SelfValidatingForm>,
        );
        wrapper.find('input').simulate('change', {
            target: {
                validity: {
                    valid: true,
                },
            },
        });
        expect(handleChange).toHaveBeenCalled();
    });

    it('should not mark invalid element as invalid initially', () => {
        const wrapper = mount(<TouchableInput required />);
        expect(wrapper.state('invalid')).toBe(false);
    });

    it('should not mark valid element as invalid initially', () => {
        const wrapper = mount(<TouchableInput />);
        expect(wrapper.state('invalid')).toBe(false);
    });

    it('should mark invalid element as invalid on change', () => {
        const wrapper = mount(<TouchableInput required />);
        wrapper.find('input').simulate('change', {
            target: {
                validity: {
                    valid: false,
                },
            },
        });
        expect(wrapper.state('invalid')).toBe(true);
    });

    it('should not mark valid element as invalid on change', () => {
        const wrapper = mount(<TouchableInput required />);
        wrapper.find('input').simulate('change', {
            target: {
                validity: {
                    valid: true,
                },
            },
        });
        expect(wrapper.state('invalid')).toBe(false);
    });

    it('should mark invalid element as invalid on submit', () => {
        const wrapper = mount(<TouchableInput required />);
        wrapper.find('input').simulate('invalid');
        expect(wrapper.state('invalid')).toBe(true);
    });

    it('should not mark valid element as invalid on submit', () => {
        const wrapper = mount(<TouchableInput />);
        expect(wrapper.state('invalid')).toBe(false);
    });

    it('should not mark element as touched initially', () => {
        const wrapper = mount(<TouchableInput />);
        expect(wrapper.state('touched')).toBe(false);
    });

    it('should make element as touched on change', () => {
        const wrapper = mount(<TouchableInput />);
        wrapper.find('input').simulate('change', {
            target: {
                validity: {}, // Unimportant
            },
        });
        expect(wrapper.state('touched')).toBe(true);
    });

    it('should make element as touched on submit', () => {
        const wrapper = mount(<TouchableInput required />);
        wrapper.find('input').simulate('invalid');
        expect(wrapper.state('touched')).toBe(true);
    });

    it('should not break on text sibling', () => {
        const wrapper = mount(
            <SelfValidatingForm>
                <TouchableInput />
                text
            </SelfValidatingForm>,
        );
    });

    it('should not break on null sibling', () => {
        console.log('breaking test')
        const wrapper = mount(
            <SelfValidatingForm>
                <TouchableInput />
                {null}
            </SelfValidatingForm>,
        );
    });

    it('should not break on false sibling', () => {
        console.log('breaking test')
        const wrapper = mount(
            <SelfValidatingForm>
                <TouchableInput />
                {false}
            </SelfValidatingForm>,
        );
    });
});
