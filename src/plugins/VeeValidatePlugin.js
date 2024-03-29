import { Field, Form, ErrorMessage, defineRule } from "vee-validate"
import { email } from "@vee-validate/rules";

export default (app) => {

    defineRule('required', (value, _, el) => {
        if(value && value.trim()) return true;
        return `${el?.label || 'This'} is required`;
    });

    defineRule('email', email);

    app.component('VeeForm', Form);
    app.component('VeeField', Field);
    app.component('VeeErrorMessage', ErrorMessage);
}