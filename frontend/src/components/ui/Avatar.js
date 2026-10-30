// The account's profile photo, or its first initial on ink when there's none. Size comes from className.
export default function Avatar({ user, className = "" }) {
  return user?.avatar ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={user.avatar} alt="" className={`rounded-full bg-ink object-cover ${className}`} />
  ) : (
    <span className={`grid place-items-center rounded-full bg-ink font-serif text-gold dark:text-[#a87a2a] ${className}`} aria-hidden>
      {user?.name?.[0]?.toUpperCase() || "U"}
    </span>
  );
}
