//新资源管理系统通用工具类模块
// darklordli,coolli2@163.com

import axios from 'axios';
import config from '../config/config';
import iView from 'iview';

let util = {

};

//axios全局配置
util.ajax = axios.create({
    baseURL: config.ajaxUrl,
    timeout: 30000
});

//全局来源配置
util.getSource = [
    "喜马拉雅",
    "口袋故事",
    "贝瓦儿歌",
    "手动添加",
    "荔枝",
    "安徽出版社",
    "qq音乐",
    "其他"
]

//接口地址全局配置
util.getUrl = function(url) {
    if (url.indexOf("?") !== -1) {
        url += `&appId=${config.appId}&access_token=${config.access_token}`;
    } else {
        url += `?appId=${config.appId}&access_token=${config.access_token}`;
    }
    return url;
};

//全局上架状态
util.getResouceStatus = (statusId) => {
    switch (statusId) {
        case -2:
            return ' <Tag type="border" color="red">已删除</Tag>'
            break;
        case -1:
            return ' <Tag type="border" color="yellow">不处理</Tag>'
            break;
        case 0:
            return ' <Tag type="border" color="red">已下架</Tag>'
            break;
        case 1:
            return ' <Tag type="border" color="green">未提交</Tag>'
            break;
        case 2:
            return ' <Tag type="border" color="green">编辑中</Tag>'
            break;
        case 3:
            return ' <Tag type="border" color="yellow">待审核</Tag>'
            break;
        case 4:
            return ' <Tag type="border" color="blue">待上架</Tag>'
            break;
        case 5:
            return ' <Tag type="border" color="blue">已上架</Tag>'
            break;
        default:
            return '未知'
    };
}

//全局时间戳格式化
util.dataformat = (millisecond) => {
    if (millisecond === 0) {
        return '无数据';
    }
    let thisdata = new Date(millisecond * 1000);
    return thisdata.Format("yyyy-MM-dd hh:mm:ss");
}

Date.prototype.Format = function(fmt) { //author: meizz
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
};


util.getUploadStatus = (statusId) => {
    switch (statusId) {
        case -1:
            return `<Tag type="border" color="blue">未上传</Tag>`;
        case 0:
            return `<Tag type="border" color="red">上传失败</Tag>`;
        case 1:
            return `<Tag type="border" color="green">上传成功</Tag>`;
    }
}


//时间长度格式化
util.formatSeconds = function(value) {
    var theTime = parseInt(value); // 秒
    var theTime1 = 0; // 分
    var theTime2 = 0; // 小时
    if (theTime > 60) {
        theTime1 = parseInt(theTime / 60);
        theTime = parseInt(theTime % 60);
        if (theTime1 > 60) {
            theTime2 = parseInt(theTime1 / 60);
            theTime1 = parseInt(theTime1 % 60);
        }
    }
    var result = "" + parseInt(theTime) + "秒";
    if (theTime1 > 0) {
        result = "" + parseInt(theTime1) + "分" + result;
    }
    if (theTime2 > 0) {
        result = "" + parseInt(theTime2) + "小时" + result;
    }
    return result;
};

//全局文件体积格式化
util.formatFileSize = function(fileSize) {
    if (fileSize < 1024) {
        return fileSize + 'B';
    } else if (fileSize < (1024 * 1024)) {
        var temp = fileSize / 1024;
        temp = temp.toFixed(2);
        return temp + 'KB';
    } else if (fileSize < (1024 * 1024 * 1024)) {
        var temp = fileSize / (1024 * 1024);
        temp = temp.toFixed(2);
        return temp + 'MB';
    } else {
        var temp = fileSize / (1024 * 1024 * 1024);
        temp = temp.toFixed(2);
        return temp + 'GB';
    }
};

//全局获得资源分类，返回分类的数组，供select组件调用
util.returntype = function() {
    util.gettype = () => {
        let json = {
            "appId": "",
            "id": 0,
            "type": 0,
            "depth": 2
        }
        util.ajax({
                method: 'POST',
                url: util.getUrl('/tag/list2'),
                data: json
            })
            .then((response) => {
                let res = response.data;
                if (res.result == 0) {
                    this.$Message.success(res.msg);

                } else {
                    this.$Message.warning(res.desc);
                }
            })
            .catch((error) => {
                console.log(error);
            });
    };
};



//展开树的每一个节点
util.expandtree = (tree) => {
    tree.map((value) => {
        value.expand = true;
        if (value.children) {
            value.children.map((childrenvalue) => {
                util.expandtree(childrenvalue)
            })
        }
    })
    return tree;
};

//取得树状结构中 type为1 的 所有节点，即取得所有的 标签组节点，并在原来的树中删掉标签组节点
util.gettaglist = (tree) => {
    let taglist = [];
    let treearr = [];
    if(!Array.isArray(tree)){
      treearr.push(tree);
    }
    else {
      treearr=tree;
    }
    util.gettaglistfuc(treearr,taglist);
    return taglist;
};


