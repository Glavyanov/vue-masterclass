import { Field, Form, ErrorMessage, defineRule } from "vee-validate"
import { email, min } from "@vee-validate/rules";

export default (app) => {

    defineRule('required', (value, _, el) => {
        if(value && value.trim()) return true;
        return `${el?.label || 'This'} is required`;
    });

    defineRule('email', email);
    defineRule('min', min);

    app.component('VeeForm', Form);
    app.component('VeeField', Field);
    app.component('VeeErrorMessage', ErrorMessage);
}