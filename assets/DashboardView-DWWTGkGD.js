import{d as S,r as l,o as V,c as N,a as t,w as a,b as o,M as B,u as z,e as E,f as n,t as c,g as d,_ as I}from"./index-iMcpLNKZ.js";const L={class:"dashboard"},R={class:"card-value"},j={class:"card-value"},q={class:"card-value"},A=S({__name:"DashboardView",setup(F){z();const _=l(!1),p=l(0),v=l(0),f=l(0),g=l([]),b=s=>new Date(s).toLocaleString("zh-CN",{year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit"}),h=s=>({not_started:"未开始",on_sale:"售票中",sold_out:"已售罄",ended:"已结束"})[s]||s,T=s=>({not_started:"blue",on_sale:"green",sold_out:"red",ended:"gray"})[s]||"default",w=async()=>{try{_.value=!0,p.value=5,v.value=1e3,f.value=750,g.value=[{id:"1",name:"2024年新年音乐会",startTime:"2024-01-01T19:30:00",venue:"市音乐厅",status:"on_sale"},{id:"2",name:"春节戏曲晚会",startTime:"2024-02-10T19:00:00",venue:"大剧院",status:"not_started"}]}catch{B.error("获取数据失败")}finally{_.value=!1}};return V(()=>{w()}),(s,e)=>{const x=o("icon-calendar"),r=o("a-card"),m=o("a-col"),k=o("icon-ticket"),y=o("icon-check-circle"),D=o("a-row"),i=o("a-table-column"),M=o("a-tag"),C=o("a-table");return E(),N("div",L,[t(D,{gutter:16},{default:a(()=>[t(m,{span:8},{default:a(()=>[t(r,{class:"dashboard-card"},{title:a(()=>[t(x),e[0]||(e[0]=d(" 最近演出 "))]),default:a(()=>[n("div",R,c(p.value),1),e[1]||(e[1]=n("div",{class:"card-label"},"场演出",-1))]),_:1})]),_:1}),t(m,{span:8},{default:a(()=>[t(r,{class:"dashboard-card"},{title:a(()=>[t(k),e[2]||(e[2]=d(" 总票数 "))]),default:a(()=>[n("div",j,c(v.value),1),e[3]||(e[3]=n("div",{class:"card-label"},"张",-1))]),_:1})]),_:1}),t(m,{span:8},{default:a(()=>[t(r,{class:"dashboard-card"},{title:a(()=>[t(y),e[4]||(e[4]=d(" 已售票数 "))]),default:a(()=>[n("div",q,c(f.value),1),e[5]||(e[5]=n("div",{class:"card-label"},"张",-1))]),_:1})]),_:1})]),_:1}),t(r,{class:"recent-shows",title:"近期演出"},{default:a(()=>[t(C,{data:g.value,loading:_.value,pagination:!1},{columns:a(()=>[t(i,{title:"演出名称","data-index":"name"}),t(i,{title:"演出时间","data-index":"startTime"},{cell:a(({record:u})=>[d(c(b(u.startTime)),1)]),_:1}),t(i,{title:"演出地点","data-index":"venue"}),t(i,{title:"状态","data-index":"status"},{cell:a(({record:u})=>[t(M,{color:T(u.status)},{default:a(()=>[d(c(h(u.status)),1)]),_:2},1032,["color"])]),_:1})]),_:1},8,["data","loading"])]),_:1})])}}}),H=I(A,[["__scopeId","data-v-97f1ad93"]]);export{H as default};
