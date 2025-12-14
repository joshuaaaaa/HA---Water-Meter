# Water Meter Card pro Home Assistant

Custom karta pro Home Assistant, která zobrazuje spotřebu vody a vypadá přesně jako skutečný vodoměr.

![Water Meter Card](preview.png)

## ✨ Funkce

- 🎯 **Realistický design** - Vypadá jako skutečný mechanický vodoměr
- 📊 **Hlavní displej** - Zobrazuje celkovou spotřebu vody v m³ (5 číslic)
- ⚙️ **Rotační ciferníky** - 4 funkční animované ciferníky s ručičkami (x1, x0.1, x0.01, x0.001)
- 🔢 **Číselné značky** - Budíky mají značky 0 a 5 pro lepší čitelnost
- 🎨 **Modrý rámeček** - Charakteristický modrý obal vodoměru
- 🔧 **Konfigurovatelné** - K-faktor, sériové číslo, vlastní název
- 📏 **Škálovatelná velikost** - small, medium, large, xlarge, nebo vlastní v pixelech
- 🌈 **Podpora témat HA** - Automaticky se přizpůsobí vašemu Home Assistant tématu
- 📐 **HA kompatibilní** - Podporuje getCardSize() a getGridOptions() podle HA standardů
- ⚡ **Automatické aktualizace** - Reaguje na změny senzoru v reálném čase

## 📦 Instalace

### HACS (Doporučeno)

1. Otevřete HACS v Home Assistant
2. Klikněte na "Frontend"
3. Klikněte na ikonu menu (tři tečky) v pravém horním rohu
4. Vyberte "Custom repositories"
5. Přidejte URL tohoto repozitáře
6. Vyberte kategorii "Lovelace"
7. Klikněte na "Add"
8. Najděte "Water Meter Card" v seznamu a nainstalujte

### Ruční instalace

1. Stáhněte soubor `water-meter-card.js`
2. Zkopírujte ho do složky `config/www/` ve vaší instalaci Home Assistant
3. Přidejte následující do `configuration.yaml`:

```yaml
lovelace:
  resources:
    - url: /local/water-meter-card.js
      type: module
```

4. Restartujte Home Assistant
5. Vyčistěte cache prohlížeče (Ctrl+F5)

## ⚙️ Konfigurace

### Minimální konfigurace

```yaml
type: custom:water-meter-card
entity: sensor.water_meter
```

### Plná konfigurace

```yaml
type: custom:water-meter-card
entity: sensor.water_meter
title: Spotřeba vody
meter_name: KUCHYŇ
k_factor: "0.25"
serial: "ZC-122107"
size: medium
use_theme: true
```

## 📋 Parametry

| Parametr | Typ | Povinný | Výchozí | Popis |
|----------|-----|---------|---------|-------|
| `entity` | string | ✅ Ano | - | ID entity senzoru vodoměru |
| `title` | string | Ne | "Spotřeba vody" | Název karty (zobrazuje se nad kruhem) |
| `meter_name` | string | Ne | "" | Vlastní označení vodoměru (zobrazuje se uvnitř kruhu nahoře) |
| `k_factor` | string | Ne | "0.25" | K-faktor vodoměru (zobrazuje se v kruhu) |
| `serial` | string | Ne | "ZC-122107" | Sériové číslo vodoměru (zobrazuje se v kruhu) |
| `size` | string/number | Ne | "medium" | Velikost: "small", "medium", "large", "xlarge", nebo číslo v px |
| `use_theme` | boolean | Ne | true | Použít barvy z HA tématu (true) nebo modrou (false) |

### Velikosti

| Size | Průměr | Výška karty | HA Grid | Použití |
|------|--------|-------------|---------|---------|
| `small` | 196px | ~250px (5 jednotek) | 6 sloupců | Postranní panel |
| `medium` | 280px | ~350px (7 jednotek) | 8 sloupců | Výchozí |
| `large` | 364px | ~450px (9 jednotek) | 10 sloupců | Hlavní dashboard |
| `xlarge` | 448px | ~550px (11 jednotek) | 12 sloupců | Velké displeje |
| `350` | 350px | ~450px | Vlastní | Vlastní velikost |

## 💡 Příklady použití

### Různé velikosti

```yaml
# Malá karta pro postranní panel
type: custom:water-meter-card
entity: sensor.water_meter
size: small
title: Voda

# Velká karta pro hlavní dashboard
type: custom:water-meter-card
entity: sensor.water_meter
size: large
meter_name: DOMÁCNOST

# Vlastní velikost
type: custom:water-meter-card
entity: sensor.water_meter
size: 350
```

### S tématem / bez tématu

```yaml
# S tématem HA (přizpůsobí se barvám)
type: custom:water-meter-card
entity: sensor.water_meter
use_theme: true

# Klasická modrá barva
type: custom:water-meter-card
entity: sensor.water_meter
use_theme: false
```

### S MQTT senzorem

```yaml
# configuration.yaml
mqtt:
  sensor:
    - name: "Vodoměr studená voda"
      state_topic: "home/water/cold/total"
      unit_of_measurement: "m³"
      device_class: water
      state_class: total_increasing
```

