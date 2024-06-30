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

            if (expense === null) {
                continue;
            }

            expense.id = i;
            expenses.push(expense);

        }

        return expenses
    }

    search(expenses) {
        let data = this.getData();
        let filterExpenses = expenses;

        // loop through all values of the filterExpense object
        for (let e in filterExpenses) {
            // checks if this value is empty
            if (filterExpenses[e] !== '') {
                // filters the values ​​of the variable 'data', looking for the same attributes of the
                // variable 'e' of 'for(let e in filterExpense)' and checking whether the values ​​of this 
                // attribute are similar, if so, it reassigns the value of the variable to the filtered values,
                // so that can go through this again, with another attribute value
                data = data.filter(data => {
                    // loop through all values of the data object
                    for (let d in data) {
                        // checks if attribute and values ​​are both similar
                        if (d === e && data[d] === filterExpenses[e]) {
                            return true;
                        }
                    }
                })
            }
        }

        return data;
    }

    // remove a expense
    remove(id) {
        localStorage.removeItem(id);
        downloadExpenseLists();
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
        bd.setData(expense)

        const regExpense = document.getElementById('regExpense'); // ref modal
        const modal = new bootstrap.Modal(regExpense); // create modal instance

        modalTitle.innerHTML = 'Registro inserido com sucesso!';
        modalBody.innerHTML = 'Despesa cadastrada com sucesso!';
        modalHeader.className = 'modal-header text-success';
        modalFooter.className = 'btn btn-success';

        modal.show();
        clearInputs(ano, mes, tipo, dia, descricao, valor);
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

function downloadExpenseLists(expenses = [], filter = false) {
    // selecting the tbody element from html
    const expensesList = document.querySelector('#expensesList');
    expensesList.innerHTML = '';

    if (expenses.length === 0 && filter === false) {
        expenses = bd.getData();
    }

    expenses.forEach(e => {
        // creat a row (tr)
        const row = expensesList.insertRow()
        const value = parseInt(e.valor).toLocaleString('pt-BR', { minimumFractionDigits: 2 })

        // creat the columns (td)
        row.insertCell(0).innerHTML = `${e.dia}/${e.mes}/${e.ano}`
        row.insertCell(1).innerHTML = e.tipo;
        row.insertCell(2).innerHTML = e.descricao;
        row.insertCell(3).innerHTML = `R$ ${value}`;

        // create remove button
        const btn = document.createElement('button'); // creat button
        btn.className = 'btn btn-danger'; // add a class name
        btn.innerHTML = '<i class="fas fa-times"></i>'; // add a icon
        btn.id = `expense_${e.id}`; // add an id
        btn.onclick = function() {
            const id = this.id.replace('expense_', '') // get the id that is the same as the localStorage id
            bd.remove(id); // calls remobe method from bd class
        }
        row.insertCell(4).append(btn);
    })
}

function clearInputs(...elements) {
    // resets the values of the html fields
    elements.forEach(e => e.value = '')
}

function searchExpenses() {
    const ano = document.querySelector('#ano');
    const mes = document.querySelector('#mes');
    const dia = document.querySelector('#dia');
    const tipo = document.querySelector('#tipo');
    const descricao = document.querySelector('#descricao');
    const valor = document.querySelector('#valor');
    // selecting the tbody element from html
    const expensesList = document.querySelector('#expensesList');

    const expense = new Expenses(dia.value, mes.value, ano.value, tipo.value, descricao.value, valor.value);
    const res = bd.search(expense)

    downloadExpenseLists(res, true)
}
