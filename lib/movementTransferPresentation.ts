/** Solo exhibe la contraparte si se encuentra explícita en el texto oficial. */
export type MovementTransfer={heading:string;label:string;otherClub:string};

export function mlbTransferPresentation(label:string,description:string):MovementTransfer|null {
  if(!/^(?:Intercambio|Traspaso)$/i.test(label))return null;
  const club=description.match(/\bintercambi[oó]\s+.+?\s+con\s+(.+?)\s+a cambio de\b/i)?.[1]?.trim();
  return club?{heading:"Intercambio",label:"INTERCAMBIO CON",otherClub:club}:null;
}

export function lmpTransferPresentation(description:string):MovementTransfer|null {
  const ceded=/\b(?:cede[n]?|cedi[oó]|otorga\s+en\s+pr[eé]stamo)\b/i.test(description);
  const received=/\b(?:recibe[n]?|adquiere[n]?)\b/i.test(description);
  if(!ceded&&!received)return null;
  const source=ceded
    ?description.match(/\b(?:al club|a los|a las|a)\s+([^.,;]+?)(?=,\s*(?:recibiendo|a cambio)|\.|$)/i)
    :description.match(/\b(?:del club|de los|de las)\s+([^.,;]+?)(?=,|\.|$)/i);
  // Las preposiciones son ambiguas: mostrar solo nombres explícitos de clubes.
  const club=source?.[1]?.trim();
  if(!club||!/\b(?:de|del|Club|Yaquis|Naranjeros|Cañeros|Charros|Tomateros|Águilas|Mayos|Venados|Algodoneros|Jaguares)\b/i.test(club))return null;
  return ceded?{heading:"Derechos cedidos",label:"DERECHOS CEDIDOS A",otherClub:club}
    :{heading:"Derechos recibidos",label:"DERECHOS RECIBIDOS DE",otherClub:club};
}

export function lmpTransferTitle(description:string,heading:string):string {
  const player=description.match(/\b(?:derechos (?:definitivos )?de|pr[eé]stamo(?:, exclusivamente para la Temporada \d{4}-\d{2},)?\s+al\s+(?:lanzador|jardinero|receptor|jugador de cuadro))\s+(.+?)\s+(?:al club|a los|a las|a)\s+/i)?.[1]?.trim();
  return player?`${heading}: ${player}`:heading;
}
