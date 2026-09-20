/** Primary Hungarian névnap entries, month-indexed (0 = January), day-indexed (0 = 1st). Given names only — not product branding. */
export const NEVNAP: string[][] = [
  ["Fruzsina","Ábel","Genovéva","Titusz","Simon","Boldizsár","Attila","Gyöngyvér","Marcell","Melánia","Ágota","Ernő","Veronika","Bódog","Lóránt","Gusztáv","Antal","Piroska","Sára","Fábián","Ágnes","Vince","Zelma","Timót","Pál","Vanda","Angelika","Károly","Adél","Martina","Marcella"],
  ["Ignác","Karolina","Balázs","Ráhel","Ágota","Dorottya","Tódor","Aranka","Abigél","Elvira","Bertold","Lívia","Ella","Bálint","Kolos","Julianna","Donát","Bernadett","Zsuzsanna","Álmos","Eleonóra","Gerzson","Alfréd","Mátyás","Géza","Győző","Ákos","Elemér"],
  ["Albin","Lujza","Kornélia","Kázmér","Adorján","Leonóra","Tamás","Zoltán","Franciska","Ildikó","Szilárd","Gergely","Krisztián","Matild","Kristóf","Henrietta","Gertrúd","Sándor","József","Klaudia","Benedek","Beáta","Emőke","Gábor","Irén","Emánuel","Hajnalka","Gedeon","Auguszta","Zalán","Árpád"],
  ["Hugó","Áron","Buda","Izidor","Vince","Vilmos","Herman","Dénes","Erhard","Zsolt","Leó","Gyula","Ida","Tibor","Anasztázia","Csongor","Rudolf","Andrea","Emma","Tivadar","Konrád","Csilla","Béla","György","Márk","Ervin","Zita","Valéria","Péter","Katalin"],
  ["Fülöp","Zsigmond","Tímea","Mónika","Györgyi","Ivett","Gizella","Mihály","Gergely","Ármin","Ferenc","Pongrác","Szervác","Bonifác","Zsófia","Mózes","Paszkál","Erik","Ivó","Bernát","Konstantin","Júlia","Dezső","Eszter","Orbán","Fülöp","Hella","Emil","Magdolna","Janka","Angéla"],
  ["Tünde","Kármen","Klotild","Bulcsú","Fatime","Norbert","Róbert","Medárd","Félix","Margit","Barnabás","Villő","Antal","Vazul","Jolán","Jusztin","Laura","Arnold","Gyárfás","Rafael","Alajos","Paulina","Zoltán","Iván","Vilmos","János","László","Levente","Péter","Pál"],
  ["Tihamér","Ottó","Kornél","Ulrik","Emese","Csaba","Apollónia","Ellák","Lukrécia","Amália","Lili","Izabella","Jenő","Örs","Henrik","Valter","Endre","Frigyes","Emília","Illés","Dániel","Magdolna","Lenke","Kinga","Kristóf","Anna","Olga","Szabolcs","Márta","Judit","Oszkár"],
  ["Boglárka","Lehel","Hermina","Domonkos","Krisztina","Berta","Ibolya","László","Emőd","Lőrinc","Zsuzsanna","Klára","Ipoly","Marcell","Mária","Ábrahám","Jácint","Ilona","Huba","István","Sámuel","Menyhért","Bence","Bertalan","Lajos","Izsó","Gáspár","Ágoston","Beatrix","Rózsa","Erika"],
  ["Egyed","Rebeka","Hilda","Rozália","Viktor","Zakariás","Regina","Mária","Ádám","Nikolett","Teodóra","Mária","Kornél","Szeréna","Enikő","Edit","Zsófia","Diána","Vilhelmina","Friderika","Máté","Mór","Tekla","Gellért","Kende","Jusztina","Adalbert","Vencel","Mihály","Jeromos"],
  ["Malvin","Petra","Helga","Ferenc","Aurél","Brúnó","Amália","Koppány","Dénes","Gedeon","Brigitta","Miksa","Kálmán","Helén","Teréz","Gál","Hedvig","Lukács","Nándor","Vendel","Orsolya","Előd","Gyöngyi","Salamon","Blanka","Dömötör","Szabina","Simon","Nárcisz","Alfonz","Farkas"],
  ["Marianna","Achilles","Győző","Károly","Imre","Lénárd","Rezső","Zsombor","Tivadar","Réka","Márton","Jónás","Szilvia","Aliz","Albert","Ödön","Gergő","Jenő","Erzsébet","Jolán","Olivér","Cecília","Kelemen","Emma","Katalin","Virág","Virgil","Stefánia","Taksony","András"],
  ["Elza","Melinda","Ferenc","Borbála","Vilma","Miklós","Ambrus","Mária","Natália","Judit","Árpád","Gabriella","Luca","Szilárda","Valér","Etelka","Lázár","Auguszta","Viola","Teofil","Tamás","Zénó","Viktória","Ádám","Eugénia","István","János","Kamilla","Tamás","Dávid","Szilveszter"],
];

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const BUDAPEST = "Europe/Budapest";
const BUDAPEST_YMD_FORMAT = new Intl.DateTimeFormat("en-GB", {
  timeZone: BUDAPEST,
  year: "numeric",
  month: "numeric",
  day: "numeric",
});

/** Calendar day in Hungary, not the visitor's local timezone. */
export function budapestYmd(d: Date): { year: number; month: number; day: number } {
  const parts = BUDAPEST_YMD_FORMAT.formatToParts(d);
  const pick = (type: Intl.DateTimeFormatPartTypes) =>
    Number(parts.find((part) => part.type === type)?.value);
  return { year: pick("year"), month: pick("month"), day: pick("day") };
}

export function namesForDate(d: Date): { names: string[]; label: string } {
  const { month, day } = budapestYmd(d);
  const names = NEVNAP[month - 1]?.[day - 1];
  return {
    names: names ? [names] : [],
    label: `${day} ${MONTHS[month - 1]}`,
  };
}
