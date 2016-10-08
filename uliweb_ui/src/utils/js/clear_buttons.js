/* display clear input text buttons
*/
(function($){
    $.fn.clear_button = function(options){
        return this.each(function(){
            //插件的实现代码
            var $item = $(this)
            if ($item.data('clear_button')) return
            $item.css({'padding-right':24})
            var $parent = $item.parent()
            $parent.css({position:'relative'})
            var el = $('<i class="ion-ios-close"></i>')
            var h = $item.outerHeight()
            el.css({height:h, 'line-height':h+'px', position:'absolute',
              right:4, top:0, cursor:'pointer', "font-size":'1.4em',
              color: "gray", display:'none'})
            $parent.append(el)
            $item.keyup(function(e){
              if ($item.val())
                el.show()
              else {
                el.hide()
              }
            })
            el.click(function(e){
              e.preventDefault()
              $item.val('')
              el.hide()
            })
            $item.data('clear_button', el)
        });
    };
})(jQuery);
