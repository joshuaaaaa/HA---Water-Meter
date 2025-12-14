# Water Meter Card for Home Assistant

A custom card for Home Assistant that displays water consumption and looks exactly like a real water meter.

![Water Meter Card](preview.png)

## ✨ Features

- 🎯 **Realistic design** - Looks like a real mechanical water meter
- 📊 **Main display** - Shows total water consumption in m³ (5 digits)
- ⚙️ **Rotating dials** - 4 functional animated dials with pointers (x1, x0.1, x0.01, x0.001)
- 🔢 **Number markers** - Dials have 0 and 5 markers for better readability
- 🎨 **Blue frame** - Characteristic blue housing of water meter
- 🔧 **Configurable** - K-factor, serial number, custom name
- 📏 **Scalable size** - small, medium, large, xlarge, or custom in pixels
- 🌈 **HA theme support** - Automatically adapts to your Home Assistant theme
- 📐 **HA compliant** - Supports getCardSize() and getGridOptions() per HA standards
- ⚡ **Auto updates** - Responds to sensor changes in real-time

## 📦 Installation

### HACS (Recommended)

1. Open HACS in Home Assistant
2. Click on "Frontend"
3. Click the menu icon (three dots) in the top right corner
4. Select "Custom repositories"
5. Add this repository URL
6. Select category "Lovelace"
7. Click "Add"
8. Find "Water Meter Card" in the list and install

### Manual Installation

1. Download the `water-meter-card.js` file
2. Copy it to the `config/www/` folder in your Home Assistant installation
3. Add the following to `configuration.yaml`:

```yaml
lovelace:
  resources:
    - url: /local/water-meter-card.js
      type: module
```

4. Restart Home Assistant
5. Clear browser cache (Ctrl+F5)

## ⚙️ Configuration

### Minimal configuration

```yaml
type: custom:water-meter-card
entity: sensor.water_meter
```

### Full configuration

```yaml
type: custom:water-meter-card
entity: sensor.water_meter
title: Water Consumption
meter_name: KITCHEN
k_factor: "0.25"
serial: "ZC-122107"
size: medium
use_theme: true
```

## 📋 Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `entity` | string | ✅ Yes | - | Water meter sensor entity ID |
| `title` | string | No | "Spotřeba vody" | Card title (displayed above circle) |
| `meter_name` | string | No | "" | Custom meter designation (displayed inside circle at top) |
| `k_factor` | string | No | "0.25" | Water meter K-factor (displayed in circle) |
| `serial` | string | No | "ZC-122107" | Serial number (displayed in circle) |
| `size` | string/number | No | "medium" | Size: "small", "medium", "large", "xlarge", or number in px |
| `use_theme` | boolean | No | true | Use HA theme colors (true) or blue (false) |

### Sizes

| Size | Diameter | Card Height | HA Grid | Use Case |
|------|----------|-------------|---------|----------|
| `small` | 196px | ~250px (5 units) | 6 columns | Sidebar panel |
| `medium` | 280px | ~350px (7 units) | 8 columns | Default |
| `large` | 364px | ~450px (9 units) | 10 columns | Main dashboard |
| `xlarge` | 448px | ~550px (11 units) | 12 columns | Large displays |
| `350` | 350px | ~450px | Custom | Custom size |

## 💡 Usage Examples

### Different sizes

```yaml
# Small card for sidebar
type: custom:water-meter-card
entity: sensor.water_meter
size: small
title: Water

# Large card for main dashboard
type: custom:water-meter-card
entity: sensor.water_meter
size: large
meter_name: HOUSEHOLD

# Custom size
type: custom:water-meter-card
entity: sensor.water_meter
size: 350
```

### With / without theme

```yaml
# With HA theme (adapts to colors)
type: custom:water-meter-card
entity: sensor.water_meter
use_theme: true

# Classic blue color
type: custom:water-meter-card
entity: sensor.water_meter
use_theme: false
```

### With MQTT sensor

```yaml
# configuration.yaml
mqtt:
  sensor:
    - name: "Cold Water Meter"
      state_topic: "home/water/cold/total"
      unit_of_measurement: "m³"
      device_class: water
      state_class: total_increasing
```

```yaml
# ui-lovelace.yaml
type: custom:water-meter-card
entity: sensor.cold_water_meter
title: Cold Water
meter_name: COLD
k_factor: "0.25"
serial: "CW-2024-001"
```

### With template sensor

