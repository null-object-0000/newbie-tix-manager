import{d as N,r as c,i as M,j as L,w as a,b as n,a as e,e as O,k as A,o as F,c as G,h as D,u as J,M as S,g as f,t as B,f as I,_ as K}from"./index-iMcpLNKZ.js";const P=N({__name:"SessionDialog",props:{visible:{type:Boolean,default:!1},mode:{default:"create"},sessionData:{default:()=>({})}},emits:["update:visible","submit"],setup($,{emit:g}){var y,v;const d=$,m=g,r=c(),s=c({...d.sessionData,timeRange:(y=d.sessionData)!=null&&y.startTime&&((v=d.sessionData)!=null&&v.endTime)?[new Date(d.sessionData.startTime),new Date(d.sessionData.endTime)]:[]}),b=(_,o,T)=>{o&&o[0]&&o[1]&&(s.value.startTime=o[0].toISOString(),s.value.endTime=o[1].toISOString())},C=M(()=>({create:"新增场次",edit:"编辑场次",view:"查看场次"})[d.mode]),x=M(()=>d.mode==="view"),R=()=>{m("update:visible",!1)},l=async()=>{if(!r.value)return!1;try{return await r.value.validate(),m("submit",s.value),m("update:visible",!1),!0}catch{return!1}};return(_,o)=>{const T=n("a-input"),p=n("a-form-item"),V=n("a-range-picker"),i=n("a-form"),t=n("a-modal");return O(),L(t,{visible:_.visible,title:C.value,onCancel:R,onOk:l},{default:a(()=>[e(i,{model:s.value,ref_key:"formRef",ref:r},{default:a(()=>[e(p,{field:"name",label:"场次名称",rules:[{required:!0,message:"请输入场次名称"}]},{default:a(()=>[e(T,{modelValue:s.value.name,"onUpdate:modelValue":o[0]||(o[0]=w=>s.value.name=w),placeholder:"请输入场次名称",readonly:x.value},null,8,["modelValue","readonly"])]),_:1}),e(p,{field:"timeRange",label:"时间段",rules:[{required:!0,message:"请选择时间段"}]},{default:a(()=>[e(V,{modelValue:s.value.timeRange,"onUpdate:modelValue":o[1]||(o[1]=w=>s.value.timeRange=w),"show-time":"",format:"YYYY-MM-DD HH:mm:ss",placeholder:["开始时间","结束时间"],readonly:x.value,onChange:b},null,8,["modelValue","readonly"])]),_:1})]),_:1},8,["model"])]),_:1},8,["visible","title"])}}}),Q={class:"show-detail"},W={style:{display:"flex","justify-content":"space-between","align-items":"center"}},X=N({__name:"index",setup($){const g=J(),m=A().params.id,r=c(!1),s=c("create"),b=c({}),C=()=>{s.value="create",b.value={},r.value=!0},x=i=>{s.value="edit",b.value={...i},r.value=!0},R=async i=>{try{s.value==="create"?S.success("创建场次成功"):S.success("更新场次成功"),r.value=!1,await T()}catch{S.error("操作失败")}},l=c({id:"1",name:"2024年春节音乐会",description:"一场充满节日气氛的音乐盛宴",startTime:"2024-02-10 19:30:00",endTime:"2024-02-10 21:30:00",venue:"国家大剧院音乐厅",priceRange:"180-580元",status:"upcoming",organizer:"国家大剧院",contact:"010-12345678"}),y=c([]),v=c(!1),_=M(()=>[{label:"演出时间",value:`${p(l.value.startTime)} - ${p(l.value.endTime)}`},{label:"演出地点",value:l.value.venue},{label:"票价范围",value:l.value.priceRange},{label:"演出状态",value:V(l.value.status)},{label:"主办方",value:l.value.organizer},{label:"联系方式",value:l.value.contact},{label:"演出介绍",value:l.value.description}]),o=async()=>{},T=async()=>{v.value=!0;try{y.value=[{id:"1",showId:m,name:"场次1",startTime:"2024-02-10 19:30:00",endTime:"2024-02-10 21:30:00",status:"not_started"}]}catch{S.error("获取场次列表失败")}finally{v.value=!1}},p=i=>new Date(i).toLocaleString("zh-CN"),V=i=>({upcoming:"即将开始",ongoing:"进行中",ended:"已结束"})[i];return F(()=>{o(),T()}),(i,t)=>{const w=n("icon-edit"),k=n("a-button"),Y=n("a-page-header"),U=n("a-descriptions"),z=n("a-card"),j=n("icon-plus"),h=n("a-table-column"),q=n("a-space"),E=n("a-table");return O(),G("div",Q,[e(Y,{title:l.value.name,onBack:t[1]||(t[1]=u=>D(g).back())},{extra:a(()=>[e(k,{onClick:t[0]||(t[0]=u=>D(g).push(`/shows/${D(m)}/edit`))},{icon:a(()=>[e(w)]),default:a(()=>[t[3]||(t[3]=f(" 编辑 "))]),_:1})]),_:1},8,["title"]),e(z,{class:"detail-card"},{default:a(()=>[e(U,{data:_.value,layout:"inline-horizontal",bordered:""},null,8,["data"])]),_:1}),e(z,{class:"sessions-card"},{title:a(()=>[I("div",W,[t[5]||(t[5]=I("span",null,"演出场次",-1)),e(k,{type:"primary",onClick:C},{icon:a(()=>[e(j)]),default:a(()=>[t[4]||(t[4]=f(" 新增场次 "))]),_:1})])]),default:a(()=>[e(E,{data:y.value,loading:v.value,pagination:!1},{columns:a(()=>[e(h,{title:"场次名称","data-index":"name"}),e(h,{title:"开始时间","data-index":"startTime"},{cell:a(({record:u})=>[f(B(p(u.startTime)),1)]),_:1}),e(h,{title:"结束时间","data-index":"endTime"},{cell:a(({record:u})=>[f(B(p(u.endTime)),1)]),_:1}),e(h,{title:"操作",fixed:"right",width:180},{cell:a(({record:u})=>[e(q,null,{default:a(()=>[e(k,{type:"text",size:"small",onClick:H=>x(u)},{default:a(()=>t[6]||(t[6]=[f("编辑")])),_:2},1032,["onClick"]),e(k,{type:"text",size:"small",onClick:H=>D(g).push(`/shows/${D(m)}/sessions/${u.id}`)},{default:a(()=>t[7]||(t[7]=[f("票档管理")])),_:2},1032,["onClick"])]),_:2},1024)]),_:1})]),_:1},8,["data","loading"])]),_:1}),e(P,{visible:r.value,"onUpdate:visible":t[2]||(t[2]=u=>r.value=u),mode:s.value,"session-data":b.value,onSubmit:R},null,8,["visible","mode","session-data"])])}}}),ee=K(X,[["__scopeId","data-v-a3d18d5f"]]);export{ee as default};
