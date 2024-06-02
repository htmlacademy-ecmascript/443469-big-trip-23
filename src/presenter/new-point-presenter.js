import {remove, render, RenderPosition} from '../framework/render.js';
import EditPoint from '../view/edit-point.js';
import {DEFAULT_POINT, UserAction, UpdateType} from '../constants.js';

export default class NewPointPresenter {
  #pointEditorComponent = null;
  #handleDataChange = null;
  #handleDestroy = null;
  #pointModel = null;
  #point = [];

  constructor({pointModel, onDataChange, onDestroy}) {
    this.#pointModel = pointModel;
    this.#handleDataChange = onDataChange;
    this.#handleDestroy = onDestroy;
    this.#point = DEFAULT_POINT;
  }

  init() {
    if (this.#pointEditorComponent !== null) {
      return;
    }

    this.#pointEditorComponent = new EditPoint(
      this.#point,
      this.#pointModel.offers,
      this.#pointModel.getOffersByType(this.#point.type),
      this.#pointModel.destinations,
      this.#pointModel.getDestinationsById(this.#point.destination),
      this.#handleFormSubmit,
      () => this.#hideEditorPoint(),
      () => this.#handleCancelClick()
    );

    const newFormContainer = document.querySelector('.trip-events__list');
    render(this.#pointEditorComponent, newFormContainer, RenderPosition.AFTERBEGIN);

    document.addEventListener('keydown', this.#escKeyDownHandler);
  }

  destroy() {
    if (this.#pointEditorComponent === null) {
      return;
    }

    this.#handleDestroy();

    remove(this.#pointEditorComponent);
    this.#pointEditorComponent = null;

    document.removeEventListener('keydown', this.#escKeyDownHandler);
  }

  #hideEditorPoint = () => {
    this.destroy();
  };

  #handleFormSubmit = ({point}) => {
    const newPoint = {
      ...point,
      id: crypto.randomUUID()
    };

    this.#handleDataChange(
      UserAction.ADD_POINT,
      UpdateType.MINOR,
      newPoint,
    );
    this.destroy();
  };

  #handleCancelClick = () => {
    this.destroy();
  };

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      this.destroy();
    }
  };
}