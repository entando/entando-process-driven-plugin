<#assign wp=JspTaglibs["/aps-core"]>
<#assign c=JspTaglibs["http://java.sun.com/jsp/jstl/core"]>

<script crossorigin src="https://unpkg.com/react@16/umd/react.production.min.js"></script>
<script crossorigin src="https://unpkg.com/react-dom@16/umd/react-dom.production.min.js"></script>

<script nonce="<@wp.cspNonce />">
window.addEventListener('keycloak', (evt) => {
    const eventType = evt.detail.eventType;
    if (eventType == "onAuthSuccess" || eventType == "onAuthRefreshSuccess") {
        localStorage.setItem('token', window.entando.keycloak.token)
    }
})
</script>