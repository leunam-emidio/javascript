class Despesa{
    constructor(ano, mes, dia, tipo, descricao, valor){
        this.ano = ano
        this.mes = mes
        this.dia = dia
        this.tipo = tipo
        this.descricao = descricao
        this.valor = valor
    }

    validarDados(){
        for(let i in this){
            if(this[i] == undefined || this[i] == '' || this[i] == null){
                return false
            }
        }
        return true
    }

    limparDados(){
        for(let i in this){
            this[i] = ''
        }
    }
}

class Bd{

    constructor(){
        let id = localStorage.getItem('id')
        if(id === null){
            localStorage.setItem('id', 0)
        }
    }

    getProximoId(){
        let proximoId = localStorage.getItem('id')
        return parseInt(proximoId) + 1
    }

    gravar(d){
        let id = this.getProximoId()

        localStorage.setItem(id, JSON.stringify(d))
        localStorage.setItem('id', id)
    }

    recuperarTodosRegistros(){
        //array de despesas
        let despesas = Array()

       let id = localStorage.getItem('id')

       //Recupera todas as despesas cadastras em localStorage
       for(let i = 1; i <= id; i++){
            //Recuperar as despesas
            let despesa = JSON.parse(localStorage.getItem(i))

            //Verificar se existe um indice que foi pulado/removido
            if(despesa === null){
                continue
            }
            despesa.id = i
            despesas.push(despesa)
       }
       return despesas
    } 

    pesquisar(despesa){
        let despesasFiltradas = Array()
        despesasFiltradas = this.recuperarTodosRegistros()
        
        console.log(despesa)
        console.log(despesasFiltradas)

        //ano
        if(despesa.ano != ''){
            console.log('filtro de ano')
            despesasFiltradas = despesasFiltradas.filter(d => d.ano == despesa.ano)
        }
        //mes
        if(despesa.mes != ''){
            console.log('filtro de mes')
            despesasFiltradas = despesasFiltradas.filter(d => d.mes == despesa.mes)
        }
        //dia
        if(despesa.dia != ''){
            console.log('filtro de dia')
            despesasFiltradas = despesasFiltradas.filter(d => d.dia == despesa.dia)
        }
        //tipo
        if(despesa.tipo != ''){
            console.log('filtro de tipo')
            despesasFiltradas = despesasFiltradas.filter(d => d.tipo == despesa.tipo)
        }
        //descricao
        if(despesa.descricao != ''){
            console.log('filtro de descricao')
            despesasFiltradas = despesasFiltradas.filter(d => d.descricao == despesa.descricao)
        }
        //valor
        if(despesa.valor != ''){
            console.log('filtro de valor')
            despesasFiltradas = despesasFiltradas.filter(d => d.valor == despesa.valor)
        }

        return despesasFiltradas
    }

    removerDespesa(id){
        localStorage.removeItem(id)
    }
}

let bd = new Bd()

function cadastrarDespesa(){
    
    let ano = document.getElementById('ano')
    let mes = document.getElementById('mes')
    let dia = document.getElementById('dia')
    let tipo = document.getElementById('tipo')
    let descricao = document.getElementById('descricao')
    let valor = document.getElementById('valor')

    let despesa = new Despesa(
        ano.value, 
        mes.value, 
        dia.value, 
        tipo.value, 
        descricao.value, 
        valor.value
    )

    if(despesa.validarDados()){
        //Dialog de sucesso
        bd.gravar(despesa)
        document.getElementsById('modal-title').innerHTML = 'Registro inserido com sucesso'
        document.getElementsById('modal-tituto-div').className = "modal-header text-sucess"

        document.getElementsById('modal-conteudo').innerHTML = 'Despesa foi cadastrada com sucesso!'

        document.getElementsById('modal-btn').innerHTML = 'Voltar'
        document.getElementsById('modal-btn').className = "modal-header text-sucess"
        
        $('#modalRegistraDespesa').modal('show')
        
        ano.value = '' 
        mes.value = ''
        dia.value = ''
        tipo.value = ''
        descricao.value = '' 
        valor.value = ''

    }else{
        //Dialog de erro
        document.getElementsById('modal-titulo').innerHTML = 'Erro na gravação'
        document.getElementsById('modal-tituto-div').className = "modal-header text-danger"

        document.getElementsById('modal-conteudo').innerHTML = 'Existem campos obrigatórios que não foram preenchidos'

        document.getElementsById('modal-btn').innerHTML = 'Voltar e corrigir'
        document.getElementsById('modal-btn').className = "modal-header text-danger"

        $('#modalRegistraDespesa').modal('show')
    }
}

function carregaListaDespesa(despesas = Array(), filtro = false){
    if(despesas.length == 0 && filtro == false){
        despesas = bd.recuperarTodosRegistros()
    }

    //Selecionando o elemento tbody da tabela
    let listaDespesas = document.getElementById('listaDespesas')
    listaDespesas.innerHTML = ''

    /*
    <tr>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
    </tr> 
    */

    //Percorrer o array despesas, listando cada despesa de forma dinâmica  
    despesas.forEach(d => {
        
        //console.log(d)

        //Criando a linha (tr)
        let linha = listaDespesas.insertRow()

        //Criar as colunas (td)
        linha.insertCell(0).innerHTML = `${d.dia}/${d.mes}/${d.ano}`

        //ajustar o tipo
        switch(parseInt(d.tipo)){
            case 1: d.tipo = 'Alimentação' 
            break
            case 2: d.tipo = 'Educação' 
            break
            case 3: d.tipo = 'Lazer' 
            break
            case 4: d.tipo = 'Saúde' 
            break
            case 5: d.tipo = 'Transporte' 
            break
        }
        linha.insertCell(1).innerHTML = d.tipo 
        linha.insertCell(2).innerHTML = d.descricao
        linha.insertCell(3).innerHTML = d.valor


        //criar o botao de exclusão
        let btn = document.createElement("button")
        btn.className = 'btn btn-danger'
        btn.innerHTML = '<i classe="fas fa-times"></i>'
        btn.id = `id_despesa_${d.id}`
        btn.onclick = function(){
            //remover a despesa
            let id = this.id.replace('id_despesa_', '')
            //alert(id)

            bd.removerDespesa(id)
            window.location.reload()
        }
        linha.insertCell(4).append(btn)

        console.log(d)
    })
} 

function pesquisarDespesa(){
    let ano = document.getElementById('ano').value
    let mes = document.getElementById('mes').value
    let dia = document.getElementById('dia').value
    let tipo = document.getElementById('tipo').value
    let descricao = document.getElementById('descricao').value
    let valor = document.getElementById('valor').value

    let despesa = new Despesa(ano, mes, dia, tipo, descricao, valor)

    let despesas = bd.pesquisar(despesa)

    carregaListaDespesa(despesas, true)
}