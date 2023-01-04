import { METHODS, DOMAINS } from '../constants';

import GROUPS from '../../mocks/pda/groups';
import makeRequest from '../makeRequest';

// eslint-disable-next-line import/prefer-default-export
export const getGroups = async connection =>
  makeRequest({
    domain: DOMAINS.PDA,
    uri: `/connections/${connection}/groups`,
    method: METHODS.GET,
    mockResponse: GROUPS,
    useAuthentication: true,
  });
