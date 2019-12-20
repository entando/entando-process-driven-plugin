import { shape, string, number, object } from 'prop-types';

export default shape({
  inlimit: string,
  application: string,
  incdownpayment: string,
  id: number,
  name: string,
  subject: string,
  desc: string,
  status: string,
  priority: number,
  skipable: string,
  owner: string,
  created: object,
  activated: object,
  processinstanceid: number,
  processdefinitionid: string,
  containerid: string,
  parentid: number,
});
