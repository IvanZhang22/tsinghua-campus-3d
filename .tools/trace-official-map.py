from PIL import Image
from collections import deque
from array import array
import json
Image.MAX_IMAGE_PIXELS=200000000
im=Image.open('artifacts/reference/official-map-202512.jpg').convert('RGB')
# Eight source pixels per sample. The legend and title are outside this crop.
x0,y0,step=1650,3700,8
im=im.crop((x0,y0,9850,14550)); im=im.resize((im.width//step,im.height//step))
w,h=im.size; raw=im.tobytes(); mask=bytearray(w*h)
for i in range(w*h):
 r,g,b=raw[i*3:i*3+3]
 if 125<r<190 and 160<g<220 and b>200 and b>g+8:mask[i]=4
 elif 110<r<185 and 80<g<165 and 140<b<205 and b>g+10:mask[i]=1
 elif r>195 and 120<g<195 and b<110:mask[i]=2
 elif 110<r<175 and 155<g<220 and 150<b<215 and g>r+12:mask[i]=3
# Fill narrow black lettering gaps without joining separate building blocks.
for _ in range(2):
 old=mask[:]
 for y in range(1,h-1):
  for x in range(1,w-1):
   i=y*w+x
   if old[i]==0:
    if old[i-1] and old[i-1]==old[i+1]:mask[i]=old[i-1]
    elif old[i-w] and old[i-w]==old[i+w]:mask[i]=old[i-w]
visited=bytearray(w*h); results=[]
def simplify(points,tol=1.3):
 if len(points)<4:return points
 a,b=points[0],points[-1]; dx,dy=b[0]-a[0],b[1]-a[1]; norm=(dx*dx+dy*dy)**.5
 dist=[abs(dy*(p[0]-a[0])-dx*(p[1]-a[1]))/norm if norm else ((p[0]-a[0])**2+(p[1]-a[1])**2)**.5 for p in points]
 j=max(range(len(points)),key=lambda k:dist[k])
 if dist[j]<=tol:return [a,b]
 return simplify(points[:j+1],tol)[:-1]+simplify(points[j:],tol)
for start,kind in enumerate(mask):
 if not kind or visited[start]:continue
 visited[start]=1; q=deque([start]); pixels=[]
 while q:
  i=q.popleft();pixels.append(i); x,y=i%w,i//w
  for j in ([i-1] if x else [])+([i+1] if x<w-1 else [])+([i-w] if y else [])+([i+w] if y<h-1 else []):
   if not visited[j] and mask[j]==kind:visited[j]=1;q.append(j)
 if len(pixels)<20:continue
 xs=[i%w for i in pixels];ys=[i//w for i in pixels];cx=x0+sum(xs)/len(xs)*step;cy=y0+sum(ys)/len(ys)*step
 # Exclude the lower-left legend, outer transport symbols and header fragments.
 if (cx<3050 and cy>11700) or cx<1750 or cy<3780:continue
 group=set(pixels); edges={}
 for i in pixels:
  x,y=i%w,i//w
  if i-w not in group:edges[(x,y)]=(x+1,y)
  if i+1 not in group:edges[(x+1,y)]=(x+1,y+1)
  if i+w not in group:edges[(x+1,y+1)]=(x,y+1)
  if i-1 not in group:edges[(x,y+1)]=(x,y)
 rings=[]
 while edges:
  a=next(iter(edges));path=[a];b=edges.pop(a)
  while b in edges and b!=a:path.append(b);b=edges.pop(b)
  if len(path)>5:
   mid=len(path)//2;p=simplify(path[:mid+1])+simplify(path[mid:]+[path[0]])[1:];rings.append(p)
 if not rings:continue
 rings.sort(key=lambda p:abs(sum(a[0]*b[1]-b[0]*a[1] for a,b in zip(p,p[1:]+p[:1]))),reverse=True)
 ring=rings[0]
 results.append({'kind':kind,'center':[round(cx),round(cy)],'ring':[[x0+x*step,y0+y*step] for x,y in ring]})
with open('artifacts/reference/traced-map.json','w') as f:json.dump(results,f)
print('Official-map traced shapes:',len(results))
