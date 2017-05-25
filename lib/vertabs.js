'use babel';

import VertabsView from './vertabs-view';
import { CompositeDisposable } from 'atom';

export default {

  vertabsView: null,

  config: {
      activeFg: {
          title: 'Active tab text color',
          type: 'color',
          default: '#FFFFFF'
      },
      activeBg: {
          title: 'Active tab background color',
          type: 'color',
          default: '#CC3E44'
      }
  },

  activate(state) {
    console.log('Activate vertabs');

    atom.packages.activatePackage('tree-view').then(this.create.bind(true));
  },

  create() {
    const treePanel = atom.workspace.getLeftPanels()[0];
    const treePanelView = atom.views.getView(treePanel);
    const treeView = treePanelView.querySelector('.tree-view');

    const vertabsView = new VertabsView();
    treeView.insertBefore(vertabsView.element, treeView.firstChild);

    atom.workspace.observeActivePaneItem(vertabsView.render.bind(vertabsView));
    atom.workspace.observeActivePane(vertabsView.render.bind(vertabsView));
    atom.workspace.onDidDestroyPaneItem(vertabsView.render.bind(vertabsView));
    atom.workspace.onDidDestroyPane(vertabsView.render.bind(vertabsView));

    vertabsView.render();

    this.vertabsView = vertabsView;
  },

  deactivate() {
    this.modalPanel.destroy();
    this.vertabsView && this.vertabsView.destroy();
  },

  serialize() {
    return {
    //   vertabsViewState: this.vertabsView.serialize()
    };
  },
};
