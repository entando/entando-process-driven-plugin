import { shape, string, array } from 'prop-types';

export default shape({
  knowledgeSource: string,
  process: string,
  options: array,
  groups: array,
  columns: array,
});
