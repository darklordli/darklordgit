<style>
    .tree-grid .level-0 .indented{
        position: relative;
        left: 0;
    }
    .tree-grid .level-1 .indented {
        position : relative;
        left     : 20px;
    }
    .tree-grid .level-2 .indented {
        position : relative;
        left     : 40px;
    }
    .tree-grid .level-3 .indented {
        position : relative;
        left     : 60px;
    }
    .tree-grid .level-4 .indented {
        position : relative;
        left     : 80px;
    }
    .tree-grid .level-5 .indented {
        position : relative;
        left     : 100px;
    }
    .tree-grid .level-6 .indented {
        position : relative;
        left     : 120px;
    }
</style>
<template>
        <table class="table table-bordered tree-grid">
            <thead>
                <tr>
                    <th>标题</th>
                    <th>姓名</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item, index) in items"
                v-show="show(item)"
                :class="'level-' + item.grade">
                    <td>
                        <i v-if="item.children" class="indented glyphicon" :class="{'glyphicon-plus':!item.expanded,'glyphicon-minus':item.expanded }" @click="toggle(index,item)"></i>
                        <i v-else class="indented fa fa-files-o "></i>
                        <a class="indented" style="display:inline-block;">{{item.text}}</a>
                    </td>
                    <td>
                        {{item.name}}
                    </td>
                </tr>
            </tbody>
        </table>
</template>
<script>
    import Vue from 'vue';
    export default {
        name: 'treegrid',
        props: ['items'],
        data(){
            return {
            }
        },
        ready() {
            let initItems = [];
            if(this.items){
                this.initData(this.items,1,null);
                this.items = initItems;
                this.$emit('data-change', initItems);
            }
        },
        computed:{
        },
        methods:{
            initData(items,level,parent){
              let spaceHtml = "";
              for(var i=1;i<level;i++){
                  spaceHtml+="";
              }
              [].forEach.call(items,function(item,index){
                  item = Object.assign({},item,{"parent":parent,"level":level,"spaceHtml":spaceHtml});
                  if((typeof item.expanded)=="undefined"){
                      item = Object.assign({},item,{"expanded":false});
                  }
                  if((typeof item.show) == "undefined"){
                      item = Object.assign({},item,{"isShow":false});
                  }
                  item = Object.assign({},item,{"load":(item.expanded?true:false)});
                  initItems.push(item);
                  if(item.children && item.expanded){
                      initData(item.children,level+1,item);
                  }
              });
          },
            show:function(item){
                return ((item.level==1) || (item.parent && item.parent.expanded && item.isShow));
            },
            toggle:function(index,item){
                let me = this;
                let level = item.level+1;
                let spaceHtml = "";
                for(var i=1;i<level;i++){
                    spaceHtml+="<i class='fa fa-files-o'></i>";
                }
                if(item.children){
                    if(item.expanded){
                        item.expanded = !item.expanded;
                        me.close(index,item);
                    }else {
                        item.expanded = !item.expanded;
                        if(item.load){
                            me.open(index,item);
                        }else {
                            item.load = true;
                            [].forEach.call(item.children,function(child,childIndex){
                                me.items.splice((index+childIndex+1),0,child);
                                Vue.set(me.items[index+childIndex+1],'parent',item);
                                //Vue.set(me.items[index+childIndex+1],'level',level);
                                Vue.set(me.items[index+childIndex+1],'spaceHtml',spaceHtml);
                                Vue.set(me.items[index+childIndex+1],'isShow',true);
                                Vue.set(me.items[index+childIndex+1],'expanded',false);
                            });
                        }
                    }
                }
            },
            test:function(){
                console.log(this.items);
            },
            open:function(index,item){
                let me = this;
                if(item.children){
                    open(index,item.children);
                }
                function open(index,items){
                    [].forEach.call(items,function(child,childIndex){
                        child.isShow = true;
                        if(child.children){
                            open(index+childIndex+1,child.children);
                        }
                    });
                }
            },
            close:function(index,item){
                let me = this;
                //debugger;
                if(item.children){
                    close(index,item.children);
                }
                function close(index,items){
                    [].forEach.call(items,function(child,childIndex){
                        child.isShow = false;
                        if(child.children){
                            close(index+childIndex+1,child.children);
                        }
                    });
                }
            }
        }
    }
</script>
