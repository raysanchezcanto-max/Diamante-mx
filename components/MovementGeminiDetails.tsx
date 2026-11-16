/** Comparativa optativa: descripción legible y expandible sin alterar el registro. */
export default function MovementGeminiDetails({text}:{text:string}){
 if(text.length<=190)return <p className="geminiMovementShort">{text}</p>;
 return <details className="geminiMovementDetails">
  <summary><span className="geminiMovementExcerpt">{text}</span><span className="geminiMovementMore">Ver más ▾</span><span className="geminiMovementLess">Ver menos ▴</span></summary>
  <p>{text}</p>
 </details>;
}
