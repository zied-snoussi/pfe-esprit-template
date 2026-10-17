"""Génère les diagrammes UML du projet (fichiers draw.io) dans ../ .

Usage :  python build_diagrams.py            (tous les diagrammes)
Rendu :  node render.js                      (PNG dans ../png/ et ../../rapport/figures/uml/)

Chaque fonction décrit un diagramme avec les aides de drawio.py (coordonnées absolues en pixels).
pfe=True met un élément en orange : ce que le stage ajoute (à utiliser pour distinguer existant / nouveau).
Les .drawio restent modifiables à la main dans draw.io, mais une nouvelle génération écrase ces retouches :
modifiez plutôt ce script.
"""
from pathlib import Path

from drawio import BLUE_STROKE, GREY_STROKE, INK, PFE_STROKE, Diagram

OUT = Path(__file__).resolve().parent.parent
D = Diagram


# =============================================================================== 1. cas d'utilisation
def use_cases():
    d = D("Cas d'utilisation global")
    d.boundary("MediBook · Plateforme de prise de rendez-vous", 250, 20, 760, 1010)

    pat = d.actor("Patient", 100, 150)
    sec = d.actor("Secrétaire", 100, 520)
    pra = d.actor("Praticien", 100, 800)
    adm = d.actor("Administrateur<br>clinique", 1090, 600)
    sms = d.actor("Service de<br>notification", 1090, 200, "système")

    A, B = 290, 650
    L = "entryX=0;entryY=0.5;"
    R = "entryX=1;entryY=0.5;"
    pat_cases = ["Rechercher un praticien", "Réserver un rendez-vous", "Déplacer un rendez-vous",
                 "Annuler un rendez-vous", "Consulter son historique"]
    sec_cases = ["Gérer les rendez-vous du jour", "Confirmer la présence", "Bloquer un créneau"]
    pra_cases = ["Définir ses horaires", "Déclarer une absence", "Consulter son planning"]
    ids = {}
    for actor, cases, top in ((pat, pat_cases, 70), (sec, sec_cases, 470), (pra, pra_cases, 730)):
        for i, c in enumerate(cases):
            ids[c] = d.usecase(c, A, top + 75 * i)
            d.edge(actor, ids[c], style=d.ASSOC + L)

    auth = d.usecase("S'authentifier", B, 300)
    remind = d.usecase("Envoyer un rappel", B, 110, pfe=True)
    staff = d.usecase("Gérer le personnel", B, 560)
    motifs = d.usecase("Gérer les motifs de consultation", B, 640)
    stats = d.usecase("Consulter le tableau de bord", B, 720, pfe=True)
    sub = d.usecase("Gérer l'abonnement", B, 800)
    for c in (staff, motifs, stats, sub):
        d.edge(adm, c, style=d.ASSOC + R)
    d.edge(sms, remind, style=d.ASSOC + R)

    inc, ext = "«include»", "«extend»"
    d.edge(ids["Réserver un rendez-vous"], auth, inc, d.INCLUDE)
    d.edge(ids["Gérer les rendez-vous du jour"], auth, inc, d.INCLUDE)
    d.edge(ids["Réserver un rendez-vous"], remind, ext, d.INCLUDE)
    d.edge(ids["Déplacer un rendez-vous"], ids["Réserver un rendez-vous"], ext, d.INCLUDE + "exitX=0.15;exitY=0;entryX=0.15;entryY=1;")
    d.note("Orange : fonctions ajoutées pendant le stage.", 650, 940, 320, 40)
    return d


