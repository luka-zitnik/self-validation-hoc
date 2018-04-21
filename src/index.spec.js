import React from 'react';
import {mount} from 'enzyme';

import {Touchable, TouchableCustom, SelfValidating} from './index';

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

describe('SelfValidationHoc', () => {
    let SelfValidatingForm;

    beforeEach(() => {
        SelfValidatingForm = SelfValidating(props => <form {...props} />);
    });

    it('should not break on text sibling', () => {
        mount(
            <SelfValidatingForm>
                <div>
                    <input />
                    text
                </div>
            </SelfValidatingForm>,
        );
    });

    it('should not break on null sibling', () => {
        mount(
            <SelfValidatingForm>
                <div>
                    <input />
                    {null}
                </div>
            </SelfValidatingForm>,
        );
    });

    it('should not break on false sibling', () => {
        mount(
            <SelfValidatingForm>
                <div>
                    <input />
                    {false}
                </div>
            </SelfValidatingForm>,
        );
    });

    describe('Touchable', () => {
        let TouchableInput;

        beforeEach(() => {
            TouchableInput = Touchable()(props => {
                const p = {...props};
                delete p.inputRef;
                return <input type="text" {...p} ref={input => { props.inputRef(input); }} />;
            });
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

        it('should call onChange when input value is changed', () => {
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

        it('should not be marked when invalid as invalid initially', () => {
            const wrapper = mount(<TouchableInput required />);
            expect(wrapper.state('invalid')).toBe(false);
        });

        it('should not be marked when valid as invalid initially', () => {
            const wrapper = mount(<TouchableInput />);
            expect(wrapper.state('invalid')).toBe(false);
        });

        it('should be marked when invalid as invalid on change', () => {
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

        it('should not be marked when valid as invalid on change', () => {
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

        it('should be marked when invalid as invalid on submit', () => {
            const wrapper = mount(<TouchableInput required />);
            wrapper.find('input').simulate('invalid');
            expect(wrapper.state('invalid')).toBe(true);
        });

        it('should not be marked when valid as invalid on submit', () => {
            const wrapper = mount(<TouchableInput />);
            expect(wrapper.state('invalid')).toBe(false);
        });

        it('should not be marked as touched initially', () => {
            const wrapper = mount(<TouchableInput />);
            expect(wrapper.state('touched')).toBe(false);
        });

        it('should be marked as touched on change', () => {
            const wrapper = mount(<TouchableInput />);
            wrapper.find('input').simulate('change', {
                target: {
                    validity: {}, // Unimportant
                },
            });
            expect(wrapper.state('touched')).toBe(true);
        });

        it('should be marked as touched on submit', () => {
            const wrapper = mount(<TouchableInput required />);
            wrapper.find('input').simulate('invalid');
            expect(wrapper.state('touched')).toBe(true);
        });
    });

    describe('TouchableCustom', () => {
        let TouchableCustomInput;

        beforeEach(() => {
            TouchableCustomInput = TouchableCustom()(AtLeastOne);
        });

        it('should call onInvalid when form is submitted', () => {
            const handleInvalid = jest.fn();
            const wrapper = mount(
                <SelfValidatingForm onSubmit={() => {}}>
                    <TouchableCustomInput onInvalid={handleInvalid} />
                </SelfValidatingForm>,
            );
            wrapper.find('form').simulate('submit', {
                target: {
                    checkValidity: () => {
                    },
                },
            });
            expect(handleInvalid).toHaveBeenCalled();
        });

        it('should call onValidityChange when input validity is changed', () => {
            const handleValidityChange = jest.fn();
            const wrapper = mount(
                <SelfValidatingForm>
                    <TouchableCustomInput onValidityChange={handleValidityChange} />
                </SelfValidatingForm>,
            );
            wrapper.find('input[type="checkbox"]').at(0).simulate('change', {
                target: {
                    checked: true,
                }
            });
            expect(handleValidityChange).toHaveBeenCalled();
        });
    });
});
