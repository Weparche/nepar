import { motion, useReducedMotion } from "framer-motion";
import GameTopBar from "./GameTopBar.jsx";

const ITEM_LABELS = {
  shell: "Školjka",
  pebble: "Kamenčić",
  crab: "Račić",
  starfish: "Morska zvijezda",
  beachball: "Lopta za plažu",
};

const REWARD_LABELS = {
  "shell-necklace": "Ogrlica od školjki",
  "sand-tower": "Toranj sa zastavicom",
  "crab-wave": "Račići mašu iz kućica",
  "glowing-path": "Sjajna staza zvijezda",
  "fair-flag": "Plažni sajam brojeva",
};

function CountingObject({
  item,
  kind,
  number,
  isCollected,
  isWrong,
  disabled,
  reducedMotion,
  onClick,
  style,
  testId,
  ariaLabel,
}) {
  const animation = isWrong
    ? { x: reducedMotion ? 0 : [0, -7, 7, -5, 5, 0] }
    : isCollected
      ? reducedMotion
        ? { opacity: 0.4 }
        : { opacity: 0.24, scale: 0.9, y: -8 }
      : { opacity: 1, scale: 1, x: 0, y: 0 };

  return (
    <motion.button
      type="button"
      className={`nj-counting-shell nj-counting-shell--${kind}${isCollected ? " nj-counting-shell--collected" : ""}${isWrong ? " nj-counting-shell--wrong" : ""}`}
      data-testid={testId}
      data-counting-shell-number={number ?? ""}
      data-counting-item-type={kind}
      style={style}
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={onClick}
      animate={animation}
      transition={{ duration: isWrong ? 0.36 : 0.3, ease: [0.16, 1, 0.3, 1] }}
    >
      <span className="nj-counting-shell__shape" aria-hidden="true" />
      <span className="nj-counting-shell__mark" aria-hidden="true" />
      {number ? <span className="nj-counting-shell__number">{number}</span> : null}
      {isCollected && !reducedMotion ? <span className="nj-counting-shell__sparkle" aria-hidden="true" /> : null}
    </motion.button>
  );
}

function CountingBeachPlayfield({ children, className = "", backgroundImage }) {
  return (
    <div
      className={`nj-counting-beach ${className}`}
      data-testid="counting-beach-playfield"
      style={backgroundImage ? { "--counting-bg": `url("${backgroundImage}")` } : undefined}
    >
      {children}
    </div>
  );
}

function CountingBasket({ itemKind, collectedCount = 0, targetNumber, collectedNumbers = [] }) {
  const chips = targetNumber ? Array.from({ length: targetNumber }, (_, index) => index + 1) : collectedNumbers;

  return (
    <div className="nj-counting-game__basket" data-testid="counting-basket">
      <span className="nj-counting-game__basket-lip" aria-hidden="true" />
      <span className="nj-counting-game__basket-label">Košarica</span>
      <div className="nj-counting-collected" data-testid="counting-collected-shells">
        {chips.map((number, index) => {
          const isFilled = targetNumber ? index < collectedCount : collectedNumbers.includes(number);
          return (
            <span
              key={`${number}-${index}`}
              className={`nj-counting-collected__chip nj-counting-collected__chip--${itemKind}${isFilled ? " nj-counting-collected__chip--filled" : ""}`}
              aria-label={isFilled ? `Skupljeno ${number}` : `Čeka ${number}`}
            >
              {isFilled ? number : index + 1}
            </span>
          );
        })}
      </div>
      {targetNumber ? (
        <span className="nj-counting-game__basket-count" data-testid="counting-basket-count">
          {collectedCount}/{targetNumber}
        </span>
      ) : null}
    </div>
  );
}

