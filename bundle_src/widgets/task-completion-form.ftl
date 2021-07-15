<#assign wp=JspTaglibs["/aps-core"]>
<script crossorigin src="https://unpkg.com/react@16/umd/react.development.js"></script>
<script crossorigin src="https://unpkg.com/react-dom@16/umd/react-dom.development.js"></script>
<#-- entando_resource_injection_point -->

<#if RequestParameters.taskId?exists>
    <#assign taskId= RequestParameters.taskId>
<#else>
    <#assign taskId= "">
</#if>

<task-completion-form service-url="/entandoPdaPlugin" page-code="${Request.reqCtx.getExtraParam('currentPage').code}" frame-id="${Request.reqCtx.getExtraParam('currentFrame')}" id="${taskId}"/>
