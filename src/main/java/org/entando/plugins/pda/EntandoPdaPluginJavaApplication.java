package org.entando.plugins.pda;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@ComponentScan("org.entando")
public class EntandoPdaPluginJavaApplication {

    public static void main(final String[] args) {
        SpringApplication.run(EntandoPdaPluginJavaApplication.class, args);
    }

}
