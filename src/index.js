import './style.css';
import Logo from './images/google_books.png';
import totalBooksItems from './modules/totalItems.js';
import { getBookData, createComment } from './modules/totalComments.js';

import { getItemLikes } from './modules/getLikes.js';

const bookList = document.getElementById('book-list');

const popUp = async (item) => {
  item.comments = await (getBookData(item.id));
  const popUpContainer = document.createElement('article');
  popUpContainer.id = 'pop-up';
  popUpContainer.innerHTML = `
    <div class="pop-container">
      <div class="pop-up-header">
        <h2 class="book-title">${item.volumeInfo.title}</h2>
        <button id="close-modal-btn">x</button>
      </div>
      <div class="pop-up-body">
        <div class="image-container">
          <img src='${item.volumeInfo.imageLinks.thumbnail}' class="book-image">
        </div>
        <div class="pop-up-content">
          <div class="left-content">
            <label>Author:</label>
            <div class="book-data">${item.volumeInfo.authors[0]}</div>
            <label>Category:</label>
            <div class="book-data">${item.volumeInfo.categories[0]}</div>
          </div>
          <div class="rigth-content">
            <label>Published date:</label>
            <div class="book-data">${item.volumeInfo.publishedDate}</div>
            <label>Language:</label>
            <div class="book-data">${item.volumeInfo.language}</div>
          </div>
        </div>
      </div>
      <div class="pop-up-comments">
        <h3>Comments (${item.comments.length})</h3>
        <ul id="comments-list"></ul>
      </div>
      <div class="pop-up-form">
        <h3>Add a comment</h3>
        <form id="new-comment">
          <input id="user" type="text" name="user" placeholder="Your name" required></input>
          <textarea id="comment" name="user" placeholder="Your name" required></textarea>
          <button class="add-comment" id="comment-btn">Comment</button>
        </form>
      </div>
    </div>
  `;
  document.body.append(popUpContainer);
  const closeBtn = document.getElementById('close-modal-btn');
  closeBtn.addEventListener('click', () => {
    popUpContainer.remove();
  });

  const addComentBtn = document.getElementById('comment-btn');
  addComentBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const userInput = document.getElementById('user').value;
    const textAreaInput = document.getElementById('comment').value;
    createComment(item.id, userInput, textAreaInput);
  });

  const commentList = document.getElementById('comments-list');
  if (item.comments.length > 0) {
    item.comments.map((item) => {
      const itemList = document.createElement('li');
      itemList.innerHTML = `
        <div>${item.comment}</div>
      `;
      return commentList.append(itemList);
    });
  }
};

const getTotal = async () => {
  const { data, totalItems, search } = await totalBooksItems();
  return { data, totalItems, search };
};

const bookDetails = async () => {
  const { data, totalItems, search } = await getTotal();

  const totalBooks = document.querySelector('.total-books');

  totalBooks.innerHTML = `(${totalItems}) Books about ${search}`;

  for (let i = 0; i < data.items.length; i += 1) {
    const likes = getItemLikes(data.items[i].id);

    const bookList = document.getElementById('book-list');
    const bookCard = document.createElement('div');
    const contentCard = document.createElement('p');

    const title = document.createElement('h4');
    const bookCardContent = `
            <p>
                <a  href='${data.items[i].volumeInfo.previewLink}'>
                    <img src='${data.items[i].volumeInfo.imageLinks.thumbnail}' class="book-cover">
                    <br>More details
                </a>
            </p>
            <button type="submit" class="add-comment" id="comment-btn-${data.items[i].id}">Comment</button>
            &#160;&#160;&#160;&#160;
            <button class="heart">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="white" class="bi bi-heart-fill" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z"/>
                </svg>
            </button>
            &#160;&#160;&#160;&#160;
            <span class="likes-counter">${likes}</span>
            &#160;&#160;&#160;
            <span class="likes">likes</span>`;
    const title1 = `${data.items[i].volumeInfo.title}`;
    title.classList.add('title');
    title.innerHTML = title1;
    bookCard.appendChild(title);
    bookCard.classList.add('bookCard');
    contentCard.innerHTML = bookCardContent;
    bookCard.appendChild(contentCard);
    bookList.appendChild(bookCard);
    const commentBtn = document.getElementById(`comment-btn-${data.items[i].id}`);
    commentBtn.addEventListener('click', () => {
      popUp(data.items[i]);
    });
  }
};

const retrieveBooks = () => {
  bookList.innerHTML = '';
  bookDetails();
};

const searchInputBtn = document.getElementById('btn-search');
searchInputBtn.addEventListener('click', retrieveBooks);

function loadLogo() {
  const googleLogo = document.querySelector('.header-img');
  googleLogo.src = Logo;
  googleLogo.alt = 'google books Logo';
}

window.onload = () => {
  loadLogo();
  // loadGithubIcon();
};

document.addEventListener('DOMContentLoaded', retrieveBooks);
