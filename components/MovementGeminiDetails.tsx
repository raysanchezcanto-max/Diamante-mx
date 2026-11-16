/** Comparativa optativa: descripción legible y expandible sin alterar el registro. */
export default function MovementGeminiDetails({text}:{text:string}){
 // Un boletín que ya llega abreviado con «…» no tiene más texto que expandir.
 if(text.length<=190 || /(?:…|\.\.\.)\s*$/.test(text))return <p className="geminiMovementShort">{text}</p>;
 return <details className="geminiMovementDetails">
  <summary><span className="geminiMovementExcerpt">{text}</span><span className="geminiMovementMore">Ver más ▾</span><span className="geminiMovementLess">Ver menos ▴</span></summary>
  <p>{text}</p>
 </details>;
}
