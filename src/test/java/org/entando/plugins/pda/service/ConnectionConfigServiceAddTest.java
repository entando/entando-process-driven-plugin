package org.entando.plugins.pda.service;

import static org.assertj.core.api.Java6Assertions.assertThat;
import static org.entando.plugins.pda.util.EntandoPluginTestHelper.ENTANDO_PLUGIN_NAME;

import io.fabric8.kubernetes.api.model.Secret;
import io.fabric8.kubernetes.api.model.apiextensions.CustomResourceDefinition;
import io.fabric8.kubernetes.client.KubernetesClient;
import io.fabric8.kubernetes.client.server.mock.EnableKubernetesMockClient;
import org.assertj.core.api.Assertions;
import org.assertj.core.api.SoftAssertions;
import org.entando.kubernetes.model.plugin.DoneableEntandoPlugin;
import org.entando.kubernetes.model.plugin.EntandoPlugin;
import org.entando.kubernetes.model.plugin.EntandoPluginList;
import org.entando.plugins.pda.model.ConnectionConfig;
import org.entando.plugins.pda.util.EntandoPluginTestHelper;
import org.entando.plugins.pda.util.YamlUtils;
import org.entando.web.exception.ConflictException;
import org.entando.web.exception.NotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.SpringBootTest.WebEnvironment;

@SpringBootTest(webEnvironment = WebEnvironment.RANDOM_PORT)
@EnableKubernetesMockClient(crud = true, https = false)
class ConnectionConfigServiceAddTest {

    public SoftAssertions safely = new SoftAssertions();

    private ConnectionConfigService connectionConfigService;

    static KubernetesClient client;

    @BeforeEach
    public void setUp() {
        connectionConfigService = new ConnectionConfigService(client, ENTANDO_PLUGIN_NAME);
    }

    @Test
    void shouldAddConfigAsSecret() throws Exception {
        // Given
        EntandoPluginTestHelper.createEntandoPlugin(client, ENTANDO_PLUGIN_NAME);
        ConnectionConfig configDto = EntandoPluginTestHelper.getRandomConnectionConfigDto();

        // When
        connectionConfigService.addConnectionConfig(configDto);

        // Then
        Secret secret = client.secrets().withName(configDto.getName()).get();
        safely.assertThat(secret.getMetadata().getName()).isEqualTo(configDto.getName());
        ConnectionConfig fromYaml = YamlUtils
                .fromYaml(secret.getStringData().get(ConnectionConfigService.CONFIG_YAML));
        safely.assertThat(fromYaml.getName()).isEqualTo(configDto.getName());
        safely.assertThat(fromYaml.getProperties()).isEqualTo(configDto.getProperties());
        EntandoPlugin entandoPlugin = EntandoPluginTestHelper.getEntandoPlugin(client, ENTANDO_PLUGIN_NAME);
        safely.assertThat(entandoPlugin.getSpec().getConnectionConfigNames()).contains(configDto.getName());
    }

    @Test
    void shouldAddConnectionConfigNameToPluginResource() throws Exception {
        // Given
        EntandoPluginTestHelper.createEntandoPlugin(client, ENTANDO_PLUGIN_NAME);
        ConnectionConfig configDto = EntandoPluginTestHelper.getRandomConnectionConfigDto();

        // When
        connectionConfigService.addConnectionConfig(configDto);

        // Then
        CustomResourceDefinition definition = EntandoPluginTestHelper.getEntandoPluginCrd(client);
        EntandoPlugin retrievedPlugin = client
                .customResources(definition, EntandoPlugin.class, EntandoPluginList.class, DoneableEntandoPlugin.class)
                .withName(ENTANDO_PLUGIN_NAME).get();
        assertThat(retrievedPlugin.getSpec().getConnectionConfigNames()).contains(configDto.getName());
    }

    @Test
    void shouldRaiseExceptionWhenAddingConfigAndCrdIsNotThere() {
        EntandoPluginTestHelper.deleteEntandoPlugin(client, ENTANDO_PLUGIN_NAME);
        Assertions.assertThatThrownBy(() -> {
            ConnectionConfig configDto = EntandoPluginTestHelper.getRandomConnectionConfigDto();

            connectionConfigService.addConnectionConfig(configDto);
        }).isInstanceOf(NotFoundException.class)
                .hasMessage(ConnectionConfigService.ERROR_PLUGIN_NOT_FOUND);
    }

    @Test
    void shouldRaiseExceptionWhenAddingConfigAndPluginIsNotThere() throws Exception {
        Assertions.assertThatThrownBy(() -> {
            EntandoPluginTestHelper.createEntandoPluginCrd(client);

            ConnectionConfig configDto = EntandoPluginTestHelper.getRandomConnectionConfigDto();

            connectionConfigService.addConnectionConfig(configDto);
        }).isInstanceOf(NotFoundException.class);
    }

    @Test
    void shouldRaiseExceptionWhenAddingConnectionWithSameName() throws Exception {
        Assertions.assertThatThrownBy(() -> {
            EntandoPluginTestHelper.createEntandoPluginCrd(client);
            EntandoPluginTestHelper.createEntandoPlugin(client, ENTANDO_PLUGIN_NAME);
            ConnectionConfig configDto = EntandoPluginTestHelper.getRandomConnectionConfigDto();

            connectionConfigService.addConnectionConfig(configDto);
            connectionConfigService.addConnectionConfig(configDto);
        }).isInstanceOf(ConflictException.class)
                .hasMessage(ConnectionConfigService.ERROR_SECRET_ALREADY_EXISTS);
    }

    @Test
    void shouldNotDuplicateConnectionConfigNamesOnPlugin() throws Exception {
        // Given
        EntandoPluginTestHelper.createEntandoPluginCrd(client);
        EntandoPluginTestHelper.createEntandoPlugin(client, ENTANDO_PLUGIN_NAME);
        ConnectionConfig configDto = EntandoPluginTestHelper.getRandomConnectionConfigDto();

        // When
        try {
            connectionConfigService.addConnectionConfig(configDto);
            connectionConfigService.addConnectionConfig(configDto);
        } catch (ConflictException e) { // NOPMD
            // do nothing
        }

        // Then
        EntandoPlugin entandoPlugin = EntandoPluginTestHelper.getEntandoPlugin(client, ENTANDO_PLUGIN_NAME);
        assertThat(entandoPlugin.getSpec().getConnectionConfigNames()).doesNotHaveDuplicates();
    }
}
