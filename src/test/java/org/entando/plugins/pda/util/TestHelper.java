package org.entando.plugins.pda.util;

import com.google.common.collect.ImmutableMap;
import lombok.experimental.UtilityClass;
import org.apache.commons.lang3.RandomStringUtils;
import org.entando.plugins.pda.model.ConnectionConfig;

@UtilityClass
public class TestHelper {

    public static ConnectionConfig getRandomConnectionConfig() {
        return ConnectionConfig.builder()
                .name(RandomStringUtils.randomAlphabetic(10))
                .properties(ImmutableMap
                        .of(RandomStringUtils.randomAlphabetic(10), RandomStringUtils.randomAlphabetic(10),
                                RandomStringUtils.randomAlphabetic(10), RandomStringUtils.randomAlphabetic(10),
                                RandomStringUtils.randomAlphabetic(10), RandomStringUtils.randomAlphabetic(10)))
                .build();
    }
}