```yaml
# ui-lovelace.yaml
type: custom:water-meter-card
entity: sensor.vodomer_studena_voda
title: Studená voda
meter_name: STUDENÁ
k_factor: "0.25"
serial: "CW-2024-001"
```

### S template senzorem

```yaml
# configuration.yaml
template:
  - sensor:
      - name: "Celková spotřeba vody"
        unit_of_measurement: "m³"
        state: >
          {{ (states('sensor.water_pulse_counter') | float / 1000) | round(3) }}
        device_class: water
        state_class: total_increasing
```

```yaml
# ui-lovelace.yaml
type: custom:water-meter-card
entity: sensor.celkova_spotreba_vody
meter_name: CELKEM
```

### Více vodoměrů

```yaml
# Vedle sebe
type: horizontal-stack
cards:
  - type: custom:water-meter-card
    entity: sensor.water_meter_cold
    title: Studená voda
    meter_name: STUDENÁ
    size: small

  - type: custom:water-meter-card
    entity: sensor.water_meter_hot
    title: Teplá voda
    meter_name: TEPLÁ
    size: small
```

### S utility meter

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
    title: Celková spotřeba
    size: large

  - type: entities
    title: Statistiky
    entities:
      - entity: sensor.water_daily
        name: Dnes
      - entity: sensor.water_monthly
        name: Tento měsíc
```

## 🎨 Vzhled karty

```
┌─────────────────────────┐
│    Spotřeba vody        │  ← title
└─────────────────────────┘
    ╔═══════════════╗
    ║ K=0.25    SN  ║  ← K-faktor & sériové číslo
    ║    KUCHYŇ     ║  ← meter_name (volitelné)
    ║               ║
    ║Q₃ 2,5   1.6MPa║  ← Specifikace
    ║               ║
    ║  [00078 m³]   ║  ← Hlavní displej (5 číslic)
    ║               ║
    ║   ╭─╮  ╭─╮    ║
    ║ 0 │↑│0 │↗│ 5  ║  ← Budíky s ručičkami a značkami
    ║   ╰─╯  ╰─╯    ║
    ║ x0.001 x0.01  ║  ← Popisky budíků
    ║ ISO4064       ║
    ╚═══════════════╝
```

## 🔍 Jak fungují budíky

Budíky zobrazují desetinná místa hodnoty:

**Příklad: 12.753 m³**

- **Hlavní displej**: `00012` m³
- **x1 dial**: Ručička ukazuje na `2` (jednotky)
- **x0.1 dial**: Ručička ukazuje na `7` (desetiny)
- **x0.01 dial**: Ručička ukazuje na `5` (setiny)
- **x0.001 dial**: Ručička ukazuje na `3` (tisíciny)

Každý budík má značky **0** (nahoře) a **5** (dole) pro snadnější čtení.

## 🌈 Podpora témat

Karta podporuje Home Assistant témata:

| Barva | HA Proměnná | Použití |
|-------|-------------|---------|
| Modrý kruh | `--primary-color` | Hlavní barva kruhu |
| Červené ručičky | `--accent-color` | Ručičky a značky |
| Text | `--primary-text-color` | Hlavní text |
| Šedý text | `--secondary-text-color` | Vedlejší text |
| Pozadí | `--card-background` | Pozadí karty |
| Ohraničení | `--divider-color` | Ohraničení prvků |

Pokud nastavíte `use_theme: false`, karta použije klasickou modrou barvu (#4a90e2).

## 🔧 Kompatibilita

- **Home Assistant**: 2021.12+
- **Masonry view**: ✅ Podporuje getCardSize()
- **Sections view**: ✅ Podporuje getGridOptions()
- **Grid view**: ✅ Respektuje skutečné rozměry
- **Mobile**: ✅ Plně responzivní
- **Themes**: ✅ Podporuje HA témata

## 📱 Tipy

1. **Jednotky**: Karta očekává hodnoty v m³ (metrech krychlových)
2. **Desetinná místa**: Displej zobrazuje 5 číslic, budíky 3 desetinná místa
3. **Device class**: Doporučujeme `device_class: water` a `state_class: total_increasing`
4. **Cache**: Po instalaci vyčistěte cache prohlížeče (Ctrl+F5)
5. **YAML editor**: Karta podporuje pouze YAML editor, ne visual editor

## 🐛 Řešení problémů

### Karta se nezobrazuje
- Zkontrolujte, že je `water-meter-card.js` v `/config/www/`
- Ověřte, že je resource přidán v `configuration.yaml`
- Vyčistěte cache prohlížeče (Ctrl+F5)
- Restartujte Home Assistant

### Chyba "entity not found"
- Zkontrolujte, že entita existuje v Developer Tools → States
- Ověřte správnost `entity` ID
- Ujistěte se, že entita vrací číselnou hodnotu

### Vodoměr vylézá mimo kartu
- Tato chyba byla opravena ve verzi 1.0.0
- Ujistěte se, že používáte nejnovější verzi
- Vyčistěte cache prohlížeče

### Visual editor chyba
- Toto je normální - karta podporuje pouze YAML editor
- Použijte YAML editor pro konfiguraci

## 📄 Licence

MIT License

## 🙏 Poděkování

Vytvořeno pro Home Assistant komunitu 🏠💧

---

[🇬🇧 English README](README.md) | 🇨🇿 České README
