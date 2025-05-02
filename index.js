class BrightnessOverlay {
  constructor(panel) {
    this.overlayId = "brightness-overlay";
    this.entity = null;
    this.unsubscribe = null;
    this.apply(panel);
  }

  apply(panel) {
    const waitForConfig = () => {
      const config = panel.lovelace?.config;
      if (!config) {
        return setTimeout(waitForConfig, 100);
      }

      const overlayCfg = config.brightness_overlay;
      if (!overlayCfg?.entity) {
        return;
      }

      this.entity = overlayCfg.entity;
      this.createOverlay();
      this.update();
      this.setupSubscription();
    };

    waitForConfig();
  }

  async setupSubscription() {
    try {
      const conn = (await window.hassConnection).conn;
      this.unsubscribe = await conn.subscribeEvents((event) => {
        if (
          event.event_type === "state_changed" &&
          event.data.entity_id === this.entity
        ) {
          this.update();
        }
      }, "state_changed");
    } catch (e) {
      console.error("❌ [overlay] error on subscription:", e);
    }
  }

  createOverlay() {
    if (document.getElementById(this.overlayId)) return;

    const overlay = document.createElement("div");
    overlay.id = this.overlayId;
    overlay.style.position = "fixed";
    overlay.style.top = 0;
    overlay.style.left = 0;
    overlay.style.width = "100%";
    overlay.style.height = "100%";
    overlay.style.pointerEvents = "none";
    overlay.style.zIndex = 9999;
    overlay.style.transition = "background-color 0.5s ease";
    overlay.style.backgroundColor = "rgba(0,0,0,0)";
    document.body.appendChild(overlay);
  }

  update() {
    const ha = document.querySelector("home-assistant");
    const stateObj = ha?.hass?.states?.[this.entity];

    if (!stateObj) {
      return;
    }

    const val = parseFloat(stateObj.state) || 0;
    const opacity = (100 - val) / 100;
    const overlay = document.getElementById(this.overlayId);
    if (overlay) {
      overlay.style.backgroundColor = `rgba(0, 0, 0, ${opacity.toFixed(2)})`;
    }
  }

  clear() {
    if (this.unsubscribe && typeof this.unsubscribe === "function") {
      this.unsubscribe();
      this.unsubscribe = null;
    }

    const overlay = document.getElementById(this.overlayId);
    if (overlay) {
      overlay.remove();
    }
  }
}

// Überwacht Panel-Wechsel und initialisiert BrightnessOverlay bei jedem neuen Lovelace-Panel
const initOverlay = (panel) => {
  const instance = new BrightnessOverlay(panel);

  const observer = new MutationObserver(() => {
    const stillPanel = panel.shadowRoot?.host?.tagName === "HA-PANEL-LOVELACE";
    const stillOverlay = panel.lovelace?.config?.brightness_overlay;

    if (!stillPanel || !stillOverlay) {
      instance.clear();
      observer.disconnect();
    }
  });

  observer.observe(panel.shadowRoot || panel, {
    childList: true,
    subtree: true,
  });
};

// Startet das System bei jedem Dashboard-Wechsel
const watchLovelacePanels = () => {
  const ha = document.querySelector("home-assistant");
  const main = ha?.shadowRoot?.querySelector("home-assistant-main");

  if (!main?.shadowRoot) {
    return setTimeout(watchLovelacePanels, 200);
  }

  const panel = main.shadowRoot.querySelector("ha-panel-lovelace");
  if (panel) initOverlay(panel);

  new MutationObserver((mutations) => {
    for (const m of mutations) {
      for (const node of m.addedNodes) {
        if (node.localName === "ha-panel-lovelace") {
          initOverlay(node);
        }
      }
    }
  }).observe(main.shadowRoot, {
    childList: true,
    subtree: true,
  });
};

customElements.whenDefined("hui-view").then(() => {
  watchLovelacePanels();
});
