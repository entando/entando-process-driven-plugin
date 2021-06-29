package org.entando.plugins.pda.controller.connection;

import static org.entando.plugins.pda.config.ConnectionConfigConfiguration.CONFIG_REST_TEMPLATE;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.boot.web.client.RootUriTemplateHandler;
import org.springframework.context.annotation.Bean;
import org.springframework.web.client.RestTemplate;

@TestConfiguration
public class TestConnectionConfigConfiguration {

    public static final String URL_PREFIX = "http://localhost:8084";

    @Bean
    @Qualifier(CONFIG_REST_TEMPLATE)
    public RestTemplate restTemplate() {
        RestTemplate restTemplate = new RestTemplate();
        RootUriTemplateHandler.addTo(restTemplate, URL_PREFIX);
        return restTemplate;
    }
}