util.gettaglistfuc = (tree,taglist) => {
    tree.forEach((value,index,array) => {
        if (value.type == 1) {
            taglist.push(value);
          }
        util.gettaglistfuc(value.children,taglist);
    })
    return taglist;
};





// 便利树的每一个节点,return标签组节点
// util.gettaglist = (tree) => {
//     tree.filter((item) => {
//       if (item.children){
//           util.gettaglist(item.children);
//       }
//       return item.type == 1
//     })
// };




util.disableclassfuc = (tree,id)=>{
  // 先深拷贝一个
  let tmptree = util.deepCopy (tree,tmptree)
  util.disableclass(tmptree,id);
  return tmptree;
};

//某id之外的节点disable
util.disableclass = (tree,id) => {
    tree.forEach((value) => {
        delete value.disableCheckbox;
        if(value.id != id){
          value.disableCheckbox = true;
        }
        // 如果点击的是这个跟节点，则需要把这个根节点下面所有的子节点放开
        else {
            value.children.forEach((childrenvalue) =>{
              delete childrenvalue.disableCheckbox;
          })
          return false;
        }
        if (value.children) {
          util.disableclass(value.children,id)
        }
    })
};

util.disabletreefuc = (tree)=>{
  // 先深拷贝一个
  let tmptree = util.deepCopy (tree,tmptree)
  util.disabletree(tmptree);
  return tmptree;
};


//遍历树的每一个节点,添加disableCheckbox属性
util.disabletree = (tree) => {
    tree.forEach((value) => {
        value.disableCheckbox = true;
        if (value.children) {
            util.disabletree(value.children)
        }
    })
};


//匹配每一个节点，将资源所在的分类选中,用id
util.selectclass = (tree, id) => {
    console.log(id)
    tree.map((value) => {
      value.selected = value.id == id ? true : false;
      return value
    })
};

//递归树，将资源所在的分类取消selected
util.unselecttree = (tree) => {
    tree.forEach((value) => {
            delete value.selected;
            if(value.children){
              util.unselecttree(value.children)
            }
    })
};



//匹配每一个节点，将资源所在的分类取消checked
util.uncheckedtree = (tree) => {
    tree.forEach((value) => {
            delete value.checked;
            if(value.children){
              util.uncheckedtree(value.children)
            }
    })
};

//遍历树的每一个节点,返回 title 对应的 id数组
util.getidarray = (tree, arr) => {

    let idarr = arr.map((currentValue) => {
        tree.forEach((value) => {
            value.children.forEach((tagvalue) => {
                if (tagvalue.title = currentValue) {
                    return tagvalue.id
                }
            })
        })
    })
    console.log(idarr)
    return idarr
};

//对接口操作返回的统一处理
util.tip = (res) => {
    if (res.data.msg = "success") {
        iView.Notice.success({
            title: '操作成功'
        });
    } else {
        iView.Notice.error({
            title: '操作失败',
            desc: res.data.msg
        });
    }
};

//对象深拷贝
util.deepCopy = (p, c) => {　　　　
    var c = c || {};　　　　
    for (var i in p) {　　　　　　
        if (typeof p[i] === 'object') {　　　　　　　　
            c[i] = (p[i].constructor === Array) ? [] : {};　　　　　　　　
            util.deepCopy(p[i], c[i]);　　　　　　
        } else {　
            c[i] = p[i];
        }　　　　
    }　　　　
    return c;　　
};

// 拿cookie
util.getCookie = (c_name) => {
    if (document.cookie.length > 0) {
        let c_start = document.cookie.indexOf(c_name + "=")
        if (c_start != -1) {
            c_start = c_start + c_name.length + 1
            let c_end = document.cookie.indexOf(";", c_start)
            if (c_end == -1) c_end = document.cookie.length
            return decodeURI(document.cookie.substring(c_start, c_end))
        }
    }
    return "";
};

// 解析cookie
util.getCurrentEditor = () => {
    let user = [];
    let u = util.getCookie('CURRENT_USER');
    u = JSON.parse(u);
    u = JSON.parse(u);

    user.push(u.realname);
    user.push(u.loginName);

    return user;
};

util.albumTypeList = [{
        value: "normal",
        label: "普通"
    },
    {
        value: "list",
        label: "歌单集合"
    },
    {
        value: "series",
        label: "系列"
    },
    {
        value: "inter_story",
        label: "互动故事"
    },
    {
        value: "ai",
        label: "AI"
    },
    {
        value: "app",
        label: "APP"
    }
];


util.getAlbumType = (typeValue) => {
    let name = typeValue;
    for (let i = 0; i < util.albumTypeList.length; i++) {
        if (util.albumTypeList[i].value === typeValue) {
            name = util.albumTypeList[i].label;
            break;
        }
    }
    return name;
};

//数组去重
util.removeDuplicatedItem = (array)=>{
    var ret = [];
    for (var i = 0, j = ar.length; i < j; i++) {
             if (ret.indexOf(ar[i]) === -1) {
                 ret.push(ar[i]);
             }
         }
         return ret;
}

export default util;