```yaml
# configuration.yaml
template:
  - sensor:
      - name: "Total Water Consumption"
        unit_of_measurement: "m³"
        state: >
          {{ (states('sensor.water_pulse_counter') | float / 1000) | round(3) }}
        device_class: water
        state_class: total_increasing
```

```yaml
# ui-lovelace.yaml
type: custom:water-meter-card
entity: sensor.total_water_consumption
meter_name: TOTAL
```

### Multiple meters

```yaml
# Side by side
type: horizontal-stack
cards:
  - type: custom:water-meter-card
    entity: sensor.water_meter_cold
    title: Cold Water
    meter_name: COLD
    size: small

  - type: custom:water-meter-card
    entity: sensor.water_meter_hot
    title: Hot Water
    meter_name: HOT
    size: small
```

### With utility meter

```yaml
# configuration.yaml
utility_meter:
  water_daily:
    source: sensor.water_meter
    cycle: daily

  water_monthly:
    source: sensor.water_meter
    cycle: monthly
```

```yaml
# ui-lovelace.yaml
type: vertical-stack
cards:
  - type: custom:water-meter-card
    entity: sensor.water_meter
    title: Total Consumption
    size: large

  - type: entities
    title: Statistics
    entities:
      - entity: sensor.water_daily
        name: Today
      - entity: sensor.water_monthly
        name: This Month
```

## 🎨 Card Appearance

```
┌─────────────────────────┐
│   Water Consumption     │  ← title
└─────────────────────────┘
    ╔═══════════════╗
    ║ K=0.25    SN  ║  ← K-factor & serial number
    ║    KITCHEN    ║  ← meter_name (optional)
    ║               ║
    ║Q₃ 2.5   1.6MPa║  ← Specifications
    ║               ║
    ║  [00078 m³]   ║  ← Main display (5 digits)
    ║               ║
    ║   ╭─╮  ╭─╮    ║
    ║ 0 │↑│0 │↗│ 5  ║  ← Dials with pointers & markers
    ║   ╰─╯  ╰─╯    ║
    ║ x0.001 x0.01  ║  ← Dial labels
    ║ ISO4064       ║
    ╚═══════════════╝
```

## 🔍 How Dials Work

Dials display decimal places of the value:

**Example: 12.753 m³**

- **Main display**: `00012` m³
- **x1 dial**: Pointer points to `2` (ones)
- **x0.1 dial**: Pointer points to `7` (tenths)
- **x0.01 dial**: Pointer points to `5` (hundredths)
- **x0.001 dial**: Pointer points to `3` (thousandths)

Each dial has **0** (top) and **5** (bottom) markers for easier reading.

## 🌈 Theme Support

The card supports Home Assistant themes:

| Color | HA Variable | Usage |
|-------|-------------|-------|
| Blue circle | `--primary-color` | Main circle color |
| Red pointers | `--accent-color` | Pointers and markers |
| Text | `--primary-text-color` | Main text |
| Gray text | `--secondary-text-color` | Secondary text |
| Background | `--card-background` | Card background |
| Borders | `--divider-color` | Element borders |

If you set `use_theme: false`, the card uses classic blue color (#4a90e2).

## 🔧 Compatibility

- **Home Assistant**: 2021.12+
- **Masonry view**: ✅ Supports getCardSize()
- **Sections view**: ✅ Supports getGridOptions()
- **Grid view**: ✅ Respects actual dimensions
- **Mobile**: ✅ Fully responsive
- **Themes**: ✅ Supports HA themes

## 📱 Tips

1. **Units**: Card expects values in m³ (cubic meters)
2. **Decimal places**: Display shows 5 digits, dials show 3 decimal places
3. **Device class**: We recommend `device_class: water` and `state_class: total_increasing`
4. **Cache**: Clear browser cache after installation (Ctrl+F5)
5. **YAML editor**: Card only supports YAML editor, not visual editor

## 🐛 Troubleshooting

### Card doesn't display
- Check that `water-meter-card.js` is in `/config/www/`
- Verify that resource is added in `configuration.yaml`
- Clear browser cache (Ctrl+F5)
- Restart Home Assistant

### "entity not found" error
- Check that entity exists in Developer Tools → States
- Verify correct `entity` ID
- Make sure entity returns a numeric value

### Meter goes outside card
- This bug was fixed in version 1.0.0
- Make sure you're using the latest version
- Clear browser cache

### Visual editor error
- This is normal - card only supports YAML editor
- Use YAML editor for configuration

## 📄 License

MIT License

## 🙏 Credits

Created for the Home Assistant community 🏠💧

---

🇬🇧 English README | [🇨🇿 Czech README](README.cs.md)
