import VisualizeComponent from './components/VisualizeComponent';

function ContentScript() {
  this.showForTables = {};
  this.initVisualizeComponents();
  this.addMutationObserver();
}

ContentScript.prototype.initVisualizeComponents = function initVisualizeComponents() {
  this.allTables = document.querySelectorAll('table');

  this.allTables.forEach((table) => {
    if (!this.showForTables[table]) {
      const visualizeComponent = new VisualizeComponent(table);
      this.showForTables[table] = true;
    }
  });
};

ContentScript.prototype.addMutationObserver = function addMutationObserver() {
  const observer = new MutationObserver((mutations) => {
    // add button
    // console.log('mutation', mutations);
    this.initVisualizeComponents();
  });
  observer.observe(document, {
    childList: true,
    subtree: true,
  });
};

const contentScript = new ContentScript();
