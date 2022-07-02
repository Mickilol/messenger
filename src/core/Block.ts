import EventBus from './EventBus';
import { nanoid } from 'nanoid';
import Handlebars from 'handlebars';

export interface BlockConstructable<P = any> {
  new(props: P): Block;
  componentName: string;
}

interface BlockMeta<P = any> {
  props: P;
}

type Events = Values<typeof Block.EVENTS>;

export default class Block<P = any, S = any, R = any> {
  static componentName: string;

  static EVENTS = {
    INIT: 'init',
    FLOW_CDM: 'flow:component-did-mount',
    FLOW_CDU: 'flow:component-did-update',
    FLOW_CWU: 'flow:component-will-unmount',
    FLOW_CU: 'flow:component-updated',
    FLOW_RENDER: 'flow:render',
  } as const;

  public id = nanoid(6);
  private readonly _meta: BlockMeta;
  protected _element: Nullable<HTMLElement> = null;
  protected readonly props: P;
  protected state: S = {} as S;
  protected children: { [id: string]: Block } = {};

  eventBus: () => EventBus<Events>;

  protected readonly refs: R = {} as R;

  public constructor(props?: P) {
    const eventBus = new EventBus<Events>();

    this._meta = {
      props,
    };

    this.getStateFromProps(props || {} as P);

    this.props = this._makePropsProxy(props || {} as P);
    this.state = this._makePropsProxy(this.state);

    this.eventBus = () => eventBus;

    this._registerEvents(eventBus);

    eventBus.emit(Block.EVENTS.INIT, this.props);
  }

  _registerEvents(eventBus: EventBus<Events>) {
    eventBus.on(Block.EVENTS.INIT, this.init.bind(this));
    eventBus.on(Block.EVENTS.FLOW_CDM, this._componentDidMount.bind(this));
    eventBus.on(Block.EVENTS.FLOW_CDU, this._componentDidUpdate.bind(this));
    eventBus.on(Block.EVENTS.FLOW_CWU, this._componentWillUnmount.bind(this));
    eventBus.on(Block.EVENTS.FLOW_CU, this._componentUpdated.bind(this));
    eventBus.on(Block.EVENTS.FLOW_RENDER, this._render.bind(this));
  }

  protected getStateFromProps(props: P): void {
    this.state = {} as S;
  }

  init() {
    this._createResources();
    this.eventBus().emit(Block.EVENTS.FLOW_RENDER, this.props);
  }

  _createResources() {
    this._element = this._createDocumentElement('div');
  }

  _createDocumentElement(tagName: string) {
    return document.createElement(tagName);
  }

  _componentDidMount() {
    this.componentDidMount();
  }

  componentDidMount() {}

  _componentWillUnmount() {
    this.componentWillUnmount();
  }

  componentWillUnmount() {}

  _componentUpdated(oldProps: P, newProps: P) {
    this.componentUpdated(oldProps, newProps);
  }

  componentUpdated(oldProps: P, newProps: P) { }

  _componentDidUpdate(oldProps: P, newProps: P) {
    const response = this.componentDidUpdate(oldProps, newProps);
    if (!response) {
      return;
    }
    this._render();
    this.eventBus().emit(Block.EVENTS.FLOW_CU, oldProps, newProps);
  }

  componentDidUpdate(oldProps: P, newProps: P) {
    return true;
  }

  setProps = (nextProps: Partial<P>) => {
    if (!nextProps) {
      return;
    }

    Object.assign(this.props, nextProps);
  };

  setState = (nextState: Partial<S>) => {
    if (!nextState) {
      return;
    }

    Object.assign(this.state, nextState);
  };

  get element() {
    return this._element;
  }

  _render() {
    const fragment = this._compile();

    this._removeEvents();
    const newElement = fragment.firstElementChild!;

    this._element!.replaceWith(newElement);

    this._element = newElement as HTMLElement;
    this._addEvents();
  }

  protected render(): string {
    return '';
  }

  getContent(): HTMLElement {
    // Хак, чтобы вызвать CDM только после добавления в DOM
    if (this.element?.parentNode?.nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
      setTimeout(() => {
        if (this.element?.parentNode?.nodeType !== Node.DOCUMENT_FRAGMENT_NODE) {
          this.eventBus().emit(Block.EVENTS.FLOW_CDM);
        }
      }, 100);
    }

    return this.element!;
  }

  _makePropsProxy<T extends P | S>(props: T): T {
    const self = this;

    return new Proxy(props as unknown as object, {
      get(target: Record<string, unknown>, prop: string) {
        const value = target[prop];
        return typeof value === 'function' ? value.bind(target) : value;
      },
      set(target: Record<string, unknown>, prop: string, value: unknown) {
        const oldTarget = { ...target };
        target[prop] = value;

        self.eventBus().emit(Block.EVENTS.FLOW_CDU, oldTarget, target);
        return true;
      },
      deleteProperty() {
        throw new Error('Нет доступа');
      },
    }) as unknown as T;
  }

  _removeEvents() {
    const events: Record<string, () => void> = (this.props as any).events;

    if (!events || !this._element) {
      return;
    }

    Object.entries(events).forEach(([event, listener]) => {
      this._element!.removeEventListener(event, listener);
    });
  }

  _addEvents() {
    const events: Record<string, () => void> = (this.props as any).events;

    if (!events) {
      return;
    }

    Object.entries(events).forEach(([event, listener]) => {
      this._element!.addEventListener(event, listener);
    });
  }

  _compile(): DocumentFragment {
    const fragment = document.createElement('template');
    const template = Handlebars.compile(this.render());

    fragment.innerHTML = template({ ...this.state, ...this.props, children: this.children, refs: this.refs });

    Object.entries(this.children).forEach(([id, component]) => {
      const stub = fragment.content.querySelector(`[data-id="${id}"]`);

      if (!stub) {
        return;
      }

      const stubChildren = stub.childNodes.length ? stub.childNodes : [];

      const content = component.getContent();
      stub.replaceWith(content);

      const layoutContent = content.querySelector('[data-layout="1"]');

      if (layoutContent && stubChildren.length) {
        layoutContent.append(...stubChildren);
      }
    });

    return fragment.content;
  }

  show() {
    this.getContent().style.display = 'flex';
    this.eventBus().emit(Block.EVENTS.FLOW_CDM);
  }

  hide() {
    this.eventBus().emit(Block.EVENTS.FLOW_CWU);
    this.getContent().style.display = 'none';
  }
}