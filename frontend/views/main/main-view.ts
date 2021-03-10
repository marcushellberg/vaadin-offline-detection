import '@vaadin/vaadin-app-layout';
import '@vaadin/vaadin-avatar/vaadin-avatar';
import '@vaadin/vaadin-tabs';
import '@vaadin/vaadin-tabs/vaadin-tab';
import { customElement, html } from 'lit-element';
import { router } from '../../index';
import { ViewRoute, views } from '../../routes';
import { appStore } from '../../stores/app-store';
import { Layout } from '../view';
import styles from './main-view.css';

@customElement('main-view')
export class MainView extends Layout {
  static get styles() {
    return [styles];
  }

  render() {
    return html`
      <vaadin-app-layout id="layout">
        <div id="topbar" slot="navbar" theme="dark">
          <header slot="navbar">
            <img id="logo" src="images/logo.png" alt="${appStore.applicationName} logo" />
            <h1>${appStore.applicationName}</h1>
            <vaadin-avatar></vaadin-avatar>
          </header>
          <vaadin-tabs slot="navbar" id="tabs" .selected="${this.getSelectedViewRoute()}">
            ${this.getMenuRoutes().map(
              (viewRoute) => html`
                <vaadin-tab>
                  <a href="${router.urlForPath(viewRoute.path)}" tabindex="-1">${viewRoute.title}</a>
                </vaadin-tab>
              `
            )}
          </vaadin-tabs>
        </div>
        <slot></slot>
      </vaadin-app-layout>
    `;
  }

  private getMenuRoutes(): ViewRoute[] {
    return views.filter((route) => route.title);
  }

  private getSelectedViewRoute(): number {
    return this.getMenuRoutes().findIndex((viewRoute) => viewRoute.path == appStore.location);
  }
}
