import renderDOM from './renderDOM';
import Block, { BlockConstructable } from 'core/Block';

function isEqual(lhs: string, rhs: string): boolean {
  return lhs === rhs;
}

class Route<P = any> {
  private pathname: string;
  private blockClass: BlockConstructable<P>;
  private block: Block | null = null;
  private props: P;
  private _shouldAuthorized: boolean;
  private _shouldUnAuthorized: boolean;

  constructor(pathname: string, view: BlockConstructable<P>, shouldAuthorized: boolean, shouldUnAuthorized: boolean, props: P) {
    this.pathname = pathname;
    this.blockClass = view;
    this._shouldAuthorized = shouldAuthorized;
    this._shouldUnAuthorized = shouldUnAuthorized;
    this.props = props;
  }

  get shouldAuthorized() {
    return this._shouldAuthorized;
  }

  get shouldUnAuthorized() {
    return this._shouldUnAuthorized;
  }

  navigate(pathname: string) {
    if (this.match(pathname)) {
      this.render();
    }
  }

  leave() {
    if (this.block) {
      this.block.hide();
    }
  }

  match(pathname: string) {
    return isEqual(pathname, this.pathname);
  }

  render() {
    if (!this.block) {
      this.block = new this.blockClass(this.props);
      renderDOM(this.block);
      return;
    }

    this.block.show();
  }
}

export default class Router {
  static __instance: Router;

  private routers: Array<Route> = [];
  private history: History = window.history;
  private currentRoute: Nullable<Route> = null;
  private unauthorizedRedirectUrl: Nullable<string> = null;
  private authorizedRedirectUrl: Nullable<string> = null;
  private getIsAuthorizedCb: Nullable<() => boolean> = null;

  constructor() {
    if (Router.__instance) {
      return Router.__instance;
    }

    Router.__instance = this;
  }

  use<P>(
    pathname: string,
    block: BlockConstructable<P>,
    shouldAuthorized: boolean = false,
    shouldUnAuthorized: boolean = false,
    props: P = {} as P
  ) {
    const route = new Route(pathname, block, shouldAuthorized, shouldUnAuthorized, props);

    this.routers.push(route);

    return this;
  }

  setAuthConfig(unauthorizedRedirectUrl: string, authorizedRedirectUrl: string, getIsAuthorized: () => boolean) {
    this.unauthorizedRedirectUrl = unauthorizedRedirectUrl;
    this.authorizedRedirectUrl = authorizedRedirectUrl;
    this.getIsAuthorizedCb = getIsAuthorized;
  }

  start() {
    window.onpopstate = (() => {
      this.onRoute(window.location.pathname);
    });

    this.onRoute(window.location.pathname);
  }

  private getRedirectUrl(route: Route): string | undefined {
    if (!this.getIsAuthorizedCb) {
      return;
    }

    if (route.shouldAuthorized && !this.getIsAuthorizedCb() && this.unauthorizedRedirectUrl) {
      return this.unauthorizedRedirectUrl;
    }

    if (route.shouldUnAuthorized && this.getIsAuthorizedCb() && this.authorizedRedirectUrl) {
      return this.authorizedRedirectUrl;
    }
  }

  private onRoute(pathname: string) {
    const route = this.getRoute(pathname);

    if (!route) {
      return;
    }

    const redirectUrl = this.getRedirectUrl(route);

    if (redirectUrl) {
      this.go(redirectUrl);
      return;
    }

    if (this.currentRoute && this.currentRoute !== route) {
      this.currentRoute.leave();
    }

    this.currentRoute = route;
    route.render();
  }

  private getRoute(pathname: string): Route | undefined {
    const router = this.routers.find(route => route.match(pathname));

    return router || this.routers.find(route => route.match('*'));
  }

  go(pathname: string) {
    this.history.pushState({}, '', pathname);
    this.onRoute(pathname);
  }

  back() {
    this.history.back();
  }

  forward() {
    this.history.forward();
  }
}
