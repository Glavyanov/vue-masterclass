import { Field, Form, ErrorMessage, defineRule } from "vee-validate"

export default (app) => {

    defineRule('required', (value, _, el) => {
        if(value && value.trim()) return true;
        return `${el?.label || 'This'} is required`;
    })

    app.component('VeeForm', Form);
    app.component('VeeField', Field);
    app.component('VeeErrorMessage', ErrorMessage);
}