/**
 *
 * Shake On Error
 * Author: Restu Suhendar www.aarestu.com
 *
 * Dual licensed under the MIT and GPL licenses
 *
 */

(function ($) {
    var ShakeOnError = function() {
        var duration_per_kocok,
            selected_shake = [],
            shake_current_selector = false,
            kocok = false,
            defaults = {
                selector : $('.coba'),
                check_error_only_content_selector : false,
                check_on_modified : false,
                check_on_submit : true,
                check_on_doc_ready : true,
                check_on_addClass : false,
                selector_error : [ '.has-error', {selector : '.alert-danger', shake_current_selector : true}, {selector : '.alert-warning',shake_current_selector : true}],
                jml_kocok : 10,
                jarak_kocok : 20,
                duration : 300,
                delay : 100,
                before_kocok : function(){},
                after_kocok : function(){}
            },
            check = function(opt, callfunc) {
                setTimeout(function(){
                    var ada = false;
                    for(var i = 0; i < opt.selector_error.length; i++ ) {

                        var add_select = opt.check_error_only_content_selector ? opt.selector_error[i] + ' ' : '';
                        var selector = typeof(opt.selector_error[i]) == 'string' ? opt.selector_error[i] : '';
                        if(typeof(opt.selector_error[i]) == 'object' && typeof(opt.selector_error[i].selector) == 'string') {
                            selector = opt.selector_error[i].selector;
                        }

                        if($( add_select + selector).get().length > 0 ) {
                            ada =  true;
                            if(typeof(opt.selector_error[i]) == 'object' && typeof(opt.selector_error[i].selector) == 'string' && typeof(opt.selector_error[i].shake_current_selector) == 'boolean') {
                                shake_current_selector = true;
                                selected_shake.pushIfNotExist(opt.selector_error[i].selector);
                                console.log(selected_shake.join(','));
                            }
                        }

                    };
                    if(ada && !kocok) {
                        callfunc();
                    }
                }, opt.delay);

            },
            add_event_and_shake = function(opt) {
                //if content body is modified
                if(opt.check_on_modified) {
                    $('body').bind("DOMSubtreeModified",function(){
                         check(opt, function(){
                            shake(opt);
                         });
                    });
                }

                //check jika addClass di panggil
                if(opt.check_on_addClass) {
                    (function () {
                        var originalAddClassMethod = jQuery.fn.addClass;

                        jQuery.fn.addClass = function () {
                            // Execute the original method.
                            var result = originalAddClassMethod.apply(this, arguments);
                            check(opt, function () {
                                shake(opt);
                            });

                            // return the original result
                            return result;
                        }
                    })();
                }

                if(opt.check_on_submit) {
                    (function () {
                        var originalOnSubmit = jQuery.fn.submit;

                        jQuery.fn.submit = function () {
                            // Execute the original method.
                            var result = originalOnSubmit.apply(this, arguments);

                            check(opt, function () {
                                shake(opt);
                            });

                            // return the original result
                            return result;
                        }
                    })();
                }

                //jika document ready cek
                if(opt.check_on_doc_ready) {
                    $(document).ready(function () {
                        check(opt, function () {
                            shake(opt);
                        });
                    });
                }
            },
            shake = function(opt) {
                kocok = true;
                setTimeout(function() {
                    if(kocok) {
                        opt.before_kocok();

                        for (var i = 0; i < opt.jml_kocok; i++) {
                            var jarak_kocok = (i % 2 == 0) ? opt.jarak_kocok : -opt.jarak_kocok;
                            if(shake_current_selector) {
                                $(selected_shake.join(', ')).animate({ 'margin-left': "+=" + jarak_kocok + 'px' }, duration_per_kocok);
                            }
                            $(opt.selector).animate({ 'margin-left': "+=" + jarak_kocok + 'px' }, duration_per_kocok);
                        }


                        setTimeout(function() {
                            shake_current_selector = false;
                            selected_shake = [];
                            opt.after_kocok();
                        }, duration_per_kocok * opt.jml_kocok + opt.duration);
                    }
                    kocok = false;

                }, opt.delay);


            };

        Array.prototype.inArray = function(comparer) {
            for(var i=0; i < this.length; i++) {
                if(comparer(this[i])) return true;
            }
            return false;
        };

        Array.prototype.pushIfNotExist = function(element, comparer) {
            if (!this.inArray(comparer)) {
                this.push(element);
            }
        };

        return {
            init : function(opt) {
                opt = $.extend({}, defaults, opt||{});
                opt.selector = this;
                duration_per_kocok = opt.duration / opt.jml_kocok;

                add_event_and_shake(opt);
            },
            shake : function(opt) {
                opt = $.extend({}, defaults, opt||{});
                opt.selector = this;
                duration_per_kocok = opt.duration / opt.jml_kocok;

                shake(opt);
            }
        };
    }();
    $.fn.extend({
        ShakeOnError: ShakeOnError.init,
        Shake : ShakeOnError.shake
    });
})(jQuery)