function FindNumberTask({
  task,
  expectedNumber,
  selectedNumbers,
  wrongItemId,
  isTaskComplete,
  reducedMotion,
  onFindNumberTap,
}) {
  const itemLabel = ITEM_LABELS[task.itemKind] ?? "Predmet";
  return (
    <>
      <CountingBeachPlayfield backgroundImage={task.mobileBackgroundImage}>
        {task.items.map((item) => (
          <CountingObject
            key={item.id}
            item={item}
            kind={item.kind}
            number={item.number}
            isCollected={selectedNumbers.includes(item.number)}
            isWrong={wrongItemId === item.id}
            disabled={selectedNumbers.includes(item.number) || isTaskComplete}
            reducedMotion={reducedMotion}
            onClick={() => onFindNumberTap(item)}
            style={{ left: `${item.x}%`, top: `${item.y}%` }}
            testId={`counting-shell-${item.number}`}
            ariaLabel={`${itemLabel} broj ${item.number}`}
          />
        ))}
      </CountingBeachPlayfield>
      <CountingBasket
        itemKind={task.itemKind}
        collectedNumbers={selectedNumbers}
        collectedCount={selectedNumbers.length}
        targetNumber={task.sequence.length}
      />
    </>
  );
}

function CollectQuantityTask({ task, collectedItemIds, collectedCount, isTaskComplete, reducedMotion, onCollectItem }) {
  const items = Array.from({ length: task.availableItems }, (_, index) => ({
    id: `${task.itemKind}-collect-${index + 1}`,
    number: index + 1,
  }));

  return (
    <>
      <CountingBeachPlayfield
        className={`nj-counting-beach--collect nj-counting-beach--${task.type}`}
        backgroundImage={task.mobileBackgroundImage}
      >
        <div className="nj-counting-quantity-target" data-testid="counting-target-number">
          {task.targetNumber}
        </div>
        <div className="nj-counting-loose-grid">
          {items.map((item) => (
            <CountingObject
              key={item.id}
              kind={task.itemKind}
              number={null}
              isCollected={collectedItemIds.includes(item.id)}
              isWrong={false}
              disabled={collectedItemIds.includes(item.id) || isTaskComplete || collectedCount >= task.targetNumber}
              reducedMotion={reducedMotion}
              onClick={() => onCollectItem(item.id)}
              testId={`counting-collect-item-${item.number}`}
              ariaLabel={`Stavi ${task.itemSingular} u košaricu`}
            />
          ))}
        </div>
      </CountingBeachPlayfield>
      <CountingBasket itemKind={task.itemKind} collectedCount={collectedCount} targetNumber={task.targetNumber} />
    </>
  );
}

function CountingNumberPath({ task, pathNumbers, wrongItemId, isTaskComplete, onPathNumber, missingOnly = false }) {
  return (
    <div className="nj-counting-number-path" data-testid="counting-number-path">
      {task.sequence.map((number) => {
        const isFilled = pathNumbers.includes(number);
        const isMissing = missingOnly && number === task.answer;
        return (
          <button
            key={number}
            type="button"
            className={`nj-counting-path-slot${isFilled ? " nj-counting-path-slot--filled" : ""}${isMissing ? " nj-counting-path-slot--missing" : ""}${wrongItemId === `path-${number}` ? " nj-counting-path-slot--wrong" : ""}`}
            data-testid={`counting-path-${number}`}
            aria-label={`Brojevna staza broj ${number}`}
            disabled={isFilled || isTaskComplete || missingOnly}
            onClick={() => onPathNumber(number)}
          >
            <span className={`nj-counting-path-slot__object nj-counting-path-slot__object--${task.itemKind}`} aria-hidden="true" />
            <span>{isMissing && !isFilled ? "?" : number}</span>
          </button>
        );
      })}
    </div>
  );
}

function NumberPathTask({ task, pathNumbers, wrongItemId, isTaskComplete, onPathNumber }) {
  return (
    <>
      <CountingBeachPlayfield className="nj-counting-beach--path" backgroundImage={task.mobileBackgroundImage}>
        <CountingNumberPath
          task={task}
          pathNumbers={pathNumbers}
          wrongItemId={wrongItemId}
          isTaskComplete={isTaskComplete}
          onPathNumber={onPathNumber}
        />
      </CountingBeachPlayfield>
      <CountingBasket itemKind={task.itemKind} collectedNumbers={pathNumbers} />
    </>
  );
}

function ChoiceRow({ task, selectedNumbers, wrongItemId, isTaskComplete, onChoiceNumber }) {
  return (
    <div className="nj-counting-choice-row" data-testid="counting-choice-row">
      {task.options.map((number) => (
        <button
          key={number}
          type="button"
          className={`nj-counting-choice${selectedNumbers.includes(number) ? " nj-counting-choice--selected" : ""}${wrongItemId === `choice-${number}` ? " nj-counting-choice--wrong" : ""}`}
          data-testid={`counting-choice-${number}`}
          disabled={isTaskComplete}
          onClick={() => onChoiceNumber(number)}
        >
          {number}
        </button>
      ))}
    </div>
  );
}

