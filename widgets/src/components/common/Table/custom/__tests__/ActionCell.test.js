import { render, fireEvent } from '@testing-library/react';
import ActionCell from 'components/common/Table/custom/ActionCell';
import 'mocks/i18nMock';

describe('<ActionCell />', () => {
  it('renders snapshot correctly', () => {
    const { container } = render(
      ActionCell({ showComplete: true, showClaim: true }, jest.fn())({})
    );

    expect(container).toMatchSnapshot();
  });

  it('renders snapshot correctly without claim and complete button', () => {
    const { container } = render(
      ActionCell({ showComplete: false, showClaim: false }, jest.fn())({})
    );

    expect(container).toMatchSnapshot();
  });

  it('shows Claim, Complete and Diagram buttons when button is clicked', () => {
    const { getByText, getByRole } = render(
      ActionCell({ showComplete: true, showClaim: true }, jest.fn())({})
    );

    fireEvent.click(getByRole('button'));

    const claimKey = 'taskList.actionButtons.claim';
    const completeKey = 'taskList.actionButtons.complete';
    const diagramKey = 'taskList.actionButtons.diagram';

    expect(getByText(claimKey)).toBeInTheDocument();
    expect(getByText(completeKey)).toBeInTheDocument();
    expect(getByText(diagramKey)).toBeInTheDocument();
  });
});
