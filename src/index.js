import DOMManipulator from './modules/dom_manipulator.js';
import './style.css';

const dom = new DOMManipulator();
dom.createCommentModal();
dom.displayItems();
dom.closeModal();
dom.displayItems();