package org.entando.plugins.pda;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.web.client.RestTemplate;

@SpringBootApplication
@ComponentScan("org.entando")
@SuppressWarnings("PMD.UseUtilityClass")
public class EntandoPdaPluginJavaApplication {

    public static void main(final String[] args) {
        SpringApplication.run(EntandoPdaPluginJavaApplication.class, args);
    }

    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplateBuilder().build();
    }

}
