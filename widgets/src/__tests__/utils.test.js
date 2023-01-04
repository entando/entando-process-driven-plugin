import utils from '../utils';

describe('Utils', () => {
  it('timeout should pass setTimeout ref', async () => {
    const timer = { ref: null };
    await utils.timeout(100, timer);

    expect(timer.ref).not.toBeNull();
  });
});
