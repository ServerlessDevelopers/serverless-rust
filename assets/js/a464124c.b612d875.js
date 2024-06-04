"use strict";(self.webpackChunkinteractive_docs=self.webpackChunkinteractive_docs||[]).push([[9060],{4524:(o,e,t)=>{t.r(e),t.d(e,{CH:()=>D,assets:()=>p,chCodeConfig:()=>d,contentTitle:()=>c,default:()=>y,frontMatter:()=>l,metadata:()=>i,toc:()=>a});t(6540);var n=t(4848),s=t(8453),r=t(4754);const l={sidebar_position:1,title:"Alpine Image",description:"Building a Rust project to be deployed on an Alpine image",keywords:["rust","docker","container","containers","alpine"]},c=void 0,i={id:"patterns/container-patterns/docker-builds/alpine-simple-api",title:"Alpine Image",description:"Building a Rust project to be deployed on an Alpine image",source:"@site/docs/patterns/container-patterns/docker-builds/alpine-simple-api.md",sourceDirName:"patterns/container-patterns/docker-builds",slug:"/patterns/container-patterns/docker-builds/alpine-simple-api",permalink:"/docs/patterns/container-patterns/docker-builds/alpine-simple-api",draft:!1,unlisted:!1,tags:[],version:"current",sidebarPosition:1,frontMatter:{sidebar_position:1,title:"Alpine Image",description:"Building a Rust project to be deployed on an Alpine image",keywords:["rust","docker","container","containers","alpine"]},sidebar:"tutorialSidebar",previous:{title:"Docker Builds",permalink:"/docs/patterns/container-patterns/docker-builds/introduction"},next:{title:"Database",permalink:"/docs/category/database"}},p={},a=[{value:"Introduction",id:"introduction",level:2},{value:"Sample Solution",id:"sample-solution",level:2},{value:"Rust Code",id:"rust-code",level:3},{value:"Cargo.toml",id:"cargotoml",level:3},{value:"Dockerfile",id:"dockerfile",level:3},{value:"The Build",id:"the-build",level:4},{value:"Final Packaging",id:"final-packaging",level:4},{value:"Testing the Solution",id:"testing-the-solution",level:2},{value:"Comment on Size",id:"comment-on-size",level:2},{value:"Congratulations",id:"congratulations",level:2}],D={annotations:r.hk,Section:r.wn,SectionLink:r.W_,SectionCode:r.bx,Scrollycoding:r.Fk,CodeSlot:r.Wu,Code:r.Cy},d={staticMediaQuery:"not screen, (max-width: 768px)",lineNumbers:void 0,showCopyButton:void 0,themeName:"dark-plus"};function h(o){const e=Object.assign({h2:"h2",p:"p",a:"a",blockquote:"blockquote",h3:"h3",code:"code",ul:"ul",li:"li",ol:"ol",h4:"h4",img:"img"},(0,s.R)(),o.components);return D||u("CH",!1),D.Code||u("CH.Code",!0),D.CodeSlot||u("CH.CodeSlot",!0),D.Scrollycoding||u("CH.Scrollycoding",!0),D.Section||u("CH.Section",!0),D.SectionCode||u("CH.SectionCode",!0),D.SectionLink||u("CH.SectionLink",!0),(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)("style",{dangerouslySetInnerHTML:{__html:'[data-ch-theme="dark-plus"] {  --ch-t-colorScheme: dark;--ch-t-foreground: #D4D4D4;--ch-t-background: #1E1E1E;--ch-t-lighter-inlineBackground: #1e1e1ee6;--ch-t-editor-background: #1E1E1E;--ch-t-editor-foreground: #D4D4D4;--ch-t-editor-rangeHighlightBackground: #ffffff0b;--ch-t-editor-infoForeground: #3794FF;--ch-t-editor-selectionBackground: #264F78;--ch-t-focusBorder: #007FD4;--ch-t-tab-activeBackground: #1E1E1E;--ch-t-tab-activeForeground: #ffffff;--ch-t-tab-inactiveBackground: #2D2D2D;--ch-t-tab-inactiveForeground: #ffffff80;--ch-t-tab-border: #252526;--ch-t-tab-activeBorder: #1E1E1E;--ch-t-editorGroup-border: #444444;--ch-t-editorGroupHeader-tabsBackground: #252526;--ch-t-editorLineNumber-foreground: #858585;--ch-t-input-background: #3C3C3C;--ch-t-input-foreground: #D4D4D4;--ch-t-icon-foreground: #C5C5C5;--ch-t-sideBar-background: #252526;--ch-t-sideBar-foreground: #D4D4D4;--ch-t-sideBar-border: #252526;--ch-t-list-activeSelectionBackground: #094771;--ch-t-list-activeSelectionForeground: #fffffe;--ch-t-list-hoverBackground: #2A2D2E; }'}}),"\n",(0,n.jsx)(e.h2,{id:"introduction",children:"Introduction"}),"\n",(0,n.jsxs)(e.p,{children:["The Alpine page on ",(0,n.jsx)(e.a,{href:"https://hub.docker.com/_/alpine",children:"Dockerhub"})," describes itself like this:"]}),"\n",(0,n.jsxs)(e.blockquote,{children:["\n",(0,n.jsx)(e.p,{children:"Alpine Linux is a Linux distribution built around musl libc and BusyBox. The image is only 5 MB in size and has access to a package repository that is much more complete than other BusyBox based images. This makes Alpine Linux a great image base for utilities and even production applications. Read more about Alpine Linux here and you can see how their mantra fits in right at home with Docker images. -- Alpine"}),"\n"]}),"\n",(0,n.jsxs)(e.p,{children:["What that means for a developer is that you are running your code on top of a slim and secure Linux base image.  By using something this minimal, you can reduce your vunerability footprint and also reduce the time to launch in container orchestrators such as ",(0,n.jsx)(e.a,{href:"https://aws.amazon.com/ecs/",children:"Elastic Container Service"})," (ECS) and ",(0,n.jsx)(e.a,{href:"https://aws.amazon.com/apprunner/",children:"AppRunner"}),"."]}),"\n",(0,n.jsx)(e.h2,{id:"sample-solution",children:"Sample Solution"}),"\n",(0,n.jsxs)(e.p,{children:["A template for this pattern can be found under the ",(0,n.jsx)(e.a,{href:"https://github.com/serverlessdevelopers/serverless-rust/tree/main/templates/patterns/container-patterns/alpine-simple-api/",children:"./templates"})," directory in the GitHub repo. You can use the template to get started with your own project.  The Dockerfile included might be all you are after, and that's OK.  But you can also use the sample API and the Dockerfile to experiment with different values.  There are also some release configuration settings in the Cargo.toml that will be discussed further down in the article.  Those settings enhance the final binary generated by Cargo."]}),"\n",(0,n.jsx)(e.p,{children:"Let's get started walking through this article."}),"\n",(0,n.jsx)(e.h3,{id:"rust-code",children:"Rust Code"}),"\n",(0,n.jsxs)(D.Section,{codeConfig:d,northPanel:{tabs:["main.rs"],active:"main.rs",heightRatio:1},files:[{name:"main.rs",focus:"",code:{lines:[{tokens:[{content:"use ",props:{style:{color:"#569CD6"}}},{content:"axum",props:{style:{color:"#4EC9B0"}}},{content:"::{",props:{style:{color:"#D4D4D4"}}},{content:"routing",props:{style:{color:"#4EC9B0"}}},{content:"::get, ",props:{style:{color:"#D4D4D4"}}},{content:"Router",props:{style:{color:"#4EC9B0"}}},{content:", ",props:{style:{color:"#D4D4D4"}}},{content:"Json",props:{style:{color:"#4EC9B0"}}},{content:"};",props:{style:{color:"#D4D4D4"}}}]},{tokens:[{content:"use ",props:{style:{color:"#569CD6"}}},{content:"serde",props:{style:{color:"#4EC9B0"}}},{content:"::",props:{style:{color:"#D4D4D4"}}},{content:"Serialize",props:{style:{color:"#4EC9B0"}}},{content:";",props:{style:{color:"#D4D4D4"}}}]},{tokens:[{content:"",props:{style:{color:"#D4D4D4"}}}]},{tokens:[{content:"#[derive(",props:{style:{color:"#D4D4D4"}}},{content:"Serialize",props:{style:{color:"#4EC9B0"}}},{content:")]",props:{style:{color:"#D4D4D4"}}}]},{tokens:[{content:"struct ",props:{style:{color:"#569CD6"}}},{content:"Resource",props:{style:{color:"#4EC9B0"}}},{content:" {",props:{style:{color:"#D4D4D4"}}}]},{tokens:[{content:"    key",props:{style:{color:"#9CDCFE"}}},{content:": ",props:{style:{color:"#D4D4D4"}}},{content:"String",props:{style:{color:"#4EC9B0"}}},{content:",",props:{style:{color:"#D4D4D4"}}}]},{tokens:[{content:"    value",props:{style:{color:"#9CDCFE"}}},{content:": ",props:{style:{color:"#D4D4D4"}}},{content:"String",props:{style:{color:"#4EC9B0"}}},{content:",",props:{style:{color:"#D4D4D4"}}}]},{tokens:[{content:"}",props:{style:{color:"#D4D4D4"}}}]},{tokens:[{content:"",props:{style:{color:"#D4D4D4"}}}]},{tokens:[{content:"#[tokio::main]",props:{style:{color:"#D4D4D4"}}}]},{tokens:[{content:"async fn ",props:{style:{color:"#569CD6"}}},{content:"main",props:{style:{color:"#DCDCAA"}}},{content:"() {",props:{style:{color:"#D4D4D4"}}}]},{tokens:[{content:"    // build our application with a route",props:{style:{color:"#6A9955"}}}]},{tokens:[{content:"    let ",props:{style:{color:"#569CD6"}}},{content:"app",props:{style:{color:"#9CDCFE"}}},{content:" = ",props:{style:{color:"#D4D4D4"}}},{content:"Router",props:{style:{color:"#4EC9B0"}}},{content:"::",props:{style:{color:"#D4D4D4"}}},{content:"new",props:{style:{color:"#DCDCAA"}}},{content:"()",props:{style:{color:"#D4D4D4"}}}]},{tokens:[{content:"        .",props:{style:{color:"#D4D4D4"}}},{content:"route",props:{style:{color:"#DCDCAA"}}},{content:"(",props:{style:{color:"#D4D4D4"}}},{content:'"/"',props:{style:{color:"#CE9178"}}},{content:", ",props:{style:{color:"#D4D4D4"}}},{content:"get",props:{style:{color:"#DCDCAA"}}},{content:"(",props:{style:{color:"#D4D4D4"}}},{content:"handler",props:{style:{color:"#9CDCFE"}}},{content:"))",props:{style:{color:"#D4D4D4"}}}]},{tokens:[{content:"        .",props:{style:{color:"#D4D4D4"}}},{content:"route",props:{style:{color:"#DCDCAA"}}},{content:"(",props:{style:{color:"#D4D4D4"}}},{content:'"/health"',props:{style:{color:"#CE9178"}}},{content:", ",props:{style:{color:"#D4D4D4"}}},{content:"get",props:{style:{color:"#DCDCAA"}}},{content:"(",props:{style:{color:"#D4D4D4"}}},{content:"health",props:{style:{color:"#9CDCFE"}}},{content:"));",props:{style:{color:"#D4D4D4"}}}]},{tokens:[{content:"",props:{style:{color:"#D4D4D4"}}}]},{tokens:[{content:"    // run it",props:{style:{color:"#6A9955"}}}]},{tokens:[{content:"    let ",props:{style:{color:"#569CD6"}}},{content:"listener",props:{style:{color:"#9CDCFE"}}},{content:" = ",props:{style:{color:"#D4D4D4"}}},{content:"tokio",props:{style:{color:"#4EC9B0"}}},{content:"::",props:{style:{color:"#D4D4D4"}}},{content:"net",props:{style:{color:"#4EC9B0"}}},{content:"::",props:{style:{color:"#D4D4D4"}}},{content:"TcpListener",props:{style:{color:"#4EC9B0"}}},{content:"::",props:{style:{color:"#D4D4D4"}}},{content:"bind",props:{style:{color:"#DCDCAA"}}},{content:"(",props:{style:{color:"#D4D4D4"}}},{content:'"0.0.0.0:8080"',props:{style:{color:"#CE9178"}}},{content:")",props:{style:{color:"#D4D4D4"}}}]},{tokens:[{content:"        .",props:{style:{color:"#D4D4D4"}}},{content:"await",props:{style:{color:"#C586C0"}}}]},{tokens:[{content:"        .",props:{style:{color:"#D4D4D4"}}},{content:"unwrap",props:{style:{color:"#DCDCAA"}}},{content:"();",props:{style:{color:"#D4D4D4"}}}]},{tokens:[{content:"    println!",props:{style:{color:"#DCDCAA"}}},{content:"(",props:{style:{color:"#D4D4D4"}}},{content:'"listening on {}"',props:{style:{color:"#CE9178"}}},{content:", ",props:{style:{color:"#D4D4D4"}}},{content:"listener",props:{style:{color:"#9CDCFE"}}},{content:".",props:{style:{color:"#D4D4D4"}}},{content:"local_addr",props:{style:{color:"#DCDCAA"}}},{content:"().",props:{style:{color:"#D4D4D4"}}},{content:"unwrap",props:{style:{color:"#DCDCAA"}}},{content:"());",props:{style:{color:"#D4D4D4"}}}]},{tokens:[{content:"    axum",props:{style:{color:"#4EC9B0"}}},{content:"::",props:{style:{color:"#D4D4D4"}}},{content:"serve",props:{style:{color:"#DCDCAA"}}},{content:"(",props:{style:{color:"#D4D4D4"}}},{content:"listener",props:{style:{color:"#9CDCFE"}}},{content:", ",props:{style:{color:"#D4D4D4"}}},{content:"app",props:{style:{color:"#9CDCFE"}}},{content:").",props:{style:{color:"#D4D4D4"}}},{content:"await",props:{style:{color:"#C586C0"}}},{content:".",props:{style:{color:"#D4D4D4"}}},{content:"unwrap",props:{style:{color:"#DCDCAA"}}},{content:"();",props:{style:{color:"#D4D4D4"}}}]},{tokens:[{content:"}",props:{style:{color:"#D4D4D4"}}}]},{tokens:[{content:"",props:{style:{color:"#D4D4D4"}}}]},{tokens:[{content:"async fn ",props:{style:{color:"#569CD6"}}},{content:"handler",props:{style:{color:"#DCDCAA"}}},{content:"() -> ",props:{style:{color:"#D4D4D4"}}},{content:"Json",props:{style:{color:"#4EC9B0"}}},{content:"<",props:{style:{color:"#D4D4D4"}}},{content:"Resource",props:{style:{color:"#4EC9B0"}}},{content:"> {",props:{style:{color:"#D4D4D4"}}}]},{tokens:[{content:"    let ",props:{style:{color:"#569CD6"}}},{content:"r",props:{style:{color:"#9CDCFE"}}},{content:" = ",props:{style:{color:"#D4D4D4"}}},{content:"Resource",props:{style:{color:"#4EC9B0"}}},{content:" {",props:{style:{color:"#D4D4D4"}}}]},{tokens:[{content:"        key",props:{style:{color:"#9CDCFE"}}},{content:": ",props:{style:{color:"#D4D4D4"}}},{content:'"key"',props:{style:{color:"#CE9178"}}},{content:".",props:{style:{color:"#D4D4D4"}}},{content:"to_string",props:{style:{color:"#DCDCAA"}}},{content:"(),",props:{style:{color:"#D4D4D4"}}}]},{tokens:[{content:"        value",props:{style:{color:"#9CDCFE"}}},{content:": ",props:{style:{color:"#D4D4D4"}}},{content:'"value"',props:{style:{color:"#CE9178"}}},{content:".",props:{style:{color:"#D4D4D4"}}},{content:"to_string",props:{style:{color:"#DCDCAA"}}},{content:"()",props:{style:{color:"#D4D4D4"}}}]},{tokens:[{content:"    };",props:{style:{color:"#D4D4D4"}}}]},{tokens:[{content:"",props:{style:{color:"#D4D4D4"}}}]},{tokens:[{content:"    Json",props:{style:{color:"#DCDCAA"}}},{content:"(",props:{style:{color:"#D4D4D4"}}},{content:"r",props:{style:{color:"#9CDCFE"}}},{content:")",props:{style:{color:"#D4D4D4"}}}]},{tokens:[{content:"}",props:{style:{color:"#D4D4D4"}}}]},{tokens:[{content:"",props:{style:{color:"#D4D4D4"}}}]},{tokens:[{content:"async fn ",props:{style:{color:"#569CD6"}}},{content:"health",props:{style:{color:"#DCDCAA"}}},{content:"() -> ",props:{style:{color:"#D4D4D4"}}},{content:"Json",props:{style:{color:"#4EC9B0"}}},{content:"<",props:{style:{color:"#D4D4D4"}}},{content:"Resource",props:{style:{color:"#4EC9B0"}}},{content:"> {",props:{style:{color:"#D4D4D4"}}}]},{tokens:[{content:"    let ",props:{style:{color:"#569CD6"}}},{content:"r",props:{style:{color:"#9CDCFE"}}},{content:" = ",props:{style:{color:"#D4D4D4"}}},{content:"Resource",props:{style:{color:"#4EC9B0"}}},{content:" {",props:{style:{color:"#D4D4D4"}}}]},{tokens:[{content:"        key",props:{style:{color:"#9CDCFE"}}},{content:": ",props:{style:{color:"#D4D4D4"}}},{content:'"healthy"',props:{style:{color:"#CE9178"}}},{content:".",props:{style:{color:"#D4D4D4"}}},{content:"to_string",props:{style:{color:"#DCDCAA"}}},{content:"(),",props:{style:{color:"#D4D4D4"}}}]},{tokens:[{content:"        value",props:{style:{color:"#9CDCFE"}}},{content:": ",props:{style:{color:"#D4D4D4"}}},{content:'"healthy"',props:{style:{color:"#CE9178"}}},{content:".",props:{style:{color:"#D4D4D4"}}},{content:"to_string",props:{style:{color:"#DCDCAA"}}},{content:"()",props:{style:{color:"#D4D4D4"}}}]},{tokens:[{content:"    };",props:{style:{color:"#D4D4D4"}}}]},{tokens:[{content:"",props:{style:{color:"#D4D4D4"}}}]},{tokens:[{content:"    Json",props:{style:{color:"#DCDCAA"}}},{content:"(",props:{style:{color:"#D4D4D4"}}},{content:"r",props:{style:{color:"#9CDCFE"}}},{content:")",props:{style:{color:"#D4D4D4"}}}]},{tokens:[{content:"}",props:{style:{color:"#D4D4D4"}}}]}],lang:"rust"},annotations:[]}],children:[(0,n.jsxs)(e.p,{children:["The API that we are building for this example is super basic.  It has two endpoints that respond on ",(0,n.jsx)(D.SectionLink,{focus:"14",id:"focus://14",children:(0,n.jsx)(e.code,{children:"GET /"})})," and ",(0,n.jsx)(D.SectionLink,{focus:"15",id:"focus://15",children:(0,n.jsx)(e.code,{children:"GET /health"})}),".  Below is the ",(0,n.jsx)(e.code,{children:"main.rs"})," that includes the entirity of the project."]}),(0,n.jsx)(D.SectionCode,{children:(0,n.jsx)(D.SectionCode,{})})]}),"\n",(0,n.jsx)(e.h3,{id:"cargotoml",children:"Cargo.toml"}),"\n",(0,n.jsx)(e.p,{children:"There was mention above about some settings in the Cargo.toml file that improved the binary size when building in release mode.  Cargo supports profiles so you can have settings for development and then settings for release (among others)."}),"\n",(0,n.jsx)(e.p,{children:"Let's have a look at the Cargo.toml file:"}),"\n",(0,n.jsxs)(D.Section,{codeConfig:d,northPanel:{tabs:["Cargo.toml"],active:"Cargo.toml",heightRatio:1},files:[{name:"Cargo.toml",focus:"",code:{lines:[{tokens:[{content:"# more above ommitted for brevity",props:{style:{color:"#6A9955"}}}]},{tokens:[{content:"[profile.dev]",props:{style:{color:"#D4D4D4"}}}]},{tokens:[{content:"opt-level",props:{style:{color:"#9CDCFE"}}},{content:" = ",props:{style:{color:"#D4D4D4"}}},{content:"0",props:{style:{color:"#B5CEA8"}}}]},{tokens:[{content:"",props:{style:{color:"#D4D4D4"}}}]},{tokens:[{content:"[profile.release]",props:{style:{color:"#D4D4D4"}}}]},{tokens:[{content:"opt-level",props:{style:{color:"#9CDCFE"}}},{content:" = ",props:{style:{color:"#D4D4D4"}}},{content:"3",props:{style:{color:"#B5CEA8"}}}]},{tokens:[{content:"strip",props:{style:{color:"#9CDCFE"}}},{content:" = ",props:{style:{color:"#D4D4D4"}}},{content:"true",props:{style:{color:"#569CD6"}}}]}],lang:"toml"},annotations:[]}],children:[(0,n.jsxs)(e.ul,{children:["\n",(0,n.jsxs)(e.li,{children:[(0,n.jsx)(D.SectionLink,{focus:"2:3",id:"focus://2:3",children:(0,n.jsx)(e.code,{children:"profile dev"})})," highlights an opt-level of 0. This tells the compiler to use no advanced optimziations."]}),"\n",(0,n.jsxs)(e.li,{children:[(0,n.jsx)(D.SectionLink,{focus:"5:7",id:"focus://5:7",children:(0,n.jsx)(e.code,{children:"profile release"})})," highlights an opt-level of 3 which is the max for optimizations.  It also includes strip=true which will remove debug and info symbols."]}),"\n"]}),(0,n.jsx)(D.SectionCode,{children:(0,n.jsx)(D.SectionCode,{})})]}),"\n",(0,n.jsx)(e.h3,{id:"dockerfile",children:"Dockerfile"}),"\n",(0,n.jsx)(e.p,{children:"Now for the part that brings it all together.  This isn't going to be a deep-dive on how to use Docker or construct Dockerfiles, but there are a few general tips below that should relate to other languages and frameworks."}),"\n",(0,n.jsx)(D.Scrollycoding,{codeConfig:d,editorSteps:[{northPanel:{tabs:[""],active:"",heightRatio:1},files:[{name:"",focus:"",code:{lines:[{tokens:[{content:"# Build arg for controlling the Rust version",props:{style:{color:"#6A9955"}}}]},{tokens:[{content:"ARG",props:{style:{color:"#569CD6"}}},{content:" RUST_VERSION=1.77",props:{style:{color:"#D4D4D4"}}}]},{tokens:[{content:"",props:{style:{color:"#D4D4D4"}}}]},{tokens:[{content:"# Base image that is the builder that originates from Alpine",props:{style:{color:"#6A9955"}}}]},{tokens:[{content:"FROM",props:{style:{color:"#569CD6"}}},{content:" rust:${RUST_VERSION}-alpine ",props:{style:{color:"#D4D4D4"}}},{content:"as",props:{style:{color:"#569CD6"}}},{content:" builder",props:{style:{color:"#D4D4D4"}}}]},{tokens:[{content:"",props:{style:{color:"#D4D4D4"}}}]},{tokens:[{content:"# adding in SSL and libc-dev as required to compile with Tokio",props:{style:{color:"#6A9955"}}}]},{tokens:[{content:"# and other crates included",props:{style:{color:"#6A9955"}}}]},{tokens:[{content:"RUN",props:{style:{color:"#569CD6"}}},{content:" apk add pkgconfig openssl-dev libc-dev",props:{style:{color:"#D4D4D4"}}}]},{tokens:[{content:"",props:{style:{color:"#D4D4D4"}}}]},{tokens:[{content:"WORKDIR",props:{style:{color:"#569CD6"}}},{content:" /usr/src/app",props:{style:{color:"#D4D4D4"}}}]},{tokens:[{content:"",props:{style:{color:"#D4D4D4"}}}]},{tokens:[{content:"# Trick Docker and Rust to cache dependencies so taht future runs of Docker build",props:{style:{color:"#6A9955"}}}]},{tokens:[{content:"# will happen much quicker as long as crates in the Cargo.tom and lock file don't change.",props:{style:{color:"#6A9955"}}}]},{tokens:[{content:"# When they change, it'll force a refresh",props:{style:{color:"#6A9955"}}}]},{tokens:[{content:"COPY",props:{style:{color:"#569CD6"}}},{content:" Cargo.toml Cargo.lock ./",props:{style:{color:"#D4D4D4"}}}]},{tokens:[{content:"RUN",props:{style:{color:"#569CD6"}}},{content:" mkdir ./src && echo ",props:{style:{color:"#D4D4D4"}}},{content:"'fn main() {}'",props:{style:{color:"#CE9178"}}},{content:" > ./src/main.rs",props:{style:{color:"#D4D4D4"}}}]},{tokens:[{content:"RUN",props:{style:{color:"#569CD6"}}},{content:" cargo build --release",props:{style:{color:"#D4D4D4"}}}]},{tokens:[{content:"",props:{style:{color:"#D4D4D4"}}}]},{tokens:[{content:"# Replace with the real src of the project",props:{style:{color:"#6A9955"}}}]},{tokens:[{content:"RUN",props:{style:{color:"#569CD6"}}},{content:" rm -rf ./src",props:{style:{color:"#D4D4D4"}}}]},{tokens:[{content:"COPY",props:{style:{color:"#569CD6"}}},{content:" ./src ./src",props:{style:{color:"#D4D4D4"}}}]},{tokens:[{content:"",props:{style:{color:"#D4D4D4"}}}]},{tokens:[{content:"# break the Cargo cache",props:{style:{color:"#6A9955"}}}]},{tokens:[{content:"RUN",props:{style:{color:"#569CD6"}}},{content:" touch ./src/main.rs",props:{style:{color:"#D4D4D4"}}}]},{tokens:[{content:"",props:{style:{color:"#D4D4D4"}}}]},{tokens:[{content:"# Build the project",props:{style:{color:"#6A9955"}}}]},{tokens:[{content:"# Note that in the Cargo.toml file there is a release profile that optimizes",props:{style:{color:"#6A9955"}}}]},{tokens:[{content:"# this build",props:{style:{color:"#6A9955"}}}]},{tokens:[{content:"RUN",props:{style:{color:"#569CD6"}}},{content:" cargo build --release",props:{style:{color:"#D4D4D4"}}}]},{tokens:[{content:"",props:{style:{color:"#D4D4D4"}}}]},{tokens:[{content:"# Build final layer from the base alpine image",props:{style:{color:"#6A9955"}}}]},{tokens:[{content:"FROM",props:{style:{color:"#569CD6"}}},{content:" alpine:latest",props:{style:{color:"#D4D4D4"}}}]},{tokens:[{content:"",props:{style:{color:"#D4D4D4"}}}]},{tokens:[{content:"# Build arguments to allow overrides",props:{style:{color:"#6A9955"}}}]},{tokens:[{content:"#   APP_USER: user that runs the binary",props:{style:{color:"#6A9955"}}}]},{tokens:[{content:"#   APP_GROUP: the group for the new user",props:{style:{color:"#6A9955"}}}]},{tokens:[{content:"#   EXPOSED_PORT: the port that the container is exposing",props:{style:{color:"#6A9955"}}}]},{tokens:[{content:"ARG",props:{style:{color:"#569CD6"}}},{content:" APP_USER=rust_user",props:{style:{color:"#D4D4D4"}}}]},{tokens:[{content:"ARG",props:{style:{color:"#569CD6"}}},{content:" APP_GROUP=rust_group",props:{style:{color:"#D4D4D4"}}}]},{tokens:[{content:"ARG",props:{style:{color:"#569CD6"}}},{content:" EXPOSED_PORT=8080",props:{style:{color:"#D4D4D4"}}}]},{tokens:[{content:"ARG",props:{style:{color:"#569CD6"}}},{content:" APP=/usr/app",props:{style:{color:"#D4D4D4"}}}]},{tokens:[{content:"",props:{style:{color:"#D4D4D4"}}}]},{tokens:[{content:"# Add the uer, group and make directory for the build artifiacts",props:{style:{color:"#6A9955"}}}]},{tokens:[{content:"#   Performing as one continuous statement to condense layers",props:{style:{color:"#6A9955"}}}]},{tokens:[{content:"RUN",props:{style:{color:"#569CD6"}}},{content:" apk update \\",props:{style:{color:"#D4D4D4"}}}]},{tokens:[{content:"    &&  apk add openssl ca-certificates \\",props:{style:{color:"#D4D4D4"}}}]},{tokens:[{content:"    &&  addgroup -S ${APP_GROUP} \\",props:{style:{color:"#D4D4D4"}}}]},{tokens:[{content:"    &&  adduser -S ${APP_USER} -G ${APP_GROUP} \\",props:{style:{color:"#D4D4D4"}}}]},{tokens:[{content:"    &&  mkdir -p ${APP}",props:{style:{color:"#D4D4D4"}}}]},{tokens:[{content:"",props:{style:{color:"#D4D4D4"}}}]},{tokens:[{content:"EXPOSE",props:{style:{color:"#569CD6"}}},{content:" $EXPOSED_PORT",props:{style:{color:"#D4D4D4"}}}]},{tokens:[{content:"COPY",props:{style:{color:"#569CD6"}}},{content:" --from=builder /usr/src/app/target/release/web_app ${APP}/web_app",props:{style:{color:"#D4D4D4"}}}]},{tokens:[{content:"RUN",props:{style:{color:"#569CD6"}}},{content:" chown -R $APP_USER:$APP_GROUP ${APP}",props:{style:{color:"#D4D4D4"}}}]},{tokens:[{content:"USER",props:{style:{color:"#569CD6"}}},{content:" $APP_USER",props:{style:{color:"#D4D4D4"}}}]},{tokens:[{content:"WORKDIR",props:{style:{color:"#569CD6"}}},{content:" ${APP}",props:{style:{color:"#D4D4D4"}}}]},{tokens:[{content:"",props:{style:{color:"#D4D4D4"}}}]},{tokens:[{content:"CMD",props:{style:{color:"#569CD6"}}},{content:" [",props:{style:{color:"#D4D4D4"}}},{content:'"./web_app"',props:{style:{color:"#CE9178"}}},{content:"]",props:{style:{color:"#D4D4D4"}}}]}],lang:"dockerfile"},annotations:[]}]}],children:(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)(e.p,{children:"A few points as we get started."}),(0,n.jsxs)(e.ol,{children:["\n",(0,n.jsxs)(e.li,{children:["The Dockerfile makes use of ",(0,n.jsx)(e.a,{href:"https://docs.docker.com/build/guide/build-args/",children:"Build Arguments"})," which provide some override capabilities when running ",(0,n.jsx)(e.code,{children:"docker build"})," and such from the command line."]}),"\n",(0,n.jsxs)(e.li,{children:["The next thing you'll find is that the file makes use of multi-stage builds.  This allows certain layers to contain more components needed for things like compilation, while the final runtime image will be from something super slim like ",(0,n.jsx)(D.SectionLink,{focus:"33",id:"focus://33",children:(0,n.jsx)(e.code,{children:"alpine:latest"})}),"."]}),"\n",(0,n.jsx)(e.li,{children:"Docker makes use of layers (which is beyond this article) and by combining commands into a single line, layers can be saved."}),"\n"]}),(0,n.jsx)(e.h4,{id:"the-build",children:"The Build"}),(0,n.jsxs)(e.p,{children:["The image that is used to start the build process is a combination of the ",(0,n.jsx)(D.SectionLink,{focus:"2",id:"focus://2",children:(0,n.jsx)(e.code,{children:"RUST_VERSION"})})," and the ",(0,n.jsx)(D.SectionLink,{focus:"5",id:"focus://5",children:(0,n.jsx)(e.code,{children:"rust alpine image"})}),".  Next, add in ",(0,n.jsx)(D.SectionLink,{focus:"9",id:"focus://9",children:(0,n.jsx)(e.code,{children:"openssl and libc-dev"})}),"."]}),(0,n.jsxs)(e.p,{children:["Something that might appear a bit odd is the work that happens ",(0,n.jsx)(D.SectionLink,{focus:"13:25",id:"focus://13:25",children:(0,n.jsx)(e.code,{children:"here"})}),".  What's going on is that we are caching the crate dependencies by doing an early build of a basic main.rs.  This will cache the pulling of the crates so that this timely operation doesn't happen for every build.  Only when things change."]}),(0,n.jsx)(e.h4,{id:"final-packaging",children:"Final Packaging"}),(0,n.jsx)(e.p,{children:"With the build produced and the binary sitting in the target directory, it's time to setup the final image."}),(0,n.jsxs)(e.p,{children:["There are a few more ",(0,n.jsx)(D.SectionLink,{focus:"39:42",id:"focus://39:42",children:(0,n.jsx)(e.code,{children:"build arguments"})})," that are created so that they can be overridden if needed and to save on typing mistakes by making them variables."]}),(0,n.jsxs)(e.p,{children:["Lastly, the files are ",(0,n.jsx)(D.SectionLink,{focus:"53:58",id:"focus://53:58",children:(0,n.jsx)(e.code,{children:"copied from the build"})})," and the binary is places in the CMD statement so that it is executed when the container is launched."]}),(0,n.jsx)(D.CodeSlot,{})]})}),"\n",(0,n.jsx)(e.h2,{id:"testing-the-solution",children:"Testing the Solution"}),"\n",(0,n.jsx)(e.p,{children:"Launching and testing the Dockerfile is easy.  Run this command first from the template directory root:"}),"\n",(0,n.jsx)(D.Code,{codeConfig:d,northPanel:{tabs:[""],active:"",heightRatio:1},files:[{name:"",focus:"",code:{lines:[{tokens:[{content:"docker ",props:{style:{color:"#D4D4D4"}}},{content:"build -t rust-service .",props:{style:{color:"#CE9178"}}}]}],lang:"bash"},annotations:[]}]}),"\n",(0,n.jsx)(e.p,{children:"From there, you can launch the container and run a cURL command like shown in this image."}),"\n",(0,n.jsx)(e.p,{children:(0,n.jsx)(e.img,{src:t(2819).A+"",loading:"lazy",alt:"Alpine cURL",width:"2520",height:"198"})}),"\n",(0,n.jsx)(D.Code,{codeConfig:d,northPanel:{tabs:[""],active:"",heightRatio:1},files:[{name:"",focus:"",code:{lines:[{tokens:[{content:"docker ",props:{style:{color:"#D4D4D4"}}},{content:"run -p 8080:",props:{style:{color:"#CE9178"}}},{content:"8080 ",props:{style:{color:"#B5CEA8"}}},{content:"rust-service",props:{style:{color:"#CE9178"}}}]},{tokens:[{content:"curl ",props:{style:{color:"#D4D4D4"}}},{content:"http://localhost:8080/ ",props:{style:{color:"#CE9178"}}}]}],lang:"bash"},annotations:[]}]}),"\n",(0,n.jsx)(e.h2,{id:"comment-on-size",children:"Comment on Size"}),"\n",(0,n.jsx)(e.p,{children:'As has been stated many times on this site, Rust provides amazing performance benefits when pairing with serverless.  And this example of building with Alpine looks at another example of how peformance might not always mean just "compute" time.'}),"\n",(0,n.jsx)(e.p,{children:"Since Rust binaries are compiled, they require no runtime like Node.js, Python, .NET or Java.  And no runtime means that the base Linux image can be as small as possible when hosting Rust binaries.  But why does that matter? Simple.  If your code is running in a container that needs to scale out, the size of the image matters.  Every byte you don't need is a wasted network byte.  So while a .NET image might be 100 - 200MB, a Rust image like this built upon Alpine can be less than 20MB.  That could be as much as 80 - 90% reduction in size when at scale can 100% make the difference between when to launch new instances in your fleet and how fast they start."}),"\n",(0,n.jsx)(e.p,{children:"This image demonstrates the final output from this article."}),"\n",(0,n.jsx)(e.p,{children:(0,n.jsx)(e.img,{src:t(4682).A+"",loading:"lazy",alt:"Alpine Size",width:"2520",height:"110"})}),"\n",(0,n.jsx)(e.h2,{id:"congratulations",children:"Congratulations"}),"\n",(0,n.jsx)(e.p,{children:"And that's it! You know have a pattern for building and packaging a simple Rust-based API with a Linux Alpine-based image in a Docker."})]})}const y=function(o={}){const{wrapper:e}=Object.assign({},(0,s.R)(),o.components);return e?(0,n.jsx)(e,Object.assign({},o,{children:(0,n.jsx)(h,o)})):h(o)};function u(o,e){throw new Error("Expected "+(e?"component":"object")+" `"+o+"` to be defined: you likely forgot to import, pass, or provide it.")}},4682:(o,e,t)=>{t.d(e,{A:()=>n});const n=t.p+"assets/images/alpine_image_size-15dc3901ad9a5cb4d2a5f2f8e449207a.png"},2819:(o,e,t)=>{t.d(e,{A:()=>n});const n=t.p+"assets/images/alpine_testing-4a7ba7d7090f97373c26f84cc1abae00.png"}}]);