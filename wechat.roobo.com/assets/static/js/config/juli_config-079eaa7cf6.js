"use strict";var juli=window.juli||{},DEBUG="babateng";"dev"==DEBUG?(window.juli.host="http://172.17.232.67",window.juli.root="http://dwn.roo.bo/appimg/",window.juli.search="http://172.17.232.67",window.juli.search="http://172.17.232.67",window.juli.dir="/storybox"):"zhineng"==DEBUG?(window.juli.host="http://dev.storybox.roobo.com",window.juli.root="http://test-www.roobo.net",window.juli.search="http://dev.storybox.roobo.com",window.juli.appid="wxf45ec14451d07bfd",window.juli.MQTT="101.200.151.229",window.juli.MQTTPORT=8083,window.juli.dir="/storybox"):"zhiling"==DEBUG?(window.juli.host="http://wechat.roobo.com",window.juli.root="http://test-www.roobo.net",window.juli.search="http://wechat.roobo.com",window.juli.appid="wx9c5f793c4eee9683",window.juli.MQTT="storybox.mqtt.roobo.com",window.juli.MQTTPORT=8083,window.juli.dir="/storybox"):"babateng"==DEBUG&&(window.juli.host="http://wechat.roobo.com",window.juli.root="http://wechat.roobo.com/",window.juli.search="http://wechat.roobo.com",window.juli.appid="wxf4bbd1868bb126fc",window.juli.MQTT="storybox.mqtt.roobo.com",window.juli.MQTTPORT=8084,window.juli.dir="/bbtbox"),juli.URL={codeid:window.juli.host+window.juli.dir+"/roobo/getOpenId.do",getSign:window.juli.host+window.juli.dir+"/roobo/getSign.do",sinvoice:window.juli.host+window.juli.dir+"/sinvoice/set.do",cate:window.juli.host+"/resource/getCategroy",subcate:window.juli.host+"/resource/getSubCategroy",getsingle:window.juli.host+"/resource/findById",download:window.juli.host+window.juli.dir+"/track/download.do",downloadlist:window.juli.host+window.juli.dir+"/roobo/tracklist/addTrackBatch.do",reset:window.juli.host+"/resource/ResetTrackList",reset400:window.juli.host+window.juli.dir+"/roobo/tracklist/resetTrackList.do",search:window.juli.search+"/resource/EsSearch/",savesearch:window.juli.host+"/resource/insertSearchHistory",getsearch:window.juli.host+"/resource/getSearchHistory",clearsearch:window.juli.host+"/resource/clearSearchHistory",getlike:window.juli.host+window.juli.dir+"/favorite/getlist.do",addlike:window.juli.host+window.juli.dir+"/favorite/save.do",dellike:window.juli.host+window.juli.dir+"/favorite/delete.do",play:window.juli.host+window.juli.dir+"/roobo/save.do",gethistory:window.juli.host+window.juli.dir+"/demand/getlist.do",delhistory:window.juli.host+window.juli.dir+"/demand/delete.do",demand:window.juli.host+window.juli.dir+"/demand/online/save.do",getdevice:window.juli.host+window.juli.dir+"/familymember/getdeviceid.do",getmember:window.juli.host+window.juli.dir+"/familymember/getlist.do",join:window.juli.host+window.juli.dir+"/familymember/join.do",quit:window.juli.host+window.juli.dir+"/familymember/quit.do",editname:window.juli.host+window.juli.dir+"/familymember/modifynickname.do",getcode:window.juli.host+window.juli.dir+"/boxqrticket/get.do",setvolume:window.juli.host+window.juli.dir+"/boxinfo/setvolume.do",getinfo:window.juli.host+window.juli.dir+"/boxinfo/get.do",getversion:window.juli.host+window.juli.dir+"/boxinfo/getversion.do",add:window.juli.host+window.juli.dir+"/track/add.do",getlist:window.juli.host+window.juli.dir+"/track/getpage.do",addlist:window.juli.host+window.juli.dir+"/tracklist/add.do",gettracklist:window.juli.host+window.juli.dir+"/tracklist/getlistsimple.do",remove:window.juli.host+window.juli.dir+"/track/remove.do",singleview:window.juli.host+window.juli.dir+"/track/getid.do",sync:window.juli.host+window.juli.dir+"/roobo/tracklist/syncTrackList.do",getplaytracklist:window.juli.host+window.juli.dir+"/tracklist/getlistview.do",getlistinfo:window.juli.host+window.juli.dir+"/tracklist/get.do",inital:window.juli.host+window.juli.dir+"/tracklist/inital.do"};