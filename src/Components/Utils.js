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

export function formatarDate(date) {
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");

    return `${day}/${month}/${year} ${hours}:${minutes}`;
}