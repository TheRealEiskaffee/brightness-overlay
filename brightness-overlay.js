const OVERLAY_ID = "brightness-overlay";
const VERSION = "1.0.1";
let unsubscribe = null;

console.info(`🌓 Brightness Overlay - v${VERSION}`);

function createOverlay() {
  if (document.getElementById(OVERLAY_ID)) return;
  const el = document.createElement("div");
  el.id = OVERLAY_ID;
  Object.assign(el.style, {
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      pointerEvents: "none",
      zIndex: 9999,
      backgroundColor: "rgba(0,0,0,0)",
      transition: "background-color 0.5s ease",
  });
  document.body.appendChild(el);
}

function updateOverlay(entity) {
  const ha = document.querySelector("home-assistant");
  const state = ha?.hass?.states?.[entity];
  if (!state) return;
  const val = parseFloat(state.state) || 0;
  const opacity = (100 - val) / 100;
  const el = document.getElementById(OVERLAY_ID);
  if (el) el.style.backgroundColor = `rgba(0, 0, 0, ${opacity.toFixed(2)})`;
}

async function subscribeToEntity(entity) {
  const conn = (await window.hassConnection).conn;
  unsubscribe = await conn.subscribeEvents((event) => {
    if (
        event.event_type === "state_changed" &&
        event.data.entity_id === entity
    ) {
       updateOverlay(entity);
    }
  }, "state_changed");
}

function cleanup() {
  if (typeof unsubscribe === "function") {
      unsubscribe();
      unsubscribe = null;
  }
  const el = document.getElementById(OVERLAY_ID);
  if (el) el.remove();
}

function applyBrightnessOverlayIfConfigured() {
  const ha = document.querySelector("home-assistant");
  const panel = ha?.shadowRoot
    ?.querySelector("home-assistant-main")
    ?.shadowRoot?.querySelector("ha-panel-lovelace");

  const config = panel?.lovelace?.config;
  const overlayCfg = config?.brightness_overlay;

  if (overlayCfg?.entity) {
    createOverlay();
    updateOverlay(overlayCfg.entity);
    subscribeToEntity(overlayCfg.entity);
  } else {
    cleanup();
  }
}

function start() {
  applyBrightnessOverlayIfConfigured();

  window.addEventListener("location-changed", () => {
    setTimeout(() => {
      applyBrightnessOverlayIfConfigured();
    }, 200);
  });
}

customElements.whenDefined("hui-view").then(start);
