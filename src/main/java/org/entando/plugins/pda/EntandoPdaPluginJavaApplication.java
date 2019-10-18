package org.entando.plugins.pda;

import org.entando.connectionconfigconnector.config.ConnectionConfigConfiguration;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Import;

@SpringBootApplication
@ComponentScan("org.entando")
@Import(ConnectionConfigConfiguration.class)
@SuppressWarnings("PMD.UseUtilityClass")
public class EntandoPdaPluginJavaApplication {

    public static void main(final String[] args) {
        SpringApplication.run(EntandoPdaPluginJavaApplication.class, args);
    }
}