# =============================================================================== 2. classes
def classes():
    d = D("Diagramme de classes d'analyse")
    c = [40, 420, 800, 1180]
    r = [40, 330, 620, 950]

    abo, _ = d.klass("Abonnement", c[0], r[0], ["offre : Texte", "nbPraticiensMax : Entier",
                     "debut : Date", "fin : Date [0..1]", "enEssai : Booléen"], existing=True)
    clin, _ = d.klass("Clinique", c[1], r[0], ["nom : Texte", "ville : Texte", "adresse : Adresse",
                      "fuseauHoraire : Texte", "statut : StatutClinique"], ops=["+ suspendre()", "+ reactiver()"])
    pers, _ = d.klass("Personnel", c[2], r[0], ["email : Email", "nom : Texte", "role : Role"], existing=True)
    d.klass("Role", c[3], r[0], ["ADMIN_CLINIQUE", "SECRETAIRE", "PRATICIEN"], stereotype="enumeration", w=220)

    agenda, _ = d.klass("PlageHoraire", c[0], r[1], ["jour : JourSemaine", "debut : Heure", "fin : Heure"])
    prat, _ = d.klass("Praticien", c[1], r[1], ["specialite : Texte", "numeroOrdre : Texte", "photo : Fichier [0..1]"])
    motif, _ = d.klass("MotifConsultation", c[2], r[1], ["libelle : Texte", "dureeMinutes : Entier", "tarif : Montant [0..1]"])

    absn, _ = d.klass("Absence", c[0], r[2], ["debut : DateHeure", "fin : DateHeure", "motif : Texte [0..1]"])
    cren, _ = d.klass("Creneau", c[1], r[2], ["debut : DateHeure", "fin : DateHeure", "disponible : Booléen",
                      "version : Entier"])
    rdv, _ = d.klass("RendezVous", c[2], r[2], ["statut : StatutRdv", "creeLe : DateHeure", "note : Texte [0..1]"],
                     ops=["+ confirmer()", "+ deplacer(c : Creneau)", "+ annuler(motif : Texte)", "+ marquerAbsent()"])
    pat, _ = d.klass("Patient", c[3], r[2], ["nom : Texte", "telephone : Téléphone", "email : Email",
                     "dateNaissance : Date", "langue : fr | en | ar"], w=260)
    rap, _ = d.klass("Rappel", c[2], r[3], ["canal : SMS | EMAIL", "prevuLe : DateHeure", "envoyeLe : DateHeure [0..1]",
                     "statut : StatutEnvoi"])

    A, K = d.ASSOCIATION, d.COMPOSITION
    d.edge(clin, abo, "souscrit", A, ends=("1", "0..*"))
    d.edge(clin, pers, "emploie", A, ends=("1", "1..*"))
    d.edge(clin, prat, "", K, ends=("1", "1..*"))
    d.edge(clin, motif, "propose", A, ends=("1", "1..*"))
    d.edge(prat, agenda, "", K, ends=("1", "0..*"))
    d.edge(prat, absn, "déclare", A, ends=("1", "0..*"))
    d.edge(prat, cren, "", K, ends=("1", "0..*"))
    d.edge(cren, rdv, "réservé par", A, ends=("1", "0..1"))
    d.edge(rdv, pat, "concerne", A, ends=("*", "1"))
    d.edge(rdv, motif, "pour", A, ends=("*", "1"))
    d.edge(rdv, rap, "", K, ends=("1", "0..*"))

    d.vertex("", 40, 980, 26, 18, f"fillColor=#F4F4F6;strokeColor={GREY_STROKE};")
    d.text("Classe réutilisée de l'existant", 74, 978, 260, 22)
    d.vertex("", 40, 1010, 26, 18, f"fillColor=#EAF0FF;strokeColor={BLUE_STROKE};")
    d.text("Classe introduite par le projet", 74, 1008, 260, 22)
    return d


# =============================================================================== 3. séquence
def seq_booking():
    d = D("Séquence : prise de rendez-vous")
    names = [("Patient", True), (":Application React", False), (":RendezVousController", False),
             (":RendezVousService", False), (":PostgreSQL", False), (":RabbitMQ", False), (":ServiceNotification", False)]
    x = [d.lifeline(n, 20 + 200 * i, 800, actor=a) for i, (n, a) in enumerate(names)]
    pat, ui, ctl, svc, db, mq, ntf = x
    d.msg(pat, ui, 120, "1 : choisir un créneau")
    d.activation(ui, 120, 560)
    d.msg(ui, ctl, 160, "2 : POST /api/rendez-vous")
    d.activation(ctl, 160, 530)
    d.self_msg(ctl, 180, "3 : vérifier le jeton (Keycloak)")
    d.msg(ctl, svc, 245, "4 : reserver(creneauId, patient)")
    d.activation(svc, 245, 500)
    d.msg(svc, db, 310, "5 : UPDATE creneau SET disponible=false<br>WHERE version = :v")
    d.frame("alt", 440, 325, 1040, 140, [(325, "[créneau déjà pris]"), (390, "[créneau libre]")])
    d.msg(svc, ctl, 365, "6 : CreneauIndisponible (409)", "return")
    d.msg(svc, db, 425, "7 : INSERT rendez_vous (CONFIRME)")
    d.msg(svc, mq, 450, "8 : publier rdv.confirme", "async")
    d.msg(svc, ctl, 500, "9 : rendez-vous créé", "return")
    d.msg(ctl, ui, 530, "10 : 201 Created", "return")
    d.msg(ui, pat, 560, "11 : afficher la confirmation", "return")
    d.text("En asynchrone :", 40, 600, 300, 22, "fontStyle=2;")
    d.msg(mq, ntf, 640, "12 : rdv.confirme", "async")
    d.activation(ntf, 640, 720)
    d.self_msg(ntf, 660, "13 : planifier le rappel J-1")
    d.note("Le verrou optimiste (colonne version) empêche<br>deux patients de réserver le même créneau.", 40, 700, 380, 50)
    return d