function CountVisibleTask({ task, selectedNumbers, wrongItemId, isTaskComplete, reducedMotion, onChoiceNumber }) {
  const items = Array.from({ length: task.visibleCount }, (_, index) => index + 1);
  return (
    <>
      <CountingBeachPlayfield className="nj-counting-beach--visible" backgroundImage={task.mobileBackgroundImage}>
        <div className="nj-counting-visible-row" data-testid="counting-visible-items">
          {items.map((number) => (
            <CountingObject
              key={number}
              kind={task.itemKind}
              number={null}
              isCollected={false}
              isWrong={false}
              disabled
              reducedMotion={reducedMotion}
              testId={`counting-visible-item-${number}`}
              ariaLabel={`${task.itemSingular} ${number}`}
            />
          ))}
        </div>
        <ChoiceRow
          task={task}
          selectedNumbers={selectedNumbers}
          wrongItemId={wrongItemId}
          isTaskComplete={isTaskComplete}
          onChoiceNumber={onChoiceNumber}
        />
      </CountingBeachPlayfield>
    </>
  );
}

function MissingNumberTask({ task, selectedNumbers, wrongItemId, isTaskComplete, onChoiceNumber }) {
  return (
    <>
      <CountingBeachPlayfield className="nj-counting-beach--missing" backgroundImage={task.mobileBackgroundImage}>
        <CountingNumberPath
          task={task}
          pathNumbers={selectedNumbers.includes(task.answer) ? task.sequence : []}
          wrongItemId={wrongItemId}
          isTaskComplete={isTaskComplete}
          onPathNumber={() => {}}
          missingOnly
        />
        <ChoiceRow
          task={task}
          selectedNumbers={selectedNumbers}
          wrongItemId={wrongItemId}
          isTaskComplete={isTaskComplete}
          onChoiceNumber={onChoiceNumber}
        />
      </CountingBeachPlayfield>
    </>
  );
}

function PlaceOnPathTask(props) {
  return <NumberPathTask {...props} />;
}

function CompletePathTask(props) {
  return <NumberPathTask {...props} />;
}

function BuildOrderTask(props) {
  return <NumberPathTask {...props} />;
}

function DecorateResultTask(props) {
  return <CollectQuantityTask {...props} />;
}

