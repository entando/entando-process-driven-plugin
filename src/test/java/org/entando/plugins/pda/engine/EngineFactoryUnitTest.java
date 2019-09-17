package org.entando.plugins.pda.engine;

import org.entando.plugins.pda.core.engine.Engine;
import org.entando.plugins.pda.core.engine.FakeEngine;
import org.junit.Before;
import org.junit.Test;

import java.util.ArrayList;
import java.util.List;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;

public class EngineFactoryUnitTest {
    private EngineFactory engineFactory;

    @Before
    public void setup() {
        List<Engine> availableEngines = new ArrayList<>();
        availableEngines.add(new FakeEngine(null));

        engineFactory = new EngineFactory();
        engineFactory.setAvailableEngines(availableEngines);
    }

    @Test
    public void testFakeEngine() {
        assertThat(engineFactory.getEngine(FakeEngine.TYPE)).isInstanceOf(FakeEngine.class);
    }
}
