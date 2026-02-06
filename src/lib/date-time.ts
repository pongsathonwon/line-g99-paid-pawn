export const formatThaiDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("th-TH",);
}