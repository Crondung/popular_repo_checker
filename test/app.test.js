import { turnCard } from '../src/app';

describe('turnCard', () => {
  it('should set the transform style correctly', () => {
    const mockEvent = { preventDefault: jest.fn() };
    const mockElement = { style: { transform: '' } };
    document.getElementById = jest.fn().mockReturnValueOnce(mockElement);

    turnCard(mockEvent, 180);

    expect(mockElement.style.transform).toBe('rotateY(180deg)');
  });
});
