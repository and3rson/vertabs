'use babel';

const path = require('path');

export default class VertabsView {

  constructor(serializedState) {
    // Create root element
    this.element = document.createElement('div');
    this.element.classList.add('vertabs');
    this.element.classList.add('tab-bar');
  }

  // Returns an object that can be retrieved when package is activated
  serialize() {}

  render() {
    const currentItem = atom.workspace.getActivePaneItem();

    while (this.element.firstChild) {
        this.element.removeChild(this.element.firstChild);
    }

    const panes = atom.workspace.getPanes();

    panes.forEach((pane, i) => {
        if (panes.length > 1) {
            this.element.appendChild(this.createGroupElement(
                i + 1
            ));
        }

        pane.getItems().forEach(item => {
            this.element.appendChild(this.createTabElement(
                item,
                item == currentItem,
                pane
            ));
        });
    });
  }

  createTabElement(item, isActive, pane) {
      const tabElement = document.createElement('div');
      tabElement.classList.add('vertabs-tab');
      tabElement.classList.add('tab');
      tabElement.setAttribute('data-type', item.constructor.name);

      const titleElement = document.createElement('div');
      titleElement.classList.add('title');
      titleElement.classList.add('icon');

      if (item.constructor.name == 'TextEditor') {
          if (item.buffer.file) {
              const name = path.basename(item.buffer.file.path);
              titleElement.textContent = name;
              titleElement.setAttribute('data-name', name);
              titleElement.setAttribute('data-path', item.buffer.file.path);
          } else {
              titleElement.textContent = 'untitled';
          }
      } else {
          titleElement.textContent = item.constructor.name.replace(/View$/, '');
      }

      tabElement.appendChild(titleElement);

      if (isActive) {
          tabElement.classList.add('vertabs-active');
          tabElement.style.backgroundColor = atom.config.get('vertabs.activeBg');
          tabElement.style.color = atom.config.get('vertabs.activeFg');
      }
      tabElement.addEventListener('click', () => {
          pane.activate();
          pane.setActiveItem(item);
      });
      return tabElement;
  }

  createGroupElement(index) {
      const groupElement = document.createElement('div');
      groupElement.textContent = `Group ${index}`;
      groupElement.classList.add('vertabs-group');
      return groupElement;
  }

  // Tear down any state and detach
  destroy() {
    this.element.remove();
  }

  getElement() {
    return this.element;
  }

}
