import { debounce } from "lodash";

const PageScrollDirective = {
    mounted(el, binding){
        el.__PageScroll__ = debounce(() => {
            console.count('debounce');
            binding.value();
        }, 200, { leading: true }); // leading: true make binding.value() to be executed first and then debounce.
        document.addEventListener('scroll', el.__PageScroll__);
    },
    unmounted(el){
        document.removeEventListener('scroll', el.__PageScroll__);
    }
}

export default (app) => {
    app.directive("page-scroll", PageScrollDirective);
}