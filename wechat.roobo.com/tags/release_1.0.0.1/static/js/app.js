/**
 * Created by lixinwei on 16/8/2.
 */

!(function($, win, undefined){
    "use strict";

    FastClick.attach(document.body);

    var mySwiper = new Swiper('.swiper-container', {
        pagination: '.swiper-pagination',
        slidesPerView: 3,
        slidesPerGroup: 3,
        slidesPerColumn: 4,
        slidesPerColumnFill: 'row',
        paginationClickable: true

    });
    
    // $.confirm("自定义的消息内容自定义的消息内容自定义的消息内容自定义的消息内容", "自定义的标题");

    // $.toast.prototype.defaults.duration = 100000;
    // $.toast("纯文本纯文本", "text");
    // $.toast("取消操作", "cancel");

    // $.actions({
    //     actions: [{
    //         text: "编辑",
    //         onClick: function() {
    //             //do something
    //         }
    //     },{
    //         text: "删除",
    //         onClick: function() {
    //             //do something
    //         }
    //     }]
    // });

})(jQuery, window);