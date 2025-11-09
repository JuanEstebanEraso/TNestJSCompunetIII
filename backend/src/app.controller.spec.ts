import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let controller: AppController;

  beforeEach(() => {
    controller = new AppController(new AppService());
  });

  it('getHello should return Hello World!', () => {
    expect(controller.getHello()).toBe('Hello World!');
  });
});
