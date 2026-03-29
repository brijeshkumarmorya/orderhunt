import Card from './Card';

export default function GameBoard({ cards, onCardClick, disabled, flashCard, resetting }) {
  return (
    <div className={`
      w-full max-w-[min(200px,22vh)] sm:max-w-2xl lg:max-w-4xl mx-auto
      grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-4 lg:gap-6
      justify-center items-center
      ${resetting ? 'anim-reset' : ''}
    `}>
      {cards.map((card, i) => (
        <div
          key={card.id}
          className="anim-fade-up w-full flex justify-center"
          style={{ animationDelay: `${i * 30}ms` }}
        >
          <div className="w-full">
            <Card
              card={card}
              onClick={onCardClick}
              disabled={disabled}
              flash={flashCard?.id === card.id ? flashCard.type : null}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
