package org.entando.plugins.pda.config;

import org.keycloak.adapters.springsecurity.KeycloakSecurityComponents;
import org.keycloak.adapters.springsecurity.client.KeycloakClientRequestFactory;
import org.keycloak.adapters.springsecurity.client.KeycloakRestTemplate;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.beans.factory.config.ConfigurableBeanFactory;
import org.springframework.boot.web.client.RootUriTemplateHandler;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Scope;
import org.springframework.web.client.RestTemplate;

@Configuration
@ComponentScan(basePackages = "org.entando.plugins.pda",
        basePackageClasses = KeycloakSecurityComponents.class)
public class ConnectionConfigConfiguration {

    public static final String CONFIG_REST_TEMPLATE = "connectionConfigRestTemplate";

    private final String sidecarPort;
    private final KeycloakClientRequestFactory keycloakClientRequestFactory;

    public ConnectionConfigConfiguration(@Value("${plugin.sidecar.port:8084}") String sidecarPort,
            KeycloakClientRequestFactory keycloakClientRequestFactory) {
        this.sidecarPort = sidecarPort;
        this.keycloakClientRequestFactory = keycloakClientRequestFactory;
    }

    @Bean
    @Qualifier(CONFIG_REST_TEMPLATE)
    @Scope(ConfigurableBeanFactory.SCOPE_PROTOTYPE)
    public RestTemplate restTemplate() {
        KeycloakRestTemplate keycloakRestTemplate = new KeycloakRestTemplate(keycloakClientRequestFactory);
        RootUriTemplateHandler.addTo(keycloakRestTemplate, "http://localhost:" + sidecarPort);
        return keycloakRestTemplate;
    }
}
