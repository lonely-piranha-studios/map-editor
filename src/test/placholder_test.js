import { expect } from 'chai';

describe('Simple math test', () => {
  it('1 + 1 should equal 2', () => {
    expect(1 + 1).to.equal(2);
  });
  it('6 / 2 should equal 3', () => {
    expect(6 / 2).to.equal(3);
  });
});

describe('World sanity check', () => {
  it('Russia hasn´t started a nuclear war', () => true);
  it('Välfärd is somewhat intact', () => true);
  it('Max is still short', () => true);
});
