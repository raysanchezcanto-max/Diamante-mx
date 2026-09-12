type BaseDiamondProps = {
  first?: number;
  second?: number;
  third?: number;
};

export default function BaseDiamond({
  first = 0,
  second = 0,
  third = 0,
}: BaseDiamondProps) {
  return (
    <div className="baseDiamond">
      <span
        className={
          second
            ? "base occupied secondBase"
            : "base secondBase"
        }
      />

      <span
        className={
          third
            ? "base occupied thirdBase"
            : "base thirdBase"
        }
      />

      <span
        className={
          first
            ? "base occupied firstBase"
            : "base firstBase"
        }
      />
    </div>
  );
}
