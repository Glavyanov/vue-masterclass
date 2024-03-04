const BackdropDirective = {
    mounted(el, binding){
        el.__backdropHandler__ = event => {
            if(!(el === event.target || el.contains(event.target))){
                binding.value(event);
            }
        };

        document.body.addEventListener('click', el.__backdropHandler__ );
    },
    unmounted(el){
        document.body.removeEventListener('click', el.__backdropHandler__ );
    }
}


export default (app) => {
    app.directive('backdrop', BackdropDirective);
}