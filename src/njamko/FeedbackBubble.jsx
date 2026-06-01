export default function FeedbackBubble({ feedback }) {
  if (!feedback) return null;

  const isCorrect = feedback === "correct";
  const bubbleClass = isCorrect ? "success-bubble-pop" : "try-again-bubble";

  return (
    <p
      data-testid="feedback-message"
      className={`nj-bubble ${bubbleClass}`}
      role="status"
    >
      {isCorrect ? "Bravo!" : "Probaj opet."}
    </p>
  );
}
