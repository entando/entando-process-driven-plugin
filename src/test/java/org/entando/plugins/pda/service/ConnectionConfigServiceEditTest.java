package org.entando.plugins.pda.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.entando.plugins.pda.util.EntandoPluginTestHelper.ENTANDO_PLUGIN_NAME;

import com.google.common.collect.ImmutableMap;
import io.fabric8.kubernetes.api.model.Secret;
import io.fabric8.kubernetes.client.KubernetesClient;
import io.fabric8.kubernetes.client.server.mock.EnableKubernetesMockClient;
import org.apache.commons.lang3.RandomStringUtils;
import org.assertj.core.api.Assertions;
import org.entando.plugins.pda.model.ConnectionConfig;
import org.entando.plugins.pda.util.EntandoPluginTestHelper;
import org.entando.plugins.pda.util.YamlUtils;
import org.entando.web.exception.NotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.SpringBootTest.WebEnvironment;

@SpringBootTest(webEnvironment = WebEnvironment.RANDOM_PORT)
@EnableKubernetesMockClient(crud = true, https = false)
class ConnectionConfigServiceEditTest {

    private ConnectionConfigService connectionConfigService;

    static KubernetesClient client;

    @BeforeEach
    public void setUp() {
        connectionConfigService = new ConnectionConfigService(client, ENTANDO_PLUGIN_NAME);
    }

    @Test
    void shouldEditConnectionConfig() throws Exception {
        // Given
        ConnectionConfig configDto = EntandoPluginTestHelper.getRandomConnectionConfigDto();
        EntandoPluginTestHelper.createSecret(client, configDto);
        EntandoPluginTestHelper.createEntandoPluginWithConfigNames(client, ENTANDO_PLUGIN_NAME, configDto.getName());

        // When
        configDto.setProperties(ImmutableMap
                .of(RandomStringUtils.randomAlphabetic(10), RandomStringUtils.randomAlphabetic(10),
                        RandomStringUtils.randomAlphabetic(10), RandomStringUtils.randomAlphabetic(10)));
        ConnectionConfig fromService = connectionConfigService.editConnectionConfig(configDto);

        // Then
        assertThat(fromService).isEqualTo(configDto);
        Secret secret = client.secrets().withName(configDto.getName()).get();
        ConnectionConfig fromYaml = YamlUtils
                .fromYaml(secret.getStringData().get(ConnectionConfigService.CONFIG_YAML));
        assertThat(fromYaml).isEqualTo(configDto);
    }

    @Test
    void shouldRaiseNotFoundExceptionWhenTryingToEditAndPluginIsNotThere() throws Exception {
        EntandoPluginTestHelper.deleteEntandoPlugin(client, ENTANDO_PLUGIN_NAME);
        Assertions.assertThatThrownBy(() -> {
            EntandoPluginTestHelper.createEntandoPluginCrd(client);
            ConnectionConfig configDto = EntandoPluginTestHelper.getRandomConnectionConfigDto();
            EntandoPluginTestHelper.createSecret(client, configDto);

            connectionConfigService.editConnectionConfig(configDto);
        }).isInstanceOf(NotFoundException.class)
                .hasMessage(ConnectionConfigService.ERROR_PLUGIN_NOT_FOUND);
    }

    @Test
    void shouldRaiseNotFoundExceptionWhenTryingToEditAndSecretIsNotThere() throws Exception {
        Assertions.assertThatThrownBy(() -> {
            ConnectionConfig configDto = EntandoPluginTestHelper.getRandomConnectionConfigDto();
            EntandoPluginTestHelper.createEntandoPluginWithConfigNames(client, ENTANDO_PLUGIN_NAME, configDto.getName());

            connectionConfigService.editConnectionConfig(configDto);
        }).isInstanceOf(NotFoundException.class)
                .hasMessage(ConnectionConfigService.ERROR_SECRET_NOT_FOUND);
    }
}
