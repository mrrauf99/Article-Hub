// Identity fields have varied across API responses (`id`, `user_id`, `_id`);
// falls back to email so self-detection still works if an id is missing.
function identityKey(person) {
  return person?.id ?? person?.user_id ?? person?._id ?? null;
}

export function isSelfMember(currentUser, member) {
  const a = identityKey(currentUser);
  const b = identityKey(member);
  if (a != null && b != null) return String(a) === String(b);

  const emailA = currentUser?.email?.toLowerCase();
  const emailB = member?.email?.toLowerCase();
  return Boolean(emailA && emailB && emailA === emailB);
}
