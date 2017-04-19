
# Roobo前端项目目录

### 基于ai的新音频资源管理系统
*   目录：taggit
*   init data：2017/3.27
*   updata data/4.17
*   项目介绍：

月初接到了更新迭代公司级音频资源管理系统的需求，此管理系统为公司级音频资源管理后台，管理为布丁机器人，故事机，布丁豆豆登所有音频资源的入口。上一版本为在我推广下，java开发人员使用amazeui框架开发版本。此版在上一版技术上添加了歌单，专辑分类，与子分类，并可以在一个分类下为资源的各个标签组内添加标签登新功能。采用前后端分离方式重构一个版本。

值得一题的是，此音频资源管理系统与其说是基于ai的，不如说是为公司的ai语义引擎与产品服务的，在此资源管理系统中，资源运营人员可以为资源选择其归属的分类，并可以为资源添加其独有的标签，并可以在全局范围内管理分类与标签，并可以给资源添加直达词与规约词等，这样，AI语义系统就可以根据这些属性在人机对话中，正确分辨和提供用户想要的音频。

*   采用的技术要点：

因为最近一直在关注vue框架以及生态的发展，在3月初的时候 iview发布了其1.0的正式版本，简单了解之后发现其是用来快速搭建pc端中后台系统的绝好产品。

iView 是一套基于 Vue.js 的开源 UI 组件库，在3月初的时候发布了基于vue的1.0版本，3月下旬发布了基于vue2.0的版本，其UI 是以 Ant.Design 为雏形，视觉表现上美观，简洁，包含了40余个组件，能够满足绝大部分的使用需求。并为用户带来了 良好的使用体验。

![iview](https://file.iviewui.com/dist/fe8d29da1225d943e30f9ee1bddce78f.png)

简单调研后迅速搭建了项目框架，并安利给了同项目的其他研发工程师。 依然采用postman管理接口。
在一个月时间内完成研发并上线。

*  vue中的ref:
此项目，是由iView 组件库搭建而成的，而iview中的部分组件，有其自身的events（组件的事件），和methods(组件的方法)：

1.对于events，只需要在vue调用的模版中通过 @事件名=“自己定义的方法名” 来调用事件，如tree组件：

    <Tree
    :data="classifylist"
    @on-select-change="gettaglist"
    @on-check-change="getcheckclass"
    show-checkbox>
    </Tree>

on-select-change表示tree组件自己的获取已选择的节点的事件，这样在后面定义的gettaglist方法中，就会自动的获得当前已选中的节点数组作为参数调用。

vue中组件 使用v-on绑定自定义事件：
[https://cn.vuejs.org/v2/guide/components.html#使用-v-on-绑定自定义事件](https://cn.vuejs.org/v2/guide/components.html#使用-v-on-绑定自定义事件)

2.对于methods,则需要从js,也就是根组件中直接访问并获取子组件，在子组件上调用他的methods,
这样就需要用到vue的子组件索引属性:ref

>ref 被用来给元素或子组件注册引用信息。引用信息将会注册在父组件的 $refs 对象上。如果在普通的 DOM 元素上使用，引用指向的就是 DOM 元素; 如果用在子组件上，引用就指向组件实例:

    <!-- vm.$refs.p will be the DOM node -->
    <p *ref="p"*>hello</p>
    <!-- vm.$refs.child will be the child comp instance -->
    <child-comp *ref="child"*></child-comp>

>当 v-for 用于元素或组件的时候，引用信息将是包含 DOM 节点或组件实例的数组。

如此以来，通过ref不仅能够获得子组件，还能够获得dom元素，使得vue架构跟过往的 jquery 能够结合到一起。
通过ref来获取子组件及调用子组件方法：

    <Tree
    :data="classifylist"
    *v-ref:class*
    @on-select-change="gettaglist"
    @on-check-change="getcheckclass"
    show-checkbox>
    </Tree>

    let classes = this.$refs.class.getCheckedNodes();

getCheckedNodes方法为tree子组件方法，可以获取被勾选的节点

###update 4.5

项目已上线并迭代中，源码斗胆放github上




##iview：
[http://v1.iviewui.com/](http://v1.iviewui.com/)
