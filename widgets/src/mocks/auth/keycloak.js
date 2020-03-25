const mockKeycloak = () => {
  if (window) {
    window.entando = {
      keycloak: {
        authenticated: true,
        clientId: 'mock-client-id',
        resourceAccess: {
          'mock-client-id': {
            roles: [
              'task-list',
              'task-get',
              'task-definition-columns-list',
              'task-comments-list',
              'task-comments-get',
              'task-comments-create',
              'task-comments-delete',
              'task-form-get',
              'task-form-submit',
              'connection-list',
              'connection-get',
              'connection-create',
              'connection-edit',
              'connection-delete',
              'process-definition-list',
              'process-definition-form-get',
              'process-definition-form-submit',
              'summary-data-repository-list',
              'process-diagram',
              'group-list',
              'summary-list',
              'summary-get',
            ],
          },
        },
      },
    };
  }
};

export default mockKeycloak;
