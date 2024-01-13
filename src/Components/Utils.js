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