package org.entando.plugins.pda.service.impl;

import edu.umd.cs.findbugs.annotations.SuppressFBWarnings;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.NoSuchFileException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import lombok.extern.slf4j.Slf4j;
import org.entando.plugins.pda.exception.ConnectionNotFoundException;
import org.entando.plugins.pda.model.ConnectionConfig;
import org.entando.web.exception.InternalServerException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.yaml.snakeyaml.Yaml;
import org.yaml.snakeyaml.constructor.Constructor;

@Slf4j
@Component
public class ConnectionConfigConnectorFileSystem {

    private static final String CONFIG_YAML = "config.yaml";

    private final String rootDirectory;

    public ConnectionConfigConnectorFileSystem(
            @Value("${entando.connections.root:/etc/entando/connectionconfigs}") String rootDirectory) {
        this.rootDirectory = rootDirectory;
    }

    public ConnectionConfig getConnectionConfig(String configName) {
        try (InputStream inputStream = Files.newInputStream(Paths.get(rootDirectory, configName, CONFIG_YAML))) {
            Yaml yaml = new Yaml(new Constructor(ConnectionConfig.class));
            ConnectionConfig connectionConfig = yaml.load(inputStream);
            connectionConfig.setName(configName);
            return connectionConfig;
        } catch (NoSuchFileException e) {
            log.trace("Connection not found: {}", configName, e);
            throw new ConnectionNotFoundException(e);
        } catch (IOException e) {
            log.debug("Error retrieving configuration with name {}", configName, e);
            throw new InternalServerException(ConnectionConfigConnectorImpl.INTERNAL_ERROR_KEY, e);
        }
    }

    @SuppressFBWarnings("RCN_REDUNDANT_NULLCHECK_WOULD_HAVE_BEEN_A_NPE")
    public List<ConnectionConfig> getConnectionConfigs() {
        try (Stream<Path> stream = Files.walk(Paths.get(rootDirectory))) {
            return stream.map(Path::toFile)
                    .filter(File::isDirectory)
                    .filter(e -> !e.getAbsolutePath().equals(rootDirectory))
                    .map(File::getName)
                    .map(this::getConnectionConfig)
                    .collect(Collectors.toList());
        } catch (IOException e) {
            log.debug("Error retrieving all configurations", e);
            return Collections.emptyList();
        }
    }
}
