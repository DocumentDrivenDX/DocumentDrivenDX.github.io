const tabs = document.querySelector('.workflow-tabs');
const panels = Array.from(document.querySelectorAll('.workflow-panel'));

tabs.setAttribute('role', 'tablist');

const buttons = panels.map((panel) => {
  const button = document.createElement('button');
  button.type = 'button';
  button.id = `${panel.id}-tab`;
  button.textContent = panel.dataset.label;
  button.setAttribute('role', 'tab');
  button.setAttribute('aria-controls', panel.id);
  panel.setAttribute('role', 'tabpanel');
  panel.setAttribute('aria-labelledby', button.id);
  panel.tabIndex = 0;
  tabs.append(button);
  return button;
});

function selectStage(index) {
  buttons.forEach((button, position) => {
    const active = index === position;
    button.setAttribute('aria-selected', String(active));
    button.tabIndex = active ? 0 : -1;
    panels[position].hidden = !active;
  });
}

function revealLinkedPanel(hash) {
  const index = panels.findIndex((panel) => hash === `#${panel.id}`);
  if (index === -1 || !panels[index].hidden) return;

  selectStage(index);
  return panels[index];
}

document.querySelectorAll('.workflow-link').forEach((link) => {
  link.addEventListener('click', (event) => {
    if (event.button || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

    // Reveal the target before native fragment navigation scrolls to it.
    revealLinkedPanel(link.hash);
  });
});

window.addEventListener('hashchange', () => {
  revealLinkedPanel(window.location.hash)?.scrollIntoView();
});

buttons.forEach((button, index) => {
  button.addEventListener('click', () => selectStage(index));
  button.addEventListener('keydown', (event) => {
    const targets = {
      ArrowRight: (index + 1) % buttons.length,
      ArrowLeft: (index - 1 + buttons.length) % buttons.length,
      Home: 0,
      End: buttons.length - 1,
    };
    if (!Object.hasOwn(targets, event.key)) return;
    event.preventDefault();
    const next = targets[event.key];
    selectStage(next);
    buttons[next].focus();
  });
});

selectStage(0);
tabs.hidden = false;
revealLinkedPanel(window.location.hash)?.scrollIntoView();
