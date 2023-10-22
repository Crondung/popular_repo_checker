import { Octokit } from '@octokit/rest';

/**
 * initialize event listeners for
 *  1. submitButton to search for a repo
 *  2. backButton to restart the search
 */
export function initEventListeners() {
  document
    .getElementById('submitButton')
    .addEventListener('click', async (event) => {
      const repoNameValue = document.getElementById('repoName').value;
      try {
        const octokit = new Octokit();
        const repo = await findRepo(repoNameValue, octokit);
        displayRepoInformation(repo);
        const score = calculateScore(repo.stars, repo.forks);
        displayPopularity(score);
      } catch (error) {
        console.error(error);
      }

      turnCard(event, 180);
    });

  document.getElementById('backButton').addEventListener('click', (event) => {
    turnCard(event, 0);
    resetBacksideCardElemets();
  });
}

/**
 * Triggers the turn-animation after a click event
 * by rotating the card by #deg degrees
 *
 * turning by 180 degrees will flip the card to the backside
 * turning by 0 degrees will flip the card to the frontside
 *
 * @param {Event} event
 * @param {number} deg
 */
export function turnCard(event, deg) {
  event.preventDefault();
  const card = document.getElementById('card');
  card.style.transform = `rotateY(${deg}deg)`;
}

/**
 * uses the Octokit package to retrieve repository informations
 *
 * @param {string} repoName
 * @param {Octokit} octokit Octokit instance to request the information with
 * @returns {Object} repoInfos with all needed fields
 */
export async function findRepo(repoName, octokit) {
  try {
    const result = await octokit.rest.search.repos({
      q: repoName,
      per_page: 1,
    });
    /* if (result.data.incomplete_results === true) {
      //TODO error handling
      console.error('incomplete results');
    } */
    if (result.data.items[0] === undefined) {
      throw new Error(`Not Found: Repository with name ${repoName}`);
    }
    const repo = result.data.items[0];
    const repoInformation = {
      name: repo.name,
      author: repo.owner.login,
      authorAvatar: repo.owner.avatar_url,
      url: repo.html_url,
      stars: repo.stargazers_count,
      forks: repo.forks,
      isPopular: repo.stargazers_count + repo.forks * 2 >= 500,
    };
    return repoInformation;
  } catch (error) {
    console.error(error);
    throw new Error('Could not get results');
  }
}

export function calculateScore(stars, forks) {
  return stars + forks * 2;
}

/**
 * Updates the backside of the card
 * to display the repository informations
 *
 * @param {Object} repoInformation
 */
export function displayRepoInformation(repoInformation) {
  const backsideCardElements = getBacksideCardElements();
  backsideCardElements.authorAvatar.src = repoInformation.authorAvatar;
  backsideCardElements.authorAnchor.href = repoInformation.url;
  backsideCardElements.repoName.innerHTML = `repository: ${repoInformation.name}`;
  backsideCardElements.author.innerHTML = `author: ${repoInformation.author}`;
  backsideCardElements.stars.innerHTML = `stars: ${repoInformation.stars}`;
  backsideCardElements.forks.innerHTML = `forks: ${repoInformation.forks}`;
}

/**
 * Checks if repoName is a valid repository name
 *
 * @param {string} repoName
 * @returns {boolean} true if repoName is a valid repository name, false otherwise
 */
export function isValidRepoName(repoName) {
  if (!repoName) return false;

  return true;
}

export function getBacksideCardElements() {
  const elements = {
    author: document.getElementById('author-name'),
    authorAvatar: document.getElementById('author-avatar'),
    authorAnchor: document.getElementById('author-anchor'),
    repoName: document.getElementById('repo-name'),
    stars: document.getElementById('stars'),
    forks: document.getElementById('forks'),
  };
  return elements;
}

export function resetBacksideCardElemets() {
  const backsideCardElements = getBacksideCardElements();
  backsideCardElements.authorAvatar.src =
    'https://upload.wikimedia.org/wikipedia/commons/c/c2/GitHub_Invertocat_Logo.svg';
  backsideCardElements.repoName.innerHTML = 'repository:';
  backsideCardElements.author.innerHTML = 'author:';
  backsideCardElements.stars.innerHTML = 'stars:';
  backsideCardElements.forks.innerHTML = 'forks:';
}

export function displayPopularity(score) {
  const colors = {
    unpopular: '#fca5a5',
    mediumPopular: '#fdba74',
    popular: '#f97316',
  };
  const popularIcon = document.getElementById('popular-icon');
  const popularityText = document.getElementById('popularity-text');
  let text = '';
  let iconColor = '';
  if (score < 250) {
    iconColor = colors.unpopular;
    text =
      '<b>Get it started!</b> Increase this repositories popularity by sharing it.';
  } else if (score < 500) {
    iconColor = colors.mediumPopular;
    text =
      '<b>Almost there!</b> Gather your final stars to become a popular repository.';
  } else {
    iconColor = colors.popular;
    text =
      '<b>A popular repository appeared!</b> Share this repository, to make it even more popular.';
  }
  popularIcon.setAttribute('fill', '#f97316');
  popularityText.innerHTML = text;
}
