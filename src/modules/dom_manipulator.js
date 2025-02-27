import APILoader from './apiloader.js';

const loader = new APILoader();

class DOMManipulator {
  displayItems = async () => {
    loader.url = 'https://api.tvmaze.com/shows';
    const data = await loader.getData();
    data.forEach((show) => {
      this.createCard(show);
    });
  };

  createCard = async (show) => {
    const createData = {
      card: ['div', ['card'], null],
      cardWrapper: ['div', ['card-wrapper'], null],
      showImage: ['img', ['show-image'], 'show-image'],
      span: ['span', ['name'], null],
    };
    const elem = this.batchCreateElements(createData);

    elem.showImage.src = show.image.medium;
    elem.span.innerHTML = show.name;

    const appendData = [
      { child: elem.cardWrapper, parent: elem.card },
      { child: elem.showImage, parent: elem.cardWrapper },
      { child: elem.span, parent: elem.cardWrapper },
    ];

    this.batchAppendElements(appendData, true);
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
}

export default DOMManipulator;