# =============================================================================== 4. activité
def act_booking():
    d = D("Activité : prise de rendez-vous")
    lanes = ["Patient", "Plateforme MediBook", "Service de notification"]
    W = 340
    for i, l in enumerate(lanes):
        d.lane(l, i * W, 0, W, 1080)
    cx = [i * W + W / 2 for i in range(3)]
    a = lambda lane, y, label, pfe=False: d.action(label, cx[lane] - 105, y, pfe=pfe)
    F = d.FLOW
    s = d.initial(cx[0] - 13, 60)
    a1 = a(0, 110, "Rechercher un praticien")
    a2 = a(1, 200, "Afficher les créneaux libres")
    a3 = a(0, 290, "Choisir un créneau")
    d1 = d.decision("Connecté ?", cx[0] - 75, 380, 150, 70)
    a4 = a(0, 490, "Se connecter ou créer un compte")
    m = d.merge(cx[1] - 17, 400)
    a5 = a(1, 590, "Réserver le créneau")
    d2 = d.decision("Créneau encore<br>libre ?", cx[1] - 80, 690, 160, 80)
    a6 = a(0, 700, "Choisir un autre créneau")
    a7 = a(1, 820, "Confirmer le rendez-vous")
    a8 = a(2, 820, "Envoyer la confirmation", pfe=True)
    a9 = a(2, 920, "Planifier le rappel J-1", pfe=True)
    f = d.final(cx[2] - 15, 1010)
    d.edge(s, a1, style=F)
    d.edge(a1, a2, style=F + "exitX=1;exitY=0.5;entryX=0.5;entryY=0;")
    d.edge(a2, a3, style=F + "exitX=0;exitY=0.5;entryX=1;entryY=0.5;")
    d.edge(a3, d1, style=F)
    d.edge(d1, m, "[oui]", F + "exitX=1;exitY=0.5;entryX=0;entryY=0.5;")
    d.edge(d1, a4, "[non]", F)
    d.edge(a4, m, style=F + "exitX=1;exitY=0.5;entryX=0.5;entryY=1;")
    d.edge(m, a5, style=F + "exitX=1;exitY=0.5;entryX=1;entryY=0.5;", points=((cx[1] + 140, 417), (cx[1] + 140, 616)))
    d.edge(a5, d2, style=F)
    d.edge(d2, a6, "[non]", F + "exitX=0;exitY=0.5;entryX=1;entryY=0.5;")
    d.edge(a6, a3, style=F + "exitX=0;exitY=0.5;entryX=0;entryY=0.5;", points=((30, 726), (30, 316)))
    d.edge(d2, a7, "[oui]", F)
    d.edge(a7, a8, style=F + "exitX=1;exitY=0.5;entryX=0;entryY=0.5;")
    d.edge(a8, a9, style=F)
    d.edge(a9, f, style=F)
    return d


