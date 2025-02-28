import APILoader from './apiloader.js';
import Counter from './counter.js';

const loader = new APILoader();
const counter = new Counter();

class DOMManipulator {
  displayItems = async () => {
    loader.url = 'https://api.tvmaze.com/shows';
    const data = await loader.getData();
    data.forEach((show) => {
      this.createCard(show);
    });
  }

  commentCounter = async (showName) => {
    const noComments = await this.getComment(showName);
    return noComments;
  }

  createCard = async (show) => {
    const createData = {
      card: ['div', ['card'], null],
      cardWrapper: ['div', ['card-wrapper'], null],
      showImage: ['img', ['show-image'], 'show-image'],
      nameLikeParent: ['div', ['name-like-parent'], null],
      span: ['span', ['name'], null],
      comment: ['button', ['comment'], `${show.name}`],
    };
    const elem = this.batchCreateElements(createData);

    elem.showImage.src = show.image.medium;
    elem.span.innerHTML = show.name;
    elem.comment.innerHTML = 'Comments';

    const appendData = [
      { child: elem.cardWrapper, parent: elem.card },
      { child: elem.showImage, parent: elem.cardWrapper },
      { child: elem.nameLikeParent, parent: elem.cardWrapper },
      { child: elem.span, parent: elem.nameLikeParent },
      { child: elem.comment, parent: elem.cardWrapper },
    ];

    this.batchAppendElements(appendData, true);
    this.showModal(elem.comment);
  };

  createCommentModal = () => {
    const modal = document.getElementById('modal-comment');
    const modalContent = `<div class="modal-wrapper">
        <div class="modal-header">
            <div class="img-parent">
                <img src="" alt="Show image" class="modal-image" id ="modal-image">
            </div>
            <span><a href="" id="close">&times</a></span>
        </div>
        <h2 class="name-show" id="name-show">Name of the show</h2>
        <div class="detail">
            <div id="type-status-lang">
            </div>
            <div id="gen-prem-end">
            </div>
        </div>
        <div class="comment-div">
            <h3 class="commnet-header" id="commnet-header">Comments(2)</h3>
            <div id="commnets">
            </div>
        </div>
        <div class="form-wrapper">
                <h3>Add a comment</h3>
                <form action="" method="post" id="frm-comment">
                    <input type="text" name="uname" id="uname" placeholder="Your name" required>
                    <br>
                    <br>
                    <textarea name="comment" id="comment" cols="50" rows="5"  placeholder="Your insights..." required></textarea>
                    <br>
                    <br>
                    <button type="submit">Comment</button>
                </form>
            </div>
    </div>`;
    modal.innerHTML = modalContent;
  };

  populateModal = async (name) => {
    const div1 = document.getElementById('type-status-lang');
    const div2 = document.getElementById('gen-prem-end');
    const nameShow = document.getElementById('name-show');
    const imageShow = document.getElementById('modal-image');
    const commentHeader = document.getElementById('commnet-header');
    const comments = document.getElementById('commnets');

    comments.innerHTML = '';
    div1.innerHTML = '';
    div2.innerHTML = '';
    const createData = {
      type: ['p', null, null],
      status: ['p', null, null],
      lang: ['p', null, null],
      genre: ['p', null, null],
      premiere: ['p', null, null],
      end: ['p', null, null],
    };

    const elem = this.batchCreateElements(createData);
    loader.url = `https://api.tvmaze.com/search/shows?q=${name}`;
    const data = await loader.getData();
    const appendData = [
      { child: elem.type, parent: div1 },
      { child: elem.status, parent: div1 },
      { child: elem.lang, parent: div1 },
      { child: elem.genre, parent: div2 },
      { child: elem.premiere, parent: div2 },
      { child: elem.end, parent: div2 },
    ];
    this.batchAppendElements(appendData, false);

    const showName = data[0].show.name;

    nameShow.innerHTML = showName;
    imageShow.src = data[0].show.image.medium;
    elem.type.innerHTML = `Type: ${data[0].show.type}`;
    elem.status.innerHTML = `Status: ${data[0].show.status}`;
    elem.lang.innerHTML = `Language: ${data[0].show.language}`;
    elem.genre.innerHTML = `Genres: ${data[0].show.genres.join(', ')}`;
    elem.premiere.innerHTML = `Premiered at: ${data[0].show.premiered}`;
    elem.end.innerHTML = `Ended at: ${data[0].show.ended}`;

    await this.commentCounter(showName);
    const noComments = await counter.getCommentCount();
    commentHeader.innerHTML = `Comments(${noComments})`;
    this.submitComment(showName);
  };

