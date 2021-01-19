<style>
            body {
                background-color: #F3F3F4;
            }

            .pda-content {
                display: -ms-grid;
                display: grid;

                grid-template-areas:
                    "header header header"
                    "sidebar content content"
                    "footer footer footer";

                -ms-grid-columns: 178px 0px 1fr 0px 1fr;

                grid-template-columns: 178px 1fr 1fr;
                -ms-grid-rows: auto 0px 1fr 0px auto;
                grid-template-rows: auto 1fr auto;
                grid-gap: 0px;

                height: 100vh;
            }

            .pda-header {
                -ms-grid-row: 1;
                -ms-grid-column: 1;
                -ms-grid-column-span: 5;
                grid-area: header;
            }

            .pda-sidebar {
                -ms-grid-row: 3;
                -ms-grid-column: 1;
                grid-area: sidebar;
                background-color: #2F4050;
            }

            .pda-main {
                -ms-grid-row: 3;
                -ms-grid-column: 3;
                -ms-grid-column-span: 3;
                grid-area: content;
                overflow-y: auto;
                background-color: #f3f3f3;
            }

            .pda-footer {
                -ms-grid-row: 5;
                -ms-grid-column: 1;
                -ms-grid-column-span: 5;
                grid-area: footer;
            }
            
            .frame-container {
                margin: 15px 0px;
            }

.frame-container .white-bg > h1 {
        background-color: #FFF;
        padding: 12px 11px;
      }
      
      .dashboard-title h1 {
        font-size: 24px;
      }

            .pda-navigation li {
                 padding: 10px 0;
             }

            .pda-navigation a {
                 color: #A2ACBD; font-size: 13px; font-weight: bold;
             }

@media (min-width: 1600px) {
.container {
    width: 100% !important;
}
}

        </style>
