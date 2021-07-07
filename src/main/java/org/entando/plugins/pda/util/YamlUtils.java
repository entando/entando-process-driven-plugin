package org.entando.plugins.pda.util;

import lombok.experimental.UtilityClass;
import org.entando.plugins.pda.model.ConnectionConfig;
import org.yaml.snakeyaml.DumperOptions;
import org.yaml.snakeyaml.DumperOptions.FlowStyle;
import org.yaml.snakeyaml.Yaml;
import org.yaml.snakeyaml.constructor.Constructor;
import org.yaml.snakeyaml.nodes.Tag;
import org.yaml.snakeyaml.representer.Representer;

@UtilityClass
public class YamlUtils {

    public static String toYaml(ConnectionConfig connectionConfig) {
        Representer representer = new Representer();
        representer.addClassTag(ConnectionConfig.class, Tag.MAP);
        DumperOptions dumperOptions = new DumperOptions();
        dumperOptions.setDefaultFlowStyle(FlowStyle.BLOCK);
        return new Yaml(representer, dumperOptions).dump(connectionConfig);
    }

    public static ConnectionConfig fromYaml(String yaml) {
        return new Yaml(new Constructor(ConnectionConfig.class)).load(yaml);
    }
}
