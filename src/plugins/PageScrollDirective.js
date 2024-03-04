import { debounce } from "lodash";

const PageScrollDirective = {
    mounted(el, binding){
        el.__PageSroll__ = debounce(() => {
            console.count('debounce');
            binding.value();
        }, 200, { leading: true });
        document.addEventListener('scroll', el.__PageSroll__);
    },
    unmounted(el){
        document.removeEventListener('scroll', el.__PageSroll__);
    }
}

export default (app) => {
    app.directive("page-scroll", PageScrollDirective);
}