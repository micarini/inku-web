# Limpia los SVG exportados de Figma: saca el fondo de la sección y del frame.
import re,sys
for f in sys.argv[1:]:
    s=open(f,encoding='utf-8').read()
    s=re.sub(r'<rect width="[\d.]+" height="[\d.]+" fill="#F5F5F5"/>\n?','',s,count=1)
    s=re.sub(r'<path d="[^"]*" fill="#1E1D1B"/>\n?','',s,count=1)
    s=re.sub(r'<path d="[^"]*" fill="black" fill-opacity="0.1"/>\n?','',s,count=1)
    s=re.sub(r'<rect width="1920" height="1080" transform="translate\([^)]*\)" fill="#[0-9A-F]{6}"/>\n?','',s,count=1)
    s=re.sub(r' id="[^"]*"','',s)
    s=s.replace('#D6392A','#C42A26').replace('#F2EFE4','#F4EFE3')
    open(f,'w',encoding='utf-8').write(s)
    print(f,len(s))
