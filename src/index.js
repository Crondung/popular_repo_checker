import './styles.scss';

document
  .getElementById('submitButton')
  .addEventListener('click', (event) => turnCard(event, '180deg'));
document
  .getElementById('backButton')
  .addEventListener('click', (event) => turnCard(event, '0deg'));

function turnCard(event, deg) {
  event.preventDefault();
  const card = document.getElementById('card');
  card.style.transform = `rotateY(${deg})`;
  console.log('tuned');
}
