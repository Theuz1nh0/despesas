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

    const expense = new Expenses(dia.value, mes.value, ano.value, tipo.value, descricao.value, valor.value);

    // checks whether all fields have been filled in, calling a method from the Expenses class
    if (expense.validateData()) {
        bd.setData(expense)

        // creat responses for the modal
        const title = 'Registro inserido com sucesso!';
        const body = 'Despesa cadastrada com sucesso!';
        const headerClass = 'text-success';
        const footerClass = 'btn-success';

        // function to creat and show the modal
        creatModal(title, body, headerClass, footerClass)

        // function to clear input after showing modal on screen
        clearInputs(ano, mes, tipo, dia, descricao, valor);
    } else {
        // creat responses for the modal
        const title = 'Erro na inclusão do registro!';
        const body = 'Existe campos obrigatórios que não foram preenchidos.';
        const headerClass = 'text-danger';
        const footerClass = 'btn-danger';

        // function to creat and show the modal
        creatModal(title, body, headerClass, footerClass)
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
        btn.onclick = function () {
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

    const expense = new Expenses(dia.value, mes.value, ano.value, tipo.value, descricao.value, valor.value);
    const res = bd.search(expense)

    let title, body, headerClass, footerClass;

    if (res.length === 0) {
        // creat responses for the modal
        title = 'Erro na filtragem!'
        body = 'Os filtros selecionados não foram encontrados.'
        headerClass = 'text-warning';
        footerClass = 'btn-warning';

        // function to creat and show the modal
        creatModal(title, body, headerClass, footerClass)
    } else {
        // creat responses for the modal
        title = 'Filtrado com sucesso!'
        body = 'Aqui estão os resultados do seu filtro...'
        headerClass = 'text-success';
        footerClass = 'btn-success';

        // function to creat and show the modal
        creatModal(title, body, headerClass, footerClass)
    }

    // creatModal()
    downloadExpenseLists(res, true)
}

// function to creat and show the modal
function creatModal(title, body, headerClass, footerClass) {
    const modalHeader = document.querySelector('#modalHeader');
    const modalTitle = document.querySelector('#modalTitle');
    const modalBody = document.querySelector('#modalBody');
    const modalFooter = document.querySelector('#modalFooter');

    const regExpense = document.getElementById('regExpense'); // ref modal
    const modal = new bootstrap.Modal(regExpense); // create modal instance

    modalTitle.innerHTML = title;
    modalBody.innerHTML = body;
    modalHeader.className = `modal-header ${headerClass}`;
    modalFooter.className = `btn ${footerClass}`;

    modal.show();
}
