window.onload = function() {
    var gridBotoes = document.getElementById('gridPrincipal');

    function buscarSetores() {
        fetch('http://localhost:8080/setor/readAll')
            .then(function(resposta) {
                return resposta.json();
            })
            .then(function(setores) {
                mostrarSetores(setores);
            })
            .catch(function(erro) {
                alert('Erro ao buscar setores');
                console.error(erro);
            });
    }

    function buscarFuncionarios(idSetor) {
        fetch('http://localhost:8080/funcionario/readAll')
            .then(function(resposta) {
                return resposta.json();
            })
            .then(function(funcionarios) {
                var funcionariosDoSetor = funcionarios.filter(function(f) {
                    return f.setorFuncionario.idSetor == idSetor;
                });
                mostrarFuncionarios(funcionariosDoSetor, idSetor);
            })
            .catch(function(erro) {
                alert('Erro ao buscar funcionários');
                console.error(erro);
            });
    }

    function mostrarSetores(setores) {
        gridBotoes.innerHTML = '';

        for (var i = 0; i < setores.length; i++) {
            var botao = document.createElement('button');
            botao.className = 'botao-grid';
            botao.textContent = setores[i].nomeSetor;

            (function(id) {
                botao.onclick = function() {
                    buscarFuncionarios(id);
                };
            })(setores[i].idSetor);

            gridBotoes.appendChild(botao);
        }
    }

    function mostrarFuncionarios(funcionarios, idSetor) {
        gridBotoes.innerHTML = '';

        for (var i = 0; i < funcionarios.length; i++) {
            var botao = document.createElement('button');
            botao.className = 'botao-grid';
            botao.textContent = funcionarios[i].nomeFuncionario;

            (function() {
                botao.onclick = function() {
                    abrirModalFalhas(idSetor);
                };
            })(funcionarios[i].idFuncionario);

            gridBotoes.appendChild(botao);
        }

        var botaoVoltar = document.createElement('button');
        botaoVoltar.className = 'botao-grid botao-voltar';
        botaoVoltar.textContent = 'Voltar';
        botaoVoltar.onclick = buscarSetores;
        gridBotoes.appendChild(botaoVoltar);
    }

    function abrirModalFalhas(idSetor) {
        var modal = new bootstrap.Modal(document.getElementById('modalTipoFalha'));
        var containerBotoes = document.getElementById('botoesTipoFalha');
        containerBotoes.innerHTML = '';

        var tiposFalha = ["Falha em equipamento", "Falta de insumo", "Assédio", "Falha de pessoal", "Acidente"];

        for (var i = 0; i < tiposFalha.length; i++) {
            var botao = document.createElement('button');
            botao.className = 'btn';
            botao.textContent = tiposFalha[i];

            (function(tipo) {
                botao.onclick = function() {
                    reportarFalha(tipo, idSetor);
                };
            })(tiposFalha[i]);

            containerBotoes.appendChild(botao);
        }

        modal.show();
    }

    function reportarFalha(tipoFalha, idSetor) {
        var data = new Date().toISOString().split('T')[0];

        var reporte = {
            idReporte: null,
            tipoReporte: tipoFalha,
            dataReporte: data,
            setor: { 
                idSetor: idSetor,
                nomeSetor: ''
            }
        };

        fetch('http://localhost:8080/reporte/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(reporte)
        })
        .then(function(resposta) {
            if (resposta.ok) {
                alert('Falha registrada com sucesso!');
                var modal = bootstrap.Modal.getInstance(document.getElementById('modalTipoFalha'));
                modal.hide();
                buscarFuncionarios(idSetor);
            } else {
                throw new Error('Erro ao registrar o reporte');
            }
        })
        .catch(function(erro) {
            alert('Erro ao registrar o reporte');
            console.error(erro);
        });
    }

    buscarSetores();
}
