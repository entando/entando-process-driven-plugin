import '@testing-library/jest-dom/extend-expect';
import 'regenerator-runtime/runtime';
import jestFetchMock from 'jest-fetch-mock';

global.fetch = jestFetchMock;
