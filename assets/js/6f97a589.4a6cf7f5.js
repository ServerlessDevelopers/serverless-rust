"use strict";(self.webpackChunkinteractive_docs=self.webpackChunkinteractive_docs||[]).push([[4076],{6496:(o,e,t)=>{t.r(e),t.d(e,{CH:()=>D,assets:()=>a,chCodeConfig:()=>d,contentTitle:()=>l,default:()=>h,frontMatter:()=>c,metadata:()=>p,toc:()=>i});t(6540);var s=t(4848),n=t(8453),r=t(4754);const c={sidebar_position:4,title:"SNS Message Processor",description:"Lambda function for processing messages from an SNS topic",keywords:["rust","lambda","sns","messaging","publish subscribe channels"]},l=void 0,p={id:"patterns/messaging-patterns/sam-lambda-sns-topic-processor",title:"SNS Message Processor",description:"Lambda function for processing messages from an SNS topic",source:"@site/docs/patterns/messaging-patterns/sam-lambda-sns-topic-processor.md",sourceDirName:"patterns/messaging-patterns",slug:"/patterns/messaging-patterns/sam-lambda-sns-topic-processor",permalink:"/docs/patterns/messaging-patterns/sam-lambda-sns-topic-processor",draft:!1,unlisted:!1,tags:[],version:"current",sidebarPosition:4,frontMatter:{sidebar_position:4,title:"SNS Message Processor",description:"Lambda function for processing messages from an SNS topic",keywords:["rust","lambda","sns","messaging","publish subscribe channels"]},sidebar:"tutorialSidebar",previous:{title:"SQS Message Processor",permalink:"/docs/patterns/messaging-patterns/sam-lambda-sqs-message-processor"},next:{title:"Kinesis Message Processor",permalink:"/docs/patterns/messaging-patterns/sam-lambda-kinesis-message-processor"}},a={},i=[{value:"How It Works",id:"how-it-works",level:2},{value:"Project Structure",id:"project-structure",level:2},{value:"Lambda Code",id:"lambda-code",level:2},{value:"Shared Code &amp; Reusability",id:"shared-code--reusability",level:2},{value:"Deploy Your Own",id:"deploy-your-own",level:2}],D={annotations:r.hk,Code:r.Cy,Section:r.wn,SectionLink:r.W_,SectionCode:r.bx,Scrollycoding:r.Fk,CodeSlot:r.Wu},d={staticMediaQuery:"not screen, (max-width: 768px)",lineNumbers:void 0,showCopyButton:void 0,themeName:"dark-plus"};function y(o){const e=Object.assign({p:"p",em:"em",strong:"strong",h2:"h2",a:"a",code:"code"},(0,n.R)(),o.components);return D||u("CH",!1),D.Code||u("CH.Code",!0),D.CodeSlot||u("CH.CodeSlot",!0),D.Scrollycoding||u("CH.Scrollycoding",!0),D.Section||u("CH.Section",!0),D.SectionCode||u("CH.SectionCode",!0),D.SectionLink||u("CH.SectionLink",!0),(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)("style",{dangerouslySetInnerHTML:{__html:'[data-ch-theme="dark-plus"] {  --ch-t-colorScheme: dark;--ch-t-foreground: #D4D4D4;--ch-t-background: #1E1E1E;--ch-t-lighter-inlineBackground: #1e1e1ee6;--ch-t-editor-background: #1E1E1E;--ch-t-editor-foreground: #D4D4D4;--ch-t-editor-rangeHighlightBackground: #ffffff0b;--ch-t-editor-infoForeground: #3794FF;--ch-t-editor-selectionBackground: #264F78;--ch-t-focusBorder: #007FD4;--ch-t-tab-activeBackground: #1E1E1E;--ch-t-tab-activeForeground: #ffffff;--ch-t-tab-inactiveBackground: #2D2D2D;--ch-t-tab-inactiveForeground: #ffffff80;--ch-t-tab-border: #252526;--ch-t-tab-activeBorder: #1E1E1E;--ch-t-editorGroup-border: #444444;--ch-t-editorGroupHeader-tabsBackground: #252526;--ch-t-editorLineNumber-foreground: #858585;--ch-t-input-background: #3C3C3C;--ch-t-input-foreground: #D4D4D4;--ch-t-icon-foreground: #C5C5C5;--ch-t-sideBar-background: #252526;--ch-t-sideBar-foreground: #D4D4D4;--ch-t-sideBar-border: #252526;--ch-t-list-activeSelectionBackground: #094771;--ch-t-list-activeSelectionForeground: #fffffe;--ch-t-list-hoverBackground: #2A2D2E; }'}}),"\n",(0,s.jsxs)(e.p,{children:["Publish/subscribe (pub/sub) is one of the two fundamental integration patterns in messaging (the other being point-to-point). In a pub/sub integration a producer ",(0,s.jsx)(e.em,{children:"publishes"})," a message onto a channel, and a subscriber receives that message. The channel in the middle could be an event bus, a topic or a stream. This pattern focuses on topic based publish subscribe."]}),"\n",(0,s.jsxs)(e.p,{children:["A topic is a message channel typically focused on a specific type of message. You may have ",(0,s.jsx)(e.strong,{children:"order-created"})," and ",(0,s.jsx)(e.strong,{children:"order-updated"})," channels. This differs from an event bus where you typically have a single bus with different types of events flowing through the same channel."]}),"\n",(0,s.jsx)(e.p,{children:"Amazon Simple Notification Service (SNS) is an example of how you can implement topic based publish/subscribe using AWS services. If you're looking to introduce pub/sub to your system, using SNS, Rust and AWS Lambda then this is the article for you."}),"\n",(0,s.jsx)(e.h2,{id:"how-it-works",children:"How It Works"}),"\n",(0,s.jsxs)(e.p,{children:["The SNS to Lambda integration is an example of an ",(0,s.jsx)(e.a,{href:"/docs/fundamentals/invocation-modes#asynchronous-invokes",children:"async invoke"}),". The SNS service calls the ",(0,s.jsx)(e.a,{href:"https://docs.aws.amazon.com/lambda/latest/api/API_InvokeAsync.html",children:"InvokeAsync"})," API on the Lambda service passing the message payload. Internally, the Lambda service queues up these messages and invokes your function."]}),"\n",(0,s.jsx)(e.p,{children:"It's important to remember that SNS itself is ephemeral and provides no durability guarantees."}),"\n",(0,s.jsx)(e.h2,{id:"project-structure",children:"Project Structure"}),"\n",(0,s.jsxs)(e.p,{children:["A SNS to Lambda template is found under the ",(0,s.jsx)(e.a,{href:"https://github.com/serverlessdevelopers/serverless-rust/tree/main/templates/patterns/messaging-patterns/sns-message-processor",children:"./templates"})," directory in the GitHub repo. You can use template to get started building with SNS and Lambda."]}),"\n",(0,s.jsx)(e.p,{children:"The project separates the SNS/Lambda handling code from your business logic. This allows you to share domain code between multiple Lambda functions that are contained within the same service."}),"\n",(0,s.jsx)(D.Code,{codeConfig:d,northPanel:{tabs:[""],active:"",heightRatio:1},files:[{name:"",focus:"",code:{lines:[{tokens:[{content:"lambdas",props:{style:{color:"#D4D4D4"}}}]},{tokens:[{content:"  - ",props:{style:{color:"#D4D4D4"}}},{content:"new-message-processor",props:{style:{color:"#CE9178"}}}]},{tokens:[{content:"  - ",props:{style:{color:"#D4D4D4"}}},{content:"shared",props:{style:{color:"#CE9178"}}}]}],lang:"bash"},annotations:[]}]}),"\n",(0,s.jsxs)(e.p,{children:["This tutorial will mostly focus on the code under ",(0,s.jsx)(e.code,{children:"lambdas/new-message-processor"}),". Although shared code will be referenced to discuss how you can take this template and 'plug-in' your own implementation."]}),"\n",(0,s.jsx)(e.h2,{id:"lambda-code",children:"Lambda Code"}),"\n",(0,s.jsxs)(D.Section,{codeConfig:d,northPanel:{tabs:[""],active:"",heightRatio:1},files:[{name:"",focus:"",code:{lines:[{tokens:[{content:"#[tokio::main]",props:{style:{color:"#D4D4D4"}}}]},{tokens:[{content:"async fn ",props:{style:{color:"#569CD6"}}},{content:"main",props:{style:{color:"#DCDCAA"}}},{content:"() -> ",props:{style:{color:"#D4D4D4"}}},{content:"Result",props:{style:{color:"#4EC9B0"}}},{content:"<(), ",props:{style:{color:"#D4D4D4"}}},{content:"Error",props:{style:{color:"#4EC9B0"}}},{content:"> {",props:{style:{color:"#D4D4D4"}}}]},{tokens:[{content:"    tracing_subscriber",props:{style:{color:"#4EC9B0"}}},{content:"::",props:{style:{color:"#D4D4D4"}}},{content:"fmt",props:{style:{color:"#DCDCAA"}}},{content:"()",props:{style:{color:"#D4D4D4"}}}]},{tokens:[{content:"        .",props:{style:{color:"#D4D4D4"}}},{content:"with_max_level",props:{style:{color:"#DCDCAA"}}},{content:"(",props:{style:{color:"#D4D4D4"}}},{content:"tracing",props:{style:{color:"#4EC9B0"}}},{content:"::",props:{style:{color:"#D4D4D4"}}},{content:"Level",props:{style:{color:"#4EC9B0"}}},{content:"::INFO)",props:{style:{color:"#D4D4D4"}}}]},{tokens:[{content:"        .",props:{style:{color:"#D4D4D4"}}},{content:"with_target",props:{style:{color:"#DCDCAA"}}},{content:"(",props:{style:{color:"#D4D4D4"}}},{content:"false",props:{style:{color:"#569CD6"}}},{content:")",props:{style:{color:"#D4D4D4"}}}]},{tokens:[{content:"        .",props:{style:{color:"#D4D4D4"}}},{content:"without_time",props:{style:{color:"#DCDCAA"}}},{content:"()",props:{style:{color:"#D4D4D4"}}}]},{tokens:[{content:"        .",props:{style:{color:"#D4D4D4"}}},{content:"init",props:{style:{color:"#DCDCAA"}}},{content:"();",props:{style:{color:"#D4D4D4"}}}]},{tokens:[{content:"",props:{style:{color:"#D4D4D4"}}}]},{tokens:[{content:"    run",props:{style:{color:"#DCDCAA"}}},{content:"(",props:{style:{color:"#D4D4D4"}}},{content:"service_fn",props:{style:{color:"#DCDCAA"}}},{content:"(",props:{style:{color:"#D4D4D4"}}},{content:"function_handler",props:{style:{color:"#9CDCFE"}}},{content:")).",props:{style:{color:"#D4D4D4"}}},{content:"await",props:{style:{color:"#C586C0"}}}]},{tokens:[{content:"}",props:{style:{color:"#D4D4D4"}}}]}],lang:"rust"},annotations:[]}],children:[(0,s.jsxs)(e.p,{children:["Whenever you are working with SNS and Lambda your ",(0,s.jsx)(D.SectionLink,{focus:"2[10:14]",id:"focus://2[10:14]",children:(0,s.jsx)(e.code,{children:"main"})})," function will look the same. This example doesn't focus on initializing AWS SDK's or reusable code. However, inside the main method is where you would normally initialize anything that is re-used between invokes."]}),(0,s.jsx)(D.SectionCode,{}),(0,s.jsxs)(e.p,{children:["One thing to note is the ",(0,s.jsx)(D.SectionLink,{focus:"1[3:13]",id:"focus://1[3:13]",children:(0,s.jsx)(e.code,{children:"tokio macro"})})," macro.  Macros in Rust are signals to the compiler to generate some code based upon the macros' definition. The tokio macro allows the ",(0,s.jsx)(D.SectionLink,{focus:"2[10:14]",id:"focus://2[10:14]",children:(0,s.jsx)(e.code,{children:"main"})})," function to run asynchronous, which is what the Lambda handler function requires."]}),(0,s.jsxs)(e.p,{children:["It's worth noting, that this ",(0,s.jsx)(D.SectionLink,{focus:"2[10:14]",id:"focus://2[10:14]",children:(0,s.jsx)(e.code,{children:"main"})})," function example would work for almost all Lambda Event Sources. The difference coming when moving on to the ",(0,s.jsx)(e.code,{children:"function_handler"})," itself."]})]}),"\n",(0,s.jsxs)(D.Scrollycoding,{codeConfig:d,editorSteps:[{northPanel:{tabs:[""],active:"",heightRatio:1},files:[{name:"",focus:"",code:{lines:[{tokens:[{content:"async fn ",props:{style:{color:"#569CD6"}}},{content:"function_handler",props:{style:{color:"#DCDCAA"}}},{content:"(",props:{style:{color:"#D4D4D4"}}},{content:"event",props:{style:{color:"#9CDCFE"}}},{content:": ",props:{style:{color:"#D4D4D4"}}},{content:"LambdaEvent",props:{style:{color:"#4EC9B0"}}},{content:"<",props:{style:{color:"#D4D4D4"}}},{content:"SnsEvent",props:{style:{color:"#4EC9B0"}}},{content:">) -> ",props:{style:{color:"#D4D4D4"}}},{content:"Result",props:{style:{color:"#4EC9B0"}}},{content:"<(), ",props:{style:{color:"#D4D4D4"}}},{content:"String",props:{style:{color:"#4EC9B0"}}},{content:"> {",props:{style:{color:"#D4D4D4"}}}]},{tokens:[{content:"    for ",props:{style:{color:"#C586C0"}}},{content:"message ",props:{style:{color:"#9CDCFE"}}},{content:"in",props:{style:{color:"#569CD6"}}},{content:" &",props:{style:{color:"#D4D4D4"}}},{content:"event",props:{style:{color:"#9CDCFE"}}},{content:".payload.records {",props:{style:{color:"#D4D4D4"}}}]},{tokens:[{content:"        let ",props:{style:{color:"#569CD6"}}},{content:"new_message",props:{style:{color:"#9CDCFE"}}},{content:": ",props:{style:{color:"#D4D4D4"}}},{content:"Result",props:{style:{color:"#4EC9B0"}}},{content:"<",props:{style:{color:"#D4D4D4"}}},{content:"OrderCreatedMessage",props:{style:{color:"#4EC9B0"}}},{content:", ",props:{style:{color:"#D4D4D4"}}},{content:"MessageParseError",props:{style:{color:"#4EC9B0"}}},{content:">",props:{style:{color:"#D4D4D4"}}}]},{tokens:[{content:"            = ",props:{style:{color:"#D4D4D4"}}},{content:"InternalSnsMessage",props:{style:{color:"#4EC9B0"}}},{content:"::",props:{style:{color:"#D4D4D4"}}},{content:"new",props:{style:{color:"#DCDCAA"}}},{content:"(",props:{style:{color:"#D4D4D4"}}},{content:"message",props:{style:{color:"#9CDCFE"}}},{content:".",props:{style:{color:"#D4D4D4"}}},{content:"clone",props:{style:{color:"#DCDCAA"}}},{content:"()).",props:{style:{color:"#D4D4D4"}}},{content:"try_into",props:{style:{color:"#DCDCAA"}}},{content:"();",props:{style:{color:"#D4D4D4"}}}]},{tokens:[{content:"",props:{style:{color:"#D4D4D4"}}}]},{tokens:[{content:"        if ",props:{style:{color:"#C586C0"}}},{content:"new_message",props:{style:{color:"#9CDCFE"}}},{content:".",props:{style:{color:"#D4D4D4"}}},{content:"is_err",props:{style:{color:"#DCDCAA"}}},{content:"(){",props:{style:{color:"#D4D4D4"}}}]},{tokens:[{content:"            return ",props:{style:{color:"#C586C0"}}},{content:"Err",props:{style:{color:"#4EC9B0"}}},{content:"(",props:{style:{color:"#D4D4D4"}}},{content:'"Failure deserializing message body"',props:{style:{color:"#CE9178"}}},{content:".",props:{style:{color:"#D4D4D4"}}},{content:"to_string",props:{style:{color:"#DCDCAA"}}},{content:"());",props:{style:{color:"#D4D4D4"}}}]},{tokens:[{content:"        }",props:{style:{color:"#D4D4D4"}}}]},{tokens:[{content:"",props:{style:{color:"#D4D4D4"}}}]},{tokens:[{content:"        let ",props:{style:{color:"#569CD6"}}},{content:"_",props:{style:{color:"#9CDCFE"}}},{content:" = ",props:{style:{color:"#D4D4D4"}}},{content:"OrderCreatedMessageHandler",props:{style:{color:"#4EC9B0"}}},{content:"::",props:{style:{color:"#D4D4D4"}}},{content:"handle",props:{style:{color:"#DCDCAA"}}},{content:"(&",props:{style:{color:"#D4D4D4"}}},{content:"new_message",props:{style:{color:"#9CDCFE"}}},{content:".",props:{style:{color:"#D4D4D4"}}},{content:"unwrap",props:{style:{color:"#DCDCAA"}}},{content:"()).",props:{style:{color:"#D4D4D4"}}},{content:"await",props:{style:{color:"#C586C0"}}},{content:"?;",props:{style:{color:"#D4D4D4"}}}]},{tokens:[{content:"    }",props:{style:{color:"#D4D4D4"}}}]},{tokens:[{content:"",props:{style:{color:"#D4D4D4"}}}]},{tokens:[{content:"    Ok",props:{style:{color:"#4EC9B0"}}},{content:"(())",props:{style:{color:"#D4D4D4"}}}]},{tokens:[{content:"}",props:{style:{color:"#D4D4D4"}}}]}],lang:"rust"},annotations:[]}]},{northPanel:{tabs:[""],active:"",heightRatio:1},files:[{name:"",focus:"",code:{lines:[{tokens:[{content:"async fn ",props:{style:{color:"#569CD6"}}},{content:"function_handler",props:{style:{color:"#DCDCAA"}}},{content:"(",props:{style:{color:"#D4D4D4"}}},{content:"event",props:{style:{color:"#9CDCFE"}}},{content:": ",props:{style:{color:"#D4D4D4"}}},{content:"LambdaEvent",props:{style:{color:"#4EC9B0"}}},{content:"<",props:{style:{color:"#D4D4D4"}}},{content:"SnsEvent",props:{style:{color:"#4EC9B0"}}},{content:">) -> ",props:{style:{color:"#D4D4D4"}}},{content:"Result",props:{style:{color:"#4EC9B0"}}},{content:"<(), ",props:{style:{color:"#D4D4D4"}}},{content:"String",props:{style:{color:"#4EC9B0"}}},{content:"> {",props:{style:{color:"#D4D4D4"}}}]},{tokens:[{content:"    for ",props:{style:{color:"#C586C0"}}},{content:"message ",props:{style:{color:"#9CDCFE"}}},{content:"in",props:{style:{color:"#569CD6"}}},{content:" &",props:{style:{color:"#D4D4D4"}}},{content:"event",props:{style:{color:"#9CDCFE"}}},{content:".payload.records {",props:{style:{color:"#D4D4D4"}}}]},{tokens:[{content:"        let ",props:{style:{color:"#569CD6"}}},{content:"new_message",props:{style:{color:"#9CDCFE"}}},{content:": ",props:{style:{color:"#D4D4D4"}}},{content:"Result",props:{style:{color:"#4EC9B0"}}},{content:"<",props:{style:{color:"#D4D4D4"}}},{content:"OrderCreatedMessage",props:{style:{color:"#4EC9B0"}}},{content:", ",props:{style:{color:"#D4D4D4"}}},{content:"MessageParseError",props:{style:{color:"#4EC9B0"}}},{content:">",props:{style:{color:"#D4D4D4"}}}]},{tokens:[{content:"            = ",props:{style:{color:"#D4D4D4"}}},{content:"InternalSnsMessage",props:{style:{color:"#4EC9B0"}}},{content:"::",props:{style:{color:"#D4D4D4"}}},{content:"new",props:{style:{color:"#DCDCAA"}}},{content:"(",props:{style:{color:"#D4D4D4"}}},{content:"message",props:{style:{color:"#9CDCFE"}}},{content:".",props:{style:{color:"#D4D4D4"}}},{content:"clone",props:{style:{color:"#DCDCAA"}}},{content:"()).",props:{style:{color:"#D4D4D4"}}},{content:"try_into",props:{style:{color:"#DCDCAA"}}},{content:"();",props:{style:{color:"#D4D4D4"}}}]},{tokens:[{content:"",props:{style:{color:"#D4D4D4"}}}]},{tokens:[{content:"        if ",props:{style:{color:"#C586C0"}}},{content:"new_message",props:{style:{color:"#9CDCFE"}}},{content:".",props:{style:{color:"#D4D4D4"}}},{content:"is_err",props:{style:{color:"#DCDCAA"}}},{content:"(){",props:{style:{color:"#D4D4D4"}}}]},{tokens:[{content:"            return ",props:{style:{color:"#C586C0"}}},{content:"Err",props:{style:{color:"#4EC9B0"}}},{content:"(",props:{style:{color:"#D4D4D4"}}},{content:'"Failure deserializing message body"',props:{style:{color:"#CE9178"}}},{content:".",props:{style:{color:"#D4D4D4"}}},{content:"to_string",props:{style:{color:"#DCDCAA"}}},{content:"());",props:{style:{color:"#D4D4D4"}}}]},{tokens:[{content:"        }",props:{style:{color:"#D4D4D4"}}}]},{tokens:[{content:"",props:{style:{color:"#D4D4D4"}}}]},{tokens:[{content:"        let ",props:{style:{color:"#569CD6"}}},{content:"_",props:{style:{color:"#9CDCFE"}}},{content:" = ",props:{style:{color:"#D4D4D4"}}},{content:"OrderCreatedMessageHandler",props:{style:{color:"#4EC9B0"}}},{content:"::",props:{style:{color:"#D4D4D4"}}},{content:"handle",props:{style:{color:"#DCDCAA"}}},{content:"(&",props:{style:{color:"#D4D4D4"}}},{content:"new_message",props:{style:{color:"#9CDCFE"}}},{content:".",props:{style:{color:"#D4D4D4"}}},{content:"unwrap",props:{style:{color:"#DCDCAA"}}},{content:"()).",props:{style:{color:"#D4D4D4"}}},{content:"await",props:{style:{color:"#C586C0"}}},{content:"?;",props:{style:{color:"#D4D4D4"}}}]},{tokens:[{content:"    }",props:{style:{color:"#D4D4D4"}}}]},{tokens:[{content:"",props:{style:{color:"#D4D4D4"}}}]},{tokens:[{content:"    Ok",props:{style:{color:"#4EC9B0"}}},{content:"(())",props:{style:{color:"#D4D4D4"}}}]},{tokens:[{content:"}",props:{style:{color:"#D4D4D4"}}}]}],lang:"rust"},annotations:[]}],southPanel:void 0}],children:[(0,s.jsxs)(s.Fragment,{children:[(0,s.jsxs)(e.p,{children:["The main bulk of an SNS sourced Lambda function is implemented in the ",(0,s.jsx)(D.SectionLink,{focus:"1[10:25]",id:"focus://1[10:25]",children:(0,s.jsx)(e.code,{children:"function_handler"})})," function. The first piece to note in this handler is that the event argument is typed to an ",(0,s.jsx)(D.SectionLink,{focus:"1[26:54]",id:"focus://1[26:54]",children:(0,s.jsx)(e.code,{children:"event"})}),". This event uses the ",(0,s.jsx)(e.a,{href:"https://docs.rs/aws_lambda_events/latest/aws_lambda_events/",children:"Lambda events Crate"})," which defines the struct definition for the record definition specified by AWS. As you are sourcing your function with SNS, this uses the ",(0,s.jsx)(e.code,{children:"SnsEvent"})," type."]}),(0,s.jsx)(D.CodeSlot,{})]}),(0,s.jsxs)(s.Fragment,{children:[(0,s.jsxs)(e.p,{children:["As you learned earlier, SNS invokes your Lambda function using the ",(0,s.jsx)(e.code,{children:"InvokeAsync"})," API call. This means SNS can continue doing other work and the Lambda service can invoke your function asynchronously. The ",(0,s.jsx)(e.code,{children:"SnsEvent"})," struct, contains a vector of ",(0,s.jsx)(e.code,{children:"SnsRecords"}),". However, this vector will only ever contain a single message. For re-usability, a custom ",(0,s.jsx)(D.SectionLink,{focus:"4",id:"focus://4",children:(0,s.jsx)(e.code,{children:"InternalSnsMessage"})})," struct is used as a wrapper around the ",(0,s.jsx)(e.code,{children:"SnsRecord"})," type that comes from the ",(0,s.jsx)(e.a,{href:"https://docs.rs/aws_lambda_events/latest/aws_lambda_events/",children:"Lambda events Crate"}),". This allows the ",(0,s.jsx)(D.SectionLink,{focus:"4",id:"focus://4",children:(0,s.jsx)(e.code,{children:"try_into()"})})," function to be used to handle the conversion from the custom SNS type into the ",(0,s.jsx)(e.code,{children:"OrderCreatedMessage"})," type used by the application."]}),(0,s.jsxs)(e.p,{children:["You'll notice that if a failure occurs either in the ",(0,s.jsx)(D.SectionLink,{focus:"4",id:"focus://4",children:"initial message parsing"})," or the actual ",(0,s.jsx)(D.SectionLink,{focus:"10",id:"focus://10",children:"handling of the message"})," an error is returned. This ensures an error is passed back up to the Lambda service and retries can happen."]}),(0,s.jsx)(D.CodeSlot,{})]})]}),"\n",(0,s.jsx)(e.h2,{id:"shared-code--reusability",children:"Shared Code & Reusability"}),"\n",(0,s.jsxs)(D.Section,{codeConfig:d,northPanel:{tabs:["lib.rs"],active:"lib.rs",heightRatio:1},files:[{name:"lib.rs",focus:"",code:{lines:[{tokens:[{content:"#[derive(",props:{style:{color:"#D4D4D4"}}},{content:"Debug",props:{style:{color:"#4EC9B0"}}},{content:")]",props:{style:{color:"#D4D4D4"}}}]},{tokens:[{content:"pub enum ",props:{style:{color:"#569CD6"}}},{content:"OrderCreatedMessageHandleError",props:{style:{color:"#4EC9B0"}}},{content:"{",props:{style:{color:"#D4D4D4"}}}]},{tokens:[{content:"    UnexpectedError",props:{style:{color:"#4EC9B0"}}}]},{tokens:[{content:"}",props:{style:{color:"#D4D4D4"}}}]},{tokens:[{content:"",props:{style:{color:"#D4D4D4"}}}]},{tokens:[{content:"#[derive(",props:{style:{color:"#D4D4D4"}}},{content:"Deserialize",props:{style:{color:"#4EC9B0"}}},{content:", ",props:{style:{color:"#D4D4D4"}}},{content:"Debug",props:{style:{color:"#4EC9B0"}}},{content:")]",props:{style:{color:"#D4D4D4"}}}]},{tokens:[{content:"#[serde(rename_all = ",props:{style:{color:"#D4D4D4"}}},{content:'"camelCase"',props:{style:{color:"#CE9178"}}},{content:")]",props:{style:{color:"#D4D4D4"}}}]},{tokens:[{content:"pub struct ",props:{style:{color:"#569CD6"}}},{content:"OrderCreatedMessage",props:{style:{color:"#4EC9B0"}}},{content:" {",props:{style:{color:"#D4D4D4"}}}]},{tokens:[{content:"    pub ",props:{style:{color:"#569CD6"}}},{content:"order_id",props:{style:{color:"#9CDCFE"}}},{content:": ",props:{style:{color:"#D4D4D4"}}},{content:"String",props:{style:{color:"#4EC9B0"}}}]},{tokens:[{content:"}",props:{style:{color:"#D4D4D4"}}}]},{tokens:[{content:"",props:{style:{color:"#D4D4D4"}}}]},{tokens:[{content:"pub struct ",props:{style:{color:"#569CD6"}}},{content:"OrderCreatedMessageHandler",props:{style:{color:"#4EC9B0"}}},{content:" {}",props:{style:{color:"#D4D4D4"}}}]},{tokens:[{content:"",props:{style:{color:"#D4D4D4"}}}]},{tokens:[{content:"impl ",props:{style:{color:"#569CD6"}}},{content:"OrderCreatedMessageHandler",props:{style:{color:"#4EC9B0"}}},{content:" {",props:{style:{color:"#D4D4D4"}}}]},{tokens:[{content:"    pub async fn ",props:{style:{color:"#569CD6"}}},{content:"handle",props:{style:{color:"#DCDCAA"}}},{content:"(",props:{style:{color:"#D4D4D4"}}},{content:"message",props:{style:{color:"#9CDCFE"}}},{content:": &",props:{style:{color:"#D4D4D4"}}},{content:"OrderCreatedMessage",props:{style:{color:"#4EC9B0"}}},{content:") -> ",props:{style:{color:"#D4D4D4"}}},{content:"Result",props:{style:{color:"#4EC9B0"}}},{content:"<(), ",props:{style:{color:"#D4D4D4"}}},{content:"OrderCreatedMessageHandleError",props:{style:{color:"#4EC9B0"}}},{content:"> {",props:{style:{color:"#D4D4D4"}}}]},{tokens:[{content:"        tracing",props:{style:{color:"#4EC9B0"}}},{content:"::",props:{style:{color:"#D4D4D4"}}},{content:"info!",props:{style:{color:"#DCDCAA"}}},{content:"(",props:{style:{color:"#D4D4D4"}}},{content:'"New message is for {}"',props:{style:{color:"#CE9178"}}},{content:", ",props:{style:{color:"#D4D4D4"}}},{content:"message",props:{style:{color:"#9CDCFE"}}},{content:".order_id);",props:{style:{color:"#D4D4D4"}}}]},{tokens:[{content:"",props:{style:{color:"#D4D4D4"}}}]},{tokens:[{content:"        if ",props:{style:{color:"#C586C0"}}},{content:"message",props:{style:{color:"#9CDCFE"}}},{content:".order_id == ",props:{style:{color:"#D4D4D4"}}},{content:'"error"',props:{style:{color:"#CE9178"}}},{content:" {",props:{style:{color:"#D4D4D4"}}}]},{tokens:[{content:"            return ",props:{style:{color:"#C586C0"}}},{content:"Err",props:{style:{color:"#4EC9B0"}}},{content:"(",props:{style:{color:"#D4D4D4"}}},{content:"OrderCreatedMessageHandleError",props:{style:{color:"#4EC9B0"}}},{content:"::",props:{style:{color:"#D4D4D4"}}},{content:"UnexpectedError",props:{style:{color:"#4EC9B0"}}},{content:");",props:{style:{color:"#D4D4D4"}}}]},{tokens:[{content:"        }",props:{style:{color:"#D4D4D4"}}}]},{tokens:[{content:"",props:{style:{color:"#D4D4D4"}}}]},{tokens:[{content:"        Ok",props:{style:{color:"#4EC9B0"}}},{content:"(())",props:{style:{color:"#D4D4D4"}}}]},{tokens:[{content:"    }",props:{style:{color:"#D4D4D4"}}}]},{tokens:[{content:"}",props:{style:{color:"#D4D4D4"}}}]}],lang:"rust"},annotations:[]}],children:[(0,s.jsxs)(e.p,{children:["The shared code in this example contains a custom ",(0,s.jsx)(D.SectionLink,{focus:"6:10",id:"focus://6:10",children:(0,s.jsx)(e.code,{children:"OrderCreatedMessage"})})," struct representing the actual message payload that was published. The shared code also contains a ",(0,s.jsx)(D.SectionLink,{focus:"12",id:"focus://12",children:(0,s.jsx)(e.code,{children:"OrderCreatedMessageHandler"})})," that contains a ",(0,s.jsxs)(D.SectionLink,{focus:"15:23",id:"focus://15:23",children:[(0,s.jsx)(e.code,{children:"handle"})," function"]}),", taking the ",(0,s.jsx)(e.code,{children:"OrderCreatedMessage"})," struct as a input parameter."]}),(0,s.jsxs)(e.p,{children:["If you want to use this template in your own applications, replace the ",(0,s.jsx)(D.SectionLink,{focus:"6:10",id:"focus://6:10",children:(0,s.jsx)(e.code,{children:"OrderCreatedMessage"})})," struct with your own custom struct and update the ",(0,s.jsxs)(D.SectionLink,{focus:"15:23",id:"focus://15:23",children:[(0,s.jsx)(e.code,{children:"handle"})," function"]})," with your custom business logic."]}),(0,s.jsx)(D.SectionCode,{})]}),"\n",(0,s.jsxs)(D.Section,{codeConfig:d,northPanel:{tabs:["lib.rs"],active:"lib.rs",heightRatio:1},files:[{name:"lib.rs",focus:"",code:{lines:[{tokens:[{content:"pub struct ",props:{style:{color:"#569CD6"}}},{content:"InternalSnsMessage",props:{style:{color:"#4EC9B0"}}},{content:"{",props:{style:{color:"#D4D4D4"}}}]},{tokens:[{content:"    message",props:{style:{color:"#9CDCFE"}}},{content:": ",props:{style:{color:"#D4D4D4"}}},{content:"SnsRecord",props:{style:{color:"#4EC9B0"}}}]},{tokens:[{content:"}",props:{style:{color:"#D4D4D4"}}}]},{tokens:[{content:"",props:{style:{color:"#D4D4D4"}}}]},{tokens:[{content:"impl ",props:{style:{color:"#569CD6"}}},{content:"InternalSnsMessage",props:{style:{color:"#4EC9B0"}}},{content:"{",props:{style:{color:"#D4D4D4"}}}]},{tokens:[{content:"    pub fn ",props:{style:{color:"#569CD6"}}},{content:"new",props:{style:{color:"#DCDCAA"}}},{content:"(",props:{style:{color:"#D4D4D4"}}},{content:"message",props:{style:{color:"#9CDCFE"}}},{content:": ",props:{style:{color:"#D4D4D4"}}},{content:"SnsRecord",props:{style:{color:"#4EC9B0"}}},{content:") -> ",props:{style:{color:"#D4D4D4"}}},{content:"Self",props:{style:{color:"#569CD6"}}},{content:" {",props:{style:{color:"#D4D4D4"}}}]},{tokens:[{content:"        Self",props:{style:{color:"#569CD6"}}},{content:" {",props:{style:{color:"#D4D4D4"}}}]},{tokens:[{content:"            message",props:{style:{color:"#9CDCFE"}}}]},{tokens:[{content:"        }",props:{style:{color:"#D4D4D4"}}}]},{tokens:[{content:"    }",props:{style:{color:"#D4D4D4"}}}]},{tokens:[{content:"}",props:{style:{color:"#D4D4D4"}}}]},{tokens:[{content:"",props:{style:{color:"#D4D4D4"}}}]},{tokens:[{content:"impl ",props:{style:{color:"#569CD6"}}},{content:"TryFrom",props:{style:{color:"#4EC9B0"}}},{content:"<",props:{style:{color:"#D4D4D4"}}},{content:"InternalSnsMessage",props:{style:{color:"#4EC9B0"}}},{content:"> ",props:{style:{color:"#D4D4D4"}}},{content:"for ",props:{style:{color:"#C586C0"}}},{content:"OrderCreatedMessage",props:{style:{color:"#4EC9B0"}}},{content:" {",props:{style:{color:"#D4D4D4"}}}]},{tokens:[{content:"    type ",props:{style:{color:"#569CD6"}}},{content:"Error",props:{style:{color:"#4EC9B0"}}},{content:" = ",props:{style:{color:"#D4D4D4"}}},{content:"MessageParseError",props:{style:{color:"#4EC9B0"}}},{content:";",props:{style:{color:"#D4D4D4"}}}]},{tokens:[{content:"",props:{style:{color:"#D4D4D4"}}}]},{tokens:[{content:"    fn ",props:{style:{color:"#569CD6"}}},{content:"try_from",props:{style:{color:"#DCDCAA"}}},{content:"(",props:{style:{color:"#D4D4D4"}}},{content:"value",props:{style:{color:"#9CDCFE"}}},{content:": ",props:{style:{color:"#D4D4D4"}}},{content:"InternalSnsMessage",props:{style:{color:"#4EC9B0"}}},{content:") -> ",props:{style:{color:"#D4D4D4"}}},{content:"Result",props:{style:{color:"#4EC9B0"}}},{content:"<",props:{style:{color:"#D4D4D4"}}},{content:"Self",props:{style:{color:"#569CD6"}}},{content:", ",props:{style:{color:"#D4D4D4"}}},{content:"Self",props:{style:{color:"#569CD6"}}},{content:"::",props:{style:{color:"#D4D4D4"}}},{content:"Error",props:{style:{color:"#4EC9B0"}}},{content:"> {",props:{style:{color:"#D4D4D4"}}}]},{tokens:[{content:"        let ",props:{style:{color:"#569CD6"}}},{content:"parsed_body",props:{style:{color:"#9CDCFE"}}},{content:": ",props:{style:{color:"#D4D4D4"}}},{content:"OrderCreatedMessage",props:{style:{color:"#4EC9B0"}}},{content:" = ",props:{style:{color:"#D4D4D4"}}},{content:"serde_json",props:{style:{color:"#4EC9B0"}}},{content:"::",props:{style:{color:"#D4D4D4"}}},{content:"from_str",props:{style:{color:"#DCDCAA"}}},{content:"(",props:{style:{color:"#D4D4D4"}}},{content:"value",props:{style:{color:"#9CDCFE"}}},{content:".message.sns.message.",props:{style:{color:"#D4D4D4"}}},{content:"as_str",props:{style:{color:"#DCDCAA"}}},{content:"())?;",props:{style:{color:"#D4D4D4"}}}]},{tokens:[{content:"",props:{style:{color:"#D4D4D4"}}}]},{tokens:[{content:"        Ok",props:{style:{color:"#4EC9B0"}}},{content:"(",props:{style:{color:"#D4D4D4"}}},{content:"parsed_body",props:{style:{color:"#9CDCFE"}}},{content:")",props:{style:{color:"#D4D4D4"}}}]},{tokens:[{content:"    }",props:{style:{color:"#D4D4D4"}}}]},{tokens:[{content:"}",props:{style:{color:"#D4D4D4"}}}]},{tokens:[{content:"",props:{style:{color:"#D4D4D4"}}}]}],lang:"rust"},annotations:[]}],children:[(0,s.jsxs)(e.p,{children:["The shared library also contains code to convert an ",(0,s.jsx)(e.code,{children:"SnsRecord"})," into the custom ",(0,s.jsx)(e.code,{children:"OrderCreatedMessage"})," struct. It does this using the ",(0,s.jsxs)(D.SectionLink,{focus:"13",id:"focus://13",children:[(0,s.jsx)(e.code,{children:"TryFrom"})," trait"]}),". Because the ",(0,s.jsx)(e.code,{children:"SnsRecord"})," struct is defined in an external crate, the ",(0,s.jsxs)(D.SectionLink,{focus:"1:3",id:"focus://1:3",children:[(0,s.jsx)(e.code,{children:"InternalSnsMessage"})," struct"]})," is used as a wrapper. Traits cannot be implemented for structs outside of the current crate."]}),(0,s.jsxs)(e.p,{children:["You'll notice the ",(0,s.jsx)(D.SectionLink,{focus:"16:15",id:"focus://16:15",children:(0,s.jsx)(e.code,{children:"try_from"})})," function returns a custom ",(0,s.jsx)(e.code,{children:"MessageParseError"})," type depending if the message body is empty or the message fails to deserialize correctly."]}),(0,s.jsx)(D.SectionCode,{})]}),"\n",(0,s.jsx)(e.p,{children:"Congratulations, you now know how to implement an SNS sourced Lambda function in Rust and do that in a way that separates your Lambda handling code from your business logic."}),"\n",(0,s.jsx)(e.h2,{id:"deploy-your-own",children:"Deploy Your Own"}),"\n",(0,s.jsx)(e.p,{children:"If you want to deploy this exact example, clone the GitHub repo and run the below commands:"}),"\n",(0,s.jsx)(D.Code,{codeConfig:d,northPanel:{tabs:["deploy.sh"],active:"deploy.sh",heightRatio:1},files:[{name:"deploy.sh",focus:"",code:{lines:[{tokens:[{content:"cd ",props:{style:{color:"#DCDCAA"}}},{content:"templates/patterns/messaging-patterns/sns-message-processor",props:{style:{color:"#CE9178"}}}]},{tokens:[{content:"sam ",props:{style:{color:"#D4D4D4"}}},{content:"build",props:{style:{color:"#CE9178"}}}]},{tokens:[{content:"sam ",props:{style:{color:"#D4D4D4"}}},{content:"deploy",props:{style:{color:"#CE9178"}}}]},{tokens:[{content:"",props:{style:{color:"#D4D4D4"}}}]}],lang:"bash"},annotations:[]}]}),"\n",(0,s.jsxs)(e.p,{children:["You can then invoke the function using the below CLI command, replacing the ",(0,s.jsx)(e.code,{children:"<TOPIC_ARN>"})," with the ARN that was output as part of the ",(0,s.jsx)(e.code,{children:"sam deploy"})," step. The ",(0,s.jsx)(e.code,{children:"sam logs"})," command will grab the latest logs."]}),"\n",(0,s.jsx)(D.Code,{codeConfig:d,northPanel:{tabs:["test.sh"],active:"test.sh",heightRatio:1},files:[{name:"test.sh",focus:"",code:{lines:[{tokens:[{content:"aws ",props:{style:{color:"#D4D4D4"}}},{content:'sns publish --message \'{"orderId":"1234"}\' --region eu-west-1 --profile dev --topic-arn',props:{style:{color:"#CE9178"}}},{content:" <",props:{style:{color:"#D4D4D4"}}},{content:"TOPIC_AR",props:{style:{color:"#CE9178"}}},{content:"N>",props:{style:{color:"#D4D4D4"}}}]},{tokens:[{content:"sam ",props:{style:{color:"#D4D4D4"}}},{content:"logs",props:{style:{color:"#CE9178"}}}]}],lang:"bash"},annotations:[]}]}),"\n",(0,s.jsxs)(e.p,{children:["If you run the below command, you can test failure scenarios. In this example, the Lambda function uses a ",(0,s.jsx)(e.a,{href:"https://aws.amazon.com/blogs/compute/introducing-aws-lambda-destinations/",children:"OnFailure Destination"})," to route failed invokes to an SQS queue."]}),"\n",(0,s.jsx)(D.Code,{codeConfig:d,northPanel:{tabs:["failure-test.sh"],active:"failure-test.sh",heightRatio:1},files:[{name:"failure-test.sh",focus:"",code:{lines:[{tokens:[{content:"aws ",props:{style:{color:"#D4D4D4"}}},{content:'sns publish --message \'{"orderId":"error"}\' --region eu-west-1 --profile dev --topic-arn',props:{style:{color:"#CE9178"}}},{content:" <",props:{style:{color:"#D4D4D4"}}},{content:"TOPIC_AR",props:{style:{color:"#CE9178"}}},{content:"N>",props:{style:{color:"#D4D4D4"}}}]},{tokens:[{content:"sam ",props:{style:{color:"#D4D4D4"}}},{content:"logs",props:{style:{color:"#CE9178"}}}]}],lang:"bash"},annotations:[]}]})]})}const h=function(o={}){const{wrapper:e}=Object.assign({},(0,n.R)(),o.components);return e?(0,s.jsx)(e,Object.assign({},o,{children:(0,s.jsx)(y,o)})):y(o)};function u(o,e){throw new Error("Expected "+(e?"component":"object")+" `"+o+"` to be defined: you likely forgot to import, pass, or provide it.")}}}]);