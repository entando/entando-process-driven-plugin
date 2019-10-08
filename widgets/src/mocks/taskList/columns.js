import { compareDates, compareNumbers, compareStrings } from 'components/common/Table/utils';
import DateCell from 'components/common/Table/custom/DateCell';
import ActionCell from 'components/common/Table/custom/ActionCell';

const columns = [
  {
    header: 'Action',
    accessor: 'action',
    customCell: ActionCell,
    styles: {
      position: 'sticky',
      left: 0,
      background: 'white',
      width: 20,
      zIndex: 100,
      borderRight: '1px solid #eee',
      paddingRight: 16,
      textAlign: 'center',
    },
  },
  {
    header: 'Inlimit',
    accessor: 'inlimit',
    sortFunction: compareStrings,
  },
  {
    header: 'Application',
    accessor: 'application',
    sortFunction: compareStrings,
  },
  {
    header: 'Inc Down Payment',
    accessor: 'incdownpayment',
    sortFunction: compareStrings,
  },
  {
    header: 'ID',
    accessor: 'id',
    sortFunction: compareNumbers,
  },
  {
    header: 'Name',
    accessor: 'name',
    sortFunction: compareStrings,
  },
  {
    header: 'Subject',
    accessor: 'subject',
    sortFunction: compareStrings,
  },
  {
    header: 'Description',
    accessor: 'desc',
    sortFunction: compareStrings,
  },
  {
    header: 'Status',
    accessor: 'status',
    sortFunction: compareStrings,
  },
  {
    header: 'Priority',
    accessor: 'priority',
    sortFunction: compareNumbers,
  },
  {
    header: 'Skipable',
    accessor: 'skipable',
    sortFunction: compareStrings,
  },
  {
    header: 'Owner',
    accessor: 'owner',
    sortFunction: compareStrings,
  },
  {
    header: 'Created',
    accessor: 'created',
    sortFunction: compareDates,
    customCell: DateCell('created'),
  },
  {
    header: 'Activated',
    accessor: 'activated',
    sortFunction: compareDates,
    customCell: DateCell('activated'),
  },
  {
    header: 'Process Instance ID',
    accessor: 'processinstanceid',
    sortFunction: compareStrings,
  },
  {
    header: 'Process Definition ID',
    accessor: 'processdefinitionid',
    sortFunction: compareStrings,
  },
  {
    header: 'Container ID',
    accessor: 'containerId',
    sortFunction: compareStrings,
  },
  {
    header: 'Parent ID',
    accessor: 'parentid',
    sortFunction: compareNumbers,
  },
];

export default columns;
