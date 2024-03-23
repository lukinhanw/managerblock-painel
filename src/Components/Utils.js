import { parseISO, format, differenceInCalendarDays, isBefore } from 'date-fns';

export function formatDate(dataString) {
    // Separa a data e a hora
    let partes = dataString.split(' ');
    let data = partes[0];
    let hora = partes[1];

    // Reorganiza a data para o formato dd/mm/yyyy
    let componentesData = data.split('-');
    let dataFormatada = componentesData[2] + '-' + componentesData[1] + '-' + componentesData[0];

    // Combina a data formatada com a hora
    return dataFormatada + ' ' + hora;
}

export function checkDateStatus(value) {
    const currentDate = new Date();
    const dateObj = parseISO(value);
    const daysDifference = differenceInCalendarDays(dateObj, currentDate);

    let formattedDate, formattedDateHora, dateClass;

    // Verifica se a data do registro já passou ou se é hoje
    if (isBefore(dateObj, currentDate) || daysDifference < 1) {
        // Se a data do registro é hoje, mas ainda não passou, mostra quantas horas restam
        if (daysDifference === 0 && isBefore(currentDate, dateObj)) {
            formattedDate = format(dateObj, 'dd-MM-yyyy');
            formattedDateHora = format(dateObj, 'HH:mm');
            dateClass = "text-warning"; // Pode ajustar a classe conforme a necessidade
        } else {
            formattedDate = "Expirado";
            dateClass = "text-danger";
        }
    } else if (daysDifference <= 3) {
        dateClass = "text-danger";
        formattedDate = format(dateObj, 'dd-MM-yyyy');
        formattedDateHora = format(dateObj, 'HH:mm');
    } else if (daysDifference <= 7) {
        dateClass = "text-warning";
        formattedDate = format(dateObj, 'dd-MM-yyyy');
        formattedDateHora = format(dateObj, 'HH:mm');
    } else {
        formattedDate = format(dateObj, 'dd-MM-yyyy');
        formattedDateHora = format(dateObj, 'HH:mm');
        dateClass = '';
    }

    // Retorna um objeto com os dados formatados e a classe
    return {
        formattedDate,
        formattedDateHora,
        dateClass,
    };
}