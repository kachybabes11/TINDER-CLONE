const SwipeFeedback = ({ direction }) => {
  if (!direction) return null;

  const isLike = direction === "right";

  return (
    <div
      aria-hidden="true"
      className={`absolute left-5 top-6 rotate-[-12deg] rounded-lg border-4 px-3 py-1 text-3xl font-black uppercase tracking-widest ${
        isLike
          ? "border-emerald-400 text-emerald-400"
          : "border-rose-400 text-rose-400"
      }`}
    >
      {isLike ? "Like" : "Pass"}
    </div>
  );
};

export default SwipeFeedback;