function CountingReward({ visible, reward }) {
  if (!visible) return null;
  return (
    <motion.div
      className="nj-counting-reward"
      data-testid="counting-reward"
      initial={{ opacity: 0, y: 8, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
    >
      <span className="nj-counting-reward__icon" aria-hidden="true" />
      <span className="nj-counting-reward__title">{REWARD_LABELS[reward] ?? "Plažna nagrada"}</span>
    </motion.div>
  );
}

function CountingMiniSandbox({ level, task, sandboxTouches, reducedMotion, onSandboxTap, onFinishSandbox }) {
  const sandboxItems = Array.from({ length: 5 }, (_, index) => index + 1);
  return (
    <section className="nj-counting-mini-sandbox" data-testid="counting-mini-sandbox" aria-label="Mini igra nagrade">
      <CountingReward visible reward={level?.reward ?? task.reward} />
      <p className="nj-counting-mini-sandbox__label">{level?.sandboxLabel ?? "Igraj se s nagradom."}</p>
      <div className="nj-counting-sandbox-items">
        {sandboxItems.map((number) => (
          <CountingObject
            key={number}
            kind={task.itemKind}
            number={number}
            isCollected={sandboxTouches >= number}
            isWrong={false}
            disabled={false}
            reducedMotion={reducedMotion}
            onClick={onSandboxTap}
            testId={`counting-sandbox-item-${number}`}
            ariaLabel={`Dotakni nagradu ${number}`}
          />
        ))}
      </div>
      <button
        type="button"
        className="nj-counting-sandbox-finish"
        data-testid="counting-sandbox-finish"
        onClick={onFinishSandbox}
      >
        Gotovo
      </button>
    </section>
  );
}

function CountingTaskRenderer(props) {
  if (props.task.type === "collect-count" || props.task.type === "collect-quantity") {
    return <CollectQuantityTask {...props} />;
  }
  if (props.task.type === "decorate-result") return <DecorateResultTask {...props} />;
  if (props.task.type === "number-path") return <NumberPathTask {...props} />;
  if (props.task.type === "place-on-path") return <PlaceOnPathTask {...props} />;
  if (props.task.type === "complete-path") return <CompletePathTask {...props} />;
  if (props.task.type === "build-order") return <BuildOrderTask {...props} />;
  if (props.task.type === "count-visible") return <CountVisibleTask {...props} />;
  if (props.task.type === "missing-number") return <MissingNumberTask {...props} />;
  return <FindNumberTask {...props} />;
}

function getInstruction(task, expectedNumber, isTaskComplete) {
  if (task.type === "find-number" && !isTaskComplete) return `Nađi broj ${expectedNumber}.`;
  return task.instruction;
}

export default function CountingGameScreen({
  modeTitle,
  levelTitle,
  level,
  task,
  taskNumber,
  totalTasks,
  expectedNumber,
  selectedNumbers,
  collectedItemIds,
  collectedCount,
  pathNumbers,
  wrongItemId,
  isTaskComplete,
  isSandboxActive,
  sandboxTouches,
  feedbackMessage,
  soundEnabled,
  onToggleSound,
  onFindNumberTap,
  onCollectItem,
  onPathNumber,
  onChoiceNumber,
  onSandboxTap,
  onFinishSandbox,
  onBack,
}) {
  const reducedMotion = useReducedMotion();

  return (
    <div className="nj-counting-game" data-testid="counting-game-screen">
      <GameTopBar
        variant="premium"
        modeTitle="Njamkova plažna misija"
        levelTitle={levelTitle}
        currentRound={Math.min(taskNumber, totalTasks)}
        totalRounds={totalTasks}
        soundEnabled={soundEnabled}
        onToggleSound={onToggleSound}
        onBack={onBack}
      />

      <section className="nj-counting-game__panel" aria-label={`${modeTitle}: ${task.title}`}>
        <div className="nj-counting-game__header">
          <div>
            <p className="nj-counting-game__story" data-testid="counting-story-goal">
              {level?.storyGoal}
            </p>
            <p className="nj-counting-game__instruction" data-testid="counting-instruction">
              {isSandboxActive ? "Nagrada je spremna." : getInstruction(task, expectedNumber, isTaskComplete)}
            </p>
          </div>
          <p className="nj-counting-game__next" data-testid="counting-expected-number">
            {task.type === "find-number" && !isTaskComplete && !isSandboxActive
              ? `Sljedeći broj: ${expectedNumber}`
              : `${taskNumber}/${totalTasks}`}
          </p>
        </div>

        {isSandboxActive ? (
          <CountingMiniSandbox
            level={level}
            task={task}
            sandboxTouches={sandboxTouches}
            reducedMotion={reducedMotion}
            onSandboxTap={onSandboxTap}
            onFinishSandbox={onFinishSandbox}
          />
        ) : (
          <>
            <CountingTaskRenderer
              task={task}
              expectedNumber={expectedNumber}
              selectedNumbers={selectedNumbers}
              collectedItemIds={collectedItemIds}
              collectedCount={collectedCount}
              pathNumbers={pathNumbers}
              wrongItemId={wrongItemId}
              isTaskComplete={isTaskComplete}
              reducedMotion={reducedMotion}
              onFindNumberTap={onFindNumberTap}
              onCollectItem={onCollectItem}
              onPathNumber={onPathNumber}
              onChoiceNumber={onChoiceNumber}
            />
            <CountingReward visible={isTaskComplete} reward={task.reward} />
          </>
        )}

        <div className="nj-counting-mascot-zone" aria-hidden="true">
          <img className="nj-counting-mascot" src="/njamko.png" alt="" />
        </div>

        <p
          className={`nj-counting-feedback${feedbackMessage ? " nj-counting-feedback--visible" : ""}`}
          data-testid="counting-feedback-message"
          role="status"
        >
          {feedbackMessage}
        </p>
      </section>
    </div>
  );
}
