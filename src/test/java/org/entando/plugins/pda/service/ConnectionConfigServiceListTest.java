package org.entando.plugins.pda.service;

import static org.assertj.core.api.Java6Assertions.assertThat;
import static org.entando.plugins.pda.util.EntandoPluginTestHelper.ENTANDO_PLUGIN_NAME;

import io.fabric8.kubernetes.client.KubernetesClient;
import io.fabric8.kubernetes.client.server.mock.EnableKubernetesMockClient;
import java.util.List;
import org.assertj.core.api.Assertions;
import org.entando.plugins.pda.model.ConnectionConfig;
import org.entando.plugins.pda.util.EntandoPluginTestHelper;
import org.entando.web.exception.NotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.SpringBootTest.WebEnvironment;

@SpringBootTest(webEnvironment = WebEnvironment.RANDOM_PORT)
@EnableKubernetesMockClient(crud = true, https = false)
class ConnectionConfigServiceListTest {

    private ConnectionConfigService connectionConfigService;

    static KubernetesClient client;

    @BeforeEach
    public void setUp() {
        connectionConfigService = new ConnectionConfigService(client, ENTANDO_PLUGIN_NAME);
    }

    @Test
    void shouldGetAllConnectionConfigs() throws Exception {
        // Given
        ConnectionConfig configDto1 = EntandoPluginTestHelper.getRandomConnectionConfigDto();
        ConnectionConfig configDto2 = EntandoPluginTestHelper.getRandomConnectionConfigDto();
        ConnectionConfig configDto3 = EntandoPluginTestHelper.getRandomConnectionConfigDto();
        EntandoPluginTestHelper.createSecret(client, configDto1);
        EntandoPluginTestHelper.createSecret(client, configDto2);
        EntandoPluginTestHelper.createSecret(client, configDto3);
        EntandoPluginTestHelper.createEntandoPluginWithConfigNames(client, ENTANDO_PLUGIN_NAME, configDto1.getName(),
                configDto2.getName());

        // When
        List<ConnectionConfig> configDtos = connectionConfigService.getAllConnectionConfig();

        // Then
        assertThat(configDtos).containsExactlyInAnyOrder(configDto1, configDto2);
        assertThat(configDtos).doesNotContain(configDto3);
    }

    @Test
    void shouldReturnEmptyListForNonExistingConfigs() throws Exception {
        EntandoPluginTestHelper.createEntandoPlugin(client, ENTANDO_PLUGIN_NAME);

        List<ConnectionConfig> allConnectionConfig = connectionConfigService.getAllConnectionConfig();

        assertThat(allConnectionConfig).isEmpty();
    }

    @Test
    void shouldRaiseNotFoundExceptionIfPluginIsNotThere() throws Exception {
        EntandoPluginTestHelper.deleteEntandoPlugin(client, ENTANDO_PLUGIN_NAME);
        Assertions.assertThatThrownBy(() -> {
            EntandoPluginTestHelper.createEntandoPluginCrd(client);

            connectionConfigService.getAllConnectionConfig();
        }).isInstanceOf(NotFoundException.class)
                .hasMessage(ConnectionConfigService.ERROR_PLUGIN_NOT_FOUND);
    }
}
