export const LEGAL_CONTACT = { name: 'Kirill Lisochenko', email: 'k.lisochenko@web.de' };
export const LEGAL_DATE = '18. November 2026';

const L = {
  wikipedia: { label: 'Wikipedia · Liste der Berliner U-Bahnhöfe', href: 'https://de.wikipedia.org/wiki/Liste_der_Berliner_U-Bahnh%C3%B6fe' },
  ccbysa: { label: 'CC BY-SA 4.0 · Lizenztext', href: 'https://creativecommons.org/licenses/by-sa/4.0/deed.de' },
  wikidata: { label: 'Wikidata · Lizenz (CC0)', href: 'https://www.wikidata.org/wiki/Wikidata:Licensing' },
  osm: { label: 'OpenStreetMap · Urheberrecht und Lizenz', href: 'https://www.openstreetmap.org/copyright' },
  ofm: { label: 'OpenFreeMap', href: 'https://openfreemap.org/' },
  omt: { label: 'OpenMapTiles', href: 'https://openmaptiles.org/' },
  ghPrivacy: { label: 'GitHub · Privacy Statement', href: 'https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement' },
  ghPages: { label: 'GitHub · GitHub Pages und Verbindungsdaten', href: 'https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages' },
  wmPrivacy: { label: 'Wikimedia Foundation · Datenschutzrichtlinie', href: 'https://foundation.wikimedia.org/wiki/Policy:Privacy_policy/de' },
  baylda: { label: 'Bayerisches Landesamt für Datenschutzaufsicht (BayLDA)', href: 'https://www.lda.bayern.de/' },
};

