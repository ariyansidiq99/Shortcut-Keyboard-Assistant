const commands = [
  { label: 'Go to Features', shortcut: 'G F', action: () => log('Navigating to Features') },
  { label: 'Go to Pricing', shortcut: 'G P', action: () => log('Navigating to Pricing') },
  { label: 'Toggle Dark Mode', shortcut: 'T D', action: () => log('Dark mode toggled') },
  { label: 'New Campaign', shortcut: 'N C', action: () => log('New campaign created') },
  { label: 'Open Analytics', shortcut: 'O A', action: () => log('Analytics opened') },
  { label: 'Export Data', shortcut: 'E D', action: () => log('Data exported') },
];

const overlay = document.querySelector("#overlay");
const paletteInput = document.querySelector("#paletteInput");
const paletteList = document.querySelector("#paletteList");
const output = document.querySelector("#output");

let selectedIndex = 0;

function log(msg) {
  output.textContent = msg;
  closePalette();
}

function renderCommands(filter = "") {
  const filtered = commands.filter(c =>
    c.label.toLowerCase().includes(filter.toLowerCase())
  );

  paletteList.innerHTML = '';

  filtered.forEach((cmd, i) => {
    const li = document.createElement("li");

    li.className = "palette_item" + (i === 0 ? " is-selected" : "");
    li.dataset.index = i;

    li.innerHTML = `
      <span class="palette_item-label">${cmd.label}</span>
      <span class="palette_item-shortcut">${cmd.shortcut}</span>
    `;

    li.addEventListener("click", () => cmd.action());

    paletteList.appendChild(li);
  });

  selectedIndex = 0;

  return filtered;
}

function openPalette() {
  overlay.classList.add("is-open");
  paletteInput.value = "";
  renderCommands();
  paletteInput.focus();
}

function closePalette() {
  overlay.classList.remove("is-open");
}

document.addEventListener("keydown", (e) => {

  if ((e.ctrlKey || e.metaKey) && e.key === "k") {
    e.preventDefault();
    overlay.classList.contains("is-open") ? closePalette() : openPalette();
    return;
  }

  if (e.key === "Escape") {
    closePalette();
    return;
  }

});

paletteInput.addEventListener("keydown", (e) => {

  const items = paletteList.querySelectorAll(".palette_item");

  if (e.key === "ArrowDown") {
    e.preventDefault();
    items[selectedIndex]?.classList.remove("is-selected");
    selectedIndex = Math.min(selectedIndex + 1, items.length - 1);
    items[selectedIndex]?.classList.add("is-selected");
  }

  if (e.key === "ArrowUp") {
    e.preventDefault();
    items[selectedIndex]?.classList.remove("is-selected");
    selectedIndex = Math.max(selectedIndex - 1, 0);
    items[selectedIndex]?.classList.add("is-selected");
  }

  if (e.key === "Enter") {
    const filtered = commands.filter(c =>
      c.label.toLowerCase().includes(paletteInput.value.toLowerCase())
    );

    if (filtered[selectedIndex]) filtered[selectedIndex].action();
  }

});

paletteInput.addEventListener("input", (e) =>
  renderCommands(e.target.value)
);

overlay.addEventListener("click", (e) => {
  if (e.target === overlay) closePalette();
});