import { shape, string } from 'prop-types';

export default shape({
  knowledgeSource: string,
  process: string,
  options: string,
  groups: string,
  columns: string,
});
