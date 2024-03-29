import { Field, Form, ErrorMessage, defineRule, configure } from "vee-validate"
import { email, min, required } from "@vee-validate/rules";
import { localize } from "@vee-validate/i18n";

export default (app) => {

    defineRule('required', required);
    defineRule('email', email);
    defineRule('min', min);

    configure({
        generateMessage: localize('bg', {
            messages: {
                required: 'Полето {field} е задължително',
                email: 'Полето {field} трябва да е коректен имейл адрес',
                min: 'Полето {field} трябва да съдържа минимум 0:{min} символа',
            }
        })
    })

    app.component('VeeForm', Form);
    app.component('VeeField', Field);
    app.component('VeeErrorMessage', ErrorMessage);
}