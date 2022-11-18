export const parseDate = (date : any) => {
    if (!date) return "";
    const parsedDate = date.slice(0, 10);
    const [year, month, day] = parsedDate.split("-");
    return `${day}/${month}/${year}`;
}