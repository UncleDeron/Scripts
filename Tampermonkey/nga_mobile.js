// ==UserScript==
// @name         NGA移动端显示优化
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  优化NGA论坛移动端显示效果
// @author       UncleDeron
// @match        https://bbs.nga.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=nga.cn
// @grant        GM_addStyle
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    let css=`
#mainmenu .stdbtn .td:first-child {
    float: left;
    width: 50%;
    text-align: center;
}
#mainmenu .stdbtn .td {
    float: right;
}
#m_nav_nav {
    margin-left: 8px;
    font-size: 1em;
}
.nav_root, .nav_link, .nav_spr{
    font-size: 1em;
    line-height:1.782em;
}
#indexBlockLeft {
    box-sizing: border-box;
    padding: 0 8px;
}
.catenew, .cateblock, .forumbox{
    border-radius: 4px;
}
.catenew .contentBlock {
    padding: 0 8px;
}

.indexblock .headline {
    display: none;
}

.contentBlock .c .b {
    padding-left: 8px;
    display: flex;
    align-items: center;
    height: 48px;
    width: unset;
}

.contentBlock .c {
    background-position: 2px center !important;
    background-color: unset !important;
}

.contentBlock .c .a {
    box-sizing: border-box;
    height: 48px;
}

.contentBlock .c .b a {
    white-space: pre-wrap;
    color: #984e39 !important;
}

.contentBlock .c .b br {
    display: none;
}

.contentBlock .c .b p {
    display: none;
}

#footer {
    display: none;
}

/* 列表页 */

#m_nav .nav, #b_nav .nav {
    font-size: 1em;
    margin: 0 8px;
}

#m_pbtntop {
    padding: 0 8px;
}

#m_pbtntop .right_ {
    float: none;
}

#m_pbtnbtm .right_ {
    float: none;
}

#m_pbtntop .right_ .stdbtn {
    font-size: 0.8em;
    width: 100%;
}

#m_pbtnbtm .right_ .stdbtn {
    font-size: 0.8em;
    width: 100%;
}

#m_pbtntop .right_ .stdbtn tr {
    display: flex;
}

#m_pbtntop .right_ .stdbtn td {
    flex: 1;
}

#m_pbtnbtm .right_ .stdbtn tr {
    display: flex;
}

#m_pbtnbtm .right_ .stdbtn td {
    flex: 1;
}

#m_pbtntop .left .stdbtn {
    font-size: 0.8em;
}

#m_threads {
    margin: 0;
}

#m_threads .forumbox{
    border-radius: 0;
}

#toptopics h3 a {
    display: block;
    width: 100%;
    text-align: center;
    padding: 0;
    line-height: 1.8em;
    height: 1.8em;
}

#toptopics br{
    display: none;
}

#toptopics .postrow{
    text-align: center;
}

#toptopics .postrow button{
    padding: 6px;
}

#toptopics .postrow #toppedtopic{
    width: 100%;
}

#topicrows{
    border-spacing: 8px 12px;
}

#topicrows .topicrow td {
    border-radius: 6px;
}

#topicrows .topicrow td > .replies {
    display: none;
}

#topicrows .topicrow .posterInfoLine{
    padding: 6px 16px 0 16px;
    border-radius: 6px 6px 0 0;
    margin-bottom: 0.4em !important;
    display: flex;
}

#topicrows .topicrow .postdate{
    display: none !important;
}

#topicrows .topicrow .replyer{
    display: none !important;
}

#topicrows .topicrow .author{
    order: -1;
    margin-left: 0px !important;
    flex: 2;
    text-align: left;
}

#topicrows .topicrow .replies{
    order: 1;
    position: relative;
    font-weight: normal !important;
    flex: 1;
}

#topicrows .topicrow .replies img{
    width: 24px;
}

#topicrows .topicrow .replies:after{
    position: relative;
    content: " 回复";
}

#topicrows .topicrow .replydate{
    order: 0;
    flex: 1;
}

#topicrows .topicrow .pager{
    display: none;
}

#topicrows .topicrow .topic{
    display: block;
    padding: 0 8px;
}
#topicrows .topicrow .topic~span{
    display: none;
}

/*帖子内容页*/
#currentTopicName {
    padding: 0 16px 8px;
    display: block;
    font-size: 1.1em;
    border-bottom: 1px solid #ccc;
}

#postsubject0 {
    display: none;
}

span.postcontent[id^=postcontent] {
    padding-left: 8px;
    display: inline-block !important;
}

.forumbox .postrow h3 {
    font-size: 1.1em;
}

.forumbox .postrow br {
    line-height: 8px;
}


    `
    GM_addStyle(css)
})();