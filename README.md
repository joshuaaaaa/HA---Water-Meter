# Water Meter Card pro Home Assistant

Custom karta pro Home Assistant, která zobrazuje spotřebu vody a vypadá přesně jako skutečný vodoměr.

![Water Meter Card](preview.png)

## Funkce

- 🎯 **Realistický design** - Vypadá jako skutečný mechanický vodoměr
- 📊 **Hlavní displej** - Zobrazuje celkovou spotřebu vody v m³
- ⚙️ **Rotační ciferníky** - 4 animované ciferníky pro desetinná místa (x1, x0.1, x0.01, x0.001)
- 🎨 **Modrý rámeček** - Charakteristický modrý obal vodoměru
- 🔧 **Konfigurovatelné** - K-faktor, sériové číslo, název
- ⚡ **Automatické aktualizace** - Reaguje na změny senzoru v reálném čase

## Instalace

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

## Konfigurace

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
meter_name: Studená voda
k_factor: "0.25"
serial: "ZC-122107"
```

## Parametry

| Parametr | Typ | Povinný | Výchozí | Popis |
|----------|-----|---------|---------|-------|
| `entity` | string | Ano | - | ID entity senzoru vodoměru |
| `title` | string | Ne | "Spotřeba vody" | Název karty (zobrazuje se nad kruhem) |
| `meter_name` | string | Ne | "" | Vlastní označení vodoměru (zobrazuje se uvnitř kruhu nahoře) |
| `k_factor` | string | Ne | "0.25" | K-faktor vodoměru |
| `serial` | string | Ne | "ZC-122107" | Sériové číslo vodoměru |

## Příklady použití

### S MQTT senzorem

```yaml
# configuration.yaml
mqtt:
  sensor:
    - name: "Vodoměr"
      state_topic: "home/water/total"
      unit_of_measurement: "m³"
      device_class: water
      state_class: total_increasing
```

```yaml
# ui-lovelace.yaml
type: custom:water-meter-card
entity: sensor.vodomer
title: Studená voda
meter_name: KUCHYŇ
k_factor: "0.25"
serial: "CW-123456"
```

### S template senzorem

```yaml
# configuration.yaml
template:
  - sensor:
      - name: "Celková spotřeba vody"
        unit_of_measurement: "m³"
        state: >
          {{ states('sensor.water_pulse_counter') | float / 1000 }}
        device_class: water
        state_class: total_increasing
```

```yaml
# ui-lovelace.yaml
type: custom:water-meter-card
entity: sensor.celkova_spotreba_vody
```

## Kompatibilita

- Home Assistant 2021.12+
- Funguje s jakýmkoliv senzorem, který vrací číselnou hodnotu
- Nejlépe s `device_class: water` a `state_class: total_increasing`

## Tipy

1. **Jednotky**: Karta očekává hodnoty v m³ (metrech krychlových)
2. **Desetinná místa**: Karta zobrazuje 3 desetinná místa
3. **Animace**: Rotační ciferníky se plynule otáčejí při změně hodnoty
4. **Responzivní**: Karta se automaticky přizpůsobuje šířce kontejneru

## Ukázka

Karta zobrazuje:
- **Hlavní displej**: 5 číslic pro celkovou spotřebu (např. 00012 m³)
- **4 rotační ciferníky**:
  - x1 (jednotky)
  - x0.1 (desetiny)
  - x0.01 (setiny)
  - x0.001 (tisíciny)
- **Technické údaje**: K-faktor, sériové číslo, ISO norma, tlak

## Podpora

Pokud najdete chybu nebo máte návrh na vylepšení, otevřete issue na GitHubu.

## Licence

MIT License

## Autor

Vytvořeno pro Home Assistant komunitu 🏠💧
