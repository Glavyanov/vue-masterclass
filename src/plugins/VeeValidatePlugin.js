import { Field, Form, ErrorMessage, defineRule, configure } from "vee-validate"
import { email, min, required } from "@vee-validate/rules";
import { localize } from "@vee-validate/i18n";
import firebase from "@/helpers/firebase";

export default (app) => {

    defineRule('required', required);
    defineRule('email', email);
    defineRule('min', min);
    defineRule('unique', async (value, args) => {
        let collection, field;
        if(Array.isArray(args)){
            [collection, field] = args;
        } else {
            ({ collection, field} = args)
        }

        const querySnapshot = await firebase.firestore().collection(collection).where(field, '==', value).get();
        return querySnapshot.empty
    });

    configure({
        generateMessage: localize('bg', {
            messages: {
                required: 'Полето {field} е задължително',
                email: 'Полето {field} трябва да е коректен имейл адрес',
                min: 'Полето {field} трябва да съдържа минимум 0:{min} символа',
                unique: 'Такъв запис вече съществува.'
            }
        })
    })

    app.component('VeeForm', Form);
    app.component('VeeField', Field);
    app.component('VeeErrorMessage', ErrorMessage);
}