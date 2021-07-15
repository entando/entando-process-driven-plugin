package org.entando.plugins.pda.service;

import static org.assertj.core.api.Java6Assertions.assertThat;
import static org.entando.plugins.pda.service.ConnectionConfigService.IGNORE_VALUE;
import static org.entando.plugins.pda.service.ConnectionConfigService.PROCESSING_INSTRUCTION_ANNOTATION;
import static org.entando.plugins.pda.util.EntandoPluginTestHelper.ENTANDO_PLUGIN_NAME;

import io.fabric8.kubernetes.client.KubernetesClient;
import io.fabric8.kubernetes.client.server.mock.EnableKubernetesMockClient;
import org.assertj.core.api.Assertions;
import org.entando.kubernetes.model.plugin.EntandoPlugin;
import org.entando.plugins.pda.model.ConnectionConfig;
import org.entando.plugins.pda.util.EntandoPluginTestHelper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.SpringBootTest.WebEnvironment;

@SpringBootTest(webEnvironment = WebEnvironment.RANDOM_PORT)
@EnableKubernetesMockClient(crud = true, https = false)
class ConnectionConfigServiceDeleteTest {

    private ConnectionConfigService connectionConfigService;

    static KubernetesClient client;

    @BeforeEach
    public void setUp() {
        connectionConfigService = new ConnectionConfigService(client, ENTANDO_PLUGIN_NAME);
    }

    @Test
    void shouldRemoveConnectionConfig() throws Exception {
        // Given
        ConnectionConfig configDto = EntandoPluginTestHelper.getRandomConnectionConfigDto();
        EntandoPluginTestHelper.createSecret(client, configDto);
        EntandoPluginTestHelper.createEntandoPluginWithConfigNames(client, ENTANDO_PLUGIN_NAME, configDto.getName());

        // When
        connectionConfigService.removeConnectionConfig(configDto.getName());

        // Then
        EntandoPlugin entandoPlugin = EntandoPluginTestHelper.getEntandoPlugin(client, ENTANDO_PLUGIN_NAME);
        assertThat(entandoPlugin.getSpec().getConnectionConfigNames()).doesNotContain(configDto.getName());
        assertThat(client.secrets().withName(configDto.getName()).get()).isNull();
        Assertions.assertThat(entandoPlugin.getMetadata().getAnnotations())
                .containsEntry(PROCESSING_INSTRUCTION_ANNOTATION, IGNORE_VALUE);
    }
}
