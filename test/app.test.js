import { JSDOM } from 'jest-environment-jsdom';
import {
  turnCard,
  findRepo,
  calculateScore,
  displayRepoInformation,
  getBacksideCardElements,
  resetBacksideCardElemets,
  displayPopularity,
} from '../src/app';
import { Octokit } from '@octokit/rest';

afterEach(() => {
  jest.restoreAllMocks();
});

describe('turnCard', () => {
  it('should set the transform style correctly', () => {
    const mockEvent = { preventDefault: jest.fn() };
    document.body.innerHTML = `<div id="card"></div>`;
    turnCard(mockEvent, 180);
    const card = document.getElementById('card');
    expect(card.style.transform).toBe('rotateY(180deg)');
  });
});

describe('findRepo', () => {
  const getRepoMock = (stars = 0, forks = 0) => {
    return {
      name: 'repo-mock',
      owner: { login: 'login', avatar_url: 'mock.png' },
      html_url: 'github.com/mock',
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
    expect(repoInformation.url).toBe(repoMock.html_url);
    expect(repoInformation.stars).toBe(repoMock.stargazers_count);
    expect(repoInformation.forks).toBe(repoMock.forks);
  });
});

describe('calculateScore', () => {
  it('should calculare the score by the formula score = stars * 1 + forks * 2', () => {
    const stars = 100;
    const forks = 200;
    expect(calculateScore(stars, forks)).toBe(stars * 1 + forks * 2);
  });
});

describe('getBacksideCardElements', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <div>
        <div id="author-name"></div>
        <img id="author-avatar" />
        <a id="author-anchor"></a>
        <div id="repo-name"></div>
        <div id="stars"></div>
        <div id="forks"></div>
      </div>
    `;
  });

  it('returns an object with backside card HTML elements', () => {
    const elements = getBacksideCardElements();

    expect(elements.author).toBeInstanceOf(HTMLDivElement);
    expect(elements.authorAvatar).toBeInstanceOf(HTMLImageElement); // Assuming it's an image
    expect(elements.authorAnchor).toBeInstanceOf(HTMLAnchorElement);
    expect(elements.repoName).toBeInstanceOf(HTMLDivElement);
    expect(elements.stars).toBeInstanceOf(HTMLDivElement);
    expect(elements.forks).toBeInstanceOf(HTMLDivElement);
  });
});

describe('displayRepoInformation', () => {
  it('should update the backside card elements with repository information', () => {
    const backsideCardElements = {
      authorAvatar: { src: '' },
      authorAnchor: { href: '' },
      repoName: { innerHTML: '' },
      author: { innerHTML: '' },
      stars: { innerHTML: '' },
      forks: { innerHTML: '' },
    };

    const repoInformation = {
      authorAvatar: 'avatar-url',
      url: 'repo-url',
      name: 'repo-name',
      author: 'repo-author',
      stars: 42,
      forks: 21,
    };

    displayRepoInformation(backsideCardElements, repoInformation);

    expect(backsideCardElements.authorAvatar.src).toBe('avatar-url');
    expect(backsideCardElements.authorAnchor.href).toBe('repo-url');
    expect(backsideCardElements.repoName.innerHTML).toBe(
      'repository: repo-name'
    );
    expect(backsideCardElements.author.innerHTML).toBe('author: repo-author');
    expect(backsideCardElements.stars.innerHTML).toBe('stars: 42');
    expect(backsideCardElements.forks.innerHTML).toBe('forks: 21');
  });
});

describe('resetBacksideCardElements', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <div>
        <img id="author-avatar" src="old-src" />
        <a id="author-anchor" href="old-href"></a>
        <div id="repo-name">repository: old repository</div>
        <div id="author-name">author: old author</div>
        <div id="stars">stars: old stars</div>
        <div id="forks">forks: old forks</div>
      </div>
    `;
  });

  it('resets all backside card elements to their default values', () => {
    resetBacksideCardElemets();
    const elements = getBacksideCardElements();
    console.log(elements);
    expect(elements.authorAvatar.src).toBe(
      'https://upload.wikimedia.org/wikipedia/commons/c/c2/GitHub_Invertocat_Logo.svg'
    );
    expect(elements.authorAnchor.href).toBe('https://github.com/');
    expect(elements.repoName.innerHTML).toBe('repository:');
    expect(elements.author.innerHTML).toBe('author:');
    expect(elements.stars.innerHTML).toBe('stars:');
    expect(elements.forks.innerHTML).toBe('forks:');
  });
});

describe('displayPopularity', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <div>
        <svg id="popular-icon"><circle></circle></svg>
        <div id="popularity-text"></div>
      </div>
    `;
  });

  it('displays content for unpopular repositories correctly', () => {
    displayPopularity(100);
    const popularIcon = document.getElementById('popular-icon');
    const popularityText = document.getElementById('popularity-text');

    expect(popularIcon.getAttribute('fill')).toBe('#fca5a5');
    expect(popularityText.innerHTML).toBe(
      '<b>Get it started!</b> Increase this repositories popularity by sharing it.'
    );
  });

  it('displays content for medium popular repositories correctly', () => {
    displayPopularity(300);
    const popularIcon = document.getElementById('popular-icon');
    const popularityText = document.getElementById('popularity-text');

    expect(popularIcon.getAttribute('fill')).toBe('#fdba74');
    expect(popularityText.innerHTML).toBe(
      '<b>Almost there!</b> Gather your final stars to become a popular repository.'
    );
  });

  it('displays content for popular repositories correctly', () => {
    displayPopularity(700);
    const popularIcon = document.getElementById('popular-icon');
    const popularityText = document.getElementById('popularity-text');

    expect(popularIcon.getAttribute('fill')).toBe('#f97316');
    expect(popularityText.innerHTML).toBe(
      '<b>A popular repository appeared!</b> Share this repository, to make it even more popular.'
    );
  });

  it('handles edge cases correctly', () => {
    displayPopularity(250);
    let popularityText = document.getElementById('popularity-text');
    expect(popularityText.innerHTML).toBe(
      '<b>Almost there!</b> Gather your final stars to become a popular repository.'
    );

    displayPopularity(499);
    popularityText = document.getElementById('popularity-text');
    expect(popularityText.innerHTML).toBe(
      '<b>Almost there!</b> Gather your final stars to become a popular repository.'
    );

    displayPopularity(500);
    popularityText = document.getElementById('popularity-text');
    expect(popularityText.innerHTML).toBe(
      '<b>A popular repository appeared!</b> Share this repository, to make it even more popular.'
    );
  });
});
