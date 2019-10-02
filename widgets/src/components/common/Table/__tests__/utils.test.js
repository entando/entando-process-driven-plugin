import moment from 'moment';

import { compareDates, compareNumbers, compareStrings } from 'components/common/Table/utils';

describe('compareDates function', () => {
  const now = { date: moment() };
  const yesterday = { date: moment().subtract(1, 'days') };

  const compareFnAsc = compareDates('date', 'asc');

  it('compares two non sorted dates properly (asc)', () => {
    expect(compareFnAsc(now, yesterday)).toBe(1);
  });

  it('compares two sorted dates properly (asc)', () => {
    expect(compareFnAsc(yesterday, now)).toBe(-1);
  });

  it('compares two equal dates properly (asc)', () => {
    expect(compareFnAsc(now, now)).toBe(0);
  });

  const compareFnDesc = compareDates('date', 'desc');

  it('compares two non sorted dates properly (desc)', () => {
    expect(compareFnDesc(yesterday, now)).toBe(1);
  });

  it('compares two sorted dates properly (desc)', () => {
    expect(compareFnDesc(now, yesterday)).toBe(-1);
  });

  it('compares two equal dates properly (desc)', () => {
    expect(compareFnDesc(now, now)).toBe(0);
  });
});

describe('compareStrings function', () => {
  const airplane = { text: 'airplane' };
  const bee = { text: 'bee' };

  const compareFnAsc = compareStrings('text', 'asc');

  it('compares two sorted strings properly (asc)', () => {
    expect(compareFnAsc(airplane, bee)).toBe(-1);
  });

  it('compares two strings properly (asc)', () => {
    expect(compareFnAsc(bee, airplane)).toBe(1);
  });

  it('compares two equal strings properly (asc)', () => {
    expect(compareFnAsc(airplane, airplane)).toBe(0);
  });

  const compareFnDesc = compareStrings('text', 'desc');

  it('compares two sorted strings properly (desc)', () => {
    expect(compareFnDesc(bee, airplane)).toBe(-1);
  });

  it('compares two strings properly (desc)', () => {
    expect(compareFnDesc(airplane, bee)).toBe(1);
  });

  it('compares two equal strings properly (desc)', () => {
    expect(compareFnDesc(airplane, airplane)).toBe(0);
  });
});

describe('compareNumbers function', () => {
  const one = { number: 1 };
  const two = { number: 2 };

  const compareFnAsc = compareNumbers('number', 'asc');

  it('compares two sorted numbers properly (asc)', () => {
    expect(compareFnAsc(one, two)).toBe(-1);
  });

  it('compares two unsorted numbers properly (asc)', () => {
    expect(compareFnAsc(two, one)).toBe(1);
  });

  it('compares two equal numbers properly (asc)', () => {
    expect(compareFnAsc(one, one)).toBe(0);
  });

  const compareFnDesc = compareNumbers('number', 'desc');

  it('compares two sorted numbers properly (desc)', () => {
    expect(compareFnDesc(one, two)).toBe(1);
  });

  it('compares two unsorted numbers properly (desc)', () => {
    expect(compareFnDesc(two, one)).toBe(-1);
  });

  it('compares two equal numbers properly (desc)', () => {
    expect(compareFnDesc(one, one)).toBe(0);
  });
});
