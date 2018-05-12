import { Angushop1Page } from './app.po';

describe('angushop1 App', () => {
  let page: Angushop1Page;

  beforeEach(() => {
    page = new Angushop1Page();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
