import {browser} from 'protractor';

describe('angular-io-v42 App', function() {
  beforeEach(() => {
    browser.get('/');
  });

  it('should do something', () => {
    expect(1).toBe(1);
  });
});
