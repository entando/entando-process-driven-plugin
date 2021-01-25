<#assign wp=JspTaglibs["/aps-core"]>
<#assign c=JspTaglibs["http://java.sun.com/jsp/jstl/core"]>
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8" />
        <title>
            <@wp.currentPage param="title" /> - <@wp.i18n key="PORTAL_TITLE" />
        </title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content="" />
        <meta name="author" content="" />

        <@wp.fragment code="entando_pda_keycloak_with_redirect" escapeXml=false />
        <@wp.fragment code="entando_pda_css_reset" escapeXml=false />
        <@wp.fragment code="entando_pda_import_react" escapeXml=false />
        <@wp.fragment code="entando_pda_shared_css_js" escapeXml=false />
        <@wp.fragment code="entando_pda_styles" escapeXml=false />

        <link rel="icon" href="<@wp.info key=" systemParam" paramName="applicationBaseURL" />favicon.png" type="image/png" />

        <@wp.fragment code="entando_pda_import_react" escapeXml=false />
	
    </head>

    <body>
        <div class="pda-content">
            <div class="pda-header">
                <@wp.fragment code="entando_pda_header" escapeXml=false />
            </div>

            <aside class="pda-sidebar">
              	<!-- SIDEBAR WIDGET (FRAME 2)-->
              	<@wp.show frame=3 />
              	<@wp.show frame=4 />
              	<!-- END OF SIDEBAR WIDGET (FRAME 2)-->
            </aside>

          	<main class="pda-main">
                <div class="frame-container container">
                    <div class="row white-bg">
                        <div class="col-sm-12">
                          	<@wp.show frame=5 />
                        </div>
                    </div>
                </div>
          	</main>
        </div>
    </body>
</html>