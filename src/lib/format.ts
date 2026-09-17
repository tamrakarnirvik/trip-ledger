export function formatMoney(amount: number) {
  return `Rs. ${new Intl.NumberFormat("en-IN").format(amount)}`;
}

export function formatDate(date: string) {
  const [year, month, day] = date
    .split("-")
    .map(Number);

  const parsedDate = new Date(
    year,
    month - 1,
    day
  );

  return new Intl.DateTimeFormat(
    "en-US",
    {
      month: "short",
      day: "numeric",
    }
  ).format(parsedDate);
}

export function formatDateTime(
  date: string
) {
  return new Intl.DateTimeFormat(
    "en-US",
    {
      month: "short",
      day: "numeric",
      year: "numeric",
    }
  ).format(new Date(date));
}