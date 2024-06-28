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
    setData(e) {
        let id = this.getNextId();

        localStorage.setItem(id, JSON.stringify(e));
        localStorage.setItem('id', id);
    }

    // get JSON data from local storage
    getData() {
        let expenses = [];
        const id = localStorage.getItem('id'); // get id

        // recovers all expenses registered in local storage
        for (let i = 1; i <= id; i++) {
            // get JSON data and transform it into a object
            let expense = JSON.parse(localStorage.getItem(i));

            if(expense === null) {
                continue;
            }
            
            expenses.push(expense);

        }

        return expenses
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
    const modalHeader = document.querySelector('#modalHeader');
    const modalTitle = document.querySelector('#modalTitle');
    const modalBody = document.querySelector('#modalBody');
    const modalFooter = document.querySelector('#modalFooter');

    const expense = new Expenses(dia.value, mes.value, ano.value, tipo.value, descricao.value, valor.value);

    // checks whether all fields have been filled in, calling a method from the Expenses class
    if (expense.validateData()) {
        bd.uploadData(expense)

        const regExpense = document.getElementById('regExpense'); // ref modal
        const modal = new bootstrap.Modal(regExpense); // create modal instance

        modalTitle.innerHTML = 'Registro inserido com sucesso!';
        modalBody.innerHTML = 'Despesa cadastrada com sucesso!';
        modalHeader.className = 'modal-header text-success';
        modalFooter.className = 'btn btn-success';

        modal.show();
    } else {

        const regExpense = document.getElementById('regExpense'); // ref modal
        const modal = new bootstrap.Modal(regExpense); // create modal instance
        
        modalTitle.innerHTML = 'Erro na inclusão do registro!';
        modalBody.innerHTML = 'Existe campos obrigatórios que não foram preenchidos.';
        modalHeader.className = 'modal-header text-danger';
        modalFooter.className = 'btn btn-danger';

        modal.show();
    }
}

function downloadExpenseLists() {
    const expenses = bd.downloadData()

    console.log(expenses)
}
