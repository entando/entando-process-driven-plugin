package org.entando.plugins.pda.dto.connection;

import java.util.Map;
import lombok.NoArgsConstructor;
import org.entando.web.response.SimpleRestResponse;

@NoArgsConstructor
public class ConfigServiceConnectionsResponse extends SimpleRestResponse<Map<String,ConnectionDto>> {
    public ConfigServiceConnectionsResponse(Map<String, ConnectionDto> payload) {
        super(payload);
    }
}
