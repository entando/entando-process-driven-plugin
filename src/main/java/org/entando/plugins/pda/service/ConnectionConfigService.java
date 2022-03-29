package org.entando.plugins.pda.service;

import io.fabric8.kubernetes.api.model.Secret;
import io.fabric8.kubernetes.client.KubernetesClient;
import io.fabric8.kubernetes.client.dsl.Resource;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Base64;
import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;
import lombok.extern.slf4j.Slf4j;
import org.entando.kubernetes.model.plugin.DoneableEntandoPlugin;
import org.entando.kubernetes.model.plugin.EntandoPlugin;
import org.entando.kubernetes.model.plugin.EntandoPluginOperationFactory;
import org.entando.kubernetes.model.plugin.EntandoPluginSpec;
import org.entando.kubernetes.model.plugin.EntandoPluginSpecBuilder;
import org.entando.plugins.pda.model.ConnectionConfig;
import org.entando.plugins.pda.util.YamlUtils;
import org.entando.web.exception.ConflictException;
import org.entando.web.exception.NotFoundException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class ConnectionConfigService {

    public static final String API_VERSION = "v1";
    public static final String CONFIG_YAML = "config.yaml";
    private static final String OPAQUE_TYPE = "Opaque";

    public static final String ERROR_PLUGIN_NOT_FOUND = "org.entando.error.plugin.notFound";
    public static final String ERROR_SECRET_NOT_FOUND = "org.entando.error.secret.notFound";
    public static final String ERROR_SECRET_ALREADY_EXISTS = "org.entando.error.secret.alreadyExists";
    public static final String PROCESSING_INSTRUCTION_ANNOTATION = "entando.org/processing-instruction";
    public static final String IGNORE_VALUE = "ignore";

    private KubernetesClient client;
    private final String entandoPluginName;

    public ConnectionConfigService(KubernetesClient client,
            @Value("#{'${entando.resource.name}' > '' ? '${entando.resource.name}' : '${entando.plugin.name}'}")
            String entandoPluginName) {
        this.client = client;
        this.entandoPluginName = entandoPluginName;
    }

    // for testing
    public void setClient(KubernetesClient client) {
        this.client = client;
    }

    public void addConnectionConfig(ConnectionConfig connectionConfig) {
        EntandoPlugin entandoPlugin = entandoPlugin().get();
        if (entandoPlugin == null) {
            throw new NotFoundException(ERROR_PLUGIN_NOT_FOUND);
        }
        ensureAnnotations(entandoPlugin);
        Set<String> connectionConfigNames = new HashSet<>();
        if (entandoPlugin.getSpec().getConnectionConfigNames() != null) {
            connectionConfigNames.addAll(entandoPlugin.getSpec().getConnectionConfigNames());
        }
        connectionConfigNames.add(connectionConfig.getName());
        EntandoPluginSpec newSpec = new EntandoPluginSpecBuilder(entandoPlugin.getSpec())
                .withConnectionConfigNames(new ArrayList<>(connectionConfigNames))
                .build();
        entandoPlugin.setSpec(newSpec);
        entandoPlugin().createOrReplace(entandoPlugin);

        Secret secret = client.secrets().inNamespace(client.getConfiguration().getNamespace())
                .withName(connectionConfig.getName())
                .get();
        if (secret != null) {
            throw new ConflictException(ERROR_SECRET_ALREADY_EXISTS);
        }
        client.secrets().inNamespace(client.getConfiguration().getNamespace()).createNew()
                .withApiVersion(API_VERSION)
                .withNewMetadata().withName(connectionConfig.getName()).endMetadata()
                .withStringData(Collections.singletonMap(CONFIG_YAML, YamlUtils.toYaml(connectionConfig)))
                .withType(OPAQUE_TYPE)
                .done();
    }

    private void ensureAnnotations(EntandoPlugin entandoPlugin) {
        Map<String, String> annotations = entandoPlugin.getMetadata().getAnnotations();
        if (annotations == null) {
            annotations = new HashMap<>();
        }
        String processingInstruction = annotations.get(PROCESSING_INSTRUCTION_ANNOTATION);
        if (processingInstruction == null || !processingInstruction.equals(IGNORE_VALUE)) {
            annotations.put(PROCESSING_INSTRUCTION_ANNOTATION, IGNORE_VALUE);
            entandoPlugin.getMetadata().setAnnotations(annotations);
            entandoPlugin().createOrReplace(entandoPlugin);
        }
    }

    public ConnectionConfig getConnectionConfig(String name) {
        EntandoPlugin entandoPlugin = entandoPlugin().get();
        if (entandoPlugin == null) {
            throw new NotFoundException(ERROR_PLUGIN_NOT_FOUND);
        }
        if (entandoPlugin.getSpec().getConnectionConfigNames().contains(name)) {
            Secret secret = client.secrets().withName(name).get();
            return fromSecret(secret);
        }
        throw new NotFoundException(ERROR_SECRET_NOT_FOUND);
    }

    public List<ConnectionConfig> getAllConnectionConfig() {
        EntandoPlugin entandoPlugin = entandoPlugin().get();
        if (entandoPlugin == null) {
            throw new NotFoundException(ERROR_PLUGIN_NOT_FOUND);
        }
        List<String> configs = entandoPlugin.getSpec().getConnectionConfigNames() == null ? new ArrayList<>()
                : entandoPlugin.getSpec().getConnectionConfigNames();

        return configs.stream()
                .map(name -> client.secrets().withName(name).get())
                .map(this::fromSecret)
                .collect(Collectors.toList());
    }

    public void removeConnectionConfig(String configName) {
        EntandoPlugin entandoPlugin = entandoPlugin().get();
        ensureAnnotations(entandoPlugin);
        entandoPlugin.getSpec().getConnectionConfigNames().remove(configName);
        entandoPlugin().createOrReplace(entandoPlugin);

        client.secrets().withName(configName).delete();
    }

    private ConnectionConfig fromSecret(Secret secret) {
        if (secret != null && secret.getStringData() != null && secret.getStringData().get(CONFIG_YAML) != null) {
            return YamlUtils.fromYaml(secret.getStringData().get(CONFIG_YAML));
        }
        if (secret != null && secret.getData() != null && secret.getData().get(CONFIG_YAML) != null) {
            byte[] decodedBytes = Base64.getDecoder().decode(secret.getData().get(CONFIG_YAML));
            return YamlUtils.fromYaml(new String(decodedBytes, StandardCharsets.UTF_8));
        }
        throw new NotFoundException(ERROR_SECRET_NOT_FOUND);
    }

    private Resource<EntandoPlugin, DoneableEntandoPlugin> entandoPlugin() {
        return EntandoPluginOperationFactory.produceAllEntandoPlugins(client)
                .inNamespace(client.getConfiguration().getNamespace()).withName(entandoPluginName);
    }

    public ConnectionConfig editConnectionConfig(ConnectionConfig configDto) {
        EntandoPlugin entandoPlugin = entandoPlugin().get();
        if (entandoPlugin == null) {
            throw new NotFoundException(ERROR_PLUGIN_NOT_FOUND);
        }
        ensureAnnotations(entandoPlugin);
        Secret secret = client.secrets().inNamespace(client.getConfiguration().getNamespace())
                .withName(configDto.getName())
                .get();
        if (secret == null) {
            throw new NotFoundException(ERROR_SECRET_NOT_FOUND);
        }
        secret.setStringData(Collections.singletonMap(CONFIG_YAML, YamlUtils.toYaml(configDto)));
        client.secrets().inNamespace(client.getConfiguration().getNamespace())
                .withName(configDto.getName())
                .createOrReplace(secret);

        return configDto;
    }
}
