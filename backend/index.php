<?php

// Função para criar um novo arquivo TXT de notícia
function criarNoticia($titulo, $conteudo) {
  $data = date('YmdHis');
  $nomeArquivo = "noticias/$data.txt";

  // Cria o arquivo TXT e abre-o para escrita
  $arquivo = fopen($nomeArquivo, 'w');

  // Escreve o conteúdo da notícia no arquivo
  fwrite($arquivo, "# $titulo\n\n$conteudo");

  // Fecha o arquivo
  fclose($arquivo);

  // Retorna uma mensagem de sucesso
  return "Notícia publicada com sucesso!";
}

// Verifica se o formulário foi enviado
if (isset($_POST['titulo']) && isset($_POST['conteudo'])) {
  $titulo = $_POST['titulo'];
  $conteudo = $_POST['conteudo'];

  // Cria a nova notícia
  $resultado = criarNoticia($titulo, $conteudo);

  // Exibe a mensagem de resultado
  echo $resultado;
}

?>

<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Publicar Notícia</title>
</head>
<body>
  <h1>Publicar Notícia</h1>

  <form method="post">
    <label for="titulo">Título:</label>
    <input type="text" id="titulo" name="titulo" required>

    <label for="conteudo">Conteúdo:</label>
    <textarea id="conteudo" name="conteudo" rows="10" required></textarea>

    <button type="submit">Publicar</button>
  </form>
</body>
</html>
