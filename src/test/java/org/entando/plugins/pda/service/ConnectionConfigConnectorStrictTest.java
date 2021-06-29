package org.entando.plugins.pda.service;

import org.apache.commons.lang3.RandomStringUtils;
import org.entando.plugins.pda.exception.ConnectionNotFoundException;
import org.entando.plugins.pda.exception.InvalidStrictOperationException;
import org.entando.plugins.pda.model.ConnectionConfig;
import org.entando.plugins.pda.model.SecurityLevel;
import org.entando.plugins.pda.service.impl.ConnectionConfigConnectorFileSystem;
import org.entando.plugins.pda.service.impl.ConnectionConfigConnectorImpl;
import org.entando.plugins.pda.util.TestHelper;
import org.junit.Before;
import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.ExpectedException;
import org.junit.rules.TemporaryFolder;
import org.springframework.web.client.RestTemplate;
import org.yaml.snakeyaml.Yaml;
import org.yaml.snakeyaml.constructor.Constructor;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.List;

import static org.assertj.core.api.Java6Assertions.assertThat;
import static org.mockito.Mockito.mock;

@SuppressWarnings("PMD.TooManyMethods")
public class ConnectionConfigConnectorStrictTest {

    @Rule
    public TemporaryFolder rootDirectory = new TemporaryFolder();

    @Rule
    public ExpectedException expectedException = ExpectedException.none();

    private ConnectionConfigConnector connectionConfigConnector;

    @Before
    public void setUp() {
        ConnectionConfigConnectorFileSystem connectionConfigConnectorFileSystem = new ConnectionConfigConnectorFileSystem(
                rootDirectory.getRoot().getAbsolutePath());
        connectionConfigConnector = new ConnectionConfigConnectorImpl(SecurityLevel.STRICT.toString(),
                mock(RestTemplate.class), connectionConfigConnectorFileSystem);
    }

    @Test
    public void shouldGetConnectionConfigFromFileSystem() throws Exception {
        // Given
        ConnectionConfig configFile = createConfigFile();

        // When
        ConnectionConfig connectionConfig = connectionConfigConnector.getConnectionConfig(configFile.getName());

        assertThat(connectionConfig).isEqualTo(configFile);
    }

    @Test
    public void shouldThrowConnectionNotFoundException() {
        expectedException.expect(ConnectionNotFoundException.class);
        expectedException.expectMessage(ConnectionNotFoundException.MESSAGE_KEY);

        connectionConfigConnector.getConnectionConfig(RandomStringUtils.randomAlphabetic(10));
    }

    @Test
    public void shouldReturnAllConnectionConfigs() throws Exception {
        // Given
        ConnectionConfig fooConfig = createConfigFile();
        ConnectionConfig barConfig = createConfigFile();
        ConnectionConfig testConfig = createConfigFile();

        // When
        List<ConnectionConfig> connectionConfigs = connectionConfigConnector.getConnectionConfigs();

        // Then
        assertThat(connectionConfigs).containsExactlyInAnyOrder(fooConfig, barConfig, testConfig);
    }

    @Test
    public void shouldReturnEmptyListOnError() {
        // Given
        ConnectionConfigConnectorFileSystem connectionConfigConnectorFileSystem = new ConnectionConfigConnectorFileSystem(
                "/wrong_path");
        connectionConfigConnector = new ConnectionConfigConnectorImpl(SecurityLevel.STRICT.toString(),
                mock(RestTemplate.class), connectionConfigConnectorFileSystem);

        // When
        List<ConnectionConfig> connectionConfigs = connectionConfigConnector.getConnectionConfigs();

        // Then
        assertThat(connectionConfigs).isEmpty();
    }

    @Test
    public void shouldReturnEmptyListForEmptyDirectory() {
        // Given empty root directory
        // When
        List<ConnectionConfig> connectionConfigs = connectionConfigConnector.getConnectionConfigs();

        // Then
        assertThat(connectionConfigs).isEmpty();
    }

    @Test
    public void shouldRaiseExceptionWhenAddingOnStrictSecurityLevel() {
        expectedException.expect(InvalidStrictOperationException.class);
        expectedException.expectMessage(InvalidStrictOperationException.MESSAGE_KEY);

        ConnectionConfig connectionConfig = TestHelper.getRandomConnectionConfig();
        connectionConfigConnector.addConnectionConfig(connectionConfig);
    }

    @Test
    public void shouldRaiseExceptionWhenDeletingOnStrictSecurityLevel() {
        expectedException.expect(InvalidStrictOperationException.class);
        expectedException.expectMessage(InvalidStrictOperationException.MESSAGE_KEY);

        connectionConfigConnector.deleteConnectionConfig(RandomStringUtils.randomAlphabetic(10));
    }

    @Test
    public void shouldRaiseExceptionWhenEditingOnStrictSecurityLevel() {
        expectedException.expect(InvalidStrictOperationException.class);
        expectedException.expectMessage(InvalidStrictOperationException.MESSAGE_KEY);

        ConnectionConfig connectionConfig = TestHelper.getRandomConnectionConfig();
        connectionConfigConnector.editConnectionConfig(connectionConfig);
    }

    private ConnectionConfig createConfigFile() throws IOException {
        ConnectionConfig connectionConfig = TestHelper.getRandomConnectionConfig();
        File configDirectory = rootDirectory.newFolder(connectionConfig.getName());
        Yaml yaml = new Yaml(new Constructor(ConnectionConfig.class));
        String yamlString = yaml.dump(connectionConfig);
        Files.write(Paths.get(configDirectory.getAbsolutePath(), "config.yaml"), yamlString.getBytes());
        return connectionConfig;
    }
}
