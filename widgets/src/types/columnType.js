import { shape, string, object, func } from 'prop-types';

export default shape({
  header: string,
  accessor: string,
  align: string,
  styles: object,
  sortFunction: func,
});
