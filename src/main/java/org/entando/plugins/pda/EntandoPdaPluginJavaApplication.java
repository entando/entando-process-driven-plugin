package org.entando.plugins.pda;

import org.entando.plugins.pda.config.ConnectionConfigConfiguration;
import org.entando.plugins.pda.service.ConnectionConfigConnector;
import org.entando.plugins.pda.service.impl.ConnectionConfigConnectorImpl;
import org.entando.plugins.pda.service.impl.InMemoryConnectionConfigConnector;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Import;
import org.springframework.context.annotation.Profile;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@SpringBootApplication
@ComponentScan("org.entando")
@Import(ConnectionConfigConfiguration.class)
@SuppressWarnings("PMD.UseUtilityClass")
public class EntandoPdaPluginJavaApplication {

    @Value("${pda.mock-connection-config}")
    private boolean mockConnectionConfig;

    @SuppressWarnings("PMD.DefaultPackage")
    @Value("${pda.allowed-origins-dev}")
    String allowedOriginsDev;

    public static void main(final String[] args) {
        SpringApplication.run(EntandoPdaPluginJavaApplication.class, args);
    }

    @Bean
    public ConnectionConfigConnector connectionConfigConnector(ConnectionConfigConnectorImpl connectionConfigImpl) {
        if (mockConnectionConfig) {
            return new InMemoryConnectionConfigConnector();
        }
        return connectionConfigImpl;
    }

    @Bean
    @Profile("dev")
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")
                        .allowedOrigins(allowedOriginsDev)
                        .allowedMethods("*")
                        .allowCredentials(true);
            }
        };
    }
}
