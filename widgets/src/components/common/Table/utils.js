/* eslint-disable react/display-name */
import moment from 'moment';

export function compareDates(accessor, sortOrder) {
  return (rowA, rowB) => {
    const dateA = rowA[accessor];
    const dateB = rowB[accessor];
    if (sortOrder === 'asc') {
      if (moment(dateA).isBefore(dateB)) {
        return -1;
      }
      if (moment(dateB).isBefore(dateA)) {
        return 1;
      }
      return 0;
    }
    if (moment(dateA).isBefore(dateB)) {
      return 1;
    }
    if (moment(dateB).isBefore(dateA)) {
      return -1;
    }
    return 0;
  };
}

export function compareStrings(accessor, sortOrder) {
  return (rowA, rowB) => {
    const stringA = rowA[accessor] ? rowA[accessor].toUpperCase() : '';
    const stringB = rowB[accessor] ? rowB[accessor].toUpperCase() : '';
    if (sortOrder === 'asc') {
      if (stringA < stringB) {
        return -1;
      }
      if (stringA > stringB) {
        return 1;
      }
      return 0;
    }
    if (stringA < stringB) {
      return 1;
    }
    if (stringA > stringB) {
      return -1;
    }
    return 0;
  };
}

export function compareNumbers(accessor, sortOrder) {
  return (rowA, rowB) => {
    const numberA = rowA[accessor];
    const numberB = rowB[accessor];
    if (sortOrder === 'asc') {
      return numberA - numberB;
    }
    return numberB - numberA;
  };
}
