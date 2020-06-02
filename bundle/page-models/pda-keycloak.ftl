<#assign wp=JspTaglibs["/aps-core"]>
<#assign c=JspTaglibs["http://java.sun.com/jsp/jstl/core"]>
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8" />
        <title>Redirecting...</title>
    </head>

    <body>
        <@wp.fragment code="entando_keycloak_check" escapeXml=false />
        <@wp.fragment code="entando_keycloak_token_setter" escapeXml=false />
    </body>
</html>