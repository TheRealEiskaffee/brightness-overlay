# 🌓 Brightness Overlay

Dim your entire Home Assistant dashboard using the value of any numeric entity. Perfect for creating day/night modes, visual focus effects, or dynamic ambient dimming.

![Preview](example-brightness-overlay.gif)

---

## ✨ Features

* Global brightness overlay on any Lovelace dashboard
* Works with any numeric entity (e.g., `input_number`, `sensor.lux`, `number.dashboard_brightness`)
* Requires a value in the **0–100 range** to calculate the opacity
* Fully reactive (no polling)
* Automatically removed on dashboard change
* Designed for performance and simplicity

---

## 📦 Installation

### Manual

1. Download `brightness-overlay.js` from the [latest release](https://github.com/TheRealEiskaffee/brightness-overlay/releases).
2. Place the file in your Home Assistant `config/www/` directory.
3. Add it to your Lovelace resources:

```yaml
type: module
url: /local/brightness-overlay.js?v=1.0.1
```

4. Restart Home Assistant or refresh your browser.

### HACS (Home Assistant Community Store)

> 💡 When adding this via **HACS > Custom Repositories**, make sure to set the **category to `Dashboard`** if `Frontend` is not available in your list.

1. Go to **HACS > Frontend**
2. Click the three dots (⋮) > **Custom Repositories**
3. Add this repository:

```
https://github.com/TheRealEiskaffee/brightness-overlay
```

4. Set the category to **Frontend**
5. Install and reload your dashboard

[![Add to HACS](https://img.shields.io/badge/HACS-Add%20Custom%20Repository-blue?logo=home-assistant\&style=for-the-badge)](https://hacs.xyz/docs/faq/custom_repositories/)

> 💡 Once HACS support is approved, this will also be available under HACS > Frontend directly.

---

## 🚀 Usage

Add the following to the top of your YAML-mode dashboard configuration:

```yaml
title: My Dashboard
brightness_overlay:
  entity: number.dashboard_brightness
views:
  - title: Home
    cards:
      ...
```

> The overlay opacity is automatically calculated as `(100 - value) / 100`.
>
> ⚠️ The entity must return a numeric value **between 0 and 100**. Values above 100 will be treated as 0 (fully dark).

Example:

* Entity value = 0 → fully dark (`rgba(0, 0, 0, 1.0)`)
* Entity value = 100 → fully transparent

---

## 🔄 Entity Suggestions

* `input_number.dashboard_brightness`
* `sensor.lux`
* `sensor.sun_elevation` (normalized to 0–100)
* `number.screen_dimmer`

---

## 💡 Use Cases

* 🌓 Manual night mode slider
* 🔆 Light-based dashboard dimming
* 🧘 Focus mode overlays
* 🌇 Ambient transitions at sunset

---

## 📋 Example Automation

Automatically dim dashboard at sunset:

```yaml
alias: Dim dashboard at night
trigger:
  - platform: sun
    event: sunset
action:
  - service: input_number.set_value
    target:
      entity_id: input_number.dashboard_brightness
    data:
      value: 20
```

---

## 🛠 Advanced Options (coming soon)

Planned:

* Custom overlay color
* Opacity factor
* `input_boolean` toggle control

---

## ❓ FAQ

**Q: Does it work with multiple dashboards?**
Yes! Each dashboard can define its own `brightness_overlay` section.

**Q: Will it interfere with other cards?**
No. It uses a non-interactive full-screen `<div>` overlay with `pointer-events: none` and high `z-index`.

**Q: Can I make it invert (100 = dark, 0 = transparent)?**
Not yet, but it will be configurable in a future release.

## 📄 License

MIT License. Created with ❤️ for the Home Assistant community.

---

## 🌐 Links

* GitHub: [TheRealEiskaffee/brightness-overlay](https://github.com/TheRealEiskaffee/brightness-overlay)
* Issues: [GitHub Issues](https://github.com/TheRealEiskaffee/brightness-overlay/issues)
* Home Assistant Docs: [https://www.home-assistant.io](https://www.home-assistant.io)

---

*This project is not affiliated with or endorsed by Home Assistant.*
