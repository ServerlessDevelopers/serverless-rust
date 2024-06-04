"use strict";(self.webpackChunkinteractive_docs=self.webpackChunkinteractive_docs||[]).push([[5718],{8914:(o,t,e)=>{e.r(t),e.d(t,{CH:()=>a,assets:()=>D,chCodeConfig:()=>C,contentTitle:()=>l,default:()=>d,frontMatter:()=>c,metadata:()=>p,toc:()=>y});e(6540);var n=e(4848),s=e(8453),r=e(4754);const c={sidebar_position:2,title:"Structure of a Lambda function",description:"A walkthrough of the key components of a Lambda function.",keywords:["fundamentals"]},l="Lambda Function Structure",p={id:"fundamentals/structure-of-a-lambda",title:"Structure of a Lambda function",description:"A walkthrough of the key components of a Lambda function.",source:"@site/docs/fundamentals/structure-of-a-lambda.md",sourceDirName:"fundamentals",slug:"/fundamentals/structure-of-a-lambda",permalink:"/docs/fundamentals/structure-of-a-lambda",draft:!1,unlisted:!1,tags:[],version:"current",sidebarPosition:2,frontMatter:{sidebar_position:2,title:"Structure of a Lambda function",description:"A walkthrough of the key components of a Lambda function.",keywords:["fundamentals"]},sidebar:"tutorialSidebar",previous:{title:"How Lambda Works",permalink:"/docs/fundamentals/how-lambda-works"},next:{title:"Lambda Networking",permalink:"/docs/fundamentals/networking"}},D={},y=[{value:"(De)serialization",id:"deserialization",level:2},{value:"Initialization",id:"initialization",level:2},{value:"The Event Payload",id:"the-event-payload",level:2},{value:"The Lambda Context",id:"the-lambda-context",level:2}],a={annotations:r.hk,Scrollycoding:r.Fk,CodeSlot:r.Wu,InlineCode:r.R0},C={staticMediaQuery:"not screen, (max-width: 768px)",lineNumbers:void 0,showCopyButton:void 0,themeName:"dark-plus"};function i(o){const t=Object.assign({h1:"h1",p:"p",h2:"h2",code:"code",strong:"strong"},(0,s.R)(),o.components);return a||E("CH",!1),a.CodeSlot||E("CH.CodeSlot",!0),a.InlineCode||E("CH.InlineCode",!0),a.Scrollycoding||E("CH.Scrollycoding",!0),(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)("style",{dangerouslySetInnerHTML:{__html:'[data-ch-theme="dark-plus"] {  --ch-t-colorScheme: dark;--ch-t-foreground: #D4D4D4;--ch-t-background: #1E1E1E;--ch-t-lighter-inlineBackground: #1e1e1ee6;--ch-t-editor-background: #1E1E1E;--ch-t-editor-foreground: #D4D4D4;--ch-t-editor-rangeHighlightBackground: #ffffff0b;--ch-t-editor-infoForeground: #3794FF;--ch-t-editor-selectionBackground: #264F78;--ch-t-focusBorder: #007FD4;--ch-t-tab-activeBackground: #1E1E1E;--ch-t-tab-activeForeground: #ffffff;--ch-t-tab-inactiveBackground: #2D2D2D;--ch-t-tab-inactiveForeground: #ffffff80;--ch-t-tab-border: #252526;--ch-t-tab-activeBorder: #1E1E1E;--ch-t-editorGroup-border: #444444;--ch-t-editorGroupHeader-tabsBackground: #252526;--ch-t-editorLineNumber-foreground: #858585;--ch-t-input-background: #3C3C3C;--ch-t-input-foreground: #D4D4D4;--ch-t-icon-foreground: #C5C5C5;--ch-t-sideBar-background: #252526;--ch-t-sideBar-foreground: #D4D4D4;--ch-t-sideBar-border: #252526;--ch-t-list-activeSelectionBackground: #094771;--ch-t-list-activeSelectionForeground: #fffffe;--ch-t-list-hoverBackground: #2A2D2E; }'}}),"\n",(0,n.jsx)(t.h1,{id:"lambda-function-structure",children:"Lambda Function Structure"}),"\n",(0,n.jsx)(t.p,{children:"Let's discuss the structure of a Lambda function built using Rust. We will dive deeper into these topics in later sections."}),"\n",(0,n.jsxs)(a.Scrollycoding,{codeConfig:C,editorSteps:[{northPanel:{tabs:["main.rs"],active:"main.rs",heightRatio:1},files:[{name:"main.rs",focus:"22",code:{lines:[{tokens:[{content:"use ",props:{style:{color:"#569CD6"}}},{content:"lambda_runtime",props:{style:{color:"#4EC9B0"}}},{content:"::{service_fn, tracing, ",props:{style:{color:"#D4D4D4"}}},{content:"Error",props:{style:{color:"#4EC9B0"}}},{content:", ",props:{style:{color:"#D4D4D4"}}},{content:"LambdaEvent",props:{style:{color:"#4EC9B0"}}},{content:"};",props:{style:{color:"#D4D4D4"}}}]},{tokens:[{content:"use ",props:{style:{color:"#569CD6"}}},{content:"serde",props:{style:{color:"#4EC9B0"}}},{content:"::{",props:{style:{color:"#D4D4D4"}}},{content:"Deserialize",props:{style:{color:"#4EC9B0"}}},{content:", ",props:{style:{color:"#D4D4D4"}}},{content:"Serialize",props:{style:{color:"#4EC9B0"}}},{content:"};",props:{style:{color:"#D4D4D4"}}}]},{tokens:[{content:"use ",props:{style:{color:"#569CD6"}}},{content:"aws_sdk_dynamodb",props:{style:{color:"#4EC9B0"}}},{content:"::{",props:{style:{color:"#D4D4D4"}}},{content:"types",props:{style:{color:"#4EC9B0"}}},{content:"::",props:{style:{color:"#D4D4D4"}}},{content:"AttributeValue",props:{style:{color:"#4EC9B0"}}},{content:", ",props:{style:{color:"#D4D4D4"}}},{content:"Client",props:{style:{color:"#4EC9B0"}}},{content:"};",props:{style:{color:"#D4D4D4"}}}]},{tokens:[{content:"",props:{style:{color:"#D4D4D4"}}}]},{tokens:[{content:"#[tokio::main]",props:{style:{color:"#D4D4D4"}}}]},{tokens:[{content:"async fn ",props:{style:{color:"#569CD6"}}},{content:"main",props:{style:{color:"#DCDCAA"}}},{content:"() -> ",props:{style:{color:"#D4D4D4"}}},{content:"Result",props:{style:{color:"#4EC9B0"}}},{content:"<(), ",props:{style:{color:"#D4D4D4"}}},{content:"Error",props:{style:{color:"#4EC9B0"}}},{content:"> {",props:{style:{color:"#D4D4D4"}}}]},{tokens:[{content:"    tracing",props:{style:{color:"#4EC9B0"}}},{content:"::",props:{style:{color:"#D4D4D4"}}},{content:"init_default_subscriber",props:{style:{color:"#DCDCAA"}}},{content:"();",props:{style:{color:"#D4D4D4"}}}]},{tokens:[{content:"",props:{style:{color:"#D4D4D4"}}}]},{tokens:[{content:"    let ",props:{style:{color:"#569CD6"}}},{content:"config",props:{style:{color:"#9CDCFE"}}},{content:" = ",props:{style:{color:"#D4D4D4"}}},{content:"aws_config",props:{style:{color:"#4EC9B0"}}},{content:"::",props:{style:{color:"#D4D4D4"}}},{content:"load_from_env",props:{style:{color:"#DCDCAA"}}},{content:"().",props:{style:{color:"#D4D4D4"}}},{content:"await",props:{style:{color:"#C586C0"}}},{content:";",props:{style:{color:"#D4D4D4"}}}]},{tokens:[{content:"    let ",props:{style:{color:"#569CD6"}}},{content:"table_name",props:{style:{color:"#9CDCFE"}}},{content:" = ",props:{style:{color:"#D4D4D4"}}},{content:"env",props:{style:{color:"#4EC9B0"}}},{content:"::",props:{style:{color:"#D4D4D4"}}},{content:"var",props:{style:{color:"#DCDCAA"}}},{content:"(",props:{style:{color:"#D4D4D4"}}},{content:'"TABLE_NAME"',props:{style:{color:"#CE9178"}}},{content:").",props:{style:{color:"#D4D4D4"}}},{content:"expect",props:{style:{color:"#DCDCAA"}}},{content:"(",props:{style:{color:"#D4D4D4"}}},{content:'"TABLE_NAME must be set"',props:{style:{color:"#CE9178"}}},{content:");",props:{style:{color:"#D4D4D4"}}}]},{tokens:[{content:"    let ",props:{style:{color:"#569CD6"}}},{content:"dynamodb_client",props:{style:{color:"#9CDCFE"}}},{content:" = ",props:{style:{color:"#D4D4D4"}}},{content:"Client",props:{style:{color:"#4EC9B0"}}},{content:"::",props:{style:{color:"#D4D4D4"}}},{content:"new",props:{style:{color:"#DCDCAA"}}},{content:"(&",props:{style:{color:"#D4D4D4"}}},{content:"config",props:{style:{color:"#9CDCFE"}}},{content:");",props:{style:{color:"#D4D4D4"}}}]},{tokens:[{content:"",props:{style:{color:"#D4D4D4"}}}]},{tokens:[{content:"    lambda_runtime",props:{style:{color:"#4EC9B0"}}},{content:"::",props:{style:{color:"#D4D4D4"}}},{content:"run",props:{style:{color:"#DCDCAA"}}},{content:"(",props:{style:{color:"#D4D4D4"}}},{content:"service_fn",props:{style:{color:"#DCDCAA"}}},{content:"(|",props:{style:{color:"#D4D4D4"}}},{content:"request",props:{style:{color:"#9CDCFE"}}},{content:": ",props:{style:{color:"#D4D4D4"}}},{content:"LambdaEvent",props:{style:{color:"#4EC9B0"}}},{content:"<",props:{style:{color:"#D4D4D4"}}},{content:"Request",props:{style:{color:"#4EC9B0"}}},{content:">| {",props:{style:{color:"#D4D4D4"}}}]},{tokens:[{content:"        let ",props:{style:{color:"#569CD6"}}},{content:"res",props:{style:{color:"#9CDCFE"}}},{content:" = ",props:{style:{color:"#D4D4D4"}}},{content:"function_handler",props:{style:{color:"#DCDCAA"}}},{content:"(",props:{style:{color:"#D4D4D4"}}},{content:"request",props:{style:{color:"#9CDCFE"}}},{content:", &",props:{style:{color:"#D4D4D4"}}},{content:"dynamodb_client",props:{style:{color:"#9CDCFE"}}},{content:").",props:{style:{color:"#D4D4D4"}}},{content:"await",props:{style:{color:"#C586C0"}}},{content:";",props:{style:{color:"#D4D4D4"}}}]},{tokens:[{content:"",props:{style:{color:"#D4D4D4"}}}]},{tokens:[{content:"        res",props:{style:{color:"#9CDCFE"}}}]},{tokens:[{content:"    }",props:{style:{color:"#D4D4D4"}}}]},{tokens:[{content:"",props:{style:{color:"#D4D4D4"}}}]},{tokens:[{content:"    Ok",props:{style:{color:"#4EC9B0"}}},{content:"(())",props:{style:{color:"#D4D4D4"}}}]},{tokens:[{content:"}",props:{style:{color:"#D4D4D4"}}}]},{tokens:[{content:"",props:{style:{color:"#D4D4D4"}}}]},{tokens:[{content:"pub",props:{style:{color:"#569CD6"}}},{content:"(",props:{style:{color:"#D4D4D4"}}},{content:"crate",props:{style:{color:"#569CD6"}}},{content:") ",props:{style:{color:"#D4D4D4"}}},{content:"async fn ",props:{style:{color:"#569CD6"}}},{content:"function_handler",props:{style:{color:"#DCDCAA"}}},{content:"(",props:{style:{color:"#D4D4D4"}}},{content:"event",props:{style:{color:"#9CDCFE"}}},{content:": ",props:{style:{color:"#D4D4D4"}}},{content:"LambdaEvent",props:{style:{color:"#4EC9B0"}}},{content:"<",props:{style:{color:"#D4D4D4"}}},{content:"Request",props:{style:{color:"#4EC9B0"}}},{content:">, ",props:{style:{color:"#D4D4D4"}}},{content:"client",props:{style:{color:"#9CDCFE"}}},{content:": &",props:{style:{color:"#D4D4D4"}}},{content:"Client",props:{style:{color:"#4EC9B0"}}},{content:") -> ",props:{style:{color:"#D4D4D4"}}},{content:"Result",props:{style:{color:"#4EC9B0"}}},{content:"<",props:{style:{color:"#D4D4D4"}}},{content:"Response",props:{style:{color:"#4EC9B0"}}},{content:", ",props:{style:{color:"#D4D4D4"}}},{content:"Error",props:{style:{color:"#4EC9B0"}}},{content:"> {",props:{style:{color:"#D4D4D4"}}}]},{tokens:[{content:"    let ",props:{style:{color:"#569CD6"}}},{content:"command",props:{style:{color:"#9CDCFE"}}},{content:" = ",props:{style:{color:"#D4D4D4"}}},{content:"event",props:{style:{color:"#9CDCFE"}}},{content:".payload.input_property;",props:{style:{color:"#D4D4D4"}}}]},{tokens:[{content:"",props:{style:{color:"#D4D4D4"}}}]},{tokens:[{content:"    let ",props:{style:{color:"#569CD6"}}},{content:"resp",props:{style:{color:"#9CDCFE"}}},{content:" = ",props:{style:{color:"#D4D4D4"}}},{content:"Response",props:{style:{color:"#4EC9B0"}}},{content:" {",props:{style:{color:"#D4D4D4"}}}]},{tokens:[{content:"        response_id",props:{style:{color:"#9CDCFE"}}},{content:": ",props:{style:{color:"#D4D4D4"}}},{content:"event",props:{style:{color:"#9CDCFE"}}},{content:".context.request_id,",props:{style:{color:"#D4D4D4"}}}]},{tokens:[{content:"    };",props:{style:{color:"#D4D4D4"}}}]},{tokens:[{content:"",props:{style:{color:"#D4D4D4"}}}]},{tokens:[{content:"    Ok",props:{style:{color:"#4EC9B0"}}},{content:"(",props:{style:{color:"#D4D4D4"}}},{content:"resp",props:{style:{color:"#9CDCFE"}}},{content:")",props:{style:{color:"#D4D4D4"}}}]},{tokens:[{content:"}",props:{style:{color:"#D4D4D4"}}}]}],lang:"rust"},annotations:[]}]},{northPanel:{tabs:["main.rs"],active:"main.rs",heightRatio:1},files:[{name:"main.rs",focus:"8:10",code:{lines:[{tokens:[{content:"use ",props:{style:{color:"#569CD6"}}},{content:"lambda_runtime",props:{style:{color:"#4EC9B0"}}},{content:"::{service_fn, tracing, ",props:{style:{color:"#D4D4D4"}}},{content:"Error",props:{style:{color:"#4EC9B0"}}},{content:", ",props:{style:{color:"#D4D4D4"}}},{content:"LambdaEvent",props:{style:{color:"#4EC9B0"}}},{content:"};",props:{style:{color:"#D4D4D4"}}}]},{tokens:[{content:"use ",props:{style:{color:"#569CD6"}}},{content:"serde",props:{style:{color:"#4EC9B0"}}},{content:"::{",props:{style:{color:"#D4D4D4"}}},{content:"Deserialize",props:{style:{color:"#4EC9B0"}}},{content:", ",props:{style:{color:"#D4D4D4"}}},{content:"Serialize",props:{style:{color:"#4EC9B0"}}},{content:"};",props:{style:{color:"#D4D4D4"}}}]},{tokens:[{content:"use ",props:{style:{color:"#569CD6"}}},{content:"aws_sdk_dynamodb",props:{style:{color:"#4EC9B0"}}},{content:"::{",props:{style:{color:"#D4D4D4"}}},{content:"types",props:{style:{color:"#4EC9B0"}}},{content:"::",props:{style:{color:"#D4D4D4"}}},{content:"AttributeValue",props:{style:{color:"#4EC9B0"}}},{content:", ",props:{style:{color:"#D4D4D4"}}},{content:"Client",props:{style:{color:"#4EC9B0"}}},{content:"};",props:{style:{color:"#D4D4D4"}}}]},{tokens:[{content:"",props:{style:{color:"#D4D4D4"}}}]},{tokens:[{content:"#[tokio::main]",props:{style:{color:"#D4D4D4"}}}]},{tokens:[{content:"async fn ",props:{style:{color:"#569CD6"}}},{content:"main",props:{style:{color:"#DCDCAA"}}},{content:"() -> ",props:{style:{color:"#D4D4D4"}}},{content:"Result",props:{style:{color:"#4EC9B0"}}},{content:"<(), ",props:{style:{color:"#D4D4D4"}}},{content:"Error",props:{style:{color:"#4EC9B0"}}},{content:"> {",props:{style:{color:"#D4D4D4"}}}]},{tokens:[{content:"    tracing",props:{style:{color:"#4EC9B0"}}},{content:"::",props:{style:{color:"#D4D4D4"}}},{content:"init_default_subscriber",props:{style:{color:"#DCDCAA"}}},{content:"();",props:{style:{color:"#D4D4D4"}}}]},{tokens:[{content:"",props:{style:{color:"#D4D4D4"}}}]},{tokens:[{content:"    let ",props:{style:{color:"#569CD6"}}},{content:"config",props:{style:{color:"#9CDCFE"}}},{content:" = ",props:{style:{color:"#D4D4D4"}}},{content:"aws_config",props:{style:{color:"#4EC9B0"}}},{content:"::",props:{style:{color:"#D4D4D4"}}},{content:"load_from_env",props:{style:{color:"#DCDCAA"}}},{content:"().",props:{style:{color:"#D4D4D4"}}},{content:"await",props:{style:{color:"#C586C0"}}},{content:";",props:{style:{color:"#D4D4D4"}}}]},{tokens:[{content:"    let ",props:{style:{color:"#569CD6"}}},{content:"table_name",props:{style:{color:"#9CDCFE"}}},{content:" = ",props:{style:{color:"#D4D4D4"}}},{content:"env",props:{style:{color:"#4EC9B0"}}},{content:"::",props:{style:{color:"#D4D4D4"}}},{content:"var",props:{style:{color:"#DCDCAA"}}},{content:"(",props:{style:{color:"#D4D4D4"}}},{content:'"TABLE_NAME"',props:{style:{color:"#CE9178"}}},{content:").",props:{style:{color:"#D4D4D4"}}},{content:"expect",props:{style:{color:"#DCDCAA"}}},{content:"(",props:{style:{color:"#D4D4D4"}}},{content:'"TABLE_NAME must be set"',props:{style:{color:"#CE9178"}}},{content:");",props:{style:{color:"#D4D4D4"}}}]},{tokens:[{content:"    let ",props:{style:{color:"#569CD6"}}},{content:"dynamodb_client",props:{style:{color:"#9CDCFE"}}},{content:" = ",props:{style:{color:"#D4D4D4"}}},{content:"Client",props:{style:{color:"#4EC9B0"}}},{content:"::",props:{style:{color:"#D4D4D4"}}},{content:"new",props:{style:{color:"#DCDCAA"}}},{content:"(&",props:{style:{color:"#D4D4D4"}}},{content:"config",props:{style:{color:"#9CDCFE"}}},{content:");",props:{style:{color:"#D4D4D4"}}}]},{tokens:[{content:"",props:{style:{color:"#D4D4D4"}}}]},{tokens:[{content:"    lambda_runtime",props:{style:{color:"#4EC9B0"}}},{content:"::",props:{style:{color:"#D4D4D4"}}},{content:"run",props:{style:{color:"#DCDCAA"}}},{content:"(",props:{style:{color:"#D4D4D4"}}},{content:"service_fn",props:{style:{color:"#DCDCAA"}}},{content:"(|",props:{style:{color:"#D4D4D4"}}},{content:"request",props:{style:{color:"#9CDCFE"}}},{content:": ",props:{style:{color:"#D4D4D4"}}},{content:"LambdaEvent",props:{style:{color:"#4EC9B0"}}},{content:"<",props:{style:{color:"#D4D4D4"}}},{content:"Request",props:{style:{color:"#4EC9B0"}}},{content:">| {",props:{style:{color:"#D4D4D4"}}}]},{tokens:[{content:"        let ",props:{style:{color:"#569CD6"}}},{content:"res",props:{style:{color:"#9CDCFE"}}},{content:" = ",props:{style:{color:"#D4D4D4"}}},{content:"function_handler",props:{style:{color:"#DCDCAA"}}},{content:"(",props:{style:{color:"#D4D4D4"}}},{content:"request",props:{style:{color:"#9CDCFE"}}},{content:", &",props:{style:{color:"#D4D4D4"}}},{content:"dynamodb_client",props:{style:{color:"#9CDCFE"}}},{content:").",props:{style:{color:"#D4D4D4"}}},{content:"await",props:{style:{color:"#C586C0"}}},{content:";",props:{style:{color:"#D4D4D4"}}}]},{tokens:[{content:"",props:{style:{color:"#D4D4D4"}}}]},{tokens:[{content:"        res",props:{style:{color:"#9CDCFE"}}}]},{tokens:[{content:"    }",props:{style:{color:"#D4D4D4"}}}]},{tokens:[{content:"",props:{style:{color:"#D4D4D4"}}}]},{tokens:[{content:"    Ok",props:{style:{color:"#4EC9B0"}}},{content:"(())",props:{style:{color:"#D4D4D4"}}}]},{tokens:[{content:"}",props:{style:{color:"#D4D4D4"}}}]},{tokens:[{content:"",props:{style:{color:"#D4D4D4"}}}]},{tokens:[{content:"pub",props:{style:{color:"#569CD6"}}},{content:"(",props:{style:{color:"#D4D4D4"}}},{content:"crate",props:{style:{color:"#569CD6"}}},{content:") ",props:{style:{color:"#D4D4D4"}}},{content:"async fn ",props:{style:{color:"#569CD6"}}},{content:"function_handler",props:{style:{color:"#DCDCAA"}}},{content:"(",props:{style:{color:"#D4D4D4"}}},{content:"event",props:{style:{color:"#9CDCFE"}}},{content:": ",props:{style:{color:"#D4D4D4"}}},{content:"LambdaEvent",props:{style:{color:"#4EC9B0"}}},{content:"<",props:{style:{color:"#D4D4D4"}}},{content:"Request",props:{style:{color:"#4EC9B0"}}},{content:">, ",props:{style:{color:"#D4D4D4"}}},{content:"client",props:{style:{color:"#9CDCFE"}}},{content:": &",props:{style:{color:"#D4D4D4"}}},{content:"Client",props:{style:{color:"#4EC9B0"}}},{content:") -> ",props:{style:{color:"#D4D4D4"}}},{content:"Result",props:{style:{color:"#4EC9B0"}}},{content:"<",props:{style:{color:"#D4D4D4"}}},{content:"Response",props:{style:{color:"#4EC9B0"}}},{content:", ",props:{style:{color:"#D4D4D4"}}},{content:"Error",props:{style:{color:"#4EC9B0"}}},{content:"> {",props:{style:{color:"#D4D4D4"}}}]},{tokens:[{content:"    let ",props:{style:{color:"#569CD6"}}},{content:"command",props:{style:{color:"#9CDCFE"}}},{content:" = ",props:{style:{color:"#D4D4D4"}}},{content:"event",props:{style:{color:"#9CDCFE"}}},{content:".payload.input_property;",props:{style:{color:"#D4D4D4"}}}]},{tokens:[{content:"",props:{style:{color:"#D4D4D4"}}}]},{tokens:[{content:"    let ",props:{style:{color:"#569CD6"}}},{content:"resp",props:{style:{color:"#9CDCFE"}}},{content:" = ",props:{style:{color:"#D4D4D4"}}},{content:"Response",props:{style:{color:"#4EC9B0"}}},{content:" {",props:{style:{color:"#D4D4D4"}}}]},{tokens:[{content:"        response_id",props:{style:{color:"#9CDCFE"}}},{content:": ",props:{style:{color:"#D4D4D4"}}},{content:"event",props:{style:{color:"#9CDCFE"}}},{content:".context.request_id,",props:{style:{color:"#D4D4D4"}}}]},{tokens:[{content:"    };",props:{style:{color:"#D4D4D4"}}}]},{tokens:[{content:"",props:{style:{color:"#D4D4D4"}}}]},{tokens:[{content:"    Ok",props:{style:{color:"#4EC9B0"}}},{content:"(",props:{style:{color:"#D4D4D4"}}},{content:"resp",props:{style:{color:"#9CDCFE"}}},{content:")",props:{style:{color:"#D4D4D4"}}}]},{tokens:[{content:"}",props:{style:{color:"#D4D4D4"}}}]}],lang:"rust"},annotations:[]}],southPanel:void 0},{northPanel:{tabs:["main.rs"],active:"main.rs",heightRatio:1},files:[{name:"main.rs",focus:"23",code:{lines:[{tokens:[{content:"use ",props:{style:{color:"#569CD6"}}},{content:"lambda_runtime",props:{style:{color:"#4EC9B0"}}},{content:"::{service_fn, tracing, ",props:{style:{color:"#D4D4D4"}}},{content:"Error",props:{style:{color:"#4EC9B0"}}},{content:", ",props:{style:{color:"#D4D4D4"}}},{content:"LambdaEvent",props:{style:{color:"#4EC9B0"}}},{content:"};",props:{style:{color:"#D4D4D4"}}}]},{tokens:[{content:"use ",props:{style:{color:"#569CD6"}}},{content:"serde",props:{style:{color:"#4EC9B0"}}},{content:"::{",props:{style:{color:"#D4D4D4"}}},{content:"Deserialize",props:{style:{color:"#4EC9B0"}}},{content:", ",props:{style:{color:"#D4D4D4"}}},{content:"Serialize",props:{style:{color:"#4EC9B0"}}},{content:"};",props:{style:{color:"#D4D4D4"}}}]},{tokens:[{content:"use ",props:{style:{color:"#569CD6"}}},{content:"aws_sdk_dynamodb",props:{style:{color:"#4EC9B0"}}},{content:"::{",props:{style:{color:"#D4D4D4"}}},{content:"types",props:{style:{color:"#4EC9B0"}}},{content:"::",props:{style:{color:"#D4D4D4"}}},{content:"AttributeValue",props:{style:{color:"#4EC9B0"}}},{content:", ",props:{style:{color:"#D4D4D4"}}},{content:"Client",props:{style:{color:"#4EC9B0"}}},{content:"};",props:{style:{color:"#D4D4D4"}}}]},{tokens:[{content:"",props:{style:{color:"#D4D4D4"}}}]},{tokens:[{content:"#[tokio::main]",props:{style:{color:"#D4D4D4"}}}]},{tokens:[{content:"async fn ",props:{style:{color:"#569CD6"}}},{content:"main",props:{style:{color:"#DCDCAA"}}},{content:"() -> ",props:{style:{color:"#D4D4D4"}}},{content:"Result",props:{style:{color:"#4EC9B0"}}},{content:"<(), ",props:{style:{color:"#D4D4D4"}}},{content:"Error",props:{style:{color:"#4EC9B0"}}},{content:"> {",props:{style:{color:"#D4D4D4"}}}]},{tokens:[{content:"    tracing",props:{style:{color:"#4EC9B0"}}},{content:"::",props:{style:{color:"#D4D4D4"}}},{content:"init_default_subscriber",props:{style:{color:"#DCDCAA"}}},{content:"();",props:{style:{color:"#D4D4D4"}}}]},{tokens:[{content:"",props:{style:{color:"#D4D4D4"}}}]},{tokens:[{content:"    let ",props:{style:{color:"#569CD6"}}},{content:"config",props:{style:{color:"#9CDCFE"}}},{content:" = ",props:{style:{color:"#D4D4D4"}}},{content:"aws_config",props:{style:{color:"#4EC9B0"}}},{content:"::",props:{style:{color:"#D4D4D4"}}},{content:"load_from_env",props:{style:{color:"#DCDCAA"}}},{content:"().",props:{style:{color:"#D4D4D4"}}},{content:"await",props:{style:{color:"#C586C0"}}},{content:";",props:{style:{color:"#D4D4D4"}}}]},{tokens:[{content:"    let ",props:{style:{color:"#569CD6"}}},{content:"table_name",props:{style:{color:"#9CDCFE"}}},{content:" = ",props:{style:{color:"#D4D4D4"}}},{content:"env",props:{style:{color:"#4EC9B0"}}},{content:"::",props:{style:{color:"#D4D4D4"}}},{content:"var",props:{style:{color:"#DCDCAA"}}},{content:"(",props:{style:{color:"#D4D4D4"}}},{content:'"TABLE_NAME"',props:{style:{color:"#CE9178"}}},{content:").",props:{style:{color:"#D4D4D4"}}},{content:"expect",props:{style:{color:"#DCDCAA"}}},{content:"(",props:{style:{color:"#D4D4D4"}}},{content:'"TABLE_NAME must be set"',props:{style:{color:"#CE9178"}}},{content:");",props:{style:{color:"#D4D4D4"}}}]},{tokens:[{content:"    let ",props:{style:{color:"#569CD6"}}},{content:"dynamodb_client",props:{style:{color:"#9CDCFE"}}},{content:" = ",props:{style:{color:"#D4D4D4"}}},{content:"Client",props:{style:{color:"#4EC9B0"}}},{content:"::",props:{style:{color:"#D4D4D4"}}},{content:"new",props:{style:{color:"#DCDCAA"}}},{content:"(&",props:{style:{color:"#D4D4D4"}}},{content:"config",props:{style:{color:"#9CDCFE"}}},{content:");",props:{style:{color:"#D4D4D4"}}}]},{tokens:[{content:"",props:{style:{color:"#D4D4D4"}}}]},{tokens:[{content:"    lambda_runtime",props:{style:{color:"#4EC9B0"}}},{content:"::",props:{style:{color:"#D4D4D4"}}},{content:"run",props:{style:{color:"#DCDCAA"}}},{content:"(",props:{style:{color:"#D4D4D4"}}},{content:"service_fn",props:{style:{color:"#DCDCAA"}}},{content:"(|",props:{style:{color:"#D4D4D4"}}},{content:"request",props:{style:{color:"#9CDCFE"}}},{content:": ",props:{style:{color:"#D4D4D4"}}},{content:"LambdaEvent",props:{style:{color:"#4EC9B0"}}},{content:"<",props:{style:{color:"#D4D4D4"}}},{content:"Request",props:{style:{color:"#4EC9B0"}}},{content:">| {",props:{style:{color:"#D4D4D4"}}}]},{tokens:[{content:"        let ",props:{style:{color:"#569CD6"}}},{content:"res",props:{style:{color:"#9CDCFE"}}},{content:" = ",props:{style:{color:"#D4D4D4"}}},{content:"function_handler",props:{style:{color:"#DCDCAA"}}},{content:"(",props:{style:{color:"#D4D4D4"}}},{content:"request",props:{style:{color:"#9CDCFE"}}},{content:", &",props:{style:{color:"#D4D4D4"}}},{content:"dynamodb_client",props:{style:{color:"#9CDCFE"}}},{content:").",props:{style:{color:"#D4D4D4"}}},{content:"await",props:{style:{color:"#C586C0"}}},{content:";",props:{style:{color:"#D4D4D4"}}}]},{tokens:[{content:"",props:{style:{color:"#D4D4D4"}}}]},{tokens:[{content:"        res",props:{style:{color:"#9CDCFE"}}}]},{tokens:[{content:"    }",props:{style:{color:"#D4D4D4"}}}]},{tokens:[{content:"",props:{style:{color:"#D4D4D4"}}}]},{tokens:[{content:"    Ok",props:{style:{color:"#4EC9B0"}}},{content:"(())",props:{style:{color:"#D4D4D4"}}}]},{tokens:[{content:"}",props:{style:{color:"#D4D4D4"}}}]},{tokens:[{content:"",props:{style:{color:"#D4D4D4"}}}]},{tokens:[{content:"pub",props:{style:{color:"#569CD6"}}},{content:"(",props:{style:{color:"#D4D4D4"}}},{content:"crate",props:{style:{color:"#569CD6"}}},{content:") ",props:{style:{color:"#D4D4D4"}}},{content:"async fn ",props:{style:{color:"#569CD6"}}},{content:"function_handler",props:{style:{color:"#DCDCAA"}}},{content:"(",props:{style:{color:"#D4D4D4"}}},{content:"event",props:{style:{color:"#9CDCFE"}}},{content:": ",props:{style:{color:"#D4D4D4"}}},{content:"LambdaEvent",props:{style:{color:"#4EC9B0"}}},{content:"<",props:{style:{color:"#D4D4D4"}}},{content:"Request",props:{style:{color:"#4EC9B0"}}},{content:">, ",props:{style:{color:"#D4D4D4"}}},{content:"client",props:{style:{color:"#9CDCFE"}}},{content:": &",props:{style:{color:"#D4D4D4"}}},{content:"Client",props:{style:{color:"#4EC9B0"}}},{content:") -> ",props:{style:{color:"#D4D4D4"}}},{content:"Result",props:{style:{color:"#4EC9B0"}}},{content:"<",props:{style:{color:"#D4D4D4"}}},{content:"Response",props:{style:{color:"#4EC9B0"}}},{content:", ",props:{style:{color:"#D4D4D4"}}},{content:"Error",props:{style:{color:"#4EC9B0"}}},{content:"> {",props:{style:{color:"#D4D4D4"}}}]},{tokens:[{content:"    let ",props:{style:{color:"#569CD6"}}},{content:"command",props:{style:{color:"#9CDCFE"}}},{content:" = ",props:{style:{color:"#D4D4D4"}}},{content:"event",props:{style:{color:"#9CDCFE"}}},{content:".payload.input_property;",props:{style:{color:"#D4D4D4"}}}]},{tokens:[{content:"",props:{style:{color:"#D4D4D4"}}}]},{tokens:[{content:"    let ",props:{style:{color:"#569CD6"}}},{content:"resp",props:{style:{color:"#9CDCFE"}}},{content:" = ",props:{style:{color:"#D4D4D4"}}},{content:"Response",props:{style:{color:"#4EC9B0"}}},{content:" {",props:{style:{color:"#D4D4D4"}}}]},{tokens:[{content:"        response_id",props:{style:{color:"#9CDCFE"}}},{content:": ",props:{style:{color:"#D4D4D4"}}},{content:"event",props:{style:{color:"#9CDCFE"}}},{content:".context.request_id,",props:{style:{color:"#D4D4D4"}}}]},{tokens:[{content:"    };",props:{style:{color:"#D4D4D4"}}}]},{tokens:[{content:"",props:{style:{color:"#D4D4D4"}}}]},{tokens:[{content:"    Ok",props:{style:{color:"#4EC9B0"}}},{content:"(",props:{style:{color:"#D4D4D4"}}},{content:"resp",props:{style:{color:"#9CDCFE"}}},{content:")",props:{style:{color:"#D4D4D4"}}}]},{tokens:[{content:"}",props:{style:{color:"#D4D4D4"}}}]}],lang:"rust"},annotations:[]}],southPanel:void 0},{northPanel:{tabs:["main.rs"],active:"main.rs",heightRatio:1},files:[{name:"main.rs",focus:"26",code:{lines:[{tokens:[{content:"use ",props:{style:{color:"#569CD6"}}},{content:"lambda_runtime",props:{style:{color:"#4EC9B0"}}},{content:"::{service_fn, tracing, ",props:{style:{color:"#D4D4D4"}}},{content:"Error",props:{style:{color:"#4EC9B0"}}},{content:", ",props:{style:{color:"#D4D4D4"}}},{content:"LambdaEvent",props:{style:{color:"#4EC9B0"}}},{content:"};",props:{style:{color:"#D4D4D4"}}}]},{tokens:[{content:"use ",props:{style:{color:"#569CD6"}}},{content:"serde",props:{style:{color:"#4EC9B0"}}},{content:"::{",props:{style:{color:"#D4D4D4"}}},{content:"Deserialize",props:{style:{color:"#4EC9B0"}}},{content:", ",props:{style:{color:"#D4D4D4"}}},{content:"Serialize",props:{style:{color:"#4EC9B0"}}},{content:"};",props:{style:{color:"#D4D4D4"}}}]},{tokens:[{content:"use ",props:{style:{color:"#569CD6"}}},{content:"aws_sdk_dynamodb",props:{style:{color:"#4EC9B0"}}},{content:"::{",props:{style:{color:"#D4D4D4"}}},{content:"types",props:{style:{color:"#4EC9B0"}}},{content:"::",props:{style:{color:"#D4D4D4"}}},{content:"AttributeValue",props:{style:{color:"#4EC9B0"}}},{content:", ",props:{style:{color:"#D4D4D4"}}},{content:"Client",props:{style:{color:"#4EC9B0"}}},{content:"};",props:{style:{color:"#D4D4D4"}}}]},{tokens:[{content:"",props:{style:{color:"#D4D4D4"}}}]},{tokens:[{content:"#[tokio::main]",props:{style:{color:"#D4D4D4"}}}]},{tokens:[{content:"async fn ",props:{style:{color:"#569CD6"}}},{content:"main",props:{style:{color:"#DCDCAA"}}},{content:"() -> ",props:{style:{color:"#D4D4D4"}}},{content:"Result",props:{style:{color:"#4EC9B0"}}},{content:"<(), ",props:{style:{color:"#D4D4D4"}}},{content:"Error",props:{style:{color:"#4EC9B0"}}},{content:"> {",props:{style:{color:"#D4D4D4"}}}]},{tokens:[{content:"    tracing",props:{style:{color:"#4EC9B0"}}},{content:"::",props:{style:{color:"#D4D4D4"}}},{content:"init_default_subscriber",props:{style:{color:"#DCDCAA"}}},{content:"();",props:{style:{color:"#D4D4D4"}}}]},{tokens:[{content:"",props:{style:{color:"#D4D4D4"}}}]},{tokens:[{content:"    let ",props:{style:{color:"#569CD6"}}},{content:"config",props:{style:{color:"#9CDCFE"}}},{content:" = ",props:{style:{color:"#D4D4D4"}}},{content:"aws_config",props:{style:{color:"#4EC9B0"}}},{content:"::",props:{style:{color:"#D4D4D4"}}},{content:"load_from_env",props:{style:{color:"#DCDCAA"}}},{content:"().",props:{style:{color:"#D4D4D4"}}},{content:"await",props:{style:{color:"#C586C0"}}},{content:";",props:{style:{color:"#D4D4D4"}}}]},{tokens:[{content:"    let ",props:{style:{color:"#569CD6"}}},{content:"table_name",props:{style:{color:"#9CDCFE"}}},{content:" = ",props:{style:{color:"#D4D4D4"}}},{content:"env",props:{style:{color:"#4EC9B0"}}},{content:"::",props:{style:{color:"#D4D4D4"}}},{content:"var",props:{style:{color:"#DCDCAA"}}},{content:"(",props:{style:{color:"#D4D4D4"}}},{content:'"TABLE_NAME"',props:{style:{color:"#CE9178"}}},{content:").",props:{style:{color:"#D4D4D4"}}},{content:"expect",props:{style:{color:"#DCDCAA"}}},{content:"(",props:{style:{color:"#D4D4D4"}}},{content:'"TABLE_NAME must be set"',props:{style:{color:"#CE9178"}}},{content:");",props:{style:{color:"#D4D4D4"}}}]},{tokens:[{content:"    let ",props:{style:{color:"#569CD6"}}},{content:"dynamodb_client",props:{style:{color:"#9CDCFE"}}},{content:" = ",props:{style:{color:"#D4D4D4"}}},{content:"Client",props:{style:{color:"#4EC9B0"}}},{content:"::",props:{style:{color:"#D4D4D4"}}},{content:"new",props:{style:{color:"#DCDCAA"}}},{content:"(&",props:{style:{color:"#D4D4D4"}}},{content:"config",props:{style:{color:"#9CDCFE"}}},{content:");",props:{style:{color:"#D4D4D4"}}}]},{tokens:[{content:"",props:{style:{color:"#D4D4D4"}}}]},{tokens:[{content:"    lambda_runtime",props:{style:{color:"#4EC9B0"}}},{content:"::",props:{style:{color:"#D4D4D4"}}},{content:"run",props:{style:{color:"#DCDCAA"}}},{content:"(",props:{style:{color:"#D4D4D4"}}},{content:"service_fn",props:{style:{color:"#DCDCAA"}}},{content:"(|",props:{style:{color:"#D4D4D4"}}},{content:"request",props:{style:{color:"#9CDCFE"}}},{content:": ",props:{style:{color:"#D4D4D4"}}},{content:"LambdaEvent",props:{style:{color:"#4EC9B0"}}},{content:"<",props:{style:{color:"#D4D4D4"}}},{content:"Request",props:{style:{color:"#4EC9B0"}}},{content:">| {",props:{style:{color:"#D4D4D4"}}}]},{tokens:[{content:"        let ",props:{style:{color:"#569CD6"}}},{content:"res",props:{style:{color:"#9CDCFE"}}},{content:" = ",props:{style:{color:"#D4D4D4"}}},{content:"function_handler",props:{style:{color:"#DCDCAA"}}},{content:"(",props:{style:{color:"#D4D4D4"}}},{content:"request",props:{style:{color:"#9CDCFE"}}},{content:", &",props:{style:{color:"#D4D4D4"}}},{content:"dynamodb_client",props:{style:{color:"#9CDCFE"}}},{content:").",props:{style:{color:"#D4D4D4"}}},{content:"await",props:{style:{color:"#C586C0"}}},{content:";",props:{style:{color:"#D4D4D4"}}}]},{tokens:[{content:"",props:{style:{color:"#D4D4D4"}}}]},{tokens:[{content:"        res",props:{style:{color:"#9CDCFE"}}}]},{tokens:[{content:"    }",props:{style:{color:"#D4D4D4"}}}]},{tokens:[{content:"",props:{style:{color:"#D4D4D4"}}}]},{tokens:[{content:"    Ok",props:{style:{color:"#4EC9B0"}}},{content:"(())",props:{style:{color:"#D4D4D4"}}}]},{tokens:[{content:"}",props:{style:{color:"#D4D4D4"}}}]},{tokens:[{content:"",props:{style:{color:"#D4D4D4"}}}]},{tokens:[{content:"pub",props:{style:{color:"#569CD6"}}},{content:"(",props:{style:{color:"#D4D4D4"}}},{content:"crate",props:{style:{color:"#569CD6"}}},{content:") ",props:{style:{color:"#D4D4D4"}}},{content:"async fn ",props:{style:{color:"#569CD6"}}},{content:"function_handler",props:{style:{color:"#DCDCAA"}}},{content:"(",props:{style:{color:"#D4D4D4"}}},{content:"event",props:{style:{color:"#9CDCFE"}}},{content:": ",props:{style:{color:"#D4D4D4"}}},{content:"LambdaEvent",props:{style:{color:"#4EC9B0"}}},{content:"<",props:{style:{color:"#D4D4D4"}}},{content:"Request",props:{style:{color:"#4EC9B0"}}},{content:">, ",props:{style:{color:"#D4D4D4"}}},{content:"client",props:{style:{color:"#9CDCFE"}}},{content:": &",props:{style:{color:"#D4D4D4"}}},{content:"Client",props:{style:{color:"#4EC9B0"}}},{content:") -> ",props:{style:{color:"#D4D4D4"}}},{content:"Result",props:{style:{color:"#4EC9B0"}}},{content:"<",props:{style:{color:"#D4D4D4"}}},{content:"Response",props:{style:{color:"#4EC9B0"}}},{content:", ",props:{style:{color:"#D4D4D4"}}},{content:"Error",props:{style:{color:"#4EC9B0"}}},{content:"> {",props:{style:{color:"#D4D4D4"}}}]},{tokens:[{content:"    let ",props:{style:{color:"#569CD6"}}},{content:"command",props:{style:{color:"#9CDCFE"}}},{content:" = ",props:{style:{color:"#D4D4D4"}}},{content:"event",props:{style:{color:"#9CDCFE"}}},{content:".payload.input_property;",props:{style:{color:"#D4D4D4"}}}]},{tokens:[{content:"",props:{style:{color:"#D4D4D4"}}}]},{tokens:[{content:"    let ",props:{style:{color:"#569CD6"}}},{content:"resp",props:{style:{color:"#9CDCFE"}}},{content:" = ",props:{style:{color:"#D4D4D4"}}},{content:"Response",props:{style:{color:"#4EC9B0"}}},{content:" {",props:{style:{color:"#D4D4D4"}}}]},{tokens:[{content:"        response_id",props:{style:{color:"#9CDCFE"}}},{content:": ",props:{style:{color:"#D4D4D4"}}},{content:"event",props:{style:{color:"#9CDCFE"}}},{content:".context.request_id,",props:{style:{color:"#D4D4D4"}}}]},{tokens:[{content:"    };",props:{style:{color:"#D4D4D4"}}}]},{tokens:[{content:"",props:{style:{color:"#D4D4D4"}}}]},{tokens:[{content:"    Ok",props:{style:{color:"#4EC9B0"}}},{content:"(",props:{style:{color:"#D4D4D4"}}},{content:"resp",props:{style:{color:"#9CDCFE"}}},{content:")",props:{style:{color:"#D4D4D4"}}}]},{tokens:[{content:"}",props:{style:{color:"#D4D4D4"}}}]}],lang:"rust"},annotations:[]}],southPanel:void 0}],children:[(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)(t.h2,{id:"deserialization",children:"(De)serialization"}),(0,n.jsx)(t.p,{children:"Event payloads are passed to Lambda functions as JSON strings. The Lambda runtime for Rust supports the ability to automatically (de)serialize the Lambda payloads and responses on your behalf."}),(0,n.jsx)(a.CodeSlot,{})]}),(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)(t.h2,{id:"initialization",children:"Initialization"}),(0,n.jsxs)(t.p,{children:["The ",(0,n.jsx)(a.InlineCode,{codeConfig:C,code:{lang:"rust",lines:[{tokens:[{content:"function_handler",props:{style:{color:"#DCDCAA"}}}]}]},children:"function_handler"})," method will be called on every invoke. It's a good practice in Lambda to initialize any objects that can be re-used outside of the handler. Things like database connections, configuration or loading of any static data."]}),(0,n.jsxs)(t.p,{children:["Performing this once outside of the handler ensures this code will only execute once per execution environment. In this example, we are initializing the DynamoDB SDK ",(0,n.jsx)(a.InlineCode,{codeConfig:C,code:{lang:"rust",lines:[{tokens:[{content:"Client",props:{style:{color:"#4EC9B0"}}}]}]},children:"Client"})," object in the main function."]}),(0,n.jsx)(a.CodeSlot,{})]}),(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)(t.h2,{id:"the-event-payload",children:"The Event Payload"}),(0,n.jsxs)(t.p,{children:["The ",(0,n.jsx)(t.code,{children:"LambdaEvent"})," struct used by your ",(0,n.jsx)(t.code,{children:"function_handler"})," is what the Lambda Rust runtime parses on your behalf. It is a combination of the Event payload passed to Lambda, and the Lambda context. The structure of this payload will change depending if you are using API Gateway, SQS or any of the other Lambda event sources."]}),(0,n.jsxs)(t.p,{children:["In this example, the Lambda function is being triggered by a custom invoke with a custom input object. In the ",(0,n.jsx)(t.code,{children:"function_handler"}),", you can access the actual input payload using the ",(0,n.jsx)(t.code,{children:"payload"})," property."]}),(0,n.jsx)(a.CodeSlot,{})]}),(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)(t.h2,{id:"the-lambda-context",children:"The Lambda Context"}),(0,n.jsxs)(t.p,{children:["The ",(0,n.jsx)(t.code,{children:"LambdaEvent"})," struct has a second property named ",(0,n.jsx)(t.code,{children:"context"}),". This property contains ",(0,n.jsx)(t.strong,{children:"contextual"})," information about this specific invoke of the function."]}),(0,n.jsx)(a.CodeSlot,{})]})]})]})}const d=function(o={}){const{wrapper:t}=Object.assign({},(0,s.R)(),o.components);return t?(0,n.jsx)(t,Object.assign({},o,{children:(0,n.jsx)(i,o)})):i(o)};function E(o,t){throw new Error("Expected "+(t?"component":"object")+" `"+o+"` to be defined: you likely forgot to import, pass, or provide it.")}}}]);