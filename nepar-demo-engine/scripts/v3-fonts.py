"""Optional maintainer step: python -m pip install fonttools[woff].

Retain original glyph metrics and all weight values used by the V3 renderer.
Committed outputs let the ordinary npm asset pipeline run without Python.
"""
from pathlib import Path
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont
from fontTools import subset

out = Path('assets/health-trust-v3/fonts')
out.mkdir(parents=True, exist_ok=True)
for family in ['cormorant-garamond', 'dm-sans']:
    for block in ['latin', 'latin-ext']:
        source = Path(f'node_modules/@fontsource-variable/{family}/files/{family}-{block}-wght-normal.woff2')
        font = TTFont(source, recalcTimestamp=False)
        font = instantiateVariableFont(font, {'wght': (400, 600)}, inplace=False)
        if block == 'latin-ext':
            options = subset.Options()
            options.layout_features = ['*']
            sub = subset.Subsetter(options=options)
            # Latin Extended A, Romanian comma accents, German capital sharp S.
            sub.populate(unicodes=list(range(0x100, 0x180)) + list(range(0x218, 0x21C)) + [0x1E9E])
            sub.subset(font)
        font.flavor = 'woff2'
        target = out / f'{family}-{block}.woff2'
        font.save(target)
        print(f'{target.name}: {source.stat().st_size} -> {target.stat().st_size} bytes')
