/**
 * @description: roobo rcc im 模块
 * @author: libaojun@roo.bo
 * @version: V1
 * @update: 16/4/26
 */

var rooboim = {
  timestamp : 0,                                   //时间戳
  sendtxt : {},
  errormsg:{},                                     //发送的消息
  host : "http://ros.365jiating.com/api/talk/text?agentid=119&token=2yucR5A4pgdBWhyDqRRGdVxG__E=",    //输入接口地址
  feedback : "http://chatbot.365jiating.com/chatbot/feedback.php",          //反馈接口地址
  scenes : "js/scenes.json",          //场景配置文件
  production :"p1",
  gettimestamp : function(){                          //如已经有clinetId，则读取，如没有，则写入
     var storage = window.localStorage;
     if (storage.clinetId){
        rooboim.timestamp=storage.clinetId
     }
     else{
        rooboim.timestamp=Math.floor((new Date().getTime())/1000);
        //rooboim.timestamp=md5("darklord"+_second);
        storage.clinetId=rooboim.timestamp;
     };
  },
  getfocus : function(){                        //页面打开获取焦点
      $(".im-input").focus()
  },
  // getsences:function(){                           //发送方内容组件
  //   var scenes = new Vue({
  //     el: '#scenes',
  //     ready:function(){
  //       $.ajax({
  //           url:rooboim.scenes,
  //           type: 'get',
  //           cache:false
  //       })
  //       .done(function(resdata) {
  //         this.$data = resdata
  //         console.log(this.$data);
  //       })
  //     }
  //   })
  // },
  getsences:function(){                           //发送方内容组件
      $.ajax({
          url:rooboim.scenes,
          type: 'get',
          cache:false
      })
      .done(function(resdata) {
            var scenes = new Vue({
              el: '#scenes',
              data:resdata
            })
                    })
  },
  enter:function(){                           //发送方内容组件
    req=Vue.extend({                          //定义发送信息的组件
      template:"#itemreq"
    });
      send=new Vue({
        data:{
          senddata:{
            "version":"1",
            "agentid":"119",
            "sessionid":rooboim.timestamp+'',
            "content":"",
            "position":"北京"
          }
        },
        el:".im-bottom",
        methods:{
          tosend: function(){
            send.senddata.content=$("input").val();
            var newreq=new req({
              data:{
                val:$("input").val()
              }
            });
            newreq.$mount().$appendTo('.im-main');          //先显示
            console.log(JSON.stringify(this.senddata))
            $.ajax({                                            //再发ajax请求
                url:rooboim.host,
                type: 'post',
                contentType: "application/json; charset=utf-8",
                cache:false,
                data: JSON.stringify(this.senddata)
            })
            .done(function(resdata) {                             //生成组建放在页面中
              console.log(resdata);
              var res=Vue.extend({                      //定义返回信息的组件
               template:"#im-new",
               methods:{
                 copy:function(){
                   $("input").val(this.hit)               //点击复制
               }
               }
               });
              var rescomponent=new res({
                data:resdata
              })
              rescomponent.$mount().$appendTo('.im-main');   //先显示返回的信息
              $("input").val("")                           //清空输入框
              document.getElementById("item-new").scrollIntoView();
              $(".im-main").find('div').attr({id: ''});
            })
          }
        }
      })
    }
      };

    $(function(){
        rooboim.getsences();
        rooboim.gettimestamp();
        rooboim.enter();
        //rooboim.getfocus();
        $('[data-toggle="tooltip"]').tooltip()
    });
