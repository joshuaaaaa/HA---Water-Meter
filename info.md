# Water Meter Card

Realistická karta vodoměru pro Home Assistant

## Funkce

✅ Realistický design jako skutečný vodoměr
✅ Hlavní digitální displej (5 číslic)
✅ 4 animované rotační ciferníky
✅ Modrý charakteristický rámeček
✅ Konfigurovatelný K-faktor a sériové číslo
✅ Automatické aktualizace v reálném čase

## Rychlý start

```yaml
type: custom:water-meter-card
entity: sensor.water_meter
```

## Screenshot

Karta zobrazuje:
- Modrý kruhový rámeček (jako skutečný vodoměr)
- Hlavní displej s 5 číslicemi
- K-faktor a sériové číslo nahoře
- 4 rotační ciferníky dole (x1, x0.1, x0.01, x0.001)
- Technické specifikace (Q₃, R80, ISO4064, tlak)
- Jednotka m³

Pro více informací viz [README.md](README.md)
