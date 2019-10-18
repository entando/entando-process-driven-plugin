package org.entando.plugins.pda.widget;

import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;

import com.kjetland.jackson.jsonSchema.JsonSchemaGenerator;
import org.entando.plugins.pda.exception.WidgetSchemaNotFoundException;
import org.entando.plugins.pda.widget.model.WidgetType;
import org.junit.Before;
import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.ExpectedException;

public class WidgetSchemaFactoryUnitTest {

    private WidgetSchemaFactory widgetSchemaFactory;

    private JsonSchemaGenerator schemaGen;

    @Rule
    public ExpectedException expectedException = ExpectedException.none();

    @Before
    public void setup() {
        schemaGen = mock(JsonSchemaGenerator.class);
        widgetSchemaFactory = new WidgetSchemaFactory(schemaGen);
    }

    @Test
    public void testInvalidWidgetType() {
        expectedException.expect(WidgetSchemaNotFoundException.class);

        widgetSchemaFactory.getSchema("invalid");
    }

    @Test
    public void testNullWidgetTypeName() {
        expectedException.expect(WidgetSchemaNotFoundException.class);

        widgetSchemaFactory.getSchema((String) null);
    }

    @Test
    public void testNullWidgetType() {
        expectedException.expect(WidgetSchemaNotFoundException.class);

        widgetSchemaFactory.getSchema((WidgetType) null);
    }

    @Test
    public void testTaskListWidgetTypeName() {
        widgetSchemaFactory.getSchema(WidgetType.TASK_LIST.code());

        verify(schemaGen).generateJsonSchema(WidgetType.TASK_LIST.schema());
    }

    @Test
    public void testTaskListWidgetType() {
        widgetSchemaFactory.getSchema(WidgetType.TASK_LIST);

        verify(schemaGen).generateJsonSchema(WidgetType.TASK_LIST.schema());
    }
}
