import Block from './Block';

export default function renderDOM(block: Block) {
  const root = document.querySelector('#app');

  if (!root) {
    throw new Error('В DOM нет элемента с id app');
  }
  
  root!.innerHTML = '';
  root!.appendChild(block.getContent());
}