# =============================================================================== 5. états
def states_booking():
    d = D("États : rendez-vous")
    init = d.initial(40, 172)
    conf = d.state("Confirmé", 200, 155)
    dep = d.state("Déplacé", 200, 360)
    pres = d.state("Présence confirmée", 560, 155)
    term = d.state("Terminé", 920, 155)
    ann = d.state("Annulé", 560, 360)
    abs_ = d.state("Absent", 920, 360, pfe=True)
    fin = d.final(1200, 270)
    F = "endArrow=open;endSize=10;"
    d.edge(init, conf, "réservation", F)
    d.edge(conf, pres, "réponse au rappel", F)
    d.edge(pres, term, "consultation faite", F)
    d.edge(conf, dep, "", F + "exitX=0.3;exitY=1;entryX=0.3;entryY=0;")
    d.text("déplacement", 140, 290, 100, 22, "fontSize=12;")
    d.edge(dep, conf, "", F + "exitX=0.7;exitY=0;entryX=0.7;entryY=1;")
    d.text("nouveau créneau", 330, 290, 140, 22, "fontSize=12;")
    d.edge(conf, ann, "annulation<br>[> 2 h avant]", F + "exitX=1;exitY=0.85;entryX=0;entryY=0.15;")
    d.edge(pres, abs_, "heure dépassée<br>[patient absent]", F + "exitX=1;exitY=0.85;entryX=0;entryY=0.15;")
    d.edge(term, fin, "", F + "exitX=1;exitY=0.5;entryX=0.5;entryY=0;edgeStyle=orthogonalEdgeStyle;")
    d.edge(ann, fin, "", F + "exitX=0.5;exitY=1;entryX=0;entryY=1;edgeStyle=orthogonalEdgeStyle;", points=((645, 470), (1204, 470)))
    d.edge(abs_, fin, "", F)
    return d


# =============================================================================== 6. déploiement
def deployment():
    d = D("Déploiement")
    pc = d.node("Poste du patient / de la clinique", 20, 260, 280, 220)
    d.node("Navigateur web", 40, 320, 240, 140, "execution environment")
    d.artifact("Application React\nSPA (patient, clinique, admin)", 55, 380, 210, 60, "artifact")

    d.node("Cluster Kubernetes (production)", 350, 20, 900, 700)
    ing = d.artifact("Ingress NGINX\nHTTPS, cert-manager", 670, 80, 230, 64, "execution environment")
    web = d.artifact("medibook-web\nnginx, fichiers statiques", 390, 220, 230, 64, "pod")
    api = d.artifact("medibook-api ×2\nSpring Boot 3", 670, 220, 230, 64, "pod", pfe=True)
    kc = d.artifact("keycloak\nOIDC, rôles", 950, 220, 230, 64, "pod")
    ntf = d.artifact("medibook-notification\nconsommateur RabbitMQ", 950, 380, 230, 64, "pod", pfe=True)
    mq = d.artifact("rabbitmq\nfiles de rappels", 670, 380, 230, 64, "statefulset")
    pg = d.artifact("postgresql\nPostgreSQL 16", 390, 380, 230, 64, "statefulset")
    mon = d.artifact("Prometheus, Grafana\nmétriques et alertes", 390, 560, 230, 64, "pod")

    smsp = d.node("Fournisseur SMS", 1320, 360, 230, 90)
    mail = d.node("Serveur SMTP", 1320, 480, 230, 90)
    gh = d.node("GitHub Actions\n+ registre ghcr.io", 1320, 80, 230, 100)

    P = "endArrow=none;"
    d.edge(pc, ing, "HTTPS", P + "edgeStyle=orthogonalEdgeStyle;exitX=0.5;exitY=0;entryX=0;entryY=0.5;", points=((160, 112),))
    d.edge(ing, web, "", P)
    d.edge(ing, api, "/api", P)
    d.edge(ing, kc, "/auth", P)
    d.edge(api, kc, "JWKS", P)
    d.edge(api, pg, "JDBC", P)
    d.edge(api, mq, "AMQP", P)
    d.edge(mq, ntf, "AMQP", P)
    d.edge(ntf, smsp, "HTTPS", P + "exitX=1;exitY=0.3;entryX=0;entryY=0.5;")
    d.edge(ntf, mail, "SMTP", P + "exitX=1;exitY=0.8;entryX=0;entryY=0.5;")
    d.edge(mon, api, "scrape", "endArrow=open;dashed=1;endSize=10;edgeStyle=orthogonalEdgeStyle;exitX=1;exitY=0.5;entryX=0;entryY=0.75;", points=((645, 592), (645, 268)))
    d.edge(gh, ing, "déploie (kubectl apply)", "endArrow=open;dashed=1;endSize=10;")
    return d


DIAGRAMS = {
    "01-cas-utilisation-global": use_cases,
    "02-diagramme-classes": classes,
    "03-sequence-prise-rdv": seq_booking,
    "04-activite-prise-rdv": act_booking,
    "05-etats-rendez-vous": states_booking,
    "06-deploiement": deployment,
}

if __name__ == "__main__":
    for name, build in DIAGRAMS.items():
        (OUT / f"{name}.drawio").write_text(build().xml(), encoding="utf-8")
        print("wrote", name)
