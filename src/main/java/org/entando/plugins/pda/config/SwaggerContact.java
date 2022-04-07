package org.entando.plugins.pda.config;

import lombok.Getter;
import lombok.Setter;
import springfox.documentation.service.Contact;

@Getter
@Setter
public class SwaggerContact {

    private String name;
    private String email;
    private String url;

    public Contact toSwaggerContact() {
        return new Contact(name, url, email);
    }

}
