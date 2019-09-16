package org.entando.plugins.pda.engine;

import org.entando.plugins.pda.core.engine.Engine;
import org.entando.plugins.pda.core.engine.FakeEngine;
import org.entando.plugins.pda.pam.engine.KieEngine;
import org.junit.Before;
import org.junit.Test;
import org.springframework.context.ApplicationContext;

import java.util.ArrayList;
import java.util.List;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

public class EngineFactoryUnitTest {

    private ApplicationContext applicationContext;
    private EngineFactory engineFactory;

    @Before
    public void setup() {
        applicationContext = mock(ApplicationContext.class);

        List<Engine> availableEngines = new ArrayList<>();
        availableEngines.add(new FakeEngine(null));

        engineFactory = new EngineFactory();
        engineFactory.setAvailableEngines(availableEngines);
    }

    @Test
    public void testFakeEngine() {
        verify(applicationContext).getBean(eq(FakeEngine.class));

        assertThat(engineFactory.getEngine(FakeEngine.TYPE)).isInstanceOf(FakeEngine.class);
    }
}
