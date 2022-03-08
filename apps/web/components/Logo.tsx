export default function Logo({ small, icon }: { small?: boolean; icon?: boolean }) {
  return (
    <h1 className="inline">
      <strong>
        {icon ? (
          <img className="mx-auto w-9" alt="Cal" title="Cal" src="/cal-com-icon-white.svg" />
        ) : (
          <img className={small ? "h-4 w-auto" : "h-5 w-auto"} alt="PV" title="PV" src="/pv-logo.svg" />
        )}
      </strong>
    </h1>
  );
}
