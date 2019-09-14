package org.entando.plugins.pda.engine;

import org.entando.plugins.pda.core.engine.FakeEngine;
import org.entando.plugins.pda.pam.engine.KieEngine;
import org.junit.Before;
import org.junit.Test;
import org.springframework.context.ApplicationContext;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

public class EngineFactoryUnitTest {

    private ApplicationContext applicationContext;
    private EngineFactory engineFactory;

    @Before
    public void setup() {
        applicationContext = mock(ApplicationContext.class);

        when(applicationContext.getBean(eq(KieEngine.class)))
            .thenReturn(new KieEngine(null));

        when(applicationContext.getBean(eq(FakeEngine.class)))
                .thenReturn(new FakeEngine(null));

        engineFactory = new EngineFactory();
        engineFactory.setApplicationContext(applicationContext);
    }

    @Test
    public void testFakeEngine() {
        verify(applicationContext).getBean(eq(FakeEngine.class));

        assertThat(engineFactory.getEngine(FakeEngine.TYPE)).isInstanceOf(FakeEngine.class);
    }

    @Test
    public void testKieEngine() {
        verify(applicationContext).getBean(eq(KieEngine.class));

        assertThat(engineFactory.getEngine(KieEngine.TYPE)).isInstanceOf(KieEngine.class);
    }
}
