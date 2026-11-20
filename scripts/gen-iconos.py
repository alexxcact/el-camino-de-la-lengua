# Reduce los PNG maestros de gen-iconos.mjs a cada densidad de Android y a assets/.
# Uso: python scripts/gen-iconos.py <carpetaMaestros>
import sys, os
from PIL import Image

src = sys.argv[1]
res = os.path.join('android', 'app', 'src', 'main', 'res')
tam = {'mdpi': 108, 'hdpi': 162, 'xhdpi': 216, 'xxhdpi': 324, 'xxxhdpi': 432}
maestros = {n: Image.open(os.path.join(src, n + '.png')).convert('RGBA') for n in ('full', 'round', 'fg')}
for dens, lado in tam.items():
    d = os.path.join(res, 'mipmap-' + dens)
    for archivo, m in (('ic_launcher.png', 'full'), ('ic_launcher_round.png', 'round'), ('ic_launcher_foreground.png', 'fg')):
        maestros[m].resize((lado, lado), Image.LANCZOS).save(os.path.join(d, archivo), optimize=True)
maestros['full'].convert('RGB').save(os.path.join('assets', 'images', 'icon.png'), optimize=True)
maestros['fg'].save(os.path.join('assets', 'images', 'adaptive-icon.png'), optimize=True)
maestros['full'].resize((48, 48), Image.LANCZOS).save(os.path.join('assets', 'images', 'favicon.png'), optimize=True)
print('ok')
