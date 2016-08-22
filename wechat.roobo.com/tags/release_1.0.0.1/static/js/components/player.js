/**
 * @description: roobo AI配置管理
 * @author: 李宝君  coolli2@163.com
 * @version: V1
 * @update: 16/5/31
 */

/**
 *
 * @name    cfgcenter.js
 * @param   {String}    名称
 * @param   {Function}  方法
 */
    var resoures = {
      getcate : function(){             //取大类
          listvm=new Vue({
            el: '#j_cate',
            data:{
              list:""
            },
            ready:function(){
              this.getdata();
            },
            methods:{
              getdata:function(){
                $.ajax({
                    url :juli.URL.cate,
                    type:'get',
                    dataType:'json',
                    cache:false
                })
                .done(function(res){
                  console.log(res);
                  listvm.list=res;
                  })
                }
              }
        })
      },
      getsubcate : function(){             //取小类
            sublistvm=new Vue({
              el: '#j_list',
              ready:function(){
                this.getdata();
              },
              methods:{
                getdata:function(){
                  $.ajax({
                      url:juli.URL.subcate+"/"+utils.getparam("id")+"/1/12",
                      type: 'get',
                      dataType: 'json',
                      cache:false
                  })
                  .done(function(res){
                    console.log(res);
                    sublistvm.$data=res
                  })
                  }
                }
          })
      },
      listdetail : function(){             //取类别中的资源
            listdetailvm=new Vue({
              el: '#j_listdetail',
              ready:function(){
                this.getdata();
              },
              methods:{
                getdata:function(){
                  var _self=this;
                  $.ajax({
                      url:juli.URL.subcate+"/"+utils.getparam("id")+"/1/12",
                      type: 'get',
                      dataType: 'json',
                      cache:false
                  })
                  .done(function(res){
                    console.log(res);
                    listdetailvm.$data=res;
                    $.each(listdetailvm.resourcePage.result,function(i,n){
                      n.sec=utils.formatSeconds(n.length);
                    })
                  })
                },
                toggleopen:function(i){                    //点击展开
                  $(".buttons-row").eq(i).toggle();
                },
                play:function(src){                  //播放某资源
                  var tryaudio=document.getElementById('try')
                  tryaudio.src=src;
                  tryaudio.play();
                },
                fav:function(){                 //收藏某资源
                    $.toast("收藏成功");
                }
              }
          })
      },
      getfavlist : function(){             //取收藏列表
            favlistvm=new Vue({
              el: '#j_favlist',
              data:{
                list:""
              },
              ready:function(){
                this.getdata();
              },
              methods:{
                getdata:function(){
                  var _self=this;
                  $.ajax({
                      url:juli.URL.getfav,
                      type: 'get',
                      dataType: 'json',
                      cache:false,
                      data:{
                        openId:oXo9MwQZVckuDFMmPbE83N5S7unY
                      }
                  })
                  .done(function(res){
                    console.log(res);
                    listdetailvm.list=res;
                    $.each(list,function(i,n){
                      n.sec=utils.formatSeconds(n.duration);
                    })
                  })
                },
                download: function(item){               //下载
                    console.log(item);
                },
                del : function(item){                   //删除收藏
                    console.log(item);
                  $.ajax({
                      url:juli.URL.getfav,
                      type: 'get',
                      dataType: 'json',
                      cache:false,
                      data:{
                        openId:oXo9MwQZVckuDFMmPbE83N5S7unY
                      }
                  })
                  .done(function(res){
                    console.log(res);
                  alert("删除成功");
                  })
                }
              }
          })
      },
      gethistory : function(){             //取收藏列表
            favlistvm=new Vue({
              el: '#j_history',
              data:{
                list:""
              },
              ready:function(){
                this.getdata();
              },
              methods:{
                getdata:function(){
                  var _self=this;
                  $.ajax({
                      url:juli.URL.gethistory,
                      type: 'get',
                      dataType: 'json',
                      cache:false,
                      data:{
                        openId:oXo9MwQZVckuDFMmPbE83N5S7unY
                      }
                  })
                  .done(function(res){
                    console.log(res);
                    listdetailvm.$data=res;
                    $.each(,function(i,n){
                      n.sec=utils.formatSeconds(n.length);
                    })
                  })
                },
                play:function(item){                      //点播
                  console.log(item);
                },
                stop:function(item){                      //停止
                  console.log(item);
                },
                addfav: function(item){               //添加收藏
                  console.log(item);
                  $.ajax({
                      url:juli.URL.getfav,
                      type: 'get',
                      dataType: 'json',
                      cache:false,
                      data:item
                  })
                  .done(function(res){
                    console.log(res);
                    alert("已添加收藏");
                    })
                  })
                },
                download: function(item){               //下载
                  console.log(item);
                },
                del : function(item){                   //删除历史
                  console.log(item);
                  $.ajax({
                      url:juli.URL.getfav,
                      type: 'get',
                      dataType: 'json',
                      cache:false,
                      data:{
                        openId:oXo9MwQZVckuDFMmPbE83N5S7unY
                      }
                  })
                  .done(function(res){
                    console.log(res);
                    listdetailvm.$data=res;
                    $.each(,function(i,n){
                      n.sec=_self.formatSeconds(n.length);
                    })
                  })
                }
              }
          })
      },
      };


      $(document).ready(function() {

       if($("#j_cate").length){
        resoures.getcate()
       }
       if($("#j_list").length){
        resoures.getsubcate()
       }
       if($("#j_listdetail").length){
        resoures.listdetail()
       }
       if($("#j_favlist").length){
        resoures.favlistvm()
       }
       if($("#j_history").length){
        resoures.gethistory()
       }

      })
