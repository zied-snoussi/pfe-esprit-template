"""Tiny draw.io (mxGraph) writer with UML helpers. Coordinates are absolute pixels."""
from xml.sax.saxutils import escape, quoteattr

FONT = "fontFamily=Helvetica;fontSize=13;"
INK = "#1E1E1E"
BLUE_FILL, BLUE_STROKE = "#EAF0FF", "#4355F9"
GREY_FILL, GREY_STROKE = "#F4F4F6", "#808080"
PFE_FILL, PFE_STROKE = "#FFF1E6", "#E8590C"  # highlight (pfe=True): what the internship adds


class Diagram:
    def __init__(self, name):
        self.name = name
        self.cells = []
        self.n = 0

    def _id(self, prefix):
        self.n += 1
        return f"{prefix}{self.n}"

    # ------------------------------------------------------------------ primitives
    def vertex(self, label, x, y, w, h, style, id=None, parent="1"):
        id = id or self._id("v")
        self.cells.append(
            f'<mxCell id="{id}" value={quoteattr(label)} style="{FONT}{style}" vertex="1" parent="{parent}">'
            f'<mxGeometry x="{x}" y="{y}" width="{w}" height="{h}" as="geometry"/></mxCell>')
        return id

    def edge(self, src=None, tgt=None, label="", style="", points=(), sp=None, tp=None, ends=None, id=None, lx=None):
        """Edge between cells (src/tgt ids) or free points (sp/tp). ends=(source_label, target_label)."""
        id = id or self._id("e")
        attrs = (f' source="{src}"' if src else "") + (f' target="{tgt}"' if tgt else "")
        geo = "".join([
            f'<mxPoint x="{sp[0]}" y="{sp[1]}" as="sourcePoint"/>' if sp else "",
            f'<mxPoint x="{tp[0]}" y="{tp[1]}" as="targetPoint"/>' if tp else "",
            ('<Array as="points">' + "".join(f'<mxPoint x="{x}" y="{y}"/>' for x, y in points) + "</Array>") if points else "",
        ])
        self.cells.append(
            f'<mxCell id="{id}" value={quoteattr(label)} style="{FONT}html=1;rounded=0;labelBackgroundColor=#FFFFFF;'
            f'strokeColor={INK};fontColor={INK};{style}" edge="1" parent="1"{attrs}>'
            f'<mxGeometry relative="1" as="geometry">{geo}</mxGeometry></mxCell>')
        if ends:
            for value, pos in zip(ends, (-1, 1)):
                if value:
                    self.cells.append(
                        f'<mxCell id="{self._id("l")}" value={quoteattr(value)} style="{FONT}edgeLabel;resizable=0;html=1;'
                        f'align={"left" if pos < 0 else "right"};verticalAlign=bottom;fontSize=12;labelBackgroundColor=none;" '
                        f'vertex="1" connectable="0" parent="{id}"><mxGeometry x="{pos * 0.92}" relative="1" as="geometry">'
                        f'<mxPoint x="0" y="-3" as="offset"/></mxGeometry></mxCell>')
        if lx is not None:  # move the main label along the edge (-1 = source, 1 = target)
            self.cells[-1 - sum(1 for e in (ends or ()) if e)] = self.cells[-1 - sum(1 for e in (ends or ()) if e)].replace(
                '<mxGeometry relative="1" as="geometry">', f'<mxGeometry x="{lx}" relative="1" as="geometry">', 1)
        return id

    def text(self, label, x, y, w, h, style=""):
        return self.vertex(label, x, y, w, h, "text;html=1;whiteSpace=wrap;align=left;verticalAlign=top;" + style)

    # ------------------------------------------------------------------ UML: use cases
    def actor(self, label, x, y, stereotype=None):
        lab = (f"«{stereotype}»<br>" if stereotype else "") + label
        return self.vertex(lab, x, y, 36, 72, "shape=umlActor;verticalLabelPosition=bottom;verticalAlign=top;html=1;"
                           f"outlineConnect=0;whiteSpace=wrap;fillColor=#FFFFFF;strokeColor={INK};strokeWidth=1.5;")

    def usecase(self, label, x, y, w=230, h=56, pfe=False):
        fill, stroke = (PFE_FILL, PFE_STROKE) if pfe else (BLUE_FILL, BLUE_STROKE)
        return self.vertex(label, x, y, w, h, f"ellipse;whiteSpace=wrap;html=1;fillColor={fill};strokeColor={stroke};")

    def boundary(self, label, x, y, w, h):
        return self.vertex(label, x, y, w, h, "rounded=0;whiteSpace=wrap;html=1;verticalAlign=top;align=center;"
                           f"fillColor=none;strokeColor={INK};fontStyle=1;fontSize=15;spacingTop=6;")

    ASSOC = "endArrow=none;"
    INCLUDE = "endArrow=open;dashed=1;endSize=10;"
    GENERAL = "endArrow=block;endFill=0;endSize=14;"

    # ------------------------------------------------------------------ UML: classes
    def klass(self, name, x, y, attrs=(), ops=(), stereotype=None, existing=False, w=280):
        fill, stroke = (GREY_FILL, GREY_STROKE) if existing else (BLUE_FILL, BLUE_STROKE)
        head = (f"<i>«{escape(stereotype)}»</i><br>" if stereotype else "") + f"<b>{escape(name)}</b>"
        body = "".join(f'<p style="margin:0 6px;">{escape(a)}</p>' for a in attrs)
        html = f'<p style="margin:0;margin-top:5px;text-align:center;">{head}</p><hr size="1" style="border-style:solid;"/>{body}'
        if ops:
            html += '<hr size="1" style="border-style:solid;"/>' + "".join(f'<p style="margin:0 6px;">{escape(o)}</p>' for o in ops)
        h = 34 + (18 if stereotype else 0) + 18.5 * len(attrs) + (10 + 18.5 * len(ops) if ops else 0) + 10
        return self.vertex(html, x, y, w, int(h), "verticalAlign=top;align=left;overflow=fill;html=1;whiteSpace=wrap;"
                           f"fillColor={fill};strokeColor={stroke};fontSize=12;"), int(h)

    COMPOSITION = "endArrow=none;startArrow=diamondThin;startFill=1;startSize=16;"
    ASSOCIATION = "endArrow=none;"

    # ------------------------------------------------------------------ UML: sequences
    def lifeline(self, label, x, height, actor=False, w=150, y=20):
        if actor:  # small stick figure, name under it, lifeline below
            cx = x + w / 2
            self.vertex(label, cx - 15, y, 30, height,
                        "shape=umlLifeline;participant=umlActor;perimeter=lifelinePerimeter;whiteSpace=nowrap;html=1;"
                        "container=0;collapsible=0;recursiveResize=0;verticalAlign=top;spacingTop=44;outlineConnect=0;"
                        f"size=46;fillColor=#FFFFFF;strokeColor={INK};labelBackgroundColor=#FFFFFF;")
            return cx
        self.vertex(label, x, y, w, height, "shape=umlLifeline;perimeter=lifelinePerimeter;whiteSpace=wrap;html=1;"
                    "container=0;collapsible=0;recursiveResize=0;outlineConnect=0;size=46;"
                    f"fillColor={BLUE_FILL};strokeColor={BLUE_STROKE};")
        return x + w / 2

    def activation(self, cx, y1, y2):
        self.acts = getattr(self, "acts", []) + [(cx, y1, y2)]
        self.vertex("", cx - 6, y1, 12, y2 - y1, f"html=1;fillColor=#FFFFFF;strokeColor={INK};")

    def _on_bar(self, x, y):
        return any(abs(cx - x) < 1 and y1 <= y <= y2 for cx, y1, y2 in getattr(self, "acts", []))

    def msg(self, x1, x2, y, label, kind="sync"):
        """Messages are resolved at output time so they start and end on the activation bars."""
        self.msgs = getattr(self, "msgs", []) + [(x1, x2, y, label, kind)]

    def _emit_msgs(self):
        for x1, x2, y, label, kind in getattr(self, "msgs", []):
            d = 1 if x2 > x1 else -1
            a = x1 + 6 * d if self._on_bar(x1, y) else x1
            b = x2 - 6 * d if self._on_bar(x2, y) else x2
            style = {"sync": "endArrow=block;endFill=1;", "async": "endArrow=open;endSize=10;",
                     "return": "endArrow=open;dashed=1;endSize=10;"}[kind]
            self.edge(label=label, style=style + "verticalAlign=bottom;", sp=(a, y), tp=(b, y))
        self.msgs = []

    def self_msg(self, x, y, label, h=26):
        return self.edge(label=label, style="endArrow=block;endFill=1;align=left;spacingLeft=6;labelBackgroundColor=none;",
                         sp=(x + 6, y), tp=(x + 6, y + h), points=((x + 40, y), (x + 40, y + h)))

    def frame(self, kind, x, y, w, h, guards=()):
        """Combined fragment; guards = [(y, '[condition]'), ...] — the first is drawn at the top, others add a separator."""
        self.vertex(kind, x, y, w, h, "shape=umlFrame;whiteSpace=wrap;html=1;width=60;height=24;fillColor=none;"
                    f"strokeColor={INK};fontStyle=1;")
        for i, (gy, guard) in enumerate(guards):
            if i:
                self.edge(style="endArrow=none;dashed=1;", sp=(x, gy), tp=(x + w, gy))
            self.text(guard, x + 66 if i == 0 else x + 8, gy + (2 if i == 0 else 4), 360, 20, "fontStyle=2;fontSize=12;")

    def note(self, label, x, y, w, h):
        return self.vertex(label, x, y, w, h, "shape=note;whiteSpace=wrap;html=1;size=14;align=left;spacingLeft=8;"
                           "fillColor=#FFFBE6;strokeColor=#B8A44C;fontSize=12;")

    # ------------------------------------------------------------------ UML: activities, states
    def initial(self, x, y):
        return self.vertex("", x, y, 26, 26, f"ellipse;html=1;fillColor={INK};strokeColor={INK};")

    def final(self, x, y):
        return self.vertex("", x, y, 30, 30, f"ellipse;html=1;shape=endState;fillColor={INK};strokeColor={INK};")

    def flow_final(self, x, y):
        return self.vertex("", x, y, 26, 26, f"shape=sumEllipse;perimeter=ellipsePerimeter;html=1;fillColor=#FFFFFF;strokeColor={INK};")

    def action(self, label, x, y, w=210, h=52, pfe=False):
        fill, stroke = (PFE_FILL, PFE_STROKE) if pfe else (BLUE_FILL, BLUE_STROKE)
        return self.vertex(label, x, y, w, h, f"rounded=1;arcSize=30;whiteSpace=wrap;html=1;fillColor={fill};strokeColor={stroke};")

    def decision(self, label, x, y, w=150, h=70):
        return self.vertex(label, x, y, w, h, f"rhombus;whiteSpace=wrap;html=1;fillColor=#FFFFFF;strokeColor={INK};fontSize=12;")

    def merge(self, x, y):
        return self.vertex("", x, y, 34, 34, f"rhombus;html=1;fillColor=#FFFFFF;strokeColor={INK};")

    def lane(self, label, x, y, w, h):
        return self.vertex(label, x, y, w, h, "swimlane;startSize=34;html=1;fillColor=#F4F4F6;swimlaneFillColor=none;"
                           f"strokeColor={GREY_STROKE};fontStyle=1;")

    FLOW = "edgeStyle=orthogonalEdgeStyle;endArrow=open;endSize=10;"

    def state(self, label, x, y, w=170, h=60, pfe=False):
        return self.action(label, x, y, w, h, pfe)

    # ------------------------------------------------------------------ UML: deployment
    def node(self, label, x, y, w, h, stereotype="device", fill="#FFFFFF", stroke=INK):
        return self.vertex(f"«{stereotype}»<br><b>{escape(label)}</b>", x, y, w, h,
                           "shape=cube;whiteSpace=wrap;html=1;boundedLbl=1;backgroundOutline=1;darkOpacity=0.05;"
                           f"darkOpacity2=0.1;size=12;verticalAlign=top;align=left;spacingLeft=10;spacingTop=4;"
                           f"fillColor={fill};strokeColor={stroke};")

    def artifact(self, label, x, y, w=210, h=60, stereotype="container", pfe=False):
        fill, stroke = (PFE_FILL, PFE_STROKE) if pfe else (BLUE_FILL, BLUE_STROKE)
        return self.vertex(f"«{stereotype}»<br><b>{escape(label.split(chr(10))[0])}</b>"
                           + "".join(f"<br><font style='font-size:11px'>{escape(l)}</font>" for l in label.split("\n")[1:]),
                           x, y, w, h, f"rounded=0;whiteSpace=wrap;html=1;fillColor={fill};strokeColor={stroke};fontSize=12;")

    # ------------------------------------------------------------------ output
    def xml(self):
        self._emit_msgs()
        return ('<mxfile host="Claude" type="device"><diagram id="d" name=' + quoteattr(self.name) + '>'
                '<mxGraphModel grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="0" '
                'pageScale="1" math="0" shadow="0"><root><mxCell id="0"/><mxCell id="1" parent="0"/>'
                + "".join(self.cells) + "</root></mxGraphModel></diagram></mxfile>")
