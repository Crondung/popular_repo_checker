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
        const repo = await findRepo(repoNameValue);
        displayRepoInformation(repo);
      } catch (error) {
        console.error(error);
      }

      turnCard(event, 180);
    });

  document
    .getElementById('backButton')
    .addEventListener('click', (event) => turnCard(event, 0));
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
 * @returns {Object} repoInfos with all needed fields
 */
export async function findRepo(repoName) {
  const octokit = new Octokit();
  try {
    const result = await octokit.rest.search.repos({
      q: repoName,
      per_page: 1,
    });
    console.log(result);
    if (result.data.incomplete_results === true) {
      //TODO error handling
      console.error('incomplete results');
    }
    if (result.data.items[0] === undefined) {
      throw new Error(`Not Found: Repository with name ${repoName}`);
    }
    const repo = result.data.items[0];
    const repoInformation = {
      name: repo.name,
      author: repo.owner.login,
      authorAvatar: repo.owner.avatar_url,
      url: repo.url,
      isPopular: repo.stargazers_count + repo.forks * 2 >= 500,
    };
    return repoInformation;
  } catch (error) {
    console.error(error);
    throw new Error('Could not get results');
  }
}

/**
 * Updates the backside of the card
 * to display the repository informations
 *
 * @param {Object} repoInformation
 */
export function displayRepoInformation(repoInformation) {
  const author = document.getElementById('author-name');
  author.innerHTML = repoInformation.author;

  const authorAvatar = document.getElementById('author-avatar');
  authorAvatar.setAttribute('src', repoInformation.authorAvatar);

  const repoName = document.getElementById('repo-name');
  repoName.innerHTML = repoInformation.name;
}
