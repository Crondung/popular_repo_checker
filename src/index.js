import { Octokit } from '@octokit/rest';
import './styles.scss';

document.getElementById('submitButton').addEventListener('click', (event) => {
  const repoNameValue = document.getElementById('repoName').value;
  const repo = findRepo(repoNameValue).then((repo) =>
    displayRepoInformation(repo)
  );

  turnCard(event, '180deg');
});
document
  .getElementById('backButton')
  .addEventListener('click', (event) => turnCard(event, '0deg'));

function turnCard(event, deg) {
  event.preventDefault();
  const card = document.getElementById('card');
  card.style.transform = `rotateY(${deg})`;
}

async function findRepo(repoName) {
  const octokit = new Octokit();
  try {
    const result = await octokit.rest.search.repos({
      q: repoName,
      per_page: 1,
    });
    if (result.data.incomplete_results === true) {
      //TODO error handling
      console.error('incomplete results');
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
  }
}

function displayRepoInformation(repoInformation) {
  const author = document.getElementById('author-name');
  author.innerHTML = repoInformation.author;

  const authorAvatar = document.getElementById('author-avatar');
  authorAvatar.setAttribute('src', repoInformation.authorAvatar);

  const repoName = document.getElementById('repo-name');
  repoName.innerHTML = repoInformation.name;
}
