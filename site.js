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
