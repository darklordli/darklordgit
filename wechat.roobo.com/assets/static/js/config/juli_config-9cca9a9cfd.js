"use strict";var juli=window.juli||{},DEBUG=!1;DEBUG?(window.juli.host="http://172.17.132.97",window.juli.root="http://dwn.roo.bo/appimg/",window.juli.search="http://172.17.132.97"):(window.juli.host="http://wechat.roobo.com",window.juli.root="http://test-www.roobo.net",window.juli.search="http://wechat.roobo.com"),juli.URL={cate:window.juli.host+"/resource/getCategroy",subcate:window.juli.host+"/resource/getSubCategroy",getsingle:window.juli.host+"/resource/findById",download:window.juli.host+"/storybox/track/download.do",search:window.juli.search+"/resource/EsSearch/",savesearch:window.juli.host+"/resource/insertSearchHistory",getsearch:window.juli.host+"/resource/getSearchHistory",clearsearch:window.juli.host+"/resource/clearSearchHistory",getlike:window.juli.host+"/storybox/favorite/getlist.do",addlike:window.juli.host+"/storybox/favorite/save.do",dellike:window.juli.host+"/storybox/favorite/delete.do",play:window.juli.host+"/storybox/roobo/save.do",gethistory:window.juli.host+"/storybox/demand/getlist.do",delhistory:window.juli.host+"/storybox/demand/delete.do",getdevice:window.juli.host+"/storybox/familymember/getdeviceid.do",getmember:window.juli.host+"/storybox/familymember/getlist.do",join:window.juli.host+"/storybox/familymember/join.do",quit:window.juli.host+"/storybox/familymember/quit.do",editname:window.juli.host+"/storybox/familymember/modifynickname.do",getcode:window.juli.host+"/storybox/boxqrticket/get.do",setvolume:window.juli.host+"/storybox/boxinfo/setvolume.do",getinfo:window.juli.host+"/storybox/boxinfo/get.do",getversion:window.juli.host+"/storybox/boxinfo/getversion.do",add:window.juli.host+"/storybox/track/add.do",getlist:window.juli.host+"/storybox/track/getlist.do",addlist:window.juli.host+"/storybox/tracklist/add.do",gettracklist:window.juli.host+"/storybox/tracklist/getlistsimple.do",remove:window.juli.host+"/storybox/track/remove.do",singleview:window.juli.host+"/storybox/track/getid.do"};