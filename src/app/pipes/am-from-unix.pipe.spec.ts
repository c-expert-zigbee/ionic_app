import { AmFromUnixPipe } from './am-from-unix.pipe';

describe('AmFromUnixPipe', () => {
  it('create an instance', () => {
    const pipe = new AmFromUnixPipe();
    expect(pipe).toBeTruthy();
  });
});