export const LEGAL_DOCUMENTS = {
  impressum: {
    label: 'Impressum',
    title: 'Impressum',
    contactTitle: 'Anbieter und Kontakt',
    intro: 'Berliner U-Bahn ist ein eigenständiges GIS- und Visualisierungsprojekt, das die Entwicklung des Berliner U-Bahn-Netzes seit 1902 zeigt: Eröffnungen, Schließungen, Unterbrechungen und Umbenennungen von Bahnhöfen und Strecken. Es ist kein Angebot der BVG oder einer Behörde.',
    sections: [
      {
        title: 'Verantwortlich für die Inhalte',
        paragraphs: ['Kirill Lisochenko ist Anbieter dieser Anwendung und verantwortlich für ihre eigenen Inhalte. Für Fragen zum Projekt nutzen Sie bitte die oben genannte E-Mail-Adresse.'],
      },
      {
        title: 'Daten und Kartenquellen',
        paragraphs: [
          'Die Bahnhofs- und Streckendaten wurden aus der deutschsprachigen Wikipedia (Lizenz CC BY-SA 4.0), Wikidata (CC0) und OpenStreetMap (ODbL) zusammengestellt und von Hand geprüft und ergänzt, insbesondere Eröffnungs- und Schließungsdaten, Umbenennungen und Unterbrechungen. Historische Strecken, die heute nicht mehr existieren, sind teilweise näherungsweise eingezeichnet. Trotz sorgfältiger Prüfung können die Angaben Fehler enthalten.',
          'Die Linienfarben orientieren sich an den heutigen Farben der Berliner U-Bahn; ein Bahnhof wird der Linie zugeordnet, die ihn heute bedient.',
          'Der Kartenhintergrund stammt von OpenFreeMap auf Grundlage von OpenMapTiles und OpenStreetMap-Daten. Die Quellenangaben bleiben direkt am Kartenrand sichtbar.',
        ],
        links: [L.wikipedia, L.ccbysa, L.wikidata, L.osm, L.ofm, L.omt],
      },
    ],
  },
  datenschutz: {
    label: 'Datenschutz',
    title: 'Datenschutzerklärung',
    contactTitle: 'Verantwortlicher und Kontakt',
    intro: 'Diese Datenschutzerklärung erläutert, welche personenbezogenen Daten beim Besuch von Berliner U-Bahn verarbeitet werden. Die Anwendung bietet keine Benutzerkonten, Werbeanzeigen oder eingebundenen Analysedienste zur Verfolgung Ihres Nutzungsverhaltens.',
    sections: [
      {
        title: 'Bereitstellung über GitHub Pages',
        paragraphs: [
          'Die Website wird über GitHub Pages bereitgestellt. Beim Abruf werden technisch notwendige Verbindungsdaten verarbeitet, etwa IP-Adresse, Zeitpunkt, angeforderte Adresse und Browserinformationen. GitHub weist ausdrücklich darauf hin, dass IP-Adressen von Besuchern einer GitHub-Pages-Website zu Sicherheitszwecken protokolliert und gespeichert werden, auch ohne GitHub-Anmeldung.',
          'Auch die Bahnhofs- und Streckendaten der Karte sind feste Dateien dieser Website und werden zusammen mit ihr von GitHub Pages geladen; eine eigene Datenbank oder ein eigener Server wird nicht abgefragt.',
          'Zweck ist die Auslieferung und Absicherung dieses öffentlich zugänglichen Informationsangebots. Rechtsgrundlage ist Art. 6 Abs. 1 Buchst. f DSGVO. Für die von GitHub in eigener Verantwortung verarbeiteten Nutzungs- und Sicherheitsdaten gelten dessen Datenschutzhinweise und Aufbewahrungsregeln; ein projektspezifischer fester Löschzeitraum wird hier nicht zugesagt.',
        ],
        links: [L.ghPrivacy, L.ghPages],
      },
      {
        title: 'Kartenhintergrund von OpenFreeMap',
        paragraphs: [
          'Beim Öffnen der Anwendung und beim Wechsel der Kartenansicht (Hell, Farbig, Dunkel) lädt Ihr Browser den Kartenhintergrund direkt von OpenFreeMap (tiles.openfreemap.org). Dazu gehören Kartenstil, Kartenkacheln sowie Kartenschriften und Symbole. Dabei werden Ihre IP-Adresse, technische Anfragedaten und die angeforderten Kartenausschnitte übermittelt. Eine Standortfreigabe des Geräts wird nicht angefordert.',
          'Die Einbindung dient der räumlichen Einordnung des U-Bahn-Netzes. Rechtsgrundlage ist Art. 6 Abs. 1 Buchst. f DSGVO: das Interesse, die ausdrücklich aufgerufene Karte funktionsfähig darzustellen. Welche Anfragedaten OpenFreeMap und dessen technische Dienstleister protokollieren und wie lange, richtet sich nach den Angaben des Anbieters.',
        ],
        links: [L.ofm],
      },
      {
        title: 'Verarbeitung in Ihrem Browser',
        paragraphs: [
          'Zeitleiste, Linienauswahl und Bahnhofsinformationen werden vollständig im Arbeitsspeicher Ihres Browsers berechnet. Die Anwendung setzt keine Cookies und speichert Einstellungen wie Jahr, ausgeblendete Linien oder Kartenansicht nicht im Local Storage oder Session Storage. Diese Einstellungen bestehen nur, solange die Seite geöffnet ist. Der Browser kann ausgelieferte Dateien und Kartenkacheln in seinem üblichen HTTP-Cache speichern.',
        ],
      },
      {
        title: 'Empfänger und Übermittlungen außerhalb der EU',
        paragraphs: [
          'GitHub und OpenFreeMap sowie deren technische Dienstleister erhalten die jeweils beschriebenen Verbindungsdaten. Eine Verarbeitung außerhalb der EU bzw. des EWR ist möglich. Die verlinkten Datenschutzhinweise erläutern Datenstandorte, Empfänger und Schutzmaßnahmen, insbesondere EU-Standardvertragsklauseln. Das EU-U.S. Data Privacy Framework gilt nur für entsprechend zertifizierte Empfänger und die davon erfassten Übermittlungen.',
        ],
        links: [L.ghPrivacy, L.ofm],
      },
      {
        title: 'Anfragen per E-Mail und externe Links',
        paragraphs: [
          'Wenn Sie uns per E-Mail kontaktieren, werden Ihre E-Mail-Adresse und der Inhalt Ihrer Nachricht zur Bearbeitung der Anfrage verarbeitet. Rechtsgrundlage ist Art. 6 Abs. 1 Buchst. f DSGVO, bei der Erfüllung gesetzlicher Datenschutzpflichten Art. 6 Abs. 1 Buchst. c DSGVO. Nachrichten werden gelöscht, sobald die Bearbeitung abgeschlossen ist und keine gesetzlichen Aufbewahrungspflichten oder offenen Rechtsansprüche entgegenstehen.',
          'Die Wikipedia-Links in den Bahnhofsinformationen sowie Links zu Quellen und Lizenzen öffnen fremde Websites erst, wenn Sie den Link auswählen. Dort gelten die Datenschutzhinweise des jeweiligen Anbieters, bei Wikipedia die der Wikimedia Foundation. Die Verbindung zum Kartendienst OpenFreeMap entsteht dagegen bereits beim Laden der Karte.',
        ],
        links: [L.wmPrivacy],
      },
      {
        title: 'Ihre Rechte',
        paragraphs: [
          'Unter den gesetzlichen Voraussetzungen haben Sie das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung und Datenübertragbarkeit. Wenn eine Verarbeitung auf Ihrer Einwilligung beruht, können Sie diese jederzeit mit Wirkung für die Zukunft widerrufen.',
          'Widerspruchsrecht: Gegen eine Verarbeitung auf Grundlage von Art. 6 Abs. 1 Buchst. f DSGVO können Sie aus Gründen, die sich aus Ihrer besonderen Situation ergeben, Widerspruch einlegen (Art. 21 DSGVO). Nutzen Sie dafür die oben genannte E-Mail-Adresse.',
          'Sie können sich bei einer Datenschutzaufsichtsbehörde beschweren, insbesondere an Ihrem Aufenthaltsort, Arbeitsplatz oder am Ort des vermuteten Verstoßes. Für einen privaten Betreiber in Bayern ist das BayLDA zuständig. Die Anwendung trifft keine automatisierten Entscheidungen mit rechtlicher oder ähnlich erheblicher Wirkung und erstellt keine Nutzerprofile. Die Angabe personenbezogener Daten ist weder gesetzlich noch vertraglich vorgeschrieben; ohne die zur Übertragung nötigen Verbindungsdaten können Website und Karte jedoch nicht ausgeliefert werden.',
        ],
        links: [L.baylda],
      },
    ],
  },
};
