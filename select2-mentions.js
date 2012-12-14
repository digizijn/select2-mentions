(function ($) {
    $.fn.extend({
        setSelection: function(selectionStart, selectionEnd) {
            return this.each(function(i) {
                if (this.createTextRange) {
                    var range = this.createTextRange();
                    range.collapse(true);
                    range.moveEnd('character', selectionEnd);
                    range.moveStart('character', selectionStart);
                    range.select();
                } else if (this.setSelectionRange) {
                    this.focus();
                    this.setSelectionRange(selectionStart, selectionEnd);
                }
            });
        },
        getCursorPosition: function() {
            if (this.length === 0) return this;
            var input = this[0];

            if (input.selectionStart) {
                return input.selectionStart;
            } else if (document.selection) {
                input.focus();

                var r = document.selection.createRange();
                if (r === null) {
                    return 0;
                }

                var re = input.createTextRange(),
                    rc = re.duplicate();
                re.moveToBookmark(r.getBookmark());
                rc.setEndPoint('EndToStart', re);

                return rc.text.length;
            }
            return 0;
        },
        insertTextAtCursorPosition: function(myValue) {
            return this.each(function(i) {
                if (document.selection) {
                    //For browsers like Internet Explorer
                    this.focus();
                    sel = document.selection.createRange();
                    sel.text = myValue;
                    this.focus();
                }
                else if (this.selectionStart || this.selectionStart == '0') {
                    //For browsers like Firefox and Webkit based
                    var startPos = this.selectionStart;
                    var endPos = this.selectionEnd;
                    var scrollTop = this.scrollTop;
                    this.value = this.value.substring(0, startPos) + myValue + this.value.substring(endPos, this.value.length);
                    this.focus();
                    this.selectionStart = startPos + myValue.length;
                    this.selectionEnd = startPos + myValue.length;
                    this.scrollTop = scrollTop;
                } else {
                    this.value += myValue;
                    this.focus();
                }
            });
        },
        mentions: function(options) {
            var self = this;
            var select2Input = $('.select2-input', self.select2('container'));
            var sendKeys = false;

            self.on('close', function(e) {
                if (sendKeys) {
                    window.setTimeout(function() {
                        var position = options.input.data('cursor-position');
                        options.input.setSelection(position, position);
                    }, 50);
                }
            });

            self.on('change', function(e) {
                if (sendKeys) {
                    sendKeys = false;
                    if ('added' in e) {
                        var position = options.input.data('cursor-position');
                        var text = e.added.text + ' ';
                        options.input.setSelection(position, position + 1);
                        options.input.insertTextAtCursorPosition(text);
                        options.input.data('cursor-position', position + text.length);
                    }
                }
            });

            options.input.on('keypress', function(e) {
                options.input.data('cursor-position', options.input.getCursorPosition());
                var code = e.which || e.keyCode;
                var typedValue = String.fromCharCode(code);
                if (options.stopKey.test(typedValue) === false) {
                    sendKeys = false;
                }
                if (sendKeys) {
                    window.setTimeout(function() {
                        self.select2('focus');
                        select2Input.val(typedValue);
                    }, 100);
                }
                if (options.triggerKey.test(typedValue)) {
                    sendKeys = true;
                }
            });

            return this;
        }
    });
})(jQuery);
