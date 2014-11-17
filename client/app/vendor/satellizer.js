// v0.8.3
!function(e,t){"use strict";function n(){return e.location.origin||e.location.protocol+"//"+e.location.host}t.module("satellizer",[]).constant("satellizer.config",{loginOnSignup:!0,loginRedirect:"/",logoutRedirect:"/",signupRedirect:"/login",loginUrl:"/auth/login",signupUrl:"/auth/signup",loginRoute:"/login",signupRoute:"/signup",tokenName:"token",tokenPrefix:"satellizer",unlinkUrl:"/auth/unlink/",authHeader:"Authorization",providers:{google:{url:"/auth/google",authorizationEndpoint:"https://accounts.google.com/o/oauth2/auth",redirectUri:n(),scope:["profile","email"],scopePrefix:"openid",scopeDelimiter:" ",requiredUrlParams:["scope"],optionalUrlParams:["display"],display:"popup",type:"2.0",popupOptions:{width:452,height:633}},facebook:{url:"/auth/facebook",authorizationEndpoint:"https://www.facebook.com/dialog/oauth",redirectUri:n()+"/",scope:["email"],scopeDelimiter:",",requiredUrlParams:["display","scope"],display:"popup",type:"2.0",popupOptions:{width:481,height:269}},linkedin:{url:"/auth/linkedin",authorizationEndpoint:"https://www.linkedin.com/uas/oauth2/authorization",redirectUri:n(),requiredUrlParams:["state"],scope:["r_emailaddress"],scopeDelimiter:" ",state:"STATE",type:"2.0",popupOptions:{width:527,height:582}},github:{url:"/auth/github",authorizationEndpoint:"https://github.com/login/oauth/authorize",redirectUri:n(),scope:[],scopeDelimiter:" ",type:"2.0",popupOptions:{width:1020,height:618}},yahoo:{url:"/auth/yahoo",authorizationEndpoint:"https://api.login.yahoo.com/oauth2/request_auth",redirectUri:n(),scope:[],scopeDelimiter:",",type:"2.0",popupOptions:{width:559,height:519}},twitter:{url:"/auth/twitter",type:"1.0",popupOptions:{width:495,height:645}}}}).provider("$auth",["satellizer.config",function(e){Object.defineProperties(this,{logoutRedirect:{get:function(){return e.logoutRedirect},set:function(t){e.logoutRedirect=t}},loginRedirect:{set:function(t){e.loginRedirect=t},get:function(){return e.loginRedirect}},signupRedirect:{get:function(){return e.signupRedirect},set:function(t){e.signupRedirect=t}},loginOnSignup:{get:function(){return e.loginOnSignup},set:function(t){e.loginOnSignup=t}},loginUrl:{get:function(){return e.loginUrl},set:function(t){e.loginUrl=t}},signupUrl:{get:function(){return e.signupUrl},set:function(t){e.signupUrl=t}},loginRoute:{get:function(){return e.loginRoute},set:function(t){e.loginRoute=t}},signupRoute:{get:function(){return e.signupRoute},set:function(t){e.signupRoute=t}},tokenName:{get:function(){return e.tokenName},set:function(t){e.tokenName=t}},tokenPrefix:{get:function(){return e.tokenPrefix},set:function(t){e.tokenPrefix=t}},unlinkUrl:{get:function(){return e.unlinkUrl},set:function(t){e.unlinkUrl=t}},authHeader:{get:function(){return e.authHeader},set:function(t){e.authHeader=t}}}),t.forEach(Object.keys(e.providers),function(n){this[n]=function(r){return t.extend(e.providers[n],r)}},this);var n=function(n){e.providers[n.name]=e.providers[n.name]||{},t.extend(e.providers[n.name],n)};this.oauth1=function(t){n(t),e.providers[t.name].type="1.0"},this.oauth2=function(t){n(t),e.providers[t.name].type="2.0"},this.$get=["$q","satellizer.shared","satellizer.local","satellizer.oauth",function(e,t,n,r){var o={};return o.authenticate=function(e,t){return r.authenticate(e,!1,t)},o.login=function(e){return n.login(e)},o.signup=function(e){return n.signup(e)},o.logout=function(){return t.logout()},o.isAuthenticated=function(){return t.isAuthenticated()},o.link=function(e,t){return r.authenticate(e,!0,t)},o.unlink=function(e){return r.unlink(e)},o.getToken=function(){return t.getToken()},o.getPayload=function(){return t.getPayload()},o}]}]).factory("satellizer.shared",["$q","$window","$location","satellizer.config",function(e,t,n,r){var o={};return o.getToken=function(){var e=r.tokenPrefix?r.tokenPrefix+"_"+r.tokenName:r.tokenName;return t.localStorage[e]},o.getPayload=function(){var e=r.tokenPrefix?r.tokenPrefix+"_"+r.tokenName:r.tokenName,n=t.localStorage[e];if(n&&3===n.split(".").length){var o=n.split(".")[1],i=o.replace("-","+").replace("_","/");return JSON.parse(t.atob(i))}},o.setToken=function(e,o,i){var u=e.data[r.tokenName],a=r.tokenPrefix?r.tokenPrefix+"_"+r.tokenName:r.tokenName;if(!u)throw new Error('Expecting a token named "'+r.tokenName+'" but instead got: '+JSON.stringify(e.data));t.localStorage[a]=u,r.loginRedirect&&!i&&n.path(r.loginRedirect),o.resolve(e)},o.isAuthenticated=function(){var e=r.tokenPrefix?r.tokenPrefix+"_"+r.tokenName:r.tokenName,n=t.localStorage[e];if(n){if(3===n.split(".").length){var o=n.split(".")[1],i=o.replace("-","+").replace("_","/"),u=JSON.parse(t.atob(i)).exp;return Math.round((new Date).getTime()/1e3)<=u}return!0}return!1},o.logout=function(){var o=e.defer(),i=r.tokenPrefix?r.tokenPrefix+"_"+r.tokenName:r.tokenName;return delete t.localStorage[i],r.logoutRedirect&&n.path(r.logoutRedirect),o.resolve(),o.promise},o}]).factory("satellizer.oauth",["$q","$http","satellizer.config","satellizer.shared","satellizer.Oauth1","satellizer.Oauth2",function(e,t,n,r,o,i){var u={};return u.authenticate=function(t,u,a){var l=e.defer(),c="1.0"===n.providers[t].type?new o:new i;return c.open(n.providers[t],a||{}).then(function(e){r.setToken(e,l,u)}).then(null,function(e){l.reject(e)}),l.promise},u.unlink=function(e){return t.get(n.unlinkUrl+e)},u}]).factory("satellizer.local",["$q","$http","$location","satellizer.utils","satellizer.shared","satellizer.config",function(e,t,n,r,o,i){var u={};return u.login=function(n){var r=e.defer();return t.post(i.loginUrl,n).then(function(e){o.setToken(e,r)}).then(null,function(e){r.reject(e)}),r.promise},u.signup=function(r){var u=e.defer();return t.post(i.signupUrl,r).then(function(e){i.loginOnSignup?o.setToken(e,u):(n.path(i.signupRedirect),u.resolve(e))}).then(null,function(e){u.reject(e)}),u.promise},u}]).factory("satellizer.Oauth2",["$q","$http","satellizer.popup","satellizer.utils","satellizer.config",function(e,n,r,o,i){return function(){var u={url:null,name:null,scope:null,scopeDelimiter:null,clientId:null,redirectUri:null,popupOptions:null,authorizationEndpoint:null,requiredUrlParams:null,optionalUrlParams:null,defaultUrlParams:["response_type","client_id","redirect_uri"],responseType:"code"},a={};return a.open=function(n,o){t.extend(u,n);var l=e.defer(),c=a.buildUrl();return r.open(c,u.popupOptions).then(function(e){if("token"===u.responseType){var t={data:{}};t.data[i.tokenName]=e.access_token,l.resolve(t)}else a.exchangeForToken(e,o).then(function(e){l.resolve(e)}).then(null,function(e){l.reject(e)})}).then(null,function(e){l.reject(e)}),l.promise},a.exchangeForToken=function(e,r){var o=t.extend({},r,{code:e.code,clientId:u.clientId,redirectUri:u.redirectUri});return n.post(u.url,o)},a.buildUrl=function(){var e=u.authorizationEndpoint,t=a.buildQueryString();return[e,t].join("?")},a.buildQueryString=function(){var e=[],n=["defaultUrlParams","requiredUrlParams","optionalUrlParams"];return t.forEach(n,function(n){t.forEach(u[n],function(t){var n=o.camelCase(t),r=u[n];"scope"===t&&Array.isArray(r)&&(r=r.join(u.scopeDelimiter),u.scopePrefix&&(r=[u.scopePrefix,r].join(u.scopeDelimiter))),e.push([t,r])})}),e.map(function(e){return e.join("=")}).join("&")},a}}]).factory("satellizer.Oauth1",["$q","$http","satellizer.popup",function(e,n,r){return function(){var o={url:null,name:null,popupOptions:null},i={};return i.open=function(n,u){t.extend(o,n);var a=e.defer();return r.open(o.url,o.popupOptions).then(function(e){i.exchangeForToken(e,u).then(function(e){a.resolve(e)}).then(null,function(e){a.reject(e)})}).then(null,function(e){a.reject(e)}),a.promise},i.exchangeForToken=function(e,r){var u=t.extend({},r,e),a=i.buildQueryString(u);return n.get(o.url+"?"+a)},i.buildQueryString=function(e){var n=[];return t.forEach(e,function(e,t){n.push(encodeURIComponent(t)+"="+encodeURIComponent(e))}),n.join("&")},i}}]).factory("satellizer.popup",["$q","$interval","$window","$location","satellizer.utils",function(n,r,o,i,u){var a=null,l=null,c={};return c.popupWindow=a,c.open=function(t,r){var o=n.defer(),i=c.stringifyOptions(c.prepareOptions(r||{}));return a=e.open(t,"_blank",i),a&&a.focus&&a.focus(),c.pollPopup(o),o.promise},c.pollPopup=function(e){l=r(function(){try{if(a.document.domain===document.domain&&(a.location.search||a.location.hash)){var n=a.location.search.substring(1).replace(/\/$/,""),o=a.location.hash.substring(1).replace(/\/$/,""),i=u.parseQueryString(o),c=u.parseQueryString(n);t.extend(c,i),c.error?e.reject({error:c.error}):e.resolve(c),a.close(),r.cancel(l)}}catch(s){}a.closed&&(r.cancel(l),e.reject({data:"Authorization Failed"}))},35)},c.prepareOptions=function(e){var n=e.width||500,r=e.height||500;return t.extend({width:n,height:r,left:o.screenX+(o.outerWidth-n)/2,top:o.screenY+(o.outerHeight-r)/2.5},e)},c.stringifyOptions=function(e){var n=[];return t.forEach(e,function(e,t){n.push(t+"="+e)}),n.join(",")},c}]).service("satellizer.utils",function(){this.camelCase=function(e){return e.replace(/([\:\-\_]+(.))/g,function(e,t,n,r){return r?n.toUpperCase():n})},this.parseQueryString=function(e){var n,r,o={};return t.forEach((e||"").split("&"),function(e){e&&(r=e.split("="),n=decodeURIComponent(r[0]),o[n]=t.isDefined(r[1])?decodeURIComponent(r[1]):!0)}),o}}).config(["$httpProvider","$authProvider","satellizer.config",function(e,t,n){e.interceptors.push(["$q",function(e){var t=n.tokenPrefix?n.tokenPrefix+"_"+n.tokenName:n.tokenName;return{request:function(e){var r=localStorage.getItem(t);return r&&(r="Authorization"===n.authHeader?"Bearer "+r:r,e.headers[n.authHeader]=r),e},responseError:function(n){return 401===n.status&&localStorage.removeItem(t),e.reject(n)}}}])}])}(window,window.angular),function(){function e(e){this.message=e}var t="undefined"!=typeof exports?exports:this,n="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";e.prototype=new Error,e.prototype.name="InvalidCharacterError",t.btoa||(t.btoa=function(t){for(var r,o,i=String(t),u=0,a=n,l="";i.charAt(0|u)||(a="=",u%1);l+=a.charAt(63&r>>8-u%1*8)){if(o=i.charCodeAt(u+=.75),o>255)throw new e("'btoa' failed: The string to be encoded contains characters outside of the Latin1 range.");r=r<<8|o}return l}),t.atob||(t.atob=function(t){var r=String(t).replace(/=+$/,"");if(r.length%4==1)throw new e("'atob' failed: The string to be decoded is not correctly encoded.");for(var o,i,u=0,a=0,l="";i=r.charAt(a++);~i&&(o=u%4?64*o+i:i,u++%4)?l+=String.fromCharCode(255&o>>(-2*u&6)):0)i=n.indexOf(i);return l})}();