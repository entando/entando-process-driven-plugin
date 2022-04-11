package org.entando.plugins.pda.config;

import static java.util.Collections.emptyList;
import static java.util.Optional.ofNullable;

import lombok.Getter;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;
import springfox.documentation.service.ApiInfo;
import springfox.documentation.service.Contact;

@Slf4j
@Component
@Getter
@Setter
@ConfigurationProperties(prefix = "swagger.info")
public class SwaggerInfo {

    private String title;
    private String description;
    private String version;
    private SwaggerContact contact;
    private String license;
    private String licenseUrl;
    private String termsOfServiceUrl;
    private String basePackage;

    public ApiInfo getApiInfo() {
        final Contact contact = ofNullable(this.contact).orElse(new SwaggerContact()).toSwaggerContact();
        return new ApiInfo(title, description, version, termsOfServiceUrl, contact, license, licenseUrl, emptyList());
    }
}
