import { turnCard, findRepo } from '../src/app';
import { Octokit } from '@octokit/rest';

describe('turnCard', () => {
  it('should set the transform style correctly', () => {
    const mockEvent = { preventDefault: jest.fn() };
    const mockElement = { style: { transform: '' } };
    document.getElementById = jest.fn().mockReturnValueOnce(mockElement);

    turnCard(mockEvent, 180);

    expect(mockElement.style.transform).toBe('rotateY(180deg)');
  });
});

describe('findRepo', () => {
  const getRepoMock = (stars = 0, forks = 0) => {
    return {
      name: 'repo-mock',
      owner: { login: 'login', avatar_url: 'mock.png' },
      url: 'github.com/mock',
      stargazers_count: stars,
      forks: forks,
    };
  };

  it('should return an object with information about the repository', async () => {
    const repoMock = getRepoMock();
    const octokitResultMock = {
      data: {
        incomplete_results: false,
        items: [repoMock],
      },
    };
    const octokit = new Octokit();
    octokit.rest.search.repos = jest
      .fn()
      .mockReturnValueOnce(octokitResultMock);
    const repoInformation = await findRepo('repo-mock', octokit);
    expect(repoInformation.name).toBe(repoMock.name);
    expect(repoInformation.author).toBe(repoMock.owner.login);
    expect(repoInformation.authorAvatar).toBe(repoMock.owner.avatar_url);
    expect(repoInformation.url).toBe(repoMock.url);
    expect(repoInformation.isPopular).toBe(false);
  });

  it('should return an repository object classified as popular, if the score is high enough', async () => {
    // score = stars * 1 + forks * 2
    const popularRepo = getRepoMock(100, 200);
    const octokitResultMock = {
      data: {
        incomplete_results: false,
        items: [popularRepo],
      },
    };
    const octokit = new Octokit();
    octokit.rest.search.repos = jest
      .fn()
      .mockReturnValueOnce(octokitResultMock);
    const repoInformation = await findRepo('repo-mock', octokit);
    expect(repoInformation.isPopular).toBe(true);
  });

  it('should return an repository object classified as not popular, if the score below 500', async () => {
    // score = stars * 1 + forks * 2
    const popularRepo = getRepoMock(99, 200);
    const octokitResultMock = {
      data: {
        incomplete_results: false,
        items: [popularRepo],
      },
    };
    const octokit = new Octokit();
    octokit.rest.search.repos = jest
      .fn()
      .mockReturnValueOnce(octokitResultMock);
    const repoInformation = await findRepo('repo-mock', octokit);
    expect(repoInformation.isPopular).toBe(false);
  });
});
