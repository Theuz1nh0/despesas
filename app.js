// class to manipulate values chosen by users
class Expenses {
    constructor(dia, mes, ano, tipo, descricao, valor) {
        this.dia = dia;
        this.mes = mes;
        this.ano = ano;
        this.tipo = tipo;
        this.descricao = descricao;
        this.valor = valor;
    }

    // method to vaidate ifthere is an empty values
    validateData() {
        for (let i in this) {
            if (this[i] === undefined || this[i] === '' || this[i] === null) {
                return false;
            }
        }

        return true;
    }
}

// class to store data on the client side, when browsing
class Bd {
    constructor() {
        this.id = localStorage.getItem('id');

        // create a ID if don't have an ID in local storage
        if (this.id === null) {
            localStorage.setItem('id', 0);
        }
    }

    // increase 1 in ID
    getNextId() {
        let nextId = localStorage.getItem('id');
        return parseInt(nextId) + 1;
    }

    // sets parameter values ​​in local storage
    writeToLocalStorage(e) {
        let id = this.getNextId();

        localStorage.setItem(id, JSON.stringify(e));
        localStorage.setItem('id', id);
    }
}


const bd = new Bd();

// function to take user values and register them using the Expenses class
function registerExpenses() {
    const ano = document.querySelector('#ano');
    const mes = document.querySelector('#mes');
    const dia = document.querySelector('#dia');
    const tipo = document.querySelector('#tipo');
    const descricao = document.querySelector('#descricao');
    const valor = document.querySelector('#valor');

    const expense = new Expenses(dia.value, mes.value, ano.value, tipo.value, descricao.value, valor.value);    

    // checks whether all fields have been filled in, calling a method from the Expenses class
    if (expense.validateData()) {
        // bd.writeToLocalStorage(expense)

        const dataWriteSuccess = document.getElementById('dataWriteSuccess'); // ref modal
        const modal = new bootstrap.Modal(dataWriteSuccess); // create modal instance

        modal.show();
    } else {

        const dataWriteError = document.getElementById('dataWriteError'); // ref modal
        const modal = new bootstrap.Modal(dataWriteError); // create modal instance
        modal.show();
    }
}