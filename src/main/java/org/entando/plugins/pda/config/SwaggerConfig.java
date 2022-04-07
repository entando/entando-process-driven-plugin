package org.entando.plugins.pda.config;

import static java.util.Arrays.asList;
import static java.util.Collections.singletonList;

import com.fasterxml.classmate.TypeResolver;
import lombok.extern.slf4j.Slf4j;
import org.entando.plugins.pda.core.exception.ErrorResponse;
import org.entando.plugins.pda.core.exception.ValidationErrorResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import springfox.documentation.builders.PathSelectors;
import springfox.documentation.builders.RequestHandlerSelectors;
import springfox.documentation.builders.ResponseMessageBuilder;
import springfox.documentation.schema.ModelRef;
import springfox.documentation.service.ResponseMessage;
import springfox.documentation.spi.DocumentationType;
import springfox.documentation.spring.web.plugins.Docket;
import springfox.documentation.swagger2.annotations.EnableSwagger2;


@Slf4j
@Configuration
@EnableSwagger2
@ConditionalOnProperty(name = "swagger.enabled", havingValue = "true")
public class SwaggerConfig implements WebMvcConfigurer {

    private final SwaggerInfo info;

    @Autowired
    public SwaggerConfig(final SwaggerInfo info) {
        this.info = info;
    }

    @Bean
    public Docket createSwaggerApi(final TypeResolver typeResolver) {
        final ResponseMessage notFoundError = new ResponseMessageBuilder()
                .code(HttpStatus.NOT_FOUND.value())
                .message(
                        "Returned when an object cannot be found, wether be"
                                + " the main resource or something inside payload")
                .responseModel(new ModelRef("ErrorResponse"))
                .build();
        final ResponseMessage validationError = new ResponseMessageBuilder()
                .code(HttpStatus.UNPROCESSABLE_ENTITY.value())
                .message("Returned when a field is missing or malformed inside payload")
                .responseModel(new ModelRef("ValidationErrorResponse"))
                .build();

        return new Docket(DocumentationType.SWAGGER_2)
                .additionalModels(typeResolver.resolve(ErrorResponse.class))
                .additionalModels(typeResolver.resolve(ValidationErrorResponse.class))
                .useDefaultResponseMessages(false)
                .globalResponseMessage(RequestMethod.POST, asList(validationError, notFoundError))
                .globalResponseMessage(RequestMethod.PUT, asList(validationError, notFoundError))
                .globalResponseMessage(RequestMethod.GET, singletonList(notFoundError))
                .apiInfo(info.getApiInfo())
                .select()
                .apis(RequestHandlerSelectors.basePackage(info.getBasePackage()))
                .paths(PathSelectors.any())
                .build();
    }

    @Override
    public void addResourceHandlers(final ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/swagger-ui.html**")
                .addResourceLocations("classpath:/META-INF/resources/swagger-ui.html");
        registry.addResourceHandler("/webjars/**").addResourceLocations("classpath:/META-INF/resources/webjars/");
    }
}
