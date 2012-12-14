$(function() {
    function example1() {
        var selector = '#example1 .demo input.select2';
        $(selector).select2({
            tags: ["red", "green", "blue", "yellow", "green", "magenta"]
        });
        $(selector).mentions({
            input: $('#example1 .demo textarea.mentions'),
            triggerKey: /@/,
            stopKey: /^[a-z0-9]+$/i
        });
    }

    example1();
});
