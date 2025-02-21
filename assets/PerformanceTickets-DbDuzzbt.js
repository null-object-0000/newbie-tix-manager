import{d as j,r as f,q as Q,g as G,x as H,m as J,M as _,f as K,c as W,a,w as l,b as n,e as g,n as k,t as X,v as Y,o as Z,_ as ee}from"./index-IoAneAfo.js";import{g as te,j as ae,k as se,l as le,m as oe,n as ne}from"./api-rjBpfQPZ.js";import{a as ie}from"./constants-CeZz7UqS.js";const re={class:"performance-tickets"},ue={class:"info-content"},ce={class:"performance-info"},de={class:"performance-cover"},me=["src"],pe={class:"performance-details"},fe={class:"session-info"},_e=j({__name:"PerformanceTickets",setup(ve){const u=J(),D=K(),d=f(null),m=f(null),q=Q(()=>d.value?[{label:"演出标题",value:d.value.title},{label:"演出场馆",value:d.value.venue},{label:"演出状态",value:ie[d.value.status]}]:[]),M=Q(()=>!d.value||!m.value?[]:[{label:"场次标题",value:m.value.title||"无"},{label:"售卖时间",value:`${T(m.value.startSaleTime)} - ${T(m.value.endSaleTime)}`},{label:"演出时间",value:`${T(m.value.startShowTime)} - ${T(m.value.endShowTime)}`}]),h=f(!1),p=f([]),w=f(!1),x=f(),v=f(null),s=G({title:"",price:0,totalQuantity:0,status:"ON_SALE"}),R={title:[{required:!0,message:"请输入票档标题"}],price:[{required:!0,message:"请输入票档价格"}],totalQuantity:[{required:!0,message:"请输入总票数"}]};H(async()=>{const t=Number(u.params.performanceId),e=Number(u.params.sessionId);if(t&&e){const r=await te(t),i=await ae(t,e);r&&i?(d.value=r,m.value=i,await N()):(_.error("场次不存在"),D.push(`/performances/${t}/sessions`))}});const N=async()=>{const t=Number(u.params.performanceId),e=Number(u.params.sessionId);t&&e&&(h.value=!0,p.value=await se(t,e),h.value=!1)},$=()=>{v.value=null,s.title="",s.price=0,s.totalQuantity=0,s.status="ON_SALE",w.value=!0},A=t=>{v.value=t,s.title=t.title,s.price=t.price,s.totalQuantity=t.totalQuantity,s.status=t.status,w.value=!0},E=async t=>{if(x.value)try{const e=await x.value.validate();if(e)return console.error("表单验证失败:",e),t(!1);const r=Number(u.params.performanceId),i=Number(u.params.sessionId),I={performanceId:r,sessionId:i,title:s.title,price:s.price,totalQuantity:s.totalQuantity,status:s.status};if(v.value){const b=await oe(r,i,v.value.id,I);if(b){const y=p.value.findIndex(C=>{var c;return C.id===((c=v.value)==null?void 0:c.id)});return y!==-1&&(p.value[y]=b),_.success("更新成功"),N(),t(!0)}}else{const b=await ne(r,i,I);return p.value.push(b),_.success("创建成功"),N(),t(!0)}return _.error("操作失败"),t(!1)}catch(e){return console.error("表单验证失败:",e),_.error("请填写必填项"),t(!1)}},P=async t=>{Y.warning({title:"确认删除",content:"确定要删除该票档吗？",hideCancel:!1,onOk:async()=>{const e=Number(u.params.performanceId),r=Number(u.params.sessionId);await le(e,r,t.id)?(p.value=p.value.filter(i=>i.id!==t.id),_.success("删除成功")):_.error("删除失败")}})},U=()=>{w.value=!1},T=t=>new Intl.DateTimeFormat("zh-CN",{year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",second:"2-digit"}).format(new Date(t));return(t,e)=>{const r=n("a-typography-title"),i=n("a-descriptions"),I=n("a-card"),b=n("icon-plus"),y=n("a-button"),C=n("a-space"),c=n("a-table-column"),z=n("a-table"),F=n("a-input"),V=n("a-form-item"),S=n("a-input-number"),B=n("a-form"),O=n("a-modal");return Z(),W("div",re,[a(r,{heading:3,style:{"margin-top":"0px","margin-bottom":"24px"}},{default:l(()=>e[4]||(e[4]=[g("票档管理")])),_:1}),a(I,{class:"info-card",style:{"margin-bottom":"16px"}},{title:l(()=>e[5]||(e[5]=[g("基本信息")])),default:l(()=>{var o;return[k("div",ue,[k("div",ce,[k("div",de,[k("img",{src:(o=d.value)==null?void 0:o.coverUrl,alt:"演出封面"},null,8,me)]),k("div",pe,[a(i,{data:q.value,layout:"inline-horizontal",column:1},null,8,["data"])])]),k("div",fe,[a(i,{data:M.value,layout:"inline-horizontal",column:1},null,8,["data"])])])]}),_:1}),a(I,null,{title:l(()=>[a(C,null,{default:l(()=>[a(y,{type:"primary",onClick:$},{icon:l(()=>[a(b)]),default:l(()=>[e[6]||(e[6]=g(" 添加票档 "))]),_:1})]),_:1})]),default:l(()=>[a(z,{data:p.value,loading:h.value,pagination:!1,bordered:!1},{columns:l(()=>[a(c,{title:"票档ID","data-index":"id",width:85}),a(c,{title:"票档标题","data-index":"title",width:150}),a(c,{title:"票档价格",width:120},{cell:l(({record:o})=>[g(" ¥"+X(o.price),1)]),_:1}),a(c,{title:"总票数","data-index":"totalQuantity",width:150}),a(c,{title:"操作",width:150},{cell:l(({record:o})=>[a(y,{type:"text",size:"small",onClick:L=>A(o)},{default:l(()=>e[7]||(e[7]=[g(" 编辑 ")])),_:2},1032,["onClick"]),a(y,{type:"text",status:"danger",size:"small",onClick:L=>P(o)},{default:l(()=>e[8]||(e[8]=[g(" 删除 ")])),_:2},1032,["onClick"])]),_:1})]),_:1},8,["data","loading"])]),_:1}),a(O,{visible:w.value,"onUpdate:visible":e[3]||(e[3]=o=>w.value=o),title:v.value?"编辑票档":"新增票档","on-before-ok":E,onCancel:U},{default:l(()=>[a(B,{ref_key:"ticketFormRef",ref:x,model:s,rules:R,"auto-label-width":""},{default:l(()=>[a(V,{field:"title",label:"票档标题",rules:[{required:!0,message:"请输入票档标题"}]},{default:l(()=>[a(F,{modelValue:s.title,"onUpdate:modelValue":e[0]||(e[0]=o=>s.title=o),placeholder:"请输入票档标题","allow-clear":""},null,8,["modelValue"])]),_:1}),a(V,{field:"price",label:"票档价格",rules:[{required:!0,message:"请输入票档价格"}]},{default:l(()=>[a(S,{modelValue:s.price,"onUpdate:modelValue":e[1]||(e[1]=o=>s.price=o),min:0,precision:2,placeholder:"请输入票档价格"},null,8,["modelValue"])]),_:1}),a(V,{field:"totalQuantity",label:"总票数",rules:[{required:!0,message:"请输入总票数"}]},{default:l(()=>[a(S,{modelValue:s.totalQuantity,"onUpdate:modelValue":e[2]||(e[2]=o=>s.totalQuantity=o),min:1,precision:0,placeholder:"请输入总票数"},null,8,["modelValue"])]),_:1})]),_:1},8,["model"])]),_:1},8,["visible","title"])])}}}),ke=ee(_e,[["__scopeId","data-v-dd84af97"]]);export{ke as default};
