!function(n,e,t,o){function l(){this.id=null,this.filename=null,this.dirname=null,this.exports={},this.loaded=!1}function r(e){var i,a,c=u[e];return c!==t?c.exports:(i=n[e],u[e]=c=new l,a=c.exports,i.call(a,r,a,c,t,o),c.loaded=!0,c.exports)}var u=[],i={};l.prototype.require=r,r.resolve=function(n){return n},r.async=function(n,t){function o(){for(var e=-1,t=l.length-1;e++<t;)l[e](r(n));delete i[n]}var l,a,c=u[n];c?t(c.exports):(l=i[n])?l[l.length]=t:(a=document.createElement("script"),l=i[n]=[t],a.type="text/javascript",a.charset="utf-8",a.async=!0,!a.attachEvent||a.attachEvent.toString&&a.attachEvent.toString().indexOf("[native code")<0?a.addEventListener("load",o,!1):a.attachEvent("onreadystatechange",o),a.src=e[n],document.head.appendChild(a))},o["5y2m3iTF-Jxyf-4prK-8D9i-drAOCSTfcRTre"]=function(e){for(var t,o,l=-1,r=e.length-1;l++<r;)t=e[l],o=t[0],null===n[o]&&(n[o]=t[1])},"function"==typeof define&&define.amd?define([],function(){return r(0)}):"undefined"!=typeof module&&module.exports?module.exports=r(0):r(0)}([function(n,e,t,o,l){var r=n(1);n.async(2,function(n){n(r)&&console.log(r)}),n.async(4,function(n){var e={key:"value"};if(n(e,"key"))throw new Error("OTHER FILE STACK TRACE")}),setTimeout(function(){throw new Error("STACK TRACE")},1e3)},function(n,e,t,o,l){t.exports={key:"value"}},null,null,null,null,null,null,null,null,null,null,null],{2:"build2/.._.._node_modules_@nathanfaucett_is_object_src_index.js",4:"build2/.._.._node_modules_@nathanfaucett_has_src_index.js"},void 0,new Function("return this;")());
//# sourceMappingURL=../build2/index.js.map