  addComment = async (appId, commentData) => {
    loader.url = `http://localhost:3000/apps/${appId}/comments`;
    const comment = await loader.setData(commentData);
    return comment;
  };

  getComment = async (appId, itemId) => {
    loader.url = `http://localhost:3000/apps/${appId}/comments?item_id=${itemId}`;
    let comment;

    try {
      comment = await loader.getData();
      if (!Array.isArray(comment)) {
        comment = null;
      }
    } catch (error) {
      const Error = 'cant get data';
      comment = null;
      return Error;
    }

    this.createComments(comment);
    return comment ? comment.length : 0;
  };

  createComments = (cmts) => {
    counter.clearCommentCounter();
    const commentBox = document.getElementById('commnets');
    if (cmts) {
      cmts.forEach((cmt) => {
        const p = document.createElement('p');
        p.classList.add('user-comment');
        p.innerHTML = `${cmt.creation_date}\t${cmt.username}: ${cmt.comment}`;
        commentBox.appendChild(p);
        counter.countComment();
      });
    }
  };

  submitComment = (itemId) => {
    const commentHeader = document.getElementById('commnet-header');
    const frmComment = document.getElementById('frm-comment');
    frmComment.addEventListener('submit', async (event) => {
      event.preventDefault();
      const user = frmComment.elements.uname.value;
      const comment = frmComment.elements.comment.value;

      const data1 = {
        item_id: itemId,
        username: user,
        comment,
      };

      const date = new Date();
      const day = date.getDate();
      const month = date.getMonth();
      const year = date.getFullYear();

      const data2 = {
        creation_date: `${year}-${month}-${day}`,
        username: user,
        comment,
      };
      const res = await this.addComment(data1);
      if (res === 201) {
        frmComment.elements.uname.value = '';
        frmComment.elements.comment.value = '';
        this.createComments([data2]);
        commentHeader.innerHTML = `Comments(${Number(commentHeader.innerHTML.charAt(9)) + 1})`;
      }
    });
  };

  createElement = (type, clss, id) => {
    const element = document.createElement(type);
    if (clss) {
      clss.forEach((cls) => {
        element.classList.add(cls);
      });
    }

    if (id) {
      element.id = id;
    }
    return element;
  };

  appendElement = (child, parent) => {
    if (parent) {
      parent.appendChild(child);
    }
  };

  batchCreateElements = (createData) => {
    const elt = {};
    const keyValuePair = Object.entries(createData);
    keyValuePair.forEach(([key, val]) => {
      elt[key] = this.createElement(...val);
    });
    return elt;
  };

  batchAppendElements = (appendData, appendToParent) => {
    appendData.forEach((elt) => {
      this.appendElement(elt.child, elt.parent);
    });
    if (appendToParent) {
      const parent = document.getElementById('parent');
      parent.appendChild(appendData[0].parent);
    }
  };

  showModal = (commentBtn) => {
    const modal = document.getElementById('modal-comment');
    commentBtn.addEventListener('click', () => {
      modal.showModal();
      this.populateModal(commentBtn.id);
      return commentBtn.id;
    });
  };

  closeModal = () => {
    const modal = document.getElementById('modal-comment');
    const close = document.getElementById('close');
    close.addEventListener('click', (event) => {
      event.preventDefault();
      modal.close();
    });
  };
}

export default DOMManipulator;