package org.entando.plugins.pda.dto.connection;

import lombok.NoArgsConstructor;
import org.entando.web.response.SimpleRestResponse;

import java.util.Map;

@NoArgsConstructor
public class ConfigServiceConnectionsResponse extends SimpleRestResponse<Map<String,ConnectionDto>> {
    public ConfigServiceConnectionsResponse(Map<String, ConnectionDto> payload) {
        super(payload);
    